import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, real, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const wildlifeCenters = pgTable("wildlife_centers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  website: text("website"),
  hours: text("hours").notNull(),
  services: text("services").array().notNull(),
  rating: real("rating").notNull(),
  address: text("address").notNull(),
  type: text("type").notNull(), // 'rescue', 'sanctuary', 'hospital', 'research'
});

export const animalIdentifications = pgTable("animal_identifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  speciesName: text("species_name").notNull(),
  scientificName: text("scientific_name").notNull(),
  conservationStatus: text("conservation_status").notNull(),
  population: text("population"),
  habitat: text("habitat").notNull(),
  threats: text("threats").array().notNull(),
  imageUrl: text("image_url").notNull(),
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdCreatedAtIdx: index("animal_identifications_user_id_created_at_idx").on(table.userId, table.createdAt),
  createdAtIdx: index("animal_identifications_created_at_idx").on(table.createdAt),
}));

export const supportedAnimals = pgTable("supported_animals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  speciesName: text("species_name").notNull().unique(),
  scientificName: text("scientific_name").notNull(),
  conservationStatus: text("conservation_status").notNull(),
  population: text("population"),
  habitat: text("habitat").notNull(),
  threats: text("threats").array().notNull(),
  region: text("region").notNull(), // 'Karnataka', 'India', 'Global'
  category: text("category").notNull(), // 'Mammal', 'Bird', 'Reptile', 'Amphibian', 'Fish'
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  regionIdx: index("supported_animals_region_idx").on(table.region),
  categoryIdx: index("supported_animals_category_idx").on(table.category),
  conservationStatusIdx: index("supported_animals_conservation_status_idx").on(table.conservationStatus),
}));

export const floraIdentifications = pgTable("flora_identifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "set null" }),
  speciesName: text("species_name").notNull(),
  scientificName: text("scientific_name").notNull(),
  conservationStatus: text("conservation_status").notNull(),
  habitat: text("habitat").notNull(),
  uses: text("uses").array().notNull(),
  threats: text("threats").array().notNull(),
  imageUrl: text("image_url").notNull(),
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userIdCreatedAtIdx: index("flora_identifications_user_id_created_at_idx").on(table.userId, table.createdAt),
  createdAtIdx: index("flora_identifications_created_at_idx").on(table.createdAt),
}));

export const botanicalGardens = pgTable("botanical_gardens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  website: text("website"),
  hours: text("hours").notNull(),
  specializations: text("specializations").array().notNull(),
  rating: real("rating").notNull(),
  address: text("address").notNull(),
});

export const animalSightings = pgTable("animal_sightings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id").references(() => animalIdentifications.id, { onDelete: "cascade" }),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  location: text("location").notNull(),
  habitatType: text("habitat_type").notNull(),
  sightedAt: timestamp("sighted_at").defaultNow().notNull(),
}, (table) => ({
  animalIdIdx: index("animal_sightings_animal_id_idx").on(table.animalId),
  locationIdx: index("animal_sightings_location_idx").on(table.location),
}));

export const ngos = pgTable("ngos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  focus: text("focus").array().notNull(), // 'Wildlife', 'Flora', 'Habitat', 'Research'
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  address: text("address").notNull(),
  volunteerOpportunities: text("volunteer_opportunities").array().notNull(),
  established: text("established"),
  rating: real("rating").notNull(),
}, (table) => ({
  focusIdx: index("ngos_focus_idx").on(table.focus),
}));

export const volunteerActivities = pgTable("volunteer_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ngoId: varchar("ngo_id").references(() => ngos.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'Rescue', 'Survey', 'Plantation', 'Awareness'
  location: text("location").notNull(),
  date: text("date").notNull(),
  volunteersNeeded: real("volunteers_needed").notNull(),
  volunteersJoined: real("volunteers_joined").notNull().default(0),
  status: text("status").notNull(), // 'upcoming', 'ongoing', 'completed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  ngoIdIdx: index("volunteer_activities_ngo_id_idx").on(table.ngoId),
  statusIdx: index("volunteer_activities_status_idx").on(table.status),
}));

export const deforestationAlerts = pgTable("deforestation_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  areaLost: real("area_lost").notNull(), // in hectares
  severity: text("severity").notNull(), // 'low', 'medium', 'high', 'critical'
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  protectedArea: text("protected_area"),
  affectedSpecies: text("affected_species").array(),
  imageUrl: text("image_url"),
}, (table) => ({
  locationIdx: index("deforestation_alerts_location_idx").on(table.location),
  severityIdx: index("deforestation_alerts_severity_idx").on(table.severity),
  detectedAtIdx: index("deforestation_alerts_detected_at_idx").on(table.detectedAt),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWildlifeCenterSchema = createInsertSchema(wildlifeCenters).omit({
  id: true,
});

export const insertAnimalIdentificationSchema = createInsertSchema(animalIdentifications).omit({
  id: true,
  createdAt: true,
});

export const insertSupportedAnimalSchema = createInsertSchema(supportedAnimals).omit({
  id: true,
  createdAt: true,
});

export const insertFloraIdentificationSchema = createInsertSchema(floraIdentifications).omit({
  id: true,
  createdAt: true,
});

export const insertBotanicalGardenSchema = createInsertSchema(botanicalGardens).omit({
  id: true,
});

export const insertAnimalSightingSchema = createInsertSchema(animalSightings).omit({
  id: true,
  sightedAt: true,
});

export const insertNgoSchema = createInsertSchema(ngos).omit({
  id: true,
});

export const insertVolunteerActivitySchema = createInsertSchema(volunteerActivities).omit({
  id: true,
  createdAt: true,
});

export const insertDeforestationAlertSchema = createInsertSchema(deforestationAlerts).omit({
  id: true,
  detectedAt: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  animalIdentifications: many(animalIdentifications),
  floraIdentifications: many(floraIdentifications),
}));

export const animalIdentificationsRelations = relations(animalIdentifications, ({ one, many }) => ({
  user: one(users, {
    fields: [animalIdentifications.userId],
    references: [users.id],
  }),
  sightings: many(animalSightings),
}));

export const floraIdentificationsRelations = relations(floraIdentifications, ({ one }) => ({
  user: one(users, {
    fields: [floraIdentifications.userId],
    references: [users.id],
  }),
}));

export const animalSightingsRelations = relations(animalSightings, ({ one }) => ({
  animal: one(animalIdentifications, {
    fields: [animalSightings.animalId],
    references: [animalIdentifications.id],
  }),
}));

export const ngosRelations = relations(ngos, ({ many }) => ({
  volunteerActivities: many(volunteerActivities),
}));

export const volunteerActivitiesRelations = relations(volunteerActivities, ({ one }) => ({
  ngo: one(ngos, {
    fields: [volunteerActivities.ngoId],
    references: [ngos.id],
  }),
}));

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type WildlifeCenter = typeof wildlifeCenters.$inferSelect;
export type InsertWildlifeCenter = z.infer<typeof insertWildlifeCenterSchema>;
export type AnimalIdentification = typeof animalIdentifications.$inferSelect;
export type InsertAnimalIdentification = z.infer<typeof insertAnimalIdentificationSchema>;
export type SupportedAnimal = typeof supportedAnimals.$inferSelect;
export type InsertSupportedAnimal = z.infer<typeof insertSupportedAnimalSchema>;
export type FloraIdentification = typeof floraIdentifications.$inferSelect;
export type InsertFloraIdentification = z.infer<typeof insertFloraIdentificationSchema>;
export type BotanicalGarden = typeof botanicalGardens.$inferSelect;
export type InsertBotanicalGarden = z.infer<typeof insertBotanicalGardenSchema>;
export type AnimalSighting = typeof animalSightings.$inferSelect;
export type InsertAnimalSighting = z.infer<typeof insertAnimalSightingSchema>;
export type Ngo = typeof ngos.$inferSelect;
export type InsertNgo = z.infer<typeof insertNgoSchema>;
export type VolunteerActivity = typeof volunteerActivities.$inferSelect;
export type InsertVolunteerActivity = z.infer<typeof insertVolunteerActivitySchema>;
export type DeforestationAlert = typeof deforestationAlerts.$inferSelect;
export type InsertDeforestationAlert = z.infer<typeof insertDeforestationAlertSchema>;

// Static data for wildlife centers
export const wildlifeCentersData: InsertWildlifeCenter[] = [
  {
    name: "Bandipur National Park",
    description: "One of India's premier tiger reserves, home to the largest population of tigers in Karnataka.",
    latitude: 11.7401,
    longitude: 76.5026,
    phone: "+91 8229 236043",
    email: "bandipur@karnataka.gov.in",
    website: "https://bandipur.org",
    hours: "6:00 AM - 6:00 PM",
    services: ["Tiger Conservation", "Elephant Protection", "Wildlife Safari"],
    rating: 4.5,
    address: "Chamarajanagar District, Karnataka",
    type: "national_park"
  },
  {
    name: "Nagarhole National Park",
    description: "Rich biodiversity with elephants, tigers, leopards, and over 270 bird species.",
    latitude: 12.0015,
    longitude: 76.0711,
    phone: "+91 8272 258901",
    email: "nagarhole@karnataka.gov.in",
    website: "https://nagarhole.org",
    hours: "6:00 AM - 6:00 PM",
    services: ["Wildlife Safari", "Bird Watching", "Nature Education"],
    rating: 4.4,
    address: "Kodagu & Mysore Districts, Karnataka",
    type: "national_park"
  },
  {
    name: "Daroji Bear Sanctuary",
    description: "Dedicated sanctuary for sloth bears with excellent viewing opportunities.",
    latitude: 15.2993,
    longitude: 76.8880,
    phone: "+91 8533 290123",
    email: "daroji@karnataka.gov.in",
    website: "https://daroji.org",
    hours: "6:30 AM - 6:00 PM",
    services: ["Sloth Bear Conservation", "Wildlife Photography", "Research"],
    rating: 4.3,
    address: "Ballari District, Karnataka",
    type: "sanctuary"
  },
  {
    name: "Bhadra Wildlife Sanctuary",
    description: "Important tiger habitat with pristine river ecosystem and diverse wildlife.",
    latitude: 13.4700,
    longitude: 75.6535,
    phone: "+91 8762 278901",
    email: "bhadra@karnataka.gov.in",
    website: "https://bhadra.org",
    hours: "6:00 AM - 6:00 PM",
    services: ["Tiger Conservation", "River Ecosystem", "Wildlife Research"],
    rating: 4.2,
    address: "Chikkamagaluru District, Karnataka",
    type: "sanctuary"
  },
  {
    name: "Kudremukh National Park",
    description: "Western Ghats biodiversity hotspot with unique shola forests and endemic species.",
    latitude: 13.1544,
    longitude: 75.5044,
    phone: "+91 8266 267890",
    email: "kudremukh@karnataka.gov.in",
    website: "https://kudremukh.org",
    hours: "6:00 AM - 6:00 PM",
    services: ["Shola Forests", "Endemic Species", "Trekking"],
    rating: 4.6,
    address: "Chikkamagaluru District, Karnataka",
    type: "national_park"
  },
  {
    name: "Wildlife Rescue & Rehabilitation Centre",
    description: "Dedicated to rescuing, treating, and rehabilitating small wild animals including birds, squirrels, and reptiles.",
    latitude: 12.8014,
    longitude: 77.5707,
    phone: "+91 80 2847 3454",
    email: "rescue@bannerghatta.org",
    website: "https://wildliferescue.org",
    hours: "9:00 AM - 5:00 PM",
    services: ["Small Animal Rescue", "Rehabilitation", "Veterinary Care"],
    rating: 4.7,
    address: "Bannerghatta, Bengaluru",
    type: "rescue"
  },
  {
    name: "Compassionate Animal Care",
    description: "Provides emergency care and protection for small wildlife in urban areas. Specializes in bird rescue and monkey conflicts.",
    latitude: 12.9279,
    longitude: 77.5619,
    phone: "+91 98450 78912",
    email: "care@compassionate.org",
    website: "https://compassionatecare.org",
    hours: "24/7 Emergency",
    services: ["Wildlife First Aid", "Animal Welfare", "Emergency Response"],
    rating: 4.5,
    address: "Jayanagar, Bengaluru",
    type: "rescue"
  },
  {
    name: "Bangalore Wildlife Welfare Society",
    description: "Community-based organization focused on protecting small animals and resolving human-wildlife conflicts in urban Bengaluru.",
    latitude: 12.9698,
    longitude: 77.7500,
    phone: "+91 99160 45678",
    email: "welfare@bwws.org",
    website: "https://bangalorewildlife.org",
    hours: "8:00 AM - 8:00 PM",
    services: ["Snake Rescue", "Urban Wildlife", "Community Education"],
    rating: 4.4,
    address: "Whitefield, Bengaluru",
    type: "rescue"
  }
];

// Static data for botanical gardens
export const botanicalGardensData: InsertBotanicalGarden[] = [
  {
    name: "Lalbagh Botanical Garden",
    description: "Historic 240-acre botanical garden with over 1,000 plant species, including rare tropical and sub-tropical plants.",
    latitude: 12.9507,
    longitude: 77.5848,
    phone: "+91 80 2657 8072",
    email: "lalbagh@bangaloregardens.gov.in",
    website: "https://lalbagh.in",
    hours: "6:00 AM - 7:00 PM",
    specializations: ["Tropical Plants", "Medicinal Plants", "Rare Flora", "Rose Garden"],
    rating: 4.6,
    address: "Mavalli, Bengaluru, Karnataka 560004"
  },
  {
    name: "Cubbon Park Botanical Section",
    description: "300-acre lung space of Bengaluru with extensive collection of native Karnataka flora and ornamental plants.",
    latitude: 12.9762,
    longitude: 77.5929,
    phone: "+91 80 2286 4442",
    email: "cubbonpark@bangaloregardens.gov.in",
    website: "https://cubbonpark.in",
    hours: "5:00 AM - 8:00 PM",
    specializations: ["Native Flora", "Urban Forestry", "Ornamental Plants"],
    rating: 4.5,
    address: "Kasturba Road, Bengaluru, Karnataka 560001"
  },
  {
    name: "University of Agricultural Sciences Botanical Garden",
    description: "Research-focused botanical garden with extensive medicinal plants collection and rare Western Ghats species.",
    latitude: 13.0728,
    longitude: 77.5801,
    phone: "+91 80 2333 0153",
    email: "botany@uasbangalore.edu.in",
    website: "https://uasbangalore.edu.in",
    hours: "9:00 AM - 5:00 PM",
    specializations: ["Medicinal Plants", "Western Ghats Endemic Flora", "Agricultural Research"],
    rating: 4.3,
    address: "GKVK Campus, Bengaluru, Karnataka 560065"
  },
  {
    name: "Mysore Brindavan Gardens",
    description: "Spectacular terraced garden with ornamental plants, fountains, and seasonal flower displays.",
    latitude: 12.4244,
    longitude: 76.5750,
    phone: "+91 821 248 0966",
    email: "brindavan@mysurugardens.gov.in",
    website: "https://brindavangardens.org",
    hours: "6:00 AM - 8:00 PM",
    specializations: ["Ornamental Plants", "Seasonal Flowers", "Landscape Design"],
    rating: 4.4,
    address: "KRS Dam, Srirangapatna, Mandya District, Karnataka"
  }
];

// Static data for NGOs
export const ngosData: InsertNgo[] = [
  {
    name: "Wildlife Conservation Society - Karnataka",
    description: "Leading wildlife conservation organization working on tiger, elephant, and leopard protection across Karnataka.",
    focus: ["Wildlife", "Habitat", "Research"],
    latitude: 12.9716,
    longitude: 77.5946,
    phone: "+91 80 2334 5678",
    email: "karnataka@wcs.org",
    website: "https://india.wcs.org",
    address: "Palace Road, Bengaluru, Karnataka 560052",
    volunteerOpportunities: ["Wildlife Survey", "Community Education", "Data Collection"],
    established: "1998",
    rating: 4.7
  },
  {
    name: "Nature Conservation Foundation",
    description: "Research and conservation organization focusing on Western Ghats biodiversity and community-based conservation.",
    focus: ["Wildlife", "Flora", "Habitat", "Research"],
    latitude: 13.0358,
    longitude: 77.5971,
    phone: "+91 80 2352 3197",
    email: "info@ncf-india.org",
    website: "https://www.ncf-india.org",
    address: "Yelahanka New Town, Bengaluru, Karnataka 560064",
    volunteerOpportunities: ["Biodiversity Survey", "Research Assistance", "Conservation Projects"],
    established: "1996",
    rating: 4.8
  },
  {
    name: "Wildlife Rescue & Rehabilitation Centre",
    description: "Dedicated to rescuing injured and orphaned wildlife across Karnataka with 24/7 emergency response.",
    focus: ["Wildlife", "Habitat"],
    latitude: 12.8014,
    longitude: 77.5707,
    phone: "+91 80 2847 3454",
    email: "rescue@wrrc.org.in",
    website: "https://wildliferescue.org",
    address: "Bannerghatta, Bengaluru, Karnataka 560083",
    volunteerOpportunities: ["Animal Care", "Emergency Response", "Public Awareness"],
    established: "2003",
    rating: 4.6
  },
  {
    name: "Karnataka Forest Department - Community Outreach",
    description: "Government initiative connecting communities with forest conservation and wildlife protection programs.",
    focus: ["Wildlife", "Flora", "Habitat"],
    latitude: 12.9758,
    longitude: 77.5983,
    phone: "+91 80 2235 3789",
    email: "outreach@aranya.gov.in",
    website: "https://aranya.gov.in",
    address: "Aranya Bhavan, Malleshwaram, Bengaluru, Karnataka 560003",
    volunteerOpportunities: ["Tree Plantation", "Wildlife Monitoring", "Community Programs"],
    established: "1864",
    rating: 4.4
  },
  {
    name: "Greenpeace India - Bangalore Chapter",
    description: "Environmental activism organization working on climate change, deforestation, and wildlife habitat protection.",
    focus: ["Habitat", "Flora"],
    latitude: 12.9352,
    longitude: 77.6245,
    phone: "+91 80 4115 4286",
    email: "bangalore@greenpeace.org",
    website: "https://www.greenpeace.org/india",
    address: "Koramangala, Bengaluru, Karnataka 560034",
    volunteerOpportunities: ["Campaign Support", "Awareness Drives", "Documentation"],
    established: "2001",
    rating: 4.5
  }
];
