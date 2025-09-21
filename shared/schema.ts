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
