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
  verifySighting(id: string, adminEmail: string): Promise<AnimalSighting | undefined>;
  getEmergencySightings(): Promise<AnimalSighting[]>;
  
  // Certificates
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getCertificatesBySighting(sightingId: string): Promise<Certificate[]>;
  getCertificateByNumber(certificateNumber: string): Promise<Certificate | undefined>;
  getCertificatesByEmail(email: string): Promise<Certificate[]>;
  
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
    
    // Create default admin user (username: admineo75, password: wildguard1234)
    const adminId = randomUUID();
    const hashedAdminPassword = bcrypt.hashSync('wildguard1234', 10);
    const defaultAdmin: AdminUser = {
      id: adminId,
      username: 'admineo75',
      password: hashedAdminPassword,
      role: 'government_official',
      department: 'Karnataka Wildlife Department',
      email: 'admin@wildguard.gov.in',
      phone: null,
      createdAt: new Date(),
      lastLogin: null
    };
    this.adminUsers.set(adminId, defaultAdmin);
    
    // Seed sample animal sightings for heatmap demo
    const sampleSightings = [
      { animal: 'Bengal Tiger', lat: 12.0141, lon: 76.0963, location: 'Bandipur National Park', habitat: 'forest' },
      { animal: 'Bengal Tiger', lat: 12.0178, lon: 76.0984, location: 'Bandipur National Park', habitat: 'forest' },
      { animal: 'Asian Elephant', lat: 11.9876, lon: 76.5772, location: 'Nagarahole National Park', habitat: 'grassland' },
      { animal: 'Asian Elephant', lat: 11.9912, lon: 76.5801, location: 'Nagarahole National Park', habitat: 'forest' },
      { animal: 'Asian Elephant', lat: 11.9845, lon: 76.5743, location: 'Nagarahole National Park', habitat: 'wetland' },
      { animal: 'Indian Leopard', lat: 12.0205, lon: 76.0921, location: 'Bandipur National Park', habitat: 'rocky_terrain' },
      { animal: 'Indian Gaur', lat: 12.0156, lon: 76.0995, location: 'Bandipur National Park', habitat: 'grassland' },
      { animal: 'Indian Gaur', lat: 11.9934, lon: 76.5823, location: 'Nagarahole National Park', habitat: 'grassland' },
      { animal: 'Sloth Bear', lat: 12.0189, lon: 76.0878, location: 'Bandipur National Park', habitat: 'forest' },
      { animal: 'Wild Dog (Dhole)', lat: 12.0123, lon: 76.1012, location: 'Bandipur National Park', habitat: 'forest' },
      { animal: 'Wild Dog (Dhole)', lat: 11.9901, lon: 76.5789, location: 'Nagarahole National Park', habitat: 'forest' },
      { animal: 'Sambar Deer', lat: 12.0167, lon: 76.0945, location: 'Bandipur National Park', habitat: 'grassland' },
      { animal: 'Sambar Deer', lat: 11.9889, lon: 76.5812, location: 'Nagarahole National Park', habitat: 'grassland' },
      { animal: 'Spotted Deer', lat: 12.0134, lon: 76.1001, location: 'Bandipur National Park', habitat: 'grassland' },
      { animal: 'Spotted Deer', lat: 11.9867, lon: 76.5756, location: 'Nagarahole National Park', habitat: 'forest' },
      { animal: 'Indian Peafowl', lat: 12.0112, lon: 76.0934, location: 'Bandipur National Park', habitat: 'grassland' },
      { animal: 'Indian Peafowl', lat: 11.9923, lon: 76.5834, location: 'Nagarahole National Park', habitat: 'grassland' },
      { animal: 'King Cobra', lat: 12.0198, lon: 76.0967, location: 'Bandipur National Park', habitat: 'forest' },
      { animal: 'Wild Boar', lat: 12.0145, lon: 76.0978, location: 'Bandipur National Park', habitat: 'grassland' },
      { animal: 'Wild Boar', lat: 11.9895, lon: 76.5767, location: 'Nagarahole National Park', habitat: 'forest' },
    ];

    sampleSightings.forEach((sighting) => {
      const sightingId = randomUUID();
      const animalSighting: any = {
        id: sightingId,
        animalId: null,
        reporterName: 'Wildlife Ranger',
        reporterEmail: 'ranger@wildguard.gov.in',
        reporterPhone: null,
        latitude: sighting.lat,
        longitude: sighting.lon,
        location: sighting.location,
        locationName: sighting.location,
        habitatType: sighting.habitat,
        animal: sighting.animal,
        animalStatus: 'healthy',
        emergencyStatus: 'none',
        description: `Sighted ${sighting.animal} in ${sighting.location}`,
        imageUrl: null,
        certificateIssued: 'no',
        verifiedBy: null,
        verifiedAt: null,
        sightedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      };
      this.animalSightings.set(sightingId, animalSighting);
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
      // MAMMALS
      {
        speciesName: "Bengal Tiger",
        scientificName: "Panthera tigris tigris",
        conservationStatus: "Endangered",
        population: "563 individuals in Karnataka (2024)",
        habitat: "Dense forests, grasslands. Karnataka's Bandipur, Nagarhole, BRT, Bhadra National Parks.",
        threats: ["Poaching", "Habitat Loss", "Human-Wildlife Conflict"],
        region: "Karnataka",
        category: "Mammal",
        description: "The Royal Bengal Tiger is India's national animal and apex predator. Karnataka's tiger reserves are crucial for their conservation."
      },
      {
        speciesName: "Asian Elephant",
        scientificName: "Elephas maximus",
        conservationStatus: "Endangered",
        population: "6,395 individuals in Karnataka (2024)",
        habitat: "Tropical forests, grasslands, cultivated areas. Large populations in Karnataka's Western Ghats.",
        threats: ["Habitat Fragmentation", "Human-Elephant Conflict", "Poaching"],
        region: "Karnataka",
        category: "Mammal",
        description: "Asian elephants are highly intelligent and play crucial roles in forest ecosystems as seed dispersers."
      },
      {
        speciesName: "Indian Leopard",
        scientificName: "Panthera pardus fusca",
        conservationStatus: "Vulnerable",
        population: "1,783 individuals in Karnataka (2024)",
        habitat: "Deciduous forests, grasslands, rocky areas. Abundant in Karnataka's protected areas.",
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
        habitat: "Dry deciduous forests, grasslands, scrublands. Common in Karnataka's Daroji Bear Sanctuary.",
        threats: ["Habitat Loss", "Human-Bear Conflict", "Poaching"],
        region: "Karnataka",
        category: "Mammal",
        description: "Sloth bears are the only bear species native to India, known for their excellent climbing abilities and insect diet."
      },
      {
        speciesName: "Indian Gaur",
        scientificName: "Bos gaurus",
        conservationStatus: "Vulnerable",
        population: "21,000-28,000 in India",
        habitat: "Dense forests, bamboo thickets, grasslands. Western Ghats of Karnataka.",
        threats: ["Habitat Loss", "Disease from Domestic Cattle", "Hunting"],
        region: "Karnataka",
        category: "Mammal",
        description: "The gaur is the world's largest bovine species, standing up to 2m tall. Vital grazers in forest ecosystems."
      },
      {
        speciesName: "Dhole",
        scientificName: "Cuon alpinus",
        conservationStatus: "Endangered",
        population: "2,000-2,500 in India",
        habitat: "Forests, grasslands. Nagarhole, Bandipur National Parks.",
        threats: ["Habitat Loss", "Prey Depletion", "Disease", "Persecution"],
        region: "Karnataka",
        category: "Mammal",
        description: "Dholes are highly social wild dogs that hunt in packs. Excellent communicators with unique whistling calls."
      },
      {
        speciesName: "Striped Hyena",
        scientificName: "Hyaena hyaena",
        conservationStatus: "Near Threatened",
        population: "5,000-14,000 in India",
        habitat: "Scrublands, grasslands, open forests. Scattered across Karnataka.",
        threats: ["Habitat Loss", "Persecution", "Prey Depletion"],
        region: "Karnataka",
        category: "Mammal",
        description: "Nocturnal scavengers with powerful jaws capable of crushing bones. Important for ecosystem cleanup."
      },
      {
        speciesName: "Indian Giant Squirrel",
        scientificName: "Ratufa indica",
        conservationStatus: "Least Concern",
        population: "Unknown",
        habitat: "Dense tropical and mixed deciduous forests. Western Ghats canopy.",
        threats: ["Habitat Loss", "Hunting"],
        region: "Karnataka",
        category: "Mammal",
        description: "Giant squirrels are spectacular arboreal rodents with colorful fur, reaching up to 1m in length including tail."
      },
      {
        speciesName: "Nilgiri Langur",
        scientificName: "Semnopithecus johnii",
        conservationStatus: "Vulnerable",
        population: "Unknown",
        habitat: "Tropical evergreen forests. Endemic to Western Ghats.",
        threats: ["Habitat Loss", "Fragmentation"],
        region: "Karnataka",
        category: "Mammal",
        description: "Black-furred primates with distinctive white head hair. Endemic to Western Ghats rainforests."
      },
      {
        speciesName: "Indian Pangolin",
        scientificName: "Manis crassicaudata",
        conservationStatus: "Endangered",
        population: "Unknown",
        habitat: "Grasslands, tropical forests, dry forests.",
        threats: ["Illegal Wildlife Trade", "Habitat Loss"],
        region: "Karnataka",
        category: "Mammal",
        description: "Pangolins are the world's most trafficked mammals. Covered in protective keratin scales, they feed on ants and termites."
      },
      {
        speciesName: "Smooth-Coated Otter",
        scientificName: "Lutrogale perspicillata",
        conservationStatus: "Vulnerable",
        population: "Unknown",
        habitat: "Rivers, wetlands, mangroves. Cauvery River basin.",
        threats: ["Habitat Loss", "Pollution", "Hunting"],
        region: "Karnataka",
        category: "Mammal",
        description: "Social otters living in family groups. Excellent swimmers crucial for aquatic ecosystem health."
      },
      {
        speciesName: "Indian Wild Dog",
        scientificName: "Cuon alpinus",
        conservationStatus: "Endangered",
        population: "2,000-2,500 in India",
        habitat: "Forests, grasslands across Karnataka's protected areas.",
        threats: ["Habitat Loss", "Disease", "Prey Depletion"],
        region: "Karnataka",
        category: "Mammal",
        description: "Pack hunters with complex social structures. Essential predators maintaining herbivore populations."
      },

      // BIRDS
      {
        speciesName: "Indian Peafowl",
        scientificName: "Pavo cristatus",
        conservationStatus: "Least Concern",
        population: "Common across India",
        habitat: "Forests, grasslands, agricultural areas.",
        threats: ["Habitat Loss", "Hunting"],
        region: "Karnataka",
        category: "Bird",
        description: "India's national bird, famous for spectacular courtship displays. Males have iridescent blue-green plumage."
      },
      {
        speciesName: "Great Indian Hornbill",
        scientificName: "Buceros bicornis",
        conservationStatus: "Vulnerable",
        population: "Unknown",
        habitat: "Evergreen and moist deciduous forests. Western Ghats.",
        threats: ["Habitat Loss", "Hunting", "Nest Site Loss"],
        region: "Karnataka",
        category: "Bird",
        description: "Massive birds with distinctive yellow-orange casques. Important seed dispersers for forest regeneration."
      },
      {
        speciesName: "Malabar Pied Hornbill",
        scientificName: "Anthracoceros coronatus",
        conservationStatus: "Near Threatened",
        population: "Unknown",
        habitat: "Evergreen forests, plantations. Western Ghats.",
        threats: ["Habitat Loss", "Hunting"],
        region: "Karnataka",
        category: "Bird",
        description: "Endemic to Western Ghats. Iconic black and white plumage with large curved bill."
      },
      {
        speciesName: "Nilgiri Wood Pigeon",
        scientificName: "Columba elphinstonii",
        conservationStatus: "Vulnerable",
        population: "Unknown",
        habitat: "Dense montane forests. Endemic to Western Ghats.",
        threats: ["Habitat Loss", "Hunting"],
        region: "Karnataka",
        category: "Bird",
        description: "Beautiful endemic pigeon with checkered black and white neck pattern. Found only in Western Ghats."
      },
      {
        speciesName: "Indian Vulture",
        scientificName: "Gyps indicus",
        conservationStatus: "Critically Endangered",
        population: "Less than 30,000 globally",
        habitat: "Open countryside, agricultural areas.",
        threats: ["Diclofenac Poisoning", "Habitat Loss"],
        region: "Karnataka",
        category: "Bird",
        description: "Vultures prevent disease spread by consuming carcasses. Population crashed 97% due to veterinary drug poisoning."
      },
      {
        speciesName: "Painted Stork",
        scientificName: "Mycteria leucocephala",
        conservationStatus: "Near Threatened",
        population: "Unknown",
        habitat: "Wetlands, marshes, lakes. Ranganathittu Bird Sanctuary.",
        threats: ["Habitat Loss", "Pollution", "Disturbance"],
        region: "Karnataka",
        category: "Bird",
        description: "Striking wading birds with pink tertiary wing feathers. Colonial breeders in wetland habitats."
      },
      {
        speciesName: "Indian Grey Hornbill",
        scientificName: "Ocyceros birostris",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Dry forests, scrublands, urban areas.",
        threats: ["Habitat Loss"],
        region: "Karnataka",
        category: "Bird",
        description: "Adaptable hornbills common even in urban areas. Cavity nesters vital for seed dispersal."
      },
      {
        speciesName: "Black-Headed Ibis",
        scientificName: "Threskiornis melanocephalus",
        conservationStatus: "Near Threatened",
        population: "Unknown",
        habitat: "Wetlands, paddy fields, marshes.",
        threats: ["Habitat Loss", "Pollution", "Disturbance"],
        region: "Karnataka",
        category: "Bird",
        description: "Wetland specialists with distinctive bare black head and curved bill. Important for wetland ecosystems."
      },

      // REPTILES
      {
        speciesName: "Indian Rock Python",
        scientificName: "Python molurus",
        conservationStatus: "Near Threatened",
        population: "Unknown",
        habitat: "Forests, grasslands, agricultural areas.",
        threats: ["Habitat Loss", "Hunting", "Illegal Trade"],
        region: "Karnataka",
        category: "Reptile",
        description: "Large non-venomous constrictor snake. Important rodent predators in agricultural areas."
      },
      {
        speciesName: "King Cobra",
        scientificName: "Ophiophagus hannah",
        conservationStatus: "Vulnerable",
        population: "Unknown",
        habitat: "Dense highland forests. Western Ghats.",
        threats: ["Habitat Loss", "Persecution", "Illegal Trade"],
        region: "Karnataka",
        category: "Reptile",
        description: "World's longest venomous snake. Feeds primarily on other snakes. Essential apex predator."
      },
      {
        speciesName: "Indian Star Tortoise",
        scientificName: "Geochelone elegans",
        conservationStatus: "Vulnerable",
        population: "Declining",
        habitat: "Dry grasslands, scrub forests.",
        threats: ["Illegal Pet Trade", "Habitat Loss"],
        region: "Karnataka",
        category: "Reptile",
        description: "Beautifully patterned tortoise with star-like shell markings. Heavily targeted by illegal pet trade."
      },
      {
        speciesName: "Mugger Crocodile",
        scientificName: "Crocodylus palustris",
        conservationStatus: "Vulnerable",
        population: "5,000-10,000 in India",
        habitat: "Rivers, lakes, marshes. Cauvery River system.",
        threats: ["Habitat Loss", "Human-Wildlife Conflict"],
        region: "Karnataka",
        category: "Reptile",
        description: "Medium-sized crocodile adapted to freshwater habitats. Important apex predator in aquatic ecosystems."
      },
      {
        speciesName: "Indian Chameleon",
        scientificName: "Chamaeleo zeylanicus",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Dry forests, scrublands, gardens.",
        threats: ["Habitat Loss", "Collection for Traditional Medicine"],
        region: "Karnataka",
        category: "Reptile",
        description: "Color-changing lizard with independently mobile eyes. Important insect predator."
      },
      {
        speciesName: "Monitor Lizard",
        scientificName: "Varanus bengalensis",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Forests, grasslands, wetlands.",
        threats: ["Habitat Loss", "Hunting for Skin and Meat"],
        region: "Karnataka",
        category: "Reptile",
        description: "Large carnivorous lizards. Ecosystem cleaners consuming carrion and controlling rodent populations."
      },

      // AMPHIBIANS
      {
        speciesName: "Purple Frog",
        scientificName: "Nasikabatrachus sahyadrensis",
        conservationStatus: "Endangered",
        population: "Unknown",
        habitat: "Moist forests. Endemic to Western Ghats.",
        threats: ["Habitat Loss", "Agriculture", "Climate Change"],
        region: "Karnataka",
        category: "Amphibian",
        description: "Ancient lineage of frog discovered in 2003. Spends most of life underground, emerging only during monsoons."
      },
      {
        speciesName: "Malabar Gliding Frog",
        scientificName: "Rhacophorus malabaricus",
        conservationStatus: "Least Concern",
        population: "Unknown",
        habitat: "Tropical moist forests. Western Ghats.",
        threats: ["Habitat Loss", "Pollution"],
        region: "Karnataka",
        category: "Amphibian",
        description: "Tree frogs capable of gliding using webbed feet. Build foam nests above water bodies."
      },
      {
        speciesName: "Indian Bull Frog",
        scientificName: "Hoplobatrachus tigerinus",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Agricultural areas, wetlands, ponds.",
        threats: ["Pollution", "Overharvesting"],
        region: "Karnataka",
        category: "Amphibian",
        description: "Large edible frogs turning bright yellow during breeding season. Important pest controllers in agriculture."
      },

      // FISH
      {
        speciesName: "Mahseer",
        scientificName: "Tor khudree",
        conservationStatus: "Endangered",
        population: "Declining",
        habitat: "Fast-flowing rivers and streams. Cauvery River.",
        threats: ["Overfishing", "Dam Construction", "Pollution"],
        region: "Karnataka",
        category: "Fish",
        description: "Large game fish known as 'Tiger of the Water'. Important for river ecosystems and local livelihoods."
      },
      {
        speciesName: "Golden Mahseer",
        scientificName: "Tor putitora",
        conservationStatus: "Critically Endangered",
        population: "Severely declining",
        habitat: "Clear rivers in Western Ghats.",
        threats: ["Overfishing", "Habitat Degradation", "Dams"],
        region: "Karnataka",
        category: "Fish",
        description: "Magnificent golden-scaled fish reaching over 50kg. Critical indicator species for river health."
      },

      // MORE MAMMALS
      {
        speciesName: "Sambar Deer",
        scientificName: "Rusa unicolor",
        conservationStatus: "Vulnerable",
        population: "Common in Karnataka",
        habitat: "Dense forests, grasslands.",
        threats: ["Habitat Loss", "Poaching"],
        region: "Karnataka",
        category: "Mammal",
        description: "Largest Indian deer species. Important prey for tigers and leopards."
      },
      {
        speciesName: "Spotted Deer (Chital)",
        scientificName: "Axis axis",
        conservationStatus: "Least Concern",
        population: "Abundant",
        habitat: "Grasslands, light forests.",
        threats: ["Habitat Loss"],
        region: "Karnataka",
        category: "Mammal",
        description: "Beautiful deer with distinctive white spots. Primary prey species for large carnivores."
      },
      {
        speciesName: "Indian Muntjac",
        scientificName: "Muntiacus muntjak",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Dense forests, scrublands.",
        threats: ["Habitat Loss", "Hunting"],
        region: "Karnataka",
        category: "Mammal",
        description: "Small deer known as 'barking deer' due to alarm call. Solitary forest dwellers."
      },
      {
        speciesName: "Four-Horned Antelope",
        scientificName: "Tetracerus quadricornis",
        conservationStatus: "Vulnerable",
        population: "Unknown",
        habitat: "Dry forests, grasslands.",
        threats: ["Habitat Loss", "Hunting"],
        region: "Karnataka",
        category: "Mammal",
        description: "Unique antelope with four horns (males). Endemic to Indian subcontinent."
      },
      {
        speciesName: "Indian Wolf",
        scientificName: "Canis lupus pallipes",
        conservationStatus: "Endangered",
        population: "2,000-3,000 in India",
        habitat: "Grasslands, scrublands.",
        threats: ["Habitat Loss", "Human-Wildlife Conflict", "Prey Depletion"],
        region: "Karnataka",
        category: "Mammal",
        description: "Smaller than northern wolves. Pack hunters essential for ecosystem balance."
      },
      {
        speciesName: "Indian Fox",
        scientificName: "Vulpes bengalensis",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Semi-arid grasslands, agricultural areas.",
        threats: ["Habitat Loss"],
        region: "Karnataka",
        category: "Mammal",
        description: "Small omnivorous foxes. Important rodent controllers in agricultural landscapes."
      },
      {
        speciesName: "Indian Jackal",
        scientificName: "Canis aureus indicus",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Grasslands, scrublands, agricultural areas.",
        threats: ["Persecution", "Disease"],
        region: "Karnataka",
        category: "Mammal",
        description: "Adaptable omnivores and scavengers. Important for ecosystem cleanup and rodent control."
      },
      {
        speciesName: "Jungle Cat",
        scientificName: "Felis chaus",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Wetlands, grasslands, scrublands.",
        threats: ["Habitat Loss", "Persecution"],
        region: "Karnataka",
        category: "Mammal",
        description: "Medium-sized wild cats adapted to diverse habitats. Excellent rodent hunters."
      },
      {
        speciesName: "Rusty-Spotted Cat",
        scientificName: "Prionailurus rubiginosus",
        conservationStatus: "Near Threatened",
        population: "Unknown",
        habitat: "Dry forests, scrublands.",
        threats: ["Habitat Loss"],
        region: "Karnataka",
        category: "Mammal",
        description: "One of the world's smallest wild cats. Nocturnal hunters of rodents and small prey."
      },
      {
        speciesName: "Indian Crested Porcupine",
        scientificName: "Hystrix indica",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Forests, grasslands, agricultural areas.",
        threats: ["Hunting", "Road Mortality"],
        region: "Karnataka",
        category: "Mammal",
        description: "Large rodents with defensive quills. Important seed dispersers and soil aerators."
      },
      {
        speciesName: "Indian Hare",
        scientificName: "Lepus nigricollis",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Grasslands, agricultural areas, scrublands.",
        threats: ["Habitat Loss", "Hunting"],
        region: "Karnataka",
        category: "Mammal",
        description: "Desert-adapted hares. Important prey species for carnivores and raptors."
      },
      {
        speciesName: "Bonnet Macaque",
        scientificName: "Macaca radiata",
        conservationStatus: "Vulnerable",
        population: "Common in Karnataka",
        habitat: "Forests, urban areas, agricultural lands.",
        threats: ["Habitat Loss", "Human-Wildlife Conflict"],
        region: "Karnataka",
        category: "Mammal",
        description: "Endemic to Indian peninsula. Adaptable primates found even in urban areas."
      },
      {
        speciesName: "Common Palm Civet",
        scientificName: "Paradoxurus hermaphroditus",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Forests, plantations, urban areas.",
        threats: ["Habitat Loss", "Hunting"],
        region: "Karnataka",
        category: "Mammal",
        description: "Nocturnal omnivores. Important seed dispersers and coffee bean processors."
      },
      {
        speciesName: "Indian Flying Fox",
        scientificName: "Pteropus medius",
        conservationStatus: "Least Concern",
        population: "Common",
        habitat: "Forests, urban areas with large trees.",
        threats: ["Habitat Loss", "Persecution"],
        region: "Karnataka",
        category: "Mammal",
        description: "Large fruit bats crucial for pollination and seed dispersal. Form large roosting colonies."
      },
      {
        speciesName: "Honey Badger",
        scientificName: "Mellivora capensis",
        conservationStatus: "Least Concern",
        population: "Uncommon",
        habitat: "Forests, grasslands, scrublands.",
        threats: ["Habitat Loss", "Persecution"],
        region: "Karnataka",
        category: "Mammal",
        description: "Fearless omnivores known for ferocity. Important controllers of venomous snakes."
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
      isEndangered: identification.isEndangered ?? false,
      endangeredAlert: identification.endangeredAlert || null,
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

  async verifySighting(id: string, adminEmail: string): Promise<AnimalSighting | undefined> {
    const sighting = this.animalSightings.get(id);
    if (!sighting) return undefined;
    
    const updated = { 
      ...sighting, 
      verifiedBy: adminEmail,
      verifiedAt: new Date()
    };
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

  async getCertificatesByEmail(email: string): Promise<Certificate[]> {
    return Array.from(this.certificates.values())
      .filter(c => c.recipientEmail === email)
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());
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
