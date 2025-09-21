import { type User, type InsertUser, type WildlifeCenter, type InsertWildlifeCenter, type AnimalIdentification, type InsertAnimalIdentification, users, wildlifeCenters, animalIdentifications } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(username: string, password: string): Promise<User | null>;
  
  getWildlifeCenters(): Promise<WildlifeCenter[]>;
  getWildlifeCenterById(id: string): Promise<WildlifeCenter | undefined>;
  getNearbyWildlifeCenters(latitude: number, longitude: number, radiusKm?: number): Promise<WildlifeCenter[]>;
  
  createAnimalIdentification(identification: InsertAnimalIdentification, userId?: string): Promise<AnimalIdentification>;
  getRecentAnimalIdentifications(limit?: number): Promise<AnimalIdentification[]>;
  getUserAnimalIdentifications(userId: string, limit?: number): Promise<AnimalIdentification[]>;
}

export class DatabaseStorage implements IStorage {
  private isInitialized = false;

  async initializeWildlifeCenters() {
    if (this.isInitialized) return;
    
    // Check if wildlife centers already exist
    const existingCenters = await db.select().from(wildlifeCenters).limit(1);
    if (existingCenters.length > 0) {
      this.isInitialized = true;
      return;
    }

    const centers: InsertWildlifeCenter[] = [
      {
        name: "Pacific Wildlife Rescue Center",
        description: "Specialized in marine and forest animal rehabilitation",
        latitude: 37.7749,
        longitude: -122.4194,
        phone: "(555) 123-4567",
        email: "contact@pacificwildlife.org",
        website: "https://pacificwildlife.org",
        hours: "Open 24/7",
        services: ["Emergency Care", "Rehabilitation"],
        rating: 4.8,
        address: "123 Forest Ave, San Francisco, CA 94102",
        type: "rescue",
      },
      {
        name: "Green Valley Conservation Sanctuary",
        description: "Large-scale wildlife preservation and breeding programs",
        latitude: 37.7849,
        longitude: -122.4094,
        phone: "(555) 987-6543",
        email: "info@greenvalley.org",
        website: "https://greenvalley.org",
        hours: "9 AM - 6 PM",
        services: ["Research", "Education"],
        rating: 4.6,
        address: "456 Conservation Blvd, San Francisco, CA 94103",
        type: "sanctuary",
      },
      {
        name: "Urban Animal Hospital & Wildlife Care",
        description: "Veterinary services for wild and domestic animals",
        latitude: 37.7649,
        longitude: -122.4294,
        phone: "(555) 456-7890",
        email: "emergency@urbananimal.com",
        website: "https://urbananimal.com",
        hours: "Open 24/7",
        services: ["Veterinary", "Surgery"],
        rating: 4.9,
        address: "789 Medical Center Dr, San Francisco, CA 94104",
        type: "hospital",
      },
    ];

    await db.insert(wildlifeCenters).values(centers);
    this.isInitialized = true;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Hash the password before storing
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(insertUser.password, saltRounds);
    
    const userWithHashedPassword = {
      ...insertUser,
      password: hashedPassword
    };
    
    const [user] = await db.insert(users).values(userWithHashedPassword).returning();
    return user;
  }

  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async getWildlifeCenters(): Promise<WildlifeCenter[]> {
    await this.initializeWildlifeCenters();
    return await db.select().from(wildlifeCenters);
  }

  async getWildlifeCenterById(id: string): Promise<WildlifeCenter | undefined> {
    const [center] = await db.select().from(wildlifeCenters).where(eq(wildlifeCenters.id, id));
    return center || undefined;
  }

  async getNearbyWildlifeCenters(latitude: number, longitude: number, radiusKm = 50): Promise<WildlifeCenter[]> {
    await this.initializeWildlifeCenters();
    
    // For simplicity, we'll get all centers and filter in memory
    // In production, you'd use PostGIS or similar for spatial queries
    const centers = await db.select().from(wildlifeCenters);
    
    return centers.filter(center => {
      const distance = this.calculateDistance(latitude, longitude, center.latitude, center.longitude);
      return distance <= radiusKm;
    }).sort((a, b) => {
      const distanceA = this.calculateDistance(latitude, longitude, a.latitude, a.longitude);
      const distanceB = this.calculateDistance(latitude, longitude, b.latitude, b.longitude);
      return distanceA - distanceB;
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  async createAnimalIdentification(identification: InsertAnimalIdentification, userId?: string): Promise<AnimalIdentification> {
    const insertData = {
      ...identification,
      userId: userId || null,
      population: identification.population || null,
    };
    
    const [result] = await db.insert(animalIdentifications).values(insertData).returning();
    return result;
  }

  async getRecentAnimalIdentifications(limit = 10): Promise<AnimalIdentification[]> {
    return await db.select()
      .from(animalIdentifications)
      .orderBy(desc(animalIdentifications.createdAt))
      .limit(limit);
  }

  async getUserAnimalIdentifications(userId: string, limit = 10): Promise<AnimalIdentification[]> {
    return await db.select()
      .from(animalIdentifications)
      .where(eq(animalIdentifications.userId, userId))
      .orderBy(desc(animalIdentifications.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
