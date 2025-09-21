import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { analyzeAnimalImage } from "./services/openai";
import { generateChatResponse } from "./services/chat";
import { insertAnimalIdentificationSchema, insertUserSchema } from "@shared/schema";
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
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
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

  const httpServer = createServer(app);
  return httpServer;
}
