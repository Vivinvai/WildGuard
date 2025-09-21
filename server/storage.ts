import { type User, type InsertUser, type WildlifeCenter, type InsertWildlifeCenter, type AnimalIdentification, type InsertAnimalIdentification, type SupportedAnimal, type InsertSupportedAnimal, users, wildlifeCenters, animalIdentifications, supportedAnimals } from "@shared/schema";
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
  
  getSupportedAnimals(filters?: { region?: string; category?: string; conservationStatus?: string }): Promise<SupportedAnimal[]>;
  createSupportedAnimal(animal: InsertSupportedAnimal): Promise<SupportedAnimal>;
  seedSupportedAnimals(): Promise<void>;
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

  async getSupportedAnimals(filters?: { region?: string; category?: string; conservationStatus?: string }): Promise<SupportedAnimal[]> {
    let query = db.select().from(supportedAnimals);
    
    const conditions = [];
    if (filters?.region) {
      conditions.push(eq(supportedAnimals.region, filters.region));
    }
    if (filters?.category) {
      conditions.push(eq(supportedAnimals.category, filters.category));
    }
    if (filters?.conservationStatus) {
      conditions.push(eq(supportedAnimals.conservationStatus, filters.conservationStatus));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(supportedAnimals.speciesName);
  }

  async createSupportedAnimal(animal: InsertSupportedAnimal): Promise<SupportedAnimal> {
    const [created] = await db.insert(supportedAnimals).values(animal).returning();
    return created;
  }

  async seedSupportedAnimals(): Promise<void> {
    // Check if animals already exist
    const existing = await db.select().from(supportedAnimals).limit(1);
    if (existing.length > 0) return;

    const animalsData: InsertSupportedAnimal[] = [
      // Karnataka Wildlife
      {
        speciesName: "Bengal Tiger",
        scientificName: "Panthera tigris tigris",
        conservationStatus: "Endangered",
        population: "2,500-3,000 individuals in India",
        habitat: "Dense forests, grasslands, and mangrove swamps. Karnataka's Bandipur and Nagarhole National Parks.",
        threats: ["Poaching", "Habitat Loss", "Human-Wildlife Conflict"],
        region: "Karnataka",
        category: "Mammal",
        description: "The Royal Bengal Tiger is India's national animal and a apex predator. Karnataka's tiger reserves are crucial for their conservation."
      },
      {
        speciesName: "Asian Elephant",
        scientificName: "Elephas maximus",
        conservationStatus: "Endangered",
        population: "27,000-31,000 individuals in India",
        habitat: "Tropical forests, grasslands, and cultivated areas. Large populations in Karnataka's Western Ghats.",
        threats: ["Habitat Fragmentation", "Human-Elephant Conflict", "Poaching"],
        region: "Karnataka",
        category: "Mammal",
        description: "Asian elephants are highly intelligent and play crucial roles in forest ecosystems as seed dispersers."
      },
      {
        speciesName: "Indian Leopard",
        scientificName: "Panthera pardus fusca",
        conservationStatus: "Vulnerable",
        population: "12,000-14,000 individuals in India",
        habitat: "Deciduous forests, grasslands, and rocky areas. Abundant in Karnataka's protected areas.",
        threats: ["Retaliatory Killing", "Poaching", "Prey Depletion"],
        region: "Karnataka",
        category: "Mammal",
        description: "Indian leopards are remarkably adaptable big cats that can survive in various habitats near human settlements."
      },
      {
        speciesName: "Sloth Bear",
        scientificName: "Melursus ursinus",
        conservationStatus: "Vulnerable",
        population: "10,000-20,000 individuals in India",
        habitat: "Dry deciduous forests, grasslands, and scrublands. Common in Karnataka's Daroji Bear Sanctuary.",
        threats: ["Habitat Loss", "Human-Bear Conflict", "Poaching"],
        region: "Karnataka",
        category: "Mammal",
        description: "Sloth bears are the only bear species native to India, known for their excellent climbing abilities and insect diet."
      },
      {
        speciesName: "Indian Wild Dog (Dhole)",
        scientificName: "Cuon alpinus",
        conservationStatus: "Endangered",
        population: "2,500 individuals globally",
        habitat: "Dense forests and protected areas. Small populations in Karnataka's Bandipur and Nagarhole.",
        threats: ["Habitat Loss", "Competition with Larger Predators", "Disease"],
        region: "Karnataka",
        category: "Mammal",
        description: "Dholes are highly social pack hunters and one of the most endangered carnivores in India."
      },
      {
        speciesName: "Great Indian Hornbill",
        scientificName: "Buceros bicornis",
        conservationStatus: "Near Threatened",
        population: "13,000-27,000 individuals globally",
        habitat: "Tropical evergreen forests of Western Ghats.",
        threats: ["Deforestation", "Hunting", "Nest Tree Loss"],
        region: "Karnataka",
        category: "Bird",
        description: "The Great Indian Hornbill is a keystone species and important seed disperser in forest ecosystems."
      },
      {
        speciesName: "King Cobra",
        scientificName: "Ophiophagus hannah",
        conservationStatus: "Vulnerable",
        population: "Unknown, declining",
        habitat: "Dense forests and bamboo thickets. Present in Karnataka's Western Ghats.",
        threats: ["Habitat Loss", "Human Persecution", "Illegal Trade"],
        region: "Karnataka",
        category: "Reptile",
        description: "The world's longest venomous snake, King Cobras are apex predators that help control rodent populations."
      }
    ];

    // Insert animals in batches to avoid overwhelming the database
    for (const animal of animalsData) {
      await this.createSupportedAnimal(animal);
    }
  }
}

export const storage = new DatabaseStorage();
