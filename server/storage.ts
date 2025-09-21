import { type User, type InsertUser, type WildlifeCenter, type InsertWildlifeCenter, type AnimalIdentification, type InsertAnimalIdentification } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWildlifeCenters(): Promise<WildlifeCenter[]>;
  getWildlifeCenterById(id: string): Promise<WildlifeCenter | undefined>;
  getNearbyWildlifeCenters(latitude: number, longitude: number, radiusKm?: number): Promise<WildlifeCenter[]>;
  
  createAnimalIdentification(identification: InsertAnimalIdentification): Promise<AnimalIdentification>;
  getRecentAnimalIdentifications(limit?: number): Promise<AnimalIdentification[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wildlifeCenters: Map<string, WildlifeCenter>;
  private animalIdentifications: Map<string, AnimalIdentification>;

  constructor() {
    this.users = new Map();
    this.wildlifeCenters = new Map();
    this.animalIdentifications = new Map();
    
    // Initialize with sample wildlife centers
    this.initializeWildlifeCenters();
  }

  private initializeWildlifeCenters() {
    const centers: WildlifeCenter[] = [
      {
        id: randomUUID(),
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
        id: randomUUID(),
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
        id: randomUUID(),
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

    centers.forEach(center => {
      this.wildlifeCenters.set(center.id, center);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWildlifeCenters(): Promise<WildlifeCenter[]> {
    return Array.from(this.wildlifeCenters.values());
  }

  async getWildlifeCenterById(id: string): Promise<WildlifeCenter | undefined> {
    return this.wildlifeCenters.get(id);
  }

  async getNearbyWildlifeCenters(latitude: number, longitude: number, radiusKm = 50): Promise<WildlifeCenter[]> {
    const centers = Array.from(this.wildlifeCenters.values());
    
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

  async createAnimalIdentification(identification: InsertAnimalIdentification): Promise<AnimalIdentification> {
    const id = randomUUID();
    const animalIdentification: AnimalIdentification = {
      ...identification,
      id,
      population: identification.population || null,
      createdAt: new Date(),
    };
    this.animalIdentifications.set(id, animalIdentification);
    return animalIdentification;
  }

  async getRecentAnimalIdentifications(limit = 10): Promise<AnimalIdentification[]> {
    const identifications = Array.from(this.animalIdentifications.values());
    return identifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
