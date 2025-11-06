import { 
  type User, type InsertUser, 
  type WildlifeCenter, type InsertWildlifeCenter, 
  type AnimalIdentification, type InsertAnimalIdentification, 
  type SupportedAnimal, type InsertSupportedAnimal,
  type FloraIdentification, type InsertFloraIdentification,
  type BotanicalGarden, type InsertBotanicalGarden,
  type AnimalSighting, type InsertAnimalSighting,
  type Ngo, type InsertNgo,
  type VolunteerActivity, type InsertVolunteerActivity,
  type DeforestationAlert, type InsertDeforestationAlert,
  type VolunteerApplication, type InsertVolunteerApplication,
  type AnimalAdoption, type InsertAnimalAdoption,
  wildlifeCentersData, botanicalGardensData, ngosData
} from "@shared/schema";
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
  
  createFloraIdentification(identification: InsertFloraIdentification, userId?: string): Promise<FloraIdentification>;
  getRecentFloraIdentifications(limit?: number): Promise<FloraIdentification[]>;
  
  getBotanicalGardens(): Promise<BotanicalGarden[]>;
  getNearbyBotanicalGardens(latitude: number, longitude: number, radiusKm?: number): Promise<BotanicalGarden[]>;
  
  createAnimalSighting(sighting: InsertAnimalSighting): Promise<AnimalSighting>;
  getAnimalSightings(animalId?: string): Promise<AnimalSighting[]>;
  
  getNgos(filters?: { focus?: string }): Promise<Ngo[]>;
  getNgoById(id: string): Promise<Ngo | undefined>;
  
  getVolunteerActivities(filters?: { status?: string; ngoId?: string }): Promise<VolunteerActivity[]>;
  createVolunteerActivity(activity: InsertVolunteerActivity): Promise<VolunteerActivity>;
  
  getDeforestationAlerts(filters?: { severity?: string; limit?: number }): Promise<DeforestationAlert[]>;
  createDeforestationAlert(alert: InsertDeforestationAlert): Promise<DeforestationAlert>;
  
  createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication>;
  getVolunteerApplications(filters?: { ngoId?: string; status?: string }): Promise<VolunteerApplication[]>;
  
  createAnimalAdoption(adoption: InsertAnimalAdoption): Promise<AnimalAdoption>;
  getAnimalAdoptions(filters?: { animalId?: string; status?: string }): Promise<AnimalAdoption[]>;
}

// DatabaseStorage temporarily disabled to avoid database connection issues

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private wildlifeCenters: Map<string, WildlifeCenter> = new Map();
  private animalIdentifications: Map<string, AnimalIdentification> = new Map();
  private supportedAnimals: Map<string, SupportedAnimal> = new Map();
  private floraIdentifications: Map<string, FloraIdentification> = new Map();
  private botanicalGardens: Map<string, BotanicalGarden> = new Map();
  private animalSightings: Map<string, AnimalSighting> = new Map();
  private ngos: Map<string, Ngo> = new Map();
  private volunteerActivities: Map<string, VolunteerActivity> = new Map();
  private deforestationAlerts: Map<string, DeforestationAlert> = new Map();
  private volunteerApplications: Map<string, VolunteerApplication> = new Map();
  private animalAdoptions: Map<string, AnimalAdoption> = new Map();
  private isInitialized = false;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    if (this.isInitialized) return;
    
    // Seed wildlife centers from shared data
    wildlifeCentersData.forEach(center => {
      const id = randomUUID();
      const wildlifeCenter: WildlifeCenter = {
        id,
        ...center,
        email: center.email || null,
        website: center.website || null
      };
      this.wildlifeCenters.set(id, wildlifeCenter);
    });
    
    // Seed botanical gardens
    botanicalGardensData.forEach(garden => {
      const id = randomUUID();
      const botanicalGarden: BotanicalGarden = {
        id,
        ...garden,
        email: garden.email || null,
        website: garden.website || null
      };
      this.botanicalGardens.set(id, botanicalGarden);
    });
    
    // Seed NGOs
    ngosData.forEach(ngo => {
      const id = randomUUID();
      const ngoEntry: Ngo = {
        id,
        ...ngo,
        website: ngo.website || null,
        established: ngo.established || null
      };
      this.ngos.set(id, ngoEntry);
    });
    
    this.isInitialized = true;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(insertUser.password, saltRounds);
    
    const user: User = {
      id: randomUUID(),
      username: insertUser.username,
      password: hashedPassword
    };
    
    this.users.set(user.id, user);
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

  async createAnimalIdentification(identification: InsertAnimalIdentification, userId?: string): Promise<AnimalIdentification> {
    const result: AnimalIdentification = {
      id: randomUUID(),
      userId: userId || null,
      speciesName: identification.speciesName,
      scientificName: identification.scientificName,
      conservationStatus: identification.conservationStatus,
      population: identification.population || null,
      habitat: identification.habitat,
      threats: identification.threats,
      imageUrl: identification.imageUrl,
      confidence: identification.confidence,
      createdAt: new Date()
    };
    
    this.animalIdentifications.set(result.id, result);
    return result;
  }

  async getRecentAnimalIdentifications(limit = 10): Promise<AnimalIdentification[]> {
    const identifications = Array.from(this.animalIdentifications.values());
    return identifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getUserAnimalIdentifications(userId: string, limit = 10): Promise<AnimalIdentification[]> {
    const identifications = Array.from(this.animalIdentifications.values());
    return identifications
      .filter(id => id.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getSupportedAnimals(filters?: { region?: string; category?: string; conservationStatus?: string }): Promise<SupportedAnimal[]> {
    let animals = Array.from(this.supportedAnimals.values());
    
    if (filters?.region) {
      animals = animals.filter(animal => animal.region === filters.region);
    }
    if (filters?.category) {
      animals = animals.filter(animal => animal.category === filters.category);
    }
    if (filters?.conservationStatus) {
      animals = animals.filter(animal => animal.conservationStatus === filters.conservationStatus);
    }
    
    return animals.sort((a, b) => a.speciesName.localeCompare(b.speciesName));
  }

  async createSupportedAnimal(animal: InsertSupportedAnimal): Promise<SupportedAnimal> {
    const result: SupportedAnimal = {
      id: randomUUID(),
      ...animal,
      population: animal.population || null,
      createdAt: new Date()
    };
    
    this.supportedAnimals.set(result.id, result);
    return result;
  }

  async seedSupportedAnimals(): Promise<void> {
    // Only seed if no animals exist
    if (this.supportedAnimals.size > 0) return;

    const animalsData: InsertSupportedAnimal[] = [
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
      }
    ];

    for (const animal of animalsData) {
      await this.createSupportedAnimal(animal);
    }
  }

  async createFloraIdentification(identification: InsertFloraIdentification, userId?: string): Promise<FloraIdentification> {
    const result: FloraIdentification = {
      id: randomUUID(),
      userId: userId || null,
      speciesName: identification.speciesName,
      scientificName: identification.scientificName,
      conservationStatus: identification.conservationStatus,
      habitat: identification.habitat,
      uses: identification.uses,
      threats: identification.threats,
      imageUrl: identification.imageUrl,
      confidence: identification.confidence,
      createdAt: new Date()
    };
    
    this.floraIdentifications.set(result.id, result);
    return result;
  }

  async getRecentFloraIdentifications(limit = 10): Promise<FloraIdentification[]> {
    const identifications = Array.from(this.floraIdentifications.values());
    return identifications
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getBotanicalGardens(): Promise<BotanicalGarden[]> {
    return Array.from(this.botanicalGardens.values());
  }

  async getNearbyBotanicalGardens(latitude: number, longitude: number, radiusKm = 50): Promise<BotanicalGarden[]> {
    const gardens = Array.from(this.botanicalGardens.values());
    
    return gardens.filter(garden => {
      const distance = this.calculateDistance(latitude, longitude, garden.latitude, garden.longitude);
      return distance <= radiusKm;
    }).sort((a, b) => {
      const distanceA = this.calculateDistance(latitude, longitude, a.latitude, a.longitude);
      const distanceB = this.calculateDistance(latitude, longitude, b.latitude, b.longitude);
      return distanceA - distanceB;
    });
  }

  async createAnimalSighting(sighting: InsertAnimalSighting): Promise<AnimalSighting> {
    const result: AnimalSighting = {
      id: randomUUID(),
      animalId: sighting.animalId || null,
      latitude: sighting.latitude,
      longitude: sighting.longitude,
      location: sighting.location,
      habitatType: sighting.habitatType,
      sightedAt: new Date()
    };
    
    this.animalSightings.set(result.id, result);
    return result;
  }

  async getAnimalSightings(animalId?: string): Promise<AnimalSighting[]> {
    const sightings = Array.from(this.animalSightings.values());
    if (animalId) {
      return sightings.filter(s => s.animalId === animalId);
    }
    return sightings;
  }

  async getNgos(filters?: { focus?: string }): Promise<Ngo[]> {
    let ngosList = Array.from(this.ngos.values());
    
    if (filters?.focus) {
      ngosList = ngosList.filter(ngo => ngo.focus.includes(filters.focus!));
    }
    
    return ngosList.sort((a, b) => b.rating - a.rating);
  }

  async getNgoById(id: string): Promise<Ngo | undefined> {
    return this.ngos.get(id);
  }

  async getVolunteerActivities(filters?: { status?: string; ngoId?: string }): Promise<VolunteerActivity[]> {
    let activities = Array.from(this.volunteerActivities.values());
    
    if (filters?.status) {
      activities = activities.filter(a => a.status === filters.status);
    }
    if (filters?.ngoId) {
      activities = activities.filter(a => a.ngoId === filters.ngoId);
    }
    
    return activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createVolunteerActivity(activity: InsertVolunteerActivity): Promise<VolunteerActivity> {
    const result: VolunteerActivity = {
      id: randomUUID(),
      ...activity,
      ngoId: activity.ngoId || null,
      volunteersJoined: activity.volunteersJoined ?? 0,
      createdAt: new Date()
    };
    
    this.volunteerActivities.set(result.id, result);
    return result;
  }

  async getDeforestationAlerts(filters?: { severity?: string; limit?: number }): Promise<DeforestationAlert[]> {
    let alerts = Array.from(this.deforestationAlerts.values());
    
    if (filters?.severity) {
      alerts = alerts.filter(a => a.severity === filters.severity);
    }
    
    const sortedAlerts = alerts.sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
    
    if (filters?.limit) {
      return sortedAlerts.slice(0, filters.limit);
    }
    
    return sortedAlerts;
  }

  async createDeforestationAlert(alert: InsertDeforestationAlert): Promise<DeforestationAlert> {
    const result: DeforestationAlert = {
      id: randomUUID(),
      ...alert,
      protectedArea: alert.protectedArea || null,
      affectedSpecies: alert.affectedSpecies || null,
      imageUrl: alert.imageUrl || null,
      detectedAt: new Date()
    };
    
    this.deforestationAlerts.set(result.id, result);
    return result;
  }

  async createVolunteerApplication(application: InsertVolunteerApplication): Promise<VolunteerApplication> {
    const result: VolunteerApplication = {
      id: randomUUID(),
      ...application,
      ngoId: application.ngoId || null,
      skills: application.skills || null,
      message: application.message || null,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.volunteerApplications.set(result.id, result);
    return result;
  }

  async getVolunteerApplications(filters?: { ngoId?: string; status?: string }): Promise<VolunteerApplication[]> {
    let applications = Array.from(this.volunteerApplications.values());
    
    if (filters?.ngoId) {
      applications = applications.filter(a => a.ngoId === filters.ngoId);
    }
    
    if (filters?.status) {
      applications = applications.filter(a => a.status === filters.status);
    }
    
    return applications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createAnimalAdoption(adoption: InsertAnimalAdoption): Promise<AnimalAdoption> {
    const result: AnimalAdoption = {
      id: randomUUID(),
      ...adoption,
      message: adoption.message || null,
      status: 'pending',
      createdAt: new Date()
    };
    
    this.animalAdoptions.set(result.id, result);
    return result;
  }

  async getAnimalAdoptions(filters?: { animalId?: string; status?: string }): Promise<AnimalAdoption[]> {
    let adoptions = Array.from(this.animalAdoptions.values());
    
    if (filters?.animalId) {
      adoptions = adoptions.filter(a => a.animalId === filters.animalId);
    }
    
    if (filters?.status) {
      adoptions = adoptions.filter(a => a.status === filters.status);
    }
    
    return adoptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Use in-memory storage by default to avoid database connection issues
export const storage = new MemStorage();
