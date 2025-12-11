import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { db } from "./db";
import { animalIdentifications, users, poachingAlerts, animalSightings } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { analyzeAnimalImage } from "./services/openai";
import { analyzeFloraWithGemini } from "./services/gemini";
import { identifyPlantWithPlantNet, getEducationalPlantData } from "./services/plantnet";
import { generateChatResponse } from "./services/chat";
import { identifyAnimalLocally, identifyFloraLocally, detectThreatsLocally } from "./services/local-ai";
import { aiOrchestrator } from "./services/ai-orchestrator";
import { 
  insertAnimalIdentificationSchema, 
  insertFloraIdentificationSchema,
  insertAnimalSightingSchema,
  insertVolunteerActivitySchema,
  insertDeforestationAlertSchema,
  insertVolunteerApplicationSchema,
  insertAnimalAdoptionSchema,
  insertDonationSchema,
  insertUserSchema 
} from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const chatSchema = z.object({
  message: z.string().min(1, "Message is required").max(1000, "Message too long"),
});

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: "Too many authentication attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and audio files are allowed'));
    }
  },
});

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User Registration
  app.post("/api/auth/register", authLimiter, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error registering user:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to register user"
      });
    }
  });

  // User Login
  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);

      const user = await storage.verifyPassword(loginData.username, loginData.password);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Regenerate session ID to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          console.error("Error regenerating session:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }

        // Store only minimal user data in session (no password hash)
        req.session.user = {
          id: user.id,
          username: user.username
        };

        // Save session before responding
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            return res.status(500).json({ error: "Failed to save session" });
          }

          // Don't return password in response
          const { password: _, ...userResponse } = user;
          res.json(userResponse);
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error logging in user:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to login"
      });
    }
  });

  // User Logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      
      // Clear the session cookie
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const user = await storage.getUser(req.session.user.id);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  // Test API keys endpoint
  app.get("/api/test-api-keys", async (req, res) => {
    try {
      const { testAllAPIKeys } = await import("./test-api-keys");
      const results = await testAllAPIKeys();
      
      const workingCount = results.filter(r => r.status === 'success').length;
      const allWorking = workingCount === results.length;
      
      res.json({
        success: allWorking,
        workingCount,
        totalCount: results.length,
        results,
        summary: allWorking 
          ? '✅ All API keys working!' 
          : `⚠️ ${workingCount}/${results.length} API keys working`,
      });
    } catch (error) {
      console.error("Error testing API keys:", error);
      res.status(500).json({ 
        error: "Failed to test API keys",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Admin authentication middleware
  function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.adminUser) {
      return res.status(401).json({ error: "Admin authentication required" });
    }
    next();
  }

  // Admin Login
  app.post("/api/admin/login", authLimiter, async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);

      const admin = await storage.verifyAdminPassword(loginData.username, loginData.password);
      if (!admin) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Update last login time
      await storage.updateAdminLastLogin(admin.id);

      // Regenerate session ID to prevent session fixation attacks
      req.session.regenerate((err) => {
        if (err) {
          console.error("Error regenerating session:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }

        // Store only minimal admin data in session (no password hash)
        req.session.adminUser = {
          id: admin.id,
          username: admin.username,
          role: admin.role
        };

        // Save session before responding
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            return res.status(500).json({ error: "Failed to save session" });
          }

          // Don't return password in response
          const { password: _, ...adminResponse } = admin;
          res.json(adminResponse);
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error logging in admin:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to login"
      });
    }
  });

  // Admin Logout
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out admin:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      
      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current admin
  app.get("/api/admin/me", requireAdminAuth, async (req, res) => {
    try {
      const admin = await storage.getAdminUser(req.session.adminUser!.id);
      if (!admin) {
        return res.status(401).json({ error: "Admin not found" });
      }
      
      const { password: _, ...adminResponse } = admin;
      res.json(adminResponse);
    } catch (error) {
      console.error("Error getting current admin:", error);
      res.status(500).json({ error: "Failed to get admin data" });
    }
  });

  // Get all animal sightings (admin only)
  app.get("/api/admin/sightings", requireAdminAuth, async (req, res) => {
    try {
      const sightings = await storage.getAllSightings();
      res.json(sightings);
    } catch (error) {
      console.error("Error getting sightings:", error);
      res.status(500).json({ error: "Failed to get sightings" });
    }
  });

  // Get emergency sightings (admin only)
  app.get("/api/admin/emergency-sightings", requireAdminAuth, async (req, res) => {
    try {
      const sightings = await storage.getEmergencySightings();
      res.json(sightings);
    } catch (error) {
      console.error("Error getting emergency sightings:", error);
      res.status(500).json({ error: "Failed to get emergency sightings" });
    }
  });

  // Get all animal identifications (admin only)
  app.get("/api/admin/identifications", requireAdminAuth, async (req, res) => {
    try {
      const { limit = 100, offset = 0 } = req.query;
      
      const identifications = await db
        .select({
          id: animalIdentifications.id,
          userId: animalIdentifications.userId,
          speciesName: animalIdentifications.speciesName,
          scientificName: animalIdentifications.scientificName,
          conservationStatus: animalIdentifications.conservationStatus,
          confidence: animalIdentifications.confidence,
          imageUrl: animalIdentifications.imageUrl,
          latitude: animalIdentifications.latitude,
          longitude: animalIdentifications.longitude,
          locationName: animalIdentifications.locationName,
          createdAt: animalIdentifications.createdAt,
          username: users.username,
        })
        .from(animalIdentifications)
        .leftJoin(users, eq(animalIdentifications.userId, users.id))
        .orderBy(desc(animalIdentifications.createdAt))
        .limit(Number(limit))
        .offset(Number(offset)) as unknown as any[];

      res.json(identifications);
    } catch (error) {
      console.error("Error getting animal identifications:", error);
      res.status(500).json({ error: "Failed to get animal identifications" });
    }
  });

  // Get identification statistics (admin only)
  app.get("/api/admin/identification-stats", requireAdminAuth, async (req, res) => {
    try {
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(animalIdentifications);
      const totalCount = totalResult[0] || { count: 0 };

      const todayResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(animalIdentifications)
        .where(sql`DATE(created_at) = CURRENT_DATE`);
      const todayCount = todayResult[0] || { count: 0 };

      const topSpecies = await db
        .select({
          speciesName: animalIdentifications.speciesName,
          count: sql<number>`count(*)`,
        })
        .from(animalIdentifications)
        .groupBy(animalIdentifications.speciesName)
        .orderBy(sql`count(*) DESC`)
        .limit(5) as unknown as { speciesName: string; count: number }[];

      res.json({
        total: totalCount.count,
        today: todayCount.count,
        topSpecies,
      });
    } catch (error) {
      console.error("Error getting identification stats:", error);
      res.status(500).json({ error: "Failed to get identification stats" });
    }
  });

  // Admin - Get all poaching alerts
  app.get("/api/admin/poaching-alerts", requireAdminAuth, async (req, res) => {
    try {
      const { status } = req.query;
      
      let query = db.select().from(poachingAlerts);
      
      // Filter by reviewed status if specified
      if (status === 'pending') {
        query = query.where(eq(poachingAlerts.reviewed, false));
      } else if (status === 'investigating' || status === 'resolved') {
        query = query.where(eq(poachingAlerts.reviewed, true));
      }
      // 'all' returns everything
      
      const alerts = await query
        .orderBy(desc(poachingAlerts.createdAt))
        .limit(100);
      
      res.json(alerts);
    } catch (error) {
      console.error("Error getting poaching alerts:", error);
      res.status(500).json({ error: "Failed to get poaching alerts" });
    }
  });

  // Admin - Get unreviewed critical alerts
  app.get("/api/admin/poaching-alerts/critical", requireAdminAuth, async (req, res) => {
    try {
      const criticalAlerts = await db
        .select()
        .from(poachingAlerts)
        .where(sql`${poachingAlerts.threatLevel} IN ('CRITICAL', 'HIGH') AND ${poachingAlerts.reviewed} = false`)
        .orderBy(desc(poachingAlerts.createdAt))
        .limit(50);
      
      res.json(criticalAlerts);
    } catch (error) {
      console.error("Error getting critical alerts:", error);
      res.status(500).json({ error: "Failed to get critical alerts" });
    }
  });

  // Admin - Mark alert as reviewed and add report
  app.post("/api/admin/poaching-alerts/:id/report", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { reportNotes, actionTaken, latitude, longitude, locationName } = req.body;
      
      const updateData: any = {
        reviewed: true,
        reviewedBy: req.session.adminUser!.id,
        reviewedAt: new Date(),
        reportNotes: reportNotes || null,
        actionTaken: actionTaken || null,
      };
      
      // Update location if provided
      if (latitude && longitude) {
        updateData.latitude = parseFloat(latitude);
        updateData.longitude = parseFloat(longitude);
      }
      if (locationName) {
        updateData.locationName = locationName;
      }
      
      await db
        .update(poachingAlerts)
        .set(updateData)
        .where(eq(poachingAlerts.id, id));
      
      res.json({ success: true, message: "Alert reported successfully" });
    } catch (error) {
      console.error("Error reporting alert:", error);
      res.status(500).json({ error: "Failed to report alert" });
    }
  });

  // Admin - Update poaching alert status
  app.patch("/api/admin/poaching-alerts/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Map status to reviewed field
      const reviewed = status === 'investigating' || status === 'resolved';
      
      const updateData: any = {
        reviewed,
        reviewedBy: req.session.adminUser!.id,
        reviewedAt: new Date(),
      };
      
      await db
        .update(poachingAlerts)
        .set(updateData)
        .where(eq(poachingAlerts.id, id));
      
      res.json({ success: true, message: "Alert status updated successfully" });
    } catch (error) {
      console.error("Error updating alert status:", error);
      res.status(500).json({ error: "Failed to update alert status" });
    }
  });

  // Admin - Get poaching alert statistics
  app.get("/api/admin/poaching-stats", requireAdminAuth, async (req, res) => {
    try {
      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(poachingAlerts);
      const totalCount = totalResult[0] || { count: 0 };

      const criticalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(poachingAlerts)
        .where(eq(poachingAlerts.threatLevel, 'CRITICAL'));
      const criticalCount = criticalResult[0] || { count: 0 };

      const highResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(poachingAlerts)
        .where(eq(poachingAlerts.threatLevel, 'HIGH'));
      const highCount = highResult[0] || { count: 0 };

      const unreviewedResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(poachingAlerts)
        .where(eq(poachingAlerts.reviewed, false));
      const unreviewedCount = unreviewedResult[0] || { count: 0 };

      const todayResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(poachingAlerts)
        .where(sql`DATE(created_at) = CURRENT_DATE`);
      const todayCount = todayResult[0] || { count: 0 };

      res.json({
        total: totalCount.count,
        critical: criticalCount.count,
        high: highCount.count,
        unreviewed: unreviewedCount.count,
        today: todayCount.count,
      });
    } catch (error) {
      console.error("Error getting poaching stats:", error);
      res.status(500).json({ error: "Failed to get poaching stats" });
    }
  });

  // Get identification statistics
  app.get("/api/admin/identification-stats", requireAdminAuth, async (req, res) => {
    try {
      const totalCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(animalIdentifications) as unknown as [{ count: number }];

      const todayCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(animalIdentifications)
        .where(sql`DATE(created_at) = CURRENT_DATE`) as unknown as [{ count: number }];

      const topSpecies = await db
        .select({
          species: animalIdentifications.species,
          count: sql<number>`count(*)`,
        })
        .from(animalIdentifications)
        .groupBy(animalIdentifications.species)
        .orderBy(sql`count(*) DESC`)
        .limit(5);

      const endangered = await db
        .select({ count: sql<number>`count(*)` })
        .from(animalIdentifications)
        .where(sql`conservation_status IN ('Endangered', 'Critically Endangered', 'Vulnerable')`) as unknown as [{ count: number }];

      res.json({
        total: totalCount[0].count,
        today: todayCount[0].count,
        topSpecies,
        endangeredSightings: endangered[0].count,
      });
    } catch (error) {
      console.error("Error getting identification stats:", error);
      res.status(500).json({ error: "Failed to get identification statistics" });
    }
  });

  // Verify sighting (admin only)
  app.patch("/api/admin/sightings/:id/verify", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get admin details from storage
      const admin = await storage.getAdminUser(req.session.adminUser!.id);
      if (!admin) {
        return res.status(401).json({ error: "Admin not found" });
      }
      
      const updatedSighting = await storage.verifySighting(id, admin.email || admin.username);
      
      if (!updatedSighting) {
        return res.status(404).json({ error: "Sighting not found" });
      }
      
      res.json({ success: true, sighting: updatedSighting });
    } catch (error) {
      console.error("Error verifying sighting:", error);
      res.status(500).json({ error: "Failed to verify sighting" });
    }
  });

  // Report animal sighting with photo and location
  app.post("/api/report-sighting", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Photo is required for sighting reports" });
      }

      // Convert image to base64
      const base64Image = req.file.buffer.toString('base64');
      const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;

      // Parse and validate coordinates
      const latitude = parseFloat(req.body.latitude);
      const longitude = parseFloat(req.body.longitude);
      
      if (!isFinite(latitude) || !isFinite(longitude)) {
        return res.status(400).json({ error: "Invalid coordinates provided" });
      }

      // Validate sighting data using Zod schema
      const sightingData = insertAnimalSightingSchema.parse({
        reporterName: req.body.reporterName,
        reporterEmail: req.body.reporterEmail,
        reporterPhone: req.body.reporterPhone || null,
        latitude,
        longitude,
        location: req.body.location,
        habitatType: req.body.habitatType,
        animalStatus: req.body.animalStatus,
        emergencyStatus: req.body.emergencyStatus,
        description: req.body.description || null,
        imageUrl,
        animalId: null,
      });

      // Create sighting record
      const sighting = await storage.createAnimalSighting(sightingData);

      // Log activity for admin monitoring
      await storage.logActivity({
        activityType: 'sighting_reported',
        userName: sightingData.reporterName,
        userEmail: sightingData.reporterEmail,
        details: {
          sightingId: sighting.id,
          location: sightingData.location,
          emergencyStatus: sightingData.emergencyStatus,
          animalStatus: sightingData.animalStatus,
        },
      });

      res.json(sighting);
    } catch (error) {
      console.error("Error reporting sighting:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to report sighting"
      });
    }
  });

  // Reverse geocoding endpoint
  app.get("/api/reverse-geocode", async (req, res) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lon = parseFloat(req.query.lon as string);

      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: "Valid latitude and longitude are required" });
      }

      // Use LocationIQ API if available
      if (process.env.LOCATIONIQ_API_KEY) {
        try {
          const response = await fetch(
            `https://us1.locationiq.com/v1/reverse?key=${process.env.LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`
          );
          
          if (response.ok) {
            const data = await response.json();
            
            // Check for errors in response
            if (data.error) {
              console.log('LocationIQ error:', data.error);
            } else if (data.address) {
              const { city, town, village, county, state, country } = data.address;
              const parts = [city || town || village, county, state, country].filter(Boolean);
              if (parts.length > 0) {
                return res.json({ locationName: parts.join(', ') });
              }
            }
          }
        } catch (locationiqError) {
          console.log('LocationIQ failed, trying Nominatim fallback');
        }
      }

      // Fallback to Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
        {
          headers: {
            'User-Agent': 'WildGuard/1.0 (Wildlife Conservation Platform)'
          }
        }
      );

      if (!response.ok) {
        return res.json({ locationName: null });
      }

      const data = await response.json();
      const { city, town, village, county, state, country } = data.address || {};
      const parts = [city || town || village, county, state, country].filter(Boolean);
      
      res.json({ locationName: parts.length > 0 ? parts.join(', ') : null });
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      res.json({ locationName: null });
    }
  });

  // Upload and analyze animal photo
  app.post("/api/identify-animal", upload.single('image'), async (req, res) => {
    const startTime = Date.now();
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      
      // Use AI Orchestrator for automatic fallback: Local → Cloud → Educational
      const aiResult = await aiOrchestrator.identifyAnimal(base64Image);
      const analysisResult = aiResult.data;
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ Identification via ${aiResult.provider}: ${analysisResult.speciesName}`);

      // Get userId from session if authenticated
      const userId = req.session.user?.id;

      // Parse location data from request
      const latitude = req.body.latitude ? parseFloat(req.body.latitude) : undefined;
      const longitude = req.body.longitude ? parseFloat(req.body.longitude) : undefined;
      const locationName = req.body.locationName || undefined;

      // Ensure confidence is always below 100% (cap at 99.9%)
      let confidence = analysisResult.confidence;
      if (confidence >= 1.0) {
        confidence = confidence / 100; // Convert percentage to decimal if needed
      }
      confidence = Math.min(confidence, 0.999); // Cap at 99.9%

      // Store the identification result
      const identification = await storage.createAnimalIdentification({
        speciesName: analysisResult.speciesName,
        scientificName: analysisResult.scientificName,
        conservationStatus: analysisResult.conservationStatus,
        population: analysisResult.population,
        habitat: analysisResult.habitat,
        threats: analysisResult.threats,
        description: analysisResult.description,
        imageUrl: imageUrl,
        confidence: confidence,
        latitude,
        longitude,
        locationName,
      }, userId);

      // CREATE ANIMAL SIGHTING for admin tracking
      // Create sighting even without GPS (use defaults)
      try {
        await db.insert(animalSightings).values({
          animalId: identification.id,
          reporterName: req.session.user?.username || 'Anonymous User',
          reporterEmail: null,
          reporterPhone: null,
          latitude: latitude || 0, // Default to 0 if no GPS
          longitude: longitude || 0, // Default to 0 if no GPS
          location: locationName || 'Location not available',
          habitatType: analysisResult.habitat || 'Unknown',
          animalStatus: 'healthy', // Default for fauna identification
          emergencyStatus: 'none',
          description: `Fauna identified: ${analysisResult.speciesName}`,
          imageUrl: imageUrl,
          certificateIssued: 'no',
          sightedAt: new Date(),
        });
        console.log(`✅ Created animal sighting for admin tracking (GPS: ${latitude ? 'Yes' : 'No'})`);
      } catch (sightingError) {
        console.error('❌ Failed to create sighting:', sightingError);
        console.error('Sighting error details:', (sightingError as Error).message);
      }

      // LOG TO ANALYSIS TRACKING TABLE
      try {
        await logImageAnalysis({
          userId: userId || null,
          userIpAddress: req.ip || req.socket.remoteAddress || null,
          sessionId: req.sessionID || null,
          imageUrl: imageUrl,
          imageSizeBytes: req.file.size,
          imageFormat: req.file.mimetype.split('/')[1] || null,
          identifiedSpecies: analysisResult.speciesName,
          scientificName: analysisResult.scientificName,
          confidenceScore: analysisResult.confidence,
          conservationStatus: analysisResult.conservationStatus,
          category: null, // We can enhance this later
          aiProvider: aiResult.provider as any,
          processingTimeMs: processingTime,
          latitude: latitude || null,
          longitude: longitude || null,
          locationName: locationName || null,
          analysisType: 'animal',
          isSuccessful: true,
          enhancedWithDatabase: false,
          databaseMatchFound: false
        });
      } catch (logError) {
        console.error("Failed to log analysis (non-critical):", logError);
        // Don't fail the request if logging fails
      }

      res.json(identification);
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error("Error identifying animal:", error);
      
      // LOG FAILED ANALYSIS
      try {
        await logImageAnalysis({
          userId: req.session.user?.id || null,
          userIpAddress: req.ip || req.socket.remoteAddress || null,
          sessionId: req.sessionID || null,
          imageUrl: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : 'N/A',
          imageSizeBytes: req.file?.size || null,
          imageFormat: req.file?.mimetype.split('/')[1] || null,
          aiProvider: 'hybrid',
          processingTimeMs: processingTime,
          analysisType: 'animal',
          isSuccessful: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      } catch (logError) {
        console.error("Failed to log error (non-critical):", logError);
      }
      
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to identify animal"
      });
    }
  });

  // NEW: Dual Gemini Verification Endpoint
  app.post("/api/identify-animal-dual-gemini", upload.single('image'), async (req, res) => {
    const startTime = Date.now();
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      console.log("\n🔬 Starting Dual Gemini Verification...");
      const base64Image = req.file.buffer.toString('base64');
      const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      
      // Import and use dual Gemini verification
      const { analyzeAnimalImage } = await import("./services/dual-gemini-verification");
      const result = await analyzeAnimalImage(base64Image);
      
      const processingTime = Date.now() - startTime;
      console.log(`✅ Dual Gemini completed in ${processingTime}ms`);

      // Get userId from session if authenticated
      const userId = req.session.user?.id;

      // Parse location data from request
      const latitude = req.body.latitude ? parseFloat(req.body.latitude) : undefined;
      const longitude = req.body.longitude ? parseFloat(req.body.longitude) : undefined;
      const locationName = req.body.locationName || undefined;

      // Store the identification result
      const identification = await storage.createAnimalIdentification({
        speciesName: result.speciesName,
        scientificName: result.scientificName,
        conservationStatus: result.conservationStatus,
        population: result.population,
        habitat: result.habitat,
        threats: result.threats,
        imageUrl: imageUrl,
        confidence: result.confidence,
        latitude,
        longitude,
        locationName,
      }, userId);

      // LOG TO ANALYSIS TRACKING TABLE
      try {
        await logImageAnalysis({
          userId: userId || null,
          userIpAddress: req.ip || req.socket.remoteAddress || null,
          sessionId: req.sessionID || null,
          imageUrl: imageUrl,
          imageSizeBytes: req.file.size,
          imageFormat: req.file.mimetype.split('/')[1] || null,
          identifiedSpecies: result.speciesName,
          scientificName: result.scientificName,
          confidenceScore: result.confidence,
          conservationStatus: result.conservationStatus,
          category: null,
          aiProvider: 'dual-gemini' as any,
          processingTimeMs: processingTime,
          latitude: latitude || null,
          longitude: longitude || null,
          locationName: locationName || null,
          analysisType: 'animal',
          isSuccessful: true,
          enhancedWithDatabase: false,
          databaseMatchFound: false
        });
      } catch (logError) {
        console.error("Failed to log analysis (non-critical):", logError);
      }

      // Return enhanced response with dual verification details
      res.json({
        ...identification,
        dualVerification: {
          visualDescription: result.visualDescription,
          firstGeminiResult: result.verificationDetails.firstGeminiResult,
          secondGeminiResult: result.verificationDetails.secondGeminiResult,
          consensusReached: result.verificationDetails.consensusReached,
          comparisonNotes: result.verificationDetails.comparisonNotes,
          processingTimeMs: result.processingTimeMs
        }
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error("Error in dual Gemini verification:", error);
      
      // LOG FAILED ANALYSIS
      try {
        await logImageAnalysis({
          userId: req.session.user?.id || null,
          userIpAddress: req.ip || req.socket.remoteAddress || null,
          sessionId: req.sessionID || null,
          imageUrl: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : 'N/A',
          imageSizeBytes: req.file?.size || null,
          imageFormat: req.file?.mimetype.split('/')[1] || null,
          aiProvider: 'dual-gemini' as any,
          processingTimeMs: processingTime,
          analysisType: 'animal',
          isSuccessful: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error"
        });
      } catch (logError) {
        console.error("Failed to log error (non-critical):", logError);
      }

      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to verify with dual Gemini"
      });
    }
  });

  // NEW: Complete Triple AI + Dual Gemini + Database Integration
  app.post("/api/identify-animal-complete", upload.single('image'), async (req, res) => {
    const startTime = Date.now();
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      console.log("\n🎯 Starting Complete AI Identification System...");
      const base64Image = req.file.buffer.toString('base64');
      const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      
      // Save image temporarily for Python processing
      const fs = await import('fs');
      const path = await import('path');
      const tempImagePath = path.join(process.cwd(), 'temp_image.jpg');
      fs.writeFileSync(tempImagePath, req.file.buffer);
      
      // Call Python complete AI system
      const { spawn } = await import('child_process');
      const pythonProcess = spawn('python', [
        path.join(process.cwd(), 'server', 'services', 'complete_ai_system.py'),
        tempImagePath
      ]);

      let pythonOutput = '';
      let pythonError = '';

      pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        pythonError += data.toString();
      });

      await new Promise((resolve, reject) => {
        pythonProcess.on('close', (code) => {
          if (code === 0) {
            resolve(true);
          } else {
            reject(new Error(`Python process failed: ${pythonError}`));
          }
        });
      });

      // Read result from JSON file
      const resultPath = path.join(process.cwd(), 'identification_result.json');
      const result = JSON.parse(fs.readFileSync(resultPath, 'utf-8'));

      // Clean up temp files
      fs.unlinkSync(tempImagePath);
      fs.unlinkSync(resultPath);

      const processingTime = Date.now() - startTime;
      console.log(`✅ Complete AI System completed in ${processingTime}ms`);

      // Get userId from session if authenticated
      const userId = req.session.user?.id;

      // Parse location data from request
      const latitude = req.body.latitude ? parseFloat(req.body.latitude) : undefined;
      const longitude = req.body.longitude ? parseFloat(req.body.longitude) : undefined;
      const locationName = req.body.locationName || undefined;

      // Store the identification result
      const identification = await storage.createAnimalIdentification({
        speciesName: result.final.species_name,
        scientificName: result.database_verified ? 'From Database' : 'Unknown',
        conservationStatus: 'Unknown',
        population: undefined,
        habitat: 'Unknown',
        threats: [],
        imageUrl: imageUrl,
        confidence: result.final.confidence,
        latitude,
        longitude,
        locationName,
      }, userId);

      res.json({
        ...identification,
        completeAI: {
          finalSpecies: result.final.species_name,
          confidence: result.final.confidence,
          indianSpecies: result.indian_species,
          databaseVerified: result.database_verified,
          geminiVerified: result.gemini_verified,
          aiVotes: result.final.ai_votes,
          processingTimeMs: processingTime,
          system: 'Custom Model + MobileNet + Dual Gemini + Database'
        }
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error("Error in complete AI system:", error);
      
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process with complete AI system"
      });
    }
  });

  // Get recent animal identifications
  app.get("/api/recent-identifications", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const identifications = await storage.getRecentAnimalIdentifications(limit);
      res.json(identifications);
    } catch (error) {
      console.error("Error getting recent identifications:", error);
      res.status(500).json({ error: "Failed to get recent identifications" });
    }
  });

  // Get user's animal identifications (requires authentication)
  app.get("/api/my-identifications", requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const identifications = await storage.getUserAnimalIdentifications(req.session.user!.id, limit);
      res.json(identifications);
    } catch (error) {
      console.error("Error getting user identifications:", error);
      res.status(500).json({ error: "Failed to get user identifications" });
    }
  });

  // Get all wildlife centers
  app.get("/api/wildlife-centers", async (req, res) => {
    try {
      const centers = await storage.getWildlifeCenters();
      res.json(centers);
    } catch (error) {
      console.error("Error getting wildlife centers:", error);
      res.status(500).json({ error: "Failed to get wildlife centers" });
    }
  });

  // Get nearby wildlife centers
  app.get("/api/wildlife-centers/nearby", async (req, res) => {
    try {
      const latitude = parseFloat(req.query.lat as string);
      const longitude = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 50;

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: "Valid latitude and longitude are required" });
      }

      const centers = await storage.getNearbyWildlifeCenters(latitude, longitude, radius);
      res.json(centers);
    } catch (error) {
      console.error("Error getting nearby wildlife centers:", error);
      res.status(500).json({ error: "Failed to get nearby wildlife centers" });
    }
  });

  // Get wildlife center by ID
  app.get("/api/wildlife-centers/:id", async (req, res) => {
    try {
      const center = await storage.getWildlifeCenterById(req.params.id);
      if (!center) {
        return res.status(404).json({ error: "Wildlife center not found" });
      }
      res.json(center);
    } catch (error) {
      console.error("Error getting wildlife center:", error);
      res.status(500).json({ error: "Failed to get wildlife center" });
    }
  });

  // Get all supported animals
  app.get("/api/supported-animals", async (req, res) => {
    try {
      const { region, category, conservationStatus } = req.query;
      
      const filters = {
        region: region as string,
        category: category as string,
        conservationStatus: conservationStatus as string
      };
      
      // Remove undefined filters
      Object.keys(filters).forEach(key => {
        if (!filters[key as keyof typeof filters]) {
          delete filters[key as keyof typeof filters];
        }
      });
      
      const animals = await storage.getSupportedAnimals(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(animals);
    } catch (error) {
      console.error("Error getting supported animals:", error);
      res.status(500).json({ error: "Failed to get supported animals" });
    }
  });

  // Seed supported animals database
  app.post("/api/supported-animals/seed", async (req, res) => {
    try {
      await storage.seedSupportedAnimals();
      res.json({ message: "Supported animals database seeded successfully" });
    } catch (error) {
      console.error("Error seeding supported animals:", error);
      res.status(500).json({ error: "Failed to seed supported animals" });
    }
  });

  // ===== DISCOVER ANIMALS ENCYCLOPEDIA =====
  
  // Get all discover animals with optional filters
  app.get("/api/discover-animals", async (req, res) => {
    try {
      const filters: { category?: string; region?: string; featured?: boolean; search?: string } = {};
      
      if (req.query.category) filters.category = req.query.category as string;
      if (req.query.region) filters.region = req.query.region as string;
      if (req.query.featured !== undefined) filters.featured = req.query.featured === 'true';
      if (req.query.search) filters.search = req.query.search as string;
      
      const animals = await storage.getDiscoverAnimals(filters);
      res.json(animals);
    } catch (error) {
      console.error("Error fetching discover animals:", error);
      res.status(500).json({ error: "Failed to fetch discover animals" });
    }
  });
  
  // Get featured discover animals
  app.get("/api/discover-animals/featured", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
      const animals = await storage.getFeaturedDiscoverAnimals(limit);
      res.json(animals);
    } catch (error) {
      console.error("Error fetching featured discover animals:", error);
      res.status(500).json({ error: "Failed to fetch featured discover animals" });
    }
  });
  
  // Search discover animals
  app.get("/api/discover-animals/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const animals = await storage.searchDiscoverAnimals(query);
      res.json(animals);
    } catch (error) {
      console.error("Error searching discover animals:", error);
      res.status(500).json({ error: "Failed to search discover animals" });
    }
  });
  
  // Get single discover animal by ID
  app.get("/api/discover-animals/:id", async (req, res) => {
    try {
      const animal = await storage.getDiscoverAnimalById(req.params.id);
      if (!animal) {
        return res.status(404).json({ error: "Animal not found" });
      }
      
      // Increment view count
      await storage.updateDiscoverAnimalViews(req.params.id);
      
      res.json(animal);
    } catch (error) {
      console.error("Error fetching discover animal:", error);
      res.status(500).json({ error: "Failed to fetch discover animal" });
    }
  });
  
  // Seed discover animals
  app.post("/api/discover-animals/seed", async (req, res) => {
    try {
      await storage.seedDiscoverAnimals();
      res.json({ message: "Discover animals seeded successfully" });
    } catch (error) {
      console.error("Error seeding discover animals:", error);
      res.status(500).json({ error: "Failed to seed discover animals" });
    }
  });

  // Upload and analyze plant photo
  app.post("/api/identify-flora", upload.single('image'), async (req, res) => {
    const startTime = Date.now();
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
      
      // Use AI Orchestrator for automatic fallback: Local → PlantNet → Cloud → Educational
      const aiResult = await aiOrchestrator.identifyFlora(base64Image);
      const analysisResult = aiResult.data;
      const identificationMethod = aiResult.provider;
      const processingTime = Date.now() - startTime;
      
      console.log(`✅ Flora identification via ${aiResult.provider}: ${analysisResult.speciesName}`);

      const userId = req.session.user?.id;

      const identification = await storage.createFloraIdentification({
        speciesName: analysisResult.speciesName,
        scientificName: analysisResult.scientificName,
        conservationStatus: analysisResult.conservationStatus,
        isEndangered: analysisResult.isEndangered,
        endangeredAlert: analysisResult.endangeredAlert,
        habitat: analysisResult.habitat,
        uses: analysisResult.uses, // Now always an array per schema
        threats: analysisResult.threats,
        imageUrl: imageUrl,
        confidence: analysisResult.confidence,
      }, userId);

      // LOG TO ANALYSIS TRACKING TABLE
      try {
        await logImageAnalysis({
          userId: userId || null,
          userIpAddress: req.ip || req.socket.remoteAddress || null,
          sessionId: req.sessionID || null,
          imageUrl: imageUrl,
          imageSizeBytes: req.file.size,
          imageFormat: req.file.mimetype.split('/')[1] || null,
          identifiedSpecies: analysisResult.speciesName,
          scientificName: analysisResult.scientificName,
          confidenceScore: analysisResult.confidence,
          conservationStatus: analysisResult.conservationStatus,
          category: 'Flora',
          aiProvider: aiResult.provider as any,
          processingTimeMs: processingTime,
          analysisType: 'flora',
          isSuccessful: true
        });
      } catch (logError) {
        console.error("Failed to log flora analysis (non-critical):", logError);
      }

      res.json({
        ...identification,
        identificationMethod, // Let frontend know which method was used
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      console.error("Error identifying flora:", error);
      
      // LOG FAILED ANALYSIS
      try {
        await logImageAnalysis({
          userId: req.session.user?.id || null,
          userIpAddress: req.ip || req.socket.remoteAddress || null,
          sessionId: req.sessionID || null,
          imageUrl: req.file ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}` : 'N/A',
          imageSizeBytes: req.file?.size || null,
          imageFormat: req.file?.mimetype.split('/')[1] || null,
          aiProvider: 'hybrid',
          processingTimeMs: processingTime,
          analysisType: 'flora',
          isSuccessful: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      } catch (logError) {
        console.error("Failed to log error (non-critical):", logError);
      }
      
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to identify flora"
      });
    }
  });

  // Get recent flora identifications
  app.get("/api/recent-flora-identifications", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const identifications = await storage.getRecentFloraIdentifications(limit);
      res.json(identifications);
    } catch (error) {
      console.error("Error getting recent flora identifications:", error);
      res.status(500).json({ error: "Failed to get recent flora identifications" });
    }
  });

  // Get all botanical gardens
  app.get("/api/botanical-gardens", async (req, res) => {
    try {
      const gardens = await storage.getBotanicalGardens();
      res.json(gardens);
    } catch (error) {
      console.error("Error getting botanical gardens:", error);
      res.status(500).json({ error: "Failed to get botanical gardens" });
    }
  });

  // Get nearby botanical gardens
  app.get("/api/botanical-gardens/nearby", async (req, res) => {
    try {
      const latitude = parseFloat(req.query.lat as string);
      const longitude = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 50;

      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ error: "Valid latitude and longitude are required" });
      }

      const gardens = await storage.getNearbyBotanicalGardens(latitude, longitude, radius);
      res.json(gardens);
    } catch (error) {
      console.error("Error getting nearby botanical gardens:", error);
      res.status(500).json({ error: "Failed to get nearby botanical gardens" });
    }
  });

  // Create animal sighting
  app.post("/api/animal-sightings", async (req, res) => {
    try {
      const sightingData = insertAnimalSightingSchema.parse(req.body);
      const sighting = await storage.createAnimalSighting(sightingData);
      res.status(201).json(sighting);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating animal sighting:", error);
      res.status(500).json({ error: "Failed to create animal sighting" });
    }
  });

  // Get animal sightings
  app.get("/api/animal-sightings", async (req, res) => {
    try {
      const animalId = req.query.animalId as string | undefined;
      const sightings = await storage.getAnimalSightings(animalId);
      res.json(sightings);
    } catch (error) {
      console.error("Error getting animal sightings:", error);
      res.status(500).json({ error: "Failed to get animal sightings" });
    }
  });

  // Get all NGOs
  app.get("/api/ngos", async (req, res) => {
    try {
      const { focus } = req.query;
      const filters = focus ? { focus: focus as string } : undefined;
      const ngos = await storage.getNgos(filters);
      res.json(ngos);
    } catch (error) {
      console.error("Error getting NGOs:", error);
      res.status(500).json({ error: "Failed to get NGOs" });
    }
  });

  // Get NGO by ID
  app.get("/api/ngos/:id", async (req, res) => {
    try {
      const ngo = await storage.getNgoById(req.params.id);
      if (!ngo) {
        return res.status(404).json({ error: "NGO not found" });
      }
      res.json(ngo);
    } catch (error) {
      console.error("Error getting NGO:", error);
      res.status(500).json({ error: "Failed to get NGO" });
    }
  });

  // Get volunteer activities
  app.get("/api/volunteer-activities", async (req, res) => {
    try {
      const { status, ngoId } = req.query;
      const filters: { status?: string; ngoId?: string } = {};
      if (status) filters.status = status as string;
      if (ngoId) filters.ngoId = ngoId as string;
      
      const activities = await storage.getVolunteerActivities(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(activities);
    } catch (error) {
      console.error("Error getting volunteer activities:", error);
      res.status(500).json({ error: "Failed to get volunteer activities" });
    }
  });

  // Create volunteer activity
  app.post("/api/volunteer-activities", async (req, res) => {
    try {
      const activityData = insertVolunteerActivitySchema.parse(req.body);
      const activity = await storage.createVolunteerActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating volunteer activity:", error);
      res.status(500).json({ error: "Failed to create volunteer activity" });
    }
  });

  // Get deforestation alerts
  app.get("/api/deforestation-alerts", async (req, res) => {
    try {
      const { severity, limit } = req.query;
      const filters: { severity?: string; limit?: number } = {};
      if (severity) filters.severity = severity as string;
      if (limit) filters.limit = parseInt(limit as string);
      
      const alerts = await storage.getDeforestationAlerts(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(alerts);
    } catch (error) {
      console.error("Error getting deforestation alerts:", error);
      res.status(500).json({ error: "Failed to get deforestation alerts" });
    }
  });

  // Create deforestation alert
  app.post("/api/deforestation-alerts", async (req, res) => {
    try {
      const alertData = insertDeforestationAlertSchema.parse(req.body);
      const alert = await storage.createDeforestationAlert(alertData);
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating deforestation alert:", error);
      res.status(500).json({ error: "Failed to create deforestation alert" });
    }
  });

  // Volunteer applications
  app.post("/api/volunteer-applications", async (req, res) => {
    try {
      const applicationData = insertVolunteerApplicationSchema.parse(req.body);
      const application = await storage.createVolunteerApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating volunteer application:", error);
      res.status(500).json({ error: "Failed to create volunteer application" });
    }
  });

  app.get("/api/volunteer-applications", async (req, res) => {
    try {
      const { ngoId, status } = req.query;
      const filters: { ngoId?: string; status?: string } = {};
      if (ngoId) filters.ngoId = ngoId as string;
      if (status) filters.status = status as string;
      
      const applications = await storage.getVolunteerApplications(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(applications);
    } catch (error) {
      console.error("Error getting volunteer applications:", error);
      res.status(500).json({ error: "Failed to get volunteer applications" });
    }
  });

  // Animal adoptions
  app.post("/api/animal-adoptions", async (req, res) => {
    try {
      const adoptionData = insertAnimalAdoptionSchema.parse(req.body);
      const adoption = await storage.createAnimalAdoption(adoptionData);
      res.status(201).json(adoption);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating animal adoption:", error);
      res.status(500).json({ error: "Failed to create animal adoption" });
    }
  });

  app.get("/api/animal-adoptions", async (req, res) => {
    try {
      const { animalId, status } = req.query;
      const filters: { animalId?: string; status?: string } = {};
      if (animalId) filters.animalId = animalId as string;
      if (status) filters.status = status as string;
      
      const adoptions = await storage.getAnimalAdoptions(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(adoptions);
    } catch (error) {
      console.error("Error getting animal adoptions:", error);
      res.status(500).json({ error: "Failed to get animal adoptions" });
    }
  });

  // Donations - Payment Gateway Integration
  app.post("/api/donations/create", async (req, res) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      
      // Generate unique receipt number
      const receiptNumber = `WG-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
      
      // Check if Razorpay is configured
      const { isPaymentGatewayConfigured, createPaymentOrder } = await import("./services/payment");
      
      if (isPaymentGatewayConfigured()) {
        // Create Razorpay payment order
        try {
          const paymentOrder = await createPaymentOrder(
            donationData.amount,
            receiptNumber,
            donationData.name,
            donationData.email
          );
          
          // Save donation with pending status
          const donation = await storage.createDonation({
            ...donationData,
            transactionId: paymentOrder.id,
            receiptNumber,
            paymentStatus: 'pending',
          });
          
          // Send confirmation email
          const { sendDonationConfirmation, isEmailServiceConfigured } = await import("./services/email");
          if (isEmailServiceConfigured()) {
            await sendDonationConfirmation(
              donation.email,
              donation.name,
              donation.amount,
              paymentOrder.id
            );
          }
          
          // Return payment order details for frontend
          res.status(201).json({
            donation,
            paymentOrder: {
              id: paymentOrder.id,
              amount: paymentOrder.amount,
              currency: paymentOrder.currency,
              razorpayKeyId: process.env.RAZORPAY_KEY_ID,
            },
          });
        } catch (paymentError) {
          console.error("Error creating payment order:", paymentError);
          return res.status(500).json({ error: "Failed to create payment order" });
        }
      } else {
        // Fallback: No payment gateway configured - simulate direct donation
        console.warn("⚠️  Payment gateway not configured. Processing as direct donation.");
        
        const transactionId = `DIRECT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
        
        const donation = await storage.createDonation({
          ...donationData,
          transactionId,
          receiptNumber,
          paymentStatus: 'completed',
        });
        
        // Send receipt email
        const { sendDonationReceipt, isEmailServiceConfigured } = await import("./services/email");
        if (isEmailServiceConfigured()) {
          await sendDonationReceipt(donation);
        } else {
          console.log(`📧 [SIMULATED] Receipt sent to ${donation.email} - Amount: ₹${donation.amount}`);
        }
        
        res.status(201).json({ donation });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error creating donation:", error);
      res.status(500).json({ error: "Failed to process donation" });
    }
  });

  // Payment verification webhook
  app.post("/api/donations/verify", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment verification details" });
      }
      
      // Verify payment signature
      const { verifyPaymentSignature } = await import("./services/payment");
      const isValid = verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      
      if (!isValid) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }
      
      // Update donation status to completed
      const donation = await storage.updateDonationStatus(
        razorpay_order_id,
        'completed',
        razorpay_payment_id
      );
      
      if (!donation) {
        return res.status(404).json({ error: "Donation not found" });
      }
      
      // Send receipt email
      const { sendDonationReceipt } = await import("./services/email");
      await sendDonationReceipt(donation);
      
      console.log(`✅ Payment verified and receipt sent for donation: ${donation.receiptNumber}`);
      
      res.json({ success: true, donation });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  // Get donation by receipt number
  app.get("/api/donations/:receiptNumber", async (req, res) => {
    try {
      const { receiptNumber } = req.params;
      const donation = await storage.getDonationByReceipt(receiptNumber);
      
      if (!donation) {
        return res.status(404).json({ error: "Donation not found" });
      }
      
      res.json(donation);
    } catch (error) {
      console.error("Error getting donation:", error);
      res.status(500).json({ error: "Failed to get donation" });
    }
  });

  app.get("/api/donations", async (req, res) => {
    try {
      const { email } = req.query;
      const donations = email 
        ? await storage.getDonationsByEmail(email as string)
        : await storage.getAllDonations();
      res.json(donations);
    } catch (error) {
      console.error("Error getting donations:", error);
      res.status(500).json({ error: "Failed to get donations" });
    }
  });

  app.get("/api/donations/stats", async (req, res) => {
    try {
      const stats = await storage.getDonationStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting donation stats:", error);
      res.status(500).json({ error: "Failed to get donation stats" });
    }
  });

  // Chat with AI about endangered animals  
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = chatSchema.parse(req.body);

      // Use the same AI service for chat
      const response = await generateChatResponse(message.trim());
      
      res.json({ response });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("Error generating chat response:", error);
      res.status(500).json({ 
        error: "I apologize, but I'm having trouble responding right now. Please try asking about endangered animals or wildlife conservation again."
      });
    }
  });

  // AI-Powered Conservation Features

  // Poaching Detection API
  app.post("/api/features/poaching-detection", upload.single('image'), async (req, res) => {
    try {
      console.log("[Poaching Detection] Request received");
      
      if (!req.file) {
        console.log("[Poaching Detection] No file uploaded");
        return res.status(400).json({ error: "Image file required" });
      }

      console.log("[Poaching Detection] File received:", {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      const imageBase64 = req.file.buffer.toString('base64');
      
      const location = req.body.latitude && req.body.longitude ? {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
      } : undefined;

      console.log("[Poaching Detection] Using AI Orchestrator (Local → Cloud fallback)...");
      const aiResult = await aiOrchestrator.detectPoachingThreats(imageBase64);
      const result = { ...aiResult.data, location };
      console.log("[Poaching Detection] Analysis complete via", aiResult.provider, "- Threat level:", result.threatLevel);
      
      // Save ALL threat alerts to database (not just critical/high)
      if (result.threatLevel && result.threatLevel !== 'none') {
        try {
          const imageUrl = await storage.saveBase64Image(imageBase64);
          
          // Build detected objects array
          const detectedObjects = [];
          if (result.detections?.all_detections) {
            for (const det of result.detections.all_detections) {
              let category: 'weapon' | 'vehicle' | 'human' | 'animal' = 'animal';
              if (['Knife', 'Pistol', 'Rifle', 'X-Bow', 'Rope'].includes(det.class)) {
                category = 'weapon';
              } else if (['Car', 'Jeep', 'Truck', 'Van', 'Helicopter', 'Bike'].includes(det.class)) {
                category = 'vehicle';
              } else if (det.class === 'Hunter') {
                category = 'human';
              }
              detectedObjects.push({
                class: det.class,
                confidence: det.confidence,
                category
              });
            }
          }
          
          const threatLevelUpper = result.threatLevel.toUpperCase();
          
          await db.insert(poachingAlerts).values({
            imageUrl,
            latitude: location?.latitude || null,
            longitude: location?.longitude || null,
            locationName: req.body.locationName || null,
            threatLevel: threatLevelUpper,
            detectedObjects,
            weaponsCount: result.detections?.weapons || 0,
            humansCount: result.detections?.humans || 0,
            vehiclesCount: result.detections?.vehicles || 0,
            animalsCount: result.detections?.animals || 0,
            alertMessage: result.evidenceDescription || `${threatLevelUpper} threat detected`,
          });
          
          console.log(`✅ Poaching alert saved to database (${threatLevelUpper})`);
        } catch (dbError) {
          console.error("Failed to save poaching alert to database:", dbError);
          // Continue even if database save fails
        }
      }
      
      res.json(result);
    } catch (error) {
      console.error("[Poaching Detection] ERROR:", error);
      console.error("[Poaching Detection] Error stack:", (error as Error).stack);
      res.status(500).json({ error: "Failed to analyze image for poaching evidence", details: (error as Error).message });
    }
  });

  // Health Assessment API - YOLOv11 Only (No Cloud AI)
  app.post("/api/features/health-assessment", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image file required" });
      }

      const imageBase64 = req.file.buffer.toString('base64');
      
      // Parse location data from request
      const latitude = req.body.latitude ? parseFloat(req.body.latitude) : undefined;
      const longitude = req.body.longitude ? parseFloat(req.body.longitude) : undefined;
      const locationName = req.body.locationName || undefined;
      
      // Use YOLOv11 Detection ONLY
      try {
        console.log("🔬 Running YOLOv11 animal detection...");
        const { detectInjuredAnimals } = await import("./services/injury-detection");
        const yoloResult = await detectInjuredAnimals(imageBase64, latitude, longitude);
        console.log(`✅ YOLOv11: ${yoloResult.animalDetected || 'No animal'} detected`);
        
        if (yoloResult && yoloResult.animalDetected) {
          const isInjured = yoloResult.injuryDetails?.detected || false;
          const needsAttention = isInjured;
          
          const responseData = {
            animalIdentified: yoloResult.animalDetected,
            overallHealthStatus: isInjured ? 'injured' : 'healthy',
            confidence: yoloResult.confidence,
            
            visualSymptoms: {
              injuries: isInjured ? ['Injury detected - requires attention'] : ['No visible injuries'],
              malnutrition: false,
              skinConditions: [],
              abnormalBehavior: []
            },
            
            detectedConditions: isInjured ? 
              ['⚠️ Animal is injured'] : 
              ['✅ Animal appears healthy'],
            
            severity: isInjured ? 'Injured - Needs Attention' : 'Healthy - No Intervention Required',
            
            treatmentRecommendations: isInjured ? [
              '🚨 INJURED ANIMAL DETECTED',
              'Contact wildlife veterinarian immediately',
              'Do not approach the animal',
              'Keep location under observation'
            ] : [
              '✅ Animal appears healthy',
              'No immediate action required',
              'Continue normal monitoring'
            ],
            
            veterinaryAlertRequired: needsAttention,
            followUpRequired: needsAttention,
            
            detailedAnalysis: `Animal: ${yoloResult.animalDetected}
Status: ${isInjured ? '⚠️ INJURED - Needs Attention' : '✅ HEALTHY - No Intervention Required'}
Confidence: ${(yoloResult.confidence * 100).toFixed(1)}%

${isInjured ? '🚨 This animal requires veterinary care. Contact wildlife rescue immediately.' : '✅ No visible injuries detected. Animal appears to be in normal condition.'}`,
            
            yoloDetection: {
              model: "YOLOv11n",
              timestamp: new Date().toISOString()
            }
          };
          
          // Save health assessment to database for admin tracking
          try {
            const imageUrl = await storage.saveBase64Image(imageBase64);
            const userId = req.session.user?.id;
            
            // Create animal identification record
            const identification = await storage.createAnimalIdentification({
              speciesName: yoloResult.animalDetected,
              scientificName: yoloResult.animalDetected, // YOLO doesn't provide scientific names
              conservationStatus: "Unknown",
              population: "Data not available",
              habitat: "Detected via health assessment",
              threats: [],
              description: `Animal detected via YOLOv11 health assessment. Status: ${isInjured ? 'Injured' : 'Healthy'}`,
              imageUrl,
              confidence: yoloResult.confidence,
              latitude,
              longitude,
              locationName,
            }, userId);
            
            // Create animal sighting record linked to the identification
            await db.insert(animalSightings).values({
              animalId: identification.id,
              latitude: latitude || 0,
              longitude: longitude || 0,
              location: locationName || 'Unknown Location',
              habitatType: 'Unknown',
              animalStatus: isInjured ? 'injured' : 'healthy',
              emergencyStatus: isInjured ? 'urgent' : 'none',
              description: `Health assessment: ${isInjured ? 'Animal requires attention' : 'Animal appears healthy'}`,
              imageUrl,
            });
            
            console.log(`✅ Health assessment saved to database: ${yoloResult.animalDetected} (${isInjured ? 'injured' : 'healthy'})`);
          } catch (dbError) {
            console.error("Failed to save health assessment to database:", dbError);
            // Continue even if database save fails
          }
          
          return res.json(responseData);
        }
        
        // No animal detected
        return res.json({
          animalIdentified: "No Animal Detected",
          overallHealthStatus: "unknown",
          confidence: 0,
          visualSymptoms: {
            injuries: [],
            malnutrition: false,
            skinConditions: [],
            abnormalBehavior: []
          },
          detectedConditions: ["No animal found in image"],
          severity: "No Analysis Available",
          treatmentRecommendations: [
            "❌ No animals detected",
            "Please upload a clearer image with the animal visible"
          ],
          veterinaryAlertRequired: false,
          followUpRequired: false,
          detailedAnalysis: "No animals detected in the image. Please try again with a clearer photo."
        });
        
      } catch (yoloError) {
        console.error("YOLOv11 error:", yoloError);
        return res.status(500).json({ 
          error: "Animal detection service unavailable. Please try again later." 
        });
      }
      
    } catch (error) {
      console.error("Health assessment error:", error);
      res.status(500).json({ error: "Failed to assess animal health" });
    }
  });

  // Population Prediction API
  app.get("/api/features/population-prediction", async (req, res) => {
    try {
      const { predictPopulation } = await import("./services/population-prediction");
      const species = (req.query.species as string) || "tiger";
      const years = parseInt(req.query.years as string) || 5;
      
      const result = await predictPopulation(species, years);
      res.json(result);
    } catch (error) {
      console.error("Population prediction error:", error);
      res.status(500).json({ error: "Failed to predict population trends" });
    }
  });

  // Get available species data
  app.get("/api/features/wildlife-data", async (req, res) => {
    try {
      const { wildlifePopulationData } = await import("./services/population-prediction");
      res.json(wildlifePopulationData);
    } catch (error) {
      console.error("Wildlife data error:", error);
      res.status(500).json({ error: "Failed to fetch wildlife data" });
    }
  });

  // Admin: Get all animal detections (fauna identification + health assessments)
  app.get("/api/admin/animal-detections", async (req, res) => {
    try {
      console.log("[Admin Detections] Starting fetch...");
      
      // Get all animal identifications with their locations
      const identifications = await db.select()
        .from(animalIdentifications)
        .orderBy(desc(animalIdentifications.createdAt))
        .limit(500); // Limit to last 500 detections

      console.log(`[Admin Detections] Found ${identifications.length} identifications`);

      // Format response with sighting structure (even if no sightings table)
      const combinedData = identifications.map(identification => ({
        id: identification.id,
        speciesName: identification.speciesName,
        scientificName: identification.scientificName,
        conservationStatus: identification.conservationStatus,
        imageUrl: identification.imageUrl,
        confidence: identification.confidence,
        latitude: identification.latitude,
        longitude: identification.longitude,
        locationName: identification.locationName,
        createdAt: identification.createdAt,
        description: identification.description,
        sighting: null, // Will be populated when sightings table is ready
        detectionType: identification.description?.includes('health assessment') ? 'health_assessment' : 'fauna_identification',
      }));

      console.log(`[Admin Detections] Returning ${combinedData.length} detections`);

      res.json({
        success: true,
        totalDetections: combinedData.length,
        detections: combinedData,
      });
    } catch (error) {
      console.error("[Admin Detections] ERROR:", error);
      console.error("[Admin Detections] Error message:", (error as Error).message);
      res.status(500).json({ 
        error: "Failed to fetch animal detections",
        details: (error as Error).message 
      });
    }
  });

  // Admin: Get detection statistics
  app.get("/api/admin/detection-stats", async (req, res) => {
    try {
      const [totalIdentifications] = await db.select({ count: sql<number>`count(*)` })
        .from(animalIdentifications);
      
      const [totalSightings] = await db.select({ count: sql<number>`count(*)` })
        .from(animalSightings);
      
      const [injuredAnimals] = await db.select({ count: sql<number>`count(*)` })
        .from(animalSightings)
        .where(sql`${animalSightings.animalStatus} IN ('injured', 'sick')`);
      
      const [criticalCases] = await db.select({ count: sql<number>`count(*)` })
        .from(animalSightings)
        .where(sql`${animalSightings.emergencyStatus} IN ('urgent', 'critical')`);

      // Get species breakdown
      const speciesBreakdown = await db.select({
        species: animalIdentifications.speciesName,
        count: sql<number>`count(*)`,
      })
      .from(animalIdentifications)
      .groupBy(animalIdentifications.speciesName)
      .orderBy(desc(sql<number>`count(*)`));

      res.json({
        totalIdentifications: totalIdentifications.count,
        totalSightings: totalSightings.count,
        injuredAnimals: injuredAnimals.count,
        criticalCases: criticalCases.count,
        speciesBreakdown,
      });
    } catch (error) {
      console.error("Error fetching detection stats:", error);
      res.status(500).json({ error: "Failed to fetch detection statistics" });
    }
  });

  // Satellite Monitoring API
  app.get("/api/features/satellite-monitoring", async (req, res) => {
    try {
      const { analyzeSatelliteData } = await import("./services/satellite-monitoring");
      const locationName = req.query.location as string;
      const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : undefined;
      const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : undefined;
      
      const result = await analyzeSatelliteData(locationName, latitude, longitude);
      res.json(result);
    } catch (error) {
      console.error("Satellite monitoring error:", error);
      res.status(500).json({ error: "Failed to analyze satellite data" });
    }
  });

  // Wildlife Sightings Heatmap API (uses existing sighting data)
  app.get("/api/features/sightings-heatmap", async (req, res) => {
    try {
      const sightings = await storage.getAnimalSightings();
      
      // Transform sightings into heatmap data
      const heatmapData = sightings
        .filter((s: any) => s.latitude && s.longitude)
        .map((s: any) => ({
          latitude: s.latitude as number,
          longitude: s.longitude as number,
          species: s.animal || "Unknown",
          status: s.animalStatus,
          timestamp: s.timestamp,
          locationName: s.locationName,
          habitatType: s.habitatType,
        }));

      // Calculate species density by location
      const densityMap = new Map<string, { count: number; species: Set<string> }>();
      heatmapData.forEach((point: any) => {
        const key = `${point.latitude.toFixed(2)},${point.longitude.toFixed(2)}`;
        if (!densityMap.has(key)) {
          densityMap.set(key, { count: 0, species: new Set() });
        }
        const data = densityMap.get(key)!;
        data.count++;
        data.species.add(point.species);
      });

      const hotspots = Array.from(densityMap.entries()).map(([coords, data]) => {
        const [lat, lon] = coords.split(',').map(Number);
        return {
          latitude: lat,
          longitude: lon,
          sightingCount: data.count,
          speciesCount: data.species.size,
          priority: data.count * data.species.size,
        };
      }).sort((a, b) => b.priority - a.priority);

      const speciesCountMap = heatmapData.reduce((acc: Map<string, number>, point: any) => {
        acc.set(point.species, (acc.get(point.species) || 0) + 1);
        return acc;
      }, new Map<string, number>());

      res.json({
        totalSightings: sightings.length,
        activeSightings: heatmapData.length,
        heatmapData,
        hotspots: hotspots.slice(0, 10), // Top 10 hotspots
        speciesBreakdown: Array.from(speciesCountMap.entries()).map(([species, count]: [string, number]) => ({ 
          species, 
          count 
        })),
      });
    } catch (error) {
      console.error("Sightings heatmap error:", error);
      res.status(500).json({ error: "Failed to generate sightings heatmap" });
    }
  });

  // NEW AI CONSERVATION FEATURES

  // Habitat Health Monitoring API
  app.get("/api/features/habitat-monitoring", async (req, res) => {
    try {
      const { monitorHabitatHealth, getAllProtectedAreasStatus } = await import("./services/habitat-monitoring");
      
      if (req.query.all === "true") {
        const results = await getAllProtectedAreasStatus();
        return res.json(results);
      }
      
      const location = req.query.location as string || "Karnataka Region";
      const latitude = req.query.latitude ? parseFloat(req.query.latitude as string) : 12.9716;
      const longitude = req.query.longitude ? parseFloat(req.query.longitude as string) : 77.5946;
      const protectedArea = req.query.protectedArea as string;
      
      const result = await monitorHabitatHealth(location, latitude, longitude, protectedArea);
      res.json(result);
    } catch (error) {
      console.error("Habitat monitoring error:", error);
      res.status(500).json({ error: "Failed to monitor habitat health" });
    }
  });

  // Wildlife Sound Detection API
  app.post("/api/features/sound-detection", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Audio file required" });
      }

      const { analyzeBioacousticSound } = await import("./services/sound-detection");
      const audioBase64 = req.file.buffer.toString('base64');
      
      const location = req.body.latitude && req.body.longitude ? {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
      } : undefined;

      const result = await analyzeBioacousticSound(audioBase64, location);
      res.json(result);
    } catch (error) {
      console.error("Sound detection error:", error);
      res.status(500).json({ error: "Failed to analyze wildlife sound" });
    }
  });

  // Footprint Recognition API
  app.post("/api/features/footprint-recognition", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image file required" });
      }

      const { recognizeFootprint } = await import("./services/footprint-recognition");
      const imageBase64 = req.file.buffer.toString('base64');
      
      const result = await recognizeFootprint(imageBase64);
      res.json(result);
    } catch (error) {
      console.error("Footprint recognition error:", error);
      res.status(500).json({ error: "Failed to recognize footprint" });
    }
  });

  // Partial Image Enhancement API
  app.post("/api/features/partial-image-enhancement", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image file required" });
      }

      const { enhanceAndIdentifyPartialImage } = await import("./services/partial-image-enhancement");
      const imageBase64 = req.file.buffer.toString('base64');
      
      const result = await enhanceAndIdentifyPartialImage(imageBase64);
      res.json(result);
    } catch (error) {
      console.error("Partial image enhancement error:", error);
      res.status(500).json({ error: "Failed to enhance and identify partial image" });
    }
  });

  // Wildlife Chatbot API
  app.post("/api/features/chatbot", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const { getWildlifeChatbotResponse } = await import("./services/wildlife-chatbot");
      const result = await getWildlifeChatbotResponse(message, storage);
      res.json(result);
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ error: "Failed to get chatbot response" });
    }
  });

  // Certificate Generation API
  app.post("/api/certificates/generate", async (req, res) => {
    try {
      const { sightingId, recipientName, recipientEmail, contribution, speciesHelped, location } = req.body;
      
      if (!sightingId || !recipientName || !recipientEmail) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const { generateCertificateNumber } = await import("./services/certificate-generator");
      const certificateNumber = generateCertificateNumber();

      const certificate = await storage.createCertificate({
        sightingId,
        recipientName,
        recipientEmail,
        certificateNumber,
        contribution: contribution || `Reported wildlife sighting and contributed to conservation efforts`,
        speciesHelped: speciesHelped || "Wildlife Conservation",
        location: location || "Karnataka, India",
      });

      // Update sighting to mark certificate as issued
      await storage.updateSightingStatus(sightingId, { certificateIssued: 'yes' });

      res.json(certificate);
    } catch (error) {
      console.error("Certificate generation error:", error);
      res.status(500).json({ error: "Failed to generate certificate" });
    }
  });

  // Download Certificate as HTML
  app.get("/api/certificates/download/:certificateNumber", async (req, res) => {
    try {
      const { certificateNumber } = req.params;
      const certificate = await storage.getCertificateByNumber(certificateNumber);

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      const { generateCertificateHTML } = await import("./services/certificate-generator");
      const html = generateCertificateHTML(certificate);

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="wildguard-certificate-${certificate.certificateNumber}.html"`);
      res.send(html);
    } catch (error) {
      console.error("Certificate download error:", error);
      res.status(500).json({ error: "Failed to download certificate" });
    }
  });

  // Get Certificate by Number (for verification)
  app.get("/api/certificates/verify/:certificateNumber", async (req, res) => {
    try {
      const { certificateNumber } = req.params;
      const certificate = await storage.getCertificateByNumber(certificateNumber);

      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      res.json(certificate);
    } catch (error) {
      console.error("Certificate verification error:", error);
      res.status(500).json({ error: "Failed to verify certificate" });
    }
  });

  // Get All Certificates for a User
  app.get("/api/certificates/user/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const certificates = await storage.getCertificatesByEmail(email);
      res.json(certificates);
    } catch (error) {
      console.error("Get user certificates error:", error);
      res.status(500).json({ error: "Failed to get user certificates" });
    }
  });

  // ============================================================
  // ANIMAL IDENTIFICATION DATABASE ROUTES
  // ============================================================

  const {
    getAnimalIdentificationBySpecies,
    searchAnimalsByName,
    getAnimalsByCategory,
    getEndangeredAnimals,
    getKarnatakaAnimals,
    getAnimalsByHabitat,
    getQuickIdentificationGuide,
    compareAnimals,
    getAllAnimalsIdentification,
    enhanceIdentificationWithDatabase,
    getDatabaseStats
  } = await import("./services/animal-identification-db");

  // ============================================================
  // IMAGE ANALYSIS LOGGING SERVICE
  // ============================================================

  const {
    logImageAnalysis,
    getAllAnalysisLogs,
    getAnalysisStatistics,
    flagAnalysis,
    verifyAnalysis,
    getAnalysesByUser,
    getFlaggedAnalyses,
    deleteOldLogs
  } = await import("./services/analysis-logging");

  // Get all animals in the identification database
  app.get("/api/animals/database", async (req, res) => {
    try {
      const animals = await getAllAnimalsIdentification();
      res.json(animals);
    } catch (error) {
      console.error("Get all animals error:", error);
      res.status(500).json({ error: "Failed to fetch animals" });
    }
  });

  // Get specific animal by species name
  app.get("/api/animals/database/:species", async (req, res) => {
    try {
      const { species } = req.params;
      const animal = await getAnimalIdentificationBySpecies(species);
      
      if (!animal) {
        return res.status(404).json({ error: "Animal not found" });
      }
      
      res.json(animal);
    } catch (error) {
      console.error("Get animal error:", error);
      res.status(500).json({ error: "Failed to fetch animal" });
    }
  });

  // Search animals by name
  app.get("/api/animals/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const results = await searchAnimalsByName(q);
      res.json(results);
    } catch (error) {
      console.error("Search animals error:", error);
      res.status(500).json({ error: "Failed to search animals" });
    }
  });

  // Get animals by category
  app.get("/api/animals/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const animals = await getAnimalsByCategory(category);
      res.json(animals);
    } catch (error) {
      console.error("Get animals by category error:", error);
      res.status(500).json({ error: "Failed to fetch animals" });
    }
  });

  // Get endangered animals
  app.get("/api/animals/endangered", async (req, res) => {
    try {
      const animals = await getEndangeredAnimals();
      res.json(animals);
    } catch (error) {
      console.error("Get endangered animals error:", error);
      res.status(500).json({ error: "Failed to fetch endangered animals" });
    }
  });

  // Get Karnataka animals
  app.get("/api/animals/karnataka", async (req, res) => {
    try {
      const animals = await getKarnatakaAnimals();
      res.json(animals);
    } catch (error) {
      console.error("Get Karnataka animals error:", error);
      res.status(500).json({ error: "Failed to fetch Karnataka animals" });
    }
  });

  // Get animals by habitat
  app.get("/api/animals/habitat/:habitat", async (req, res) => {
    try {
      const { habitat } = req.params;
      const animals = await getAnimalsByHabitat(habitat);
      res.json(animals);
    } catch (error) {
      console.error("Get animals by habitat error:", error);
      res.status(500).json({ error: "Failed to fetch animals" });
    }
  });

  // Get quick identification guide
  app.get("/api/animals/guide/:species", async (req, res) => {
    try {
      const { species } = req.params;
      const guide = await getQuickIdentificationGuide(species);
      
      if (!guide) {
        return res.status(404).json({ error: "Animal not found" });
      }
      
      res.json(guide);
    } catch (error) {
      console.error("Get identification guide error:", error);
      res.status(500).json({ error: "Failed to fetch identification guide" });
    }
  });

  // Compare multiple animals
  app.post("/api/animals/compare", async (req, res) => {
    try {
      const { species } = req.body;
      
      if (!Array.isArray(species)) {
        return res.status(400).json({ error: "Species array is required" });
      }
      
      const comparison = await compareAnimals(species);
      res.json(comparison);
    } catch (error) {
      console.error("Compare animals error:", error);
      res.status(500).json({ error: "Failed to compare animals" });
    }
  });

  // Get database statistics
  app.get("/api/animals/stats", async (req, res) => {
    try {
      const stats = await getDatabaseStats();
      res.json(stats);
    } catch (error) {
      console.error("Get database stats error:", error);
      res.status(500).json({ error: "Failed to fetch database stats" });
    }
  });

  // Enhanced identification with database
  app.post("/api/animals/enhance-identification", async (req, res) => {
    try {
      const { species, confidence } = req.body;
      
      if (!species) {
        return res.status(400).json({ error: "Species name is required" });
      }
      
      const enhanced = await enhanceIdentificationWithDatabase(
        species,
        confidence || 0
      );
      
      res.json(enhanced);
    } catch (error) {
      console.error("Enhance identification error:", error);
      res.status(500).json({ error: "Failed to enhance identification" });
    }
  });

  // ============================================================
  // ADMIN - IMAGE ANALYSIS MONITORING ROUTES
  // ============================================================

  // Middleware for admin-only routes
  function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.session.adminUser) {
      return res.status(403).json({ error: "Admin authentication required" });
    }
    next();
  }

  // Get all analysis logs (admin only)
  app.get("/api/admin/analysis-logs", requireAdminAuth, async (req, res) => {
    try {
      const {
        limit = 100,
        offset = 0,
        analysisType,
        aiProvider,
        isSuccessful,
        startDate,
        endDate
      } = req.query;

      const logs = await getAllAnalysisLogs({
        limit: Number(limit),
        offset: Number(offset),
        analysisType: analysisType as string,
        aiProvider: aiProvider as string,
        isSuccessful: isSuccessful === 'true' ? true : isSuccessful === 'false' ? false : undefined,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      });

      res.json(logs);
    } catch (error) {
      console.error("Get analysis logs error:", error);
      res.status(500).json({ error: "Failed to fetch analysis logs" });
    }
  });

  // Get analysis statistics (admin only)
  app.get("/api/admin/analysis-stats", requireAdminAuth, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      const stats = await getAnalysisStatistics({
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined
      });

      res.json(stats);
    } catch (error) {
      console.error("Get analysis stats error:", error);
      res.status(500).json({ error: "Failed to fetch analysis statistics" });
    }
  });

  // Get flagged analyses (admin only)
  app.get("/api/admin/analysis-logs/flagged", requireAdminAuth, async (req, res) => {
    try {
      const { limit = 100 } = req.query;
      const flagged = await getFlaggedAnalyses(Number(limit));
      res.json(flagged);
    } catch (error) {
      console.error("Get flagged analyses error:", error);
      res.status(500).json({ error: "Failed to fetch flagged analyses" });
    }
  });

  // Flag/unflag an analysis (admin only)
  app.post("/api/admin/analysis-logs/:id/flag", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { isFlagged, adminNotes } = req.body;

      const success = await flagAnalysis(id, isFlagged, adminNotes);

      if (success) {
        res.json({ success: true, message: "Analysis flagged successfully" });
      } else {
        res.status(500).json({ error: "Failed to flag analysis" });
      }
    } catch (error) {
      console.error("Flag analysis error:", error);
      res.status(500).json({ error: "Failed to flag analysis" });
    }
  });

  // Verify an analysis (admin only)
  app.post("/api/admin/analysis-logs/:id/verify", requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const adminId = req.session.adminUser!.id;

      const success = await verifyAnalysis(id, adminId);

      if (success) {
        res.json({ success: true, message: "Analysis verified successfully" });
      } else {
        res.status(500).json({ error: "Failed to verify analysis" });
      }
    } catch (error) {
      console.error("Verify analysis error:", error);
      res.status(500).json({ error: "Failed to verify analysis" });
    }
  });

  // Get analyses by specific user (admin only)
  app.get("/api/admin/analysis-logs/user/:userId", requireAdminAuth, async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 50 } = req.query;

      const logs = await getAnalysesByUser(userId, Number(limit));
      res.json(logs);
    } catch (error) {
      console.error("Get user analyses error:", error);
      res.status(500).json({ error: "Failed to fetch user analyses" });
    }
  });

  // Delete old logs (admin only - maintenance endpoint)
  app.delete("/api/admin/analysis-logs/cleanup", requireAdminAuth, async (req, res) => {
    try {
      const { olderThanDays = 365 } = req.query;
      
      // Additional security check - only super admins can delete logs
      if (req.session.adminUser!.role !== 'super_admin') {
        return res.status(403).json({ error: "Super admin access required" });
      }

      const deletedCount = await deleteOldLogs(Number(olderThanDays));
      res.json({ 
        success: true, 
        deletedCount,
        message: `Deleted ${deletedCount} logs older than ${olderThanDays} days`
      });
    } catch (error) {
      console.error("Delete old logs error:", error);
      res.status(500).json({ error: "Failed to delete old logs" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
