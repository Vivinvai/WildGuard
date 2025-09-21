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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  animalIdentifications: many(animalIdentifications),
}));

export const animalIdentificationsRelations = relations(animalIdentifications, ({ one }) => ({
  user: one(users, {
    fields: [animalIdentifications.userId],
    references: [users.id],
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
