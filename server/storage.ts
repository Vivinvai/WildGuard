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
  type AdminUser, type InsertAdminUser,
  type Certificate, type InsertCertificate,
  type UserActivity, type InsertUserActivity,
  wildlifeCentersData, botanicalGardensData, ngosData
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(username: string, password: string): Promise<User | null>;
  
  // Admin user management
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  verifyAdminPassword(username: string, password: string): Promise<AdminUser | null>;
  updateAdminLastLogin(id: string): Promise<void>;
  
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
  getAllSightings(): Promise<AnimalSighting[]>;
  getSightingById(id: string): Promise<AnimalSighting | undefined>;
  updateSightingStatus(id: string, updates: Partial<AnimalSighting>): Promise<AnimalSighting | undefined>;
  getEmergencySightings(): Promise<AnimalSighting[]>;
  
  // Certificates
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getCertificatesBySighting(sightingId: string): Promise<Certificate[]>;
  getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined>;
  
  // User activity tracking
  logActivity(activity: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(filters?: { activityType?: string; userEmail?: string; limit?: number }): Promise<UserActivity[]>;
  getRecentActivities(limit?: number): Promise<UserActivity[]>;
  
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
  private adminUsers: Map<string, AdminUser> = new Map();
  private wildlifeCenters: Map<string, WildlifeCenter> = new Map();
  private animalIdentifications: Map<string, AnimalIdentification> = new Map();
  private supportedAnimals: Map<string, SupportedAnimal> = new Map();
  private floraIdentifications: Map<string, FloraIdentification> = new Map();
  private botanicalGardens: Map<string, BotanicalGarden> = new Map();
  private animalSightings: Map<string, AnimalSighting> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private userActivity: Map<string, UserActivity> = new Map();
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
    
    // Create default admin user (username: Admin, password: 12345678)
    const adminId = randomUUID();
    const hashedAdminPassword = bcrypt.hashSync('12345678', 10);
    const defaultAdmin: AdminUser = {
      id: adminId,
      username: 'Admin',
      password: hashedAdminPassword,
      role: 'government_official',
      department: 'Karnataka Wildlife Department',
      email: 'admin@wildguard.gov.in',
      phone: null,
      createdAt: new Date(),
      lastLogin: null
    };
    this.adminUsers.set(adminId, defaultAdmin);
    
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
      reporterName: sighting.reporterName || null,
      reporterEmail: sighting.reporterEmail || null,
      reporterPhone: sighting.reporterPhone || null,
      latitude: sighting.latitude,
      longitude: sighting.longitude,
      location: sighting.location,
      habitatType: sighting.habitatType,
      animalStatus: sighting.animalStatus,
      emergencyStatus: sighting.emergencyStatus || 'none',
      description: sighting.description || null,
      imageUrl: sighting.imageUrl || null,
      certificateIssued: sighting.certificateIssued || 'no',
      verifiedBy: sighting.verifiedBy || null,
      verifiedAt: sighting.verifiedAt || null,
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
      beforeImageUrl: alert.beforeImageUrl || null,
      afterImageUrl: alert.afterImageUrl || null,
      description: alert.description || null,
      reportedBy: alert.reportedBy || null,
      verifiedBy: alert.verifiedBy || null,
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

  // Admin user management methods
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    return this.adminUsers.get(id);
  }

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    for (const admin of Array.from(this.adminUsers.values())) {
      if (admin.username === username) {
        return admin;
      }
    }
    return undefined;
  }

  async createAdminUser(insertAdmin: InsertAdminUser): Promise<AdminUser> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(insertAdmin.password, saltRounds);
    
    const admin: AdminUser = {
      id: randomUUID(),
      username: insertAdmin.username,
      password: hashedPassword,
      role: insertAdmin.role || 'government_official',
      department: insertAdmin.department || null,
      email: insertAdmin.email || null,
      phone: insertAdmin.phone || null,
      createdAt: new Date(),
      lastLogin: null
    };
    
    this.adminUsers.set(admin.id, admin);
    return admin;
  }

  async verifyAdminPassword(username: string, password: string): Promise<AdminUser | null> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return null;
    
    const isValid = await bcrypt.compare(password, admin.password);
    return isValid ? admin : null;
  }

  async updateAdminLastLogin(id: string): Promise<void> {
    const admin = this.adminUsers.get(id);
    if (admin) {
      admin.lastLogin = new Date();
      this.adminUsers.set(id, admin);
    }
  }

  // Enhanced sighting methods
  async getAllSightings(): Promise<AnimalSighting[]> {
    return Array.from(this.animalSightings.values())
      .sort((a, b) => b.sightedAt.getTime() - a.sightedAt.getTime());
  }

  async getSightingById(id: string): Promise<AnimalSighting | undefined> {
    return this.animalSightings.get(id);
  }

  async updateSightingStatus(id: string, updates: Partial<AnimalSighting>): Promise<AnimalSighting | undefined> {
    const sighting = this.animalSightings.get(id);
    if (!sighting) return undefined;
    
    const updated = { ...sighting, ...updates };
    this.animalSightings.set(id, updated);
    return updated;
  }

  async getEmergencySightings(): Promise<AnimalSighting[]> {
    return Array.from(this.animalSightings.values())
      .filter(s => s.emergencyStatus === 'urgent' || s.emergencyStatus === 'critical')
      .sort((a, b) => {
        const urgencyOrder = { critical: 0, urgent: 1, none: 2 };
        return urgencyOrder[a.emergencyStatus as keyof typeof urgencyOrder] - 
               urgencyOrder[b.emergencyStatus as keyof typeof urgencyOrder];
      });
  }

  // Certificate methods
  async createCertificate(insertCert: InsertCertificate): Promise<Certificate> {
    const cert: Certificate = {
      id: randomUUID(),
      ...insertCert,
      sightingId: insertCert.sightingId || null,
      issueDate: new Date()
    };
    
    this.certificates.set(cert.id, cert);
    return cert;
  }

  async getCertificatesBySighting(sightingId: string): Promise<Certificate[]> {
    return Array.from(this.certificates.values())
      .filter(c => c.sightingId === sightingId);
  }

  async getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined> {
    for (const cert of Array.from(this.certificates.values())) {
      if (cert.certificateNumber === certificateNumber) {
        return cert;
      }
    }
    return undefined;
  }

  // User activity methods
  async logActivity(insertActivity: InsertUserActivity): Promise<UserActivity> {
    const activity: UserActivity = {
      id: randomUUID(),
      activityType: insertActivity.activityType,
      userId: insertActivity.userId || null,
      userName: insertActivity.userName || null,
      userEmail: insertActivity.userEmail || null,
      details: insertActivity.details || null,
      ipAddress: insertActivity.ipAddress || null,
      timestamp: new Date()
    };
    
    this.userActivity.set(activity.id, activity);
    return activity;
  }

  async getUserActivities(filters?: { activityType?: string; userEmail?: string; limit?: number }): Promise<UserActivity[]> {
    let activities = Array.from(this.userActivity.values());
    
    if (filters?.activityType) {
      activities = activities.filter(a => a.activityType === filters.activityType);
    }
    
    if (filters?.userEmail) {
      activities = activities.filter(a => a.userEmail === filters.userEmail);
    }
    
    activities = activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (filters?.limit) {
      return activities.slice(0, filters.limit);
    }
    
    return activities;
  }

  async getRecentActivities(limit = 50): Promise<UserActivity[]> {
    return Array.from(this.userActivity.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

// Use in-memory storage by default to avoid database connection issues
export const storage = new MemStorage();
