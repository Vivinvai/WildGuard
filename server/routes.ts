import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { analyzeAnimalImage } from "./services/openai";
import { analyzeFloraWithGemini } from "./services/gemini";
import { generateChatResponse } from "./services/chat";
import { 
  insertAnimalIdentificationSchema, 
  insertFloraIdentificationSchema,
  insertAnimalSightingSchema,
  insertVolunteerActivitySchema,
  insertDeforestationAlertSchema,
  insertVolunteerApplicationSchema,
  insertAnimalAdoptionSchema,
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

  // Upload and analyze animal photo
  app.post("/api/identify-animal", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const analysisResult = await analyzeAnimalImage(base64Image);

      // Get userId from session if authenticated
      const userId = req.session.user?.id;

      // Store the identification result
      const identification = await storage.createAnimalIdentification({
        speciesName: analysisResult.speciesName,
        scientificName: analysisResult.scientificName,
        conservationStatus: analysisResult.conservationStatus,
        population: analysisResult.population,
        habitat: analysisResult.habitat,
        threats: analysisResult.threats,
        imageUrl: `data:${req.file.mimetype};base64,${base64Image}`,
        confidence: analysisResult.confidence,
      }, userId);

      res.json(identification);
    } catch (error) {
      console.error("Error identifying animal:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to identify animal"
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

  // Upload and analyze plant photo
  app.post("/api/identify-flora", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const base64Image = req.file.buffer.toString('base64');
      const analysisResult = await analyzeFloraWithGemini(base64Image);

      const userId = req.session.user?.id;

      const identification = await storage.createFloraIdentification({
        speciesName: analysisResult.speciesName,
        scientificName: analysisResult.scientificName,
        conservationStatus: analysisResult.conservationStatus,
        isEndangered: analysisResult.isEndangered,
        endangeredAlert: analysisResult.endangeredAlert,
        habitat: analysisResult.habitat,
        uses: analysisResult.uses,
        threats: analysisResult.threats,
        imageUrl: `data:${req.file.mimetype};base64,${base64Image}`,
        confidence: analysisResult.confidence,
      }, userId);

      res.json(identification);
    } catch (error) {
      console.error("Error identifying flora:", error);
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

      const { analyzePoachingEvidence } = await import("./services/poaching-detection");
      const imageBase64 = req.file.buffer.toString('base64');
      
      const location = req.body.latitude && req.body.longitude ? {
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
      } : undefined;

      console.log("[Poaching Detection] Calling AI service...");
      const result = await analyzePoachingEvidence(imageBase64, location);
      console.log("[Poaching Detection] Analysis complete, threat level:", result.threatLevel);
      
      res.json(result);
    } catch (error) {
      console.error("[Poaching Detection] ERROR:", error);
      console.error("[Poaching Detection] Error stack:", (error as Error).stack);
      res.status(500).json({ error: "Failed to analyze image for poaching evidence", details: (error as Error).message });
    }
  });

  // Health Assessment API
  app.post("/api/features/health-assessment", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image file required" });
      }

      const { assessAnimalHealth } = await import("./services/health-assessment");
      const imageBase64 = req.file.buffer.toString('base64');
      
      const result = await assessAnimalHealth(imageBase64);
      res.json(result);
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

  const httpServer = createServer(app);
  return httpServer;
}
