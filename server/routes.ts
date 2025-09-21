import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { analyzeAnimalImage } from "./services/openai";
import { insertAnimalIdentificationSchema, insertUserSchema } from "@shared/schema";

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

export async function registerRoutes(app: Express): Promise<Server> {
  // User Registration
  app.post("/api/auth/register", async (req, res) => {
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
      console.error("Error registering user:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to register user"
      });
    }
  });

  // User Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await storage.verifyPassword(username, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Store user session (simplified - you might want to use express-session)
      // Don't return password in response
      const { password: _, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to login"
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
      });

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

  const httpServer = createServer(app);
  return httpServer;
}
