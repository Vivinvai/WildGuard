/**
 * Animal Identification Database Service
 * 
 * Provides comprehensive animal identification information including:
 * - Physical characteristics for field identification
 * - Behavioral patterns and habitat information
 * - Conservation status and population data
 * - Comparison with similar species
 * - Identification tips and field marks
 */

import { db } from "../db";
import { eq, ilike, or, and, sql } from "drizzle-orm";

export interface AnimalIdentificationFeatures {
  id: string;
  speciesName: string;
  scientificName: string;
  category: string;
  conservationStatus: string;
  
  // Physical Features
  bodySize: string;
  bodyLength: string | null;
  bodyWeight: string | null;
  bodyColor: string[];
  distinctiveMarkings: string[];
  bodyShape: string | null;
  
  // Head & Face
  headShape: string | null;
  earType: string | null;
  eyeColor: string | null;
  noseType: string | null;
  teethType: string | null;
  
  // Limbs & Movement
  legCount: string | null;
  pawType: string | null;
  tailType: string | null;
  movementStyle: string | null;
  
  // Behavior & Habitat
  habitatType: string[];
  activityPattern: string | null;
  socialBehavior: string | null;
  dietType: string | null;
  
  // Geographic
  nativeRegion: string[];
  foundInKarnataka: boolean;
  altitudeRange: string | null;
  
  // Sounds & Signs
  vocalizations: string[] | null;
  footprintDescription: string | null;
  scatDescription: string | null;
  territorialMarks: string | null;
  
  // Additional Info
  populationEstimate: string | null;
  lifespan: string | null;
  breedingSeason: string | null;
  similarSpecies: string[] | null;
  identificationTips: string[];
  
  // Images
  imageUrl: string;
  footprintImageUrl: string | null;
  scatImageUrl: string | null;
  comparisonImages: string[] | null;
  
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Get animal identification features by species name
 */
export async function getAnimalIdentificationBySpecies(speciesName: string): Promise<AnimalIdentificationFeatures | null> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM animal_identification_features 
      WHERE LOWER(species_name) = LOWER(${speciesName})
      LIMIT 1
    `);
    
    return result.rows[0] as unknown as AnimalIdentificationFeatures | null;
  } catch (error) {
    console.error("Error fetching animal identification:", error);
    return null;
  }
}

/**
 * Search for animals by partial name match
 */
export async function searchAnimalsByName(searchTerm: string): Promise<AnimalIdentificationFeatures[]> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM animal_identification_features 
      WHERE 
        LOWER(species_name) LIKE LOWER(${'%' + searchTerm + '%'})
        OR LOWER(scientific_name) LIKE LOWER(${'%' + searchTerm + '%'})
      ORDER BY species_name
      LIMIT 20
    `);
    
    return result.rows as unknown as AnimalIdentificationFeatures[];
  } catch (error) {
    console.error("Error searching animals:", error);
    return [];
  }
}

/**
 * Get animals by category (Mammal, Bird, Reptile, etc.)
 */
export async function getAnimalsByCategory(category: string): Promise<AnimalIdentificationFeatures[]> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM animal_identification_features 
      WHERE LOWER(category) = LOWER(${category})
      ORDER BY species_name
    `);
    
    return result.rows as unknown as AnimalIdentificationFeatures[];
  } catch (error) {
    console.error("Error fetching animals by category:", error);
    return [];
  }
}

/**
 * Get endangered animals
 */
export async function getEndangeredAnimals(): Promise<AnimalIdentificationFeatures[]> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM animal_identification_features 
      WHERE conservation_status IN ('Endangered', 'Critically Endangered', 'Vulnerable')
      ORDER BY 
        CASE conservation_status
          WHEN 'Critically Endangered' THEN 1
          WHEN 'Endangered' THEN 2
          WHEN 'Vulnerable' THEN 3
        END,
        species_name
    `);
    
    return result.rows as unknown as AnimalIdentificationFeatures[];
  } catch (error) {
    console.error("Error fetching endangered animals:", error);
    return [];
  }
}

/**
 * Get animals found in Karnataka
 */
export async function getKarnatakaAnimals(): Promise<AnimalIdentificationFeatures[]> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM animal_identification_features 
      WHERE found_in_karnataka = true
      ORDER BY species_name
    `);
    
    return result.rows as unknown as AnimalIdentificationFeatures[];
  } catch (error) {
    console.error("Error fetching Karnataka animals:", error);
    return [];
  }
}

/**
 * Get animals by habitat type
 */
export async function getAnimalsByHabitat(habitat: string): Promise<AnimalIdentificationFeatures[]> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM animal_identification_features 
      WHERE ${habitat} = ANY(habitat_type)
      ORDER BY species_name
    `);
    
    return result.rows as unknown as AnimalIdentificationFeatures[];
  } catch (error) {
    console.error("Error fetching animals by habitat:", error);
    return [];
  }
}

/**
 * Get animal identification tips for field use
 */
export async function getQuickIdentificationGuide(speciesName: string): Promise<{
  species: string;
  quickTips: string[];
  keyFeatures: string[];
  similarSpecies: string[];
  habitat: string[];
} | null> {
  try {
    const animal = await getAnimalIdentificationBySpecies(speciesName);
    
    if (!animal) {
      return null;
    }
    
    return {
      species: animal.speciesName,
      quickTips: animal.identificationTips,
      keyFeatures: animal.distinctiveMarkings,
      similarSpecies: animal.similarSpecies || [],
      habitat: animal.habitatType
    };
  } catch (error) {
    console.error("Error generating identification guide:", error);
    return null;
  }
}

/**
 * Compare multiple animals to help with identification
 */
export async function compareAnimals(speciesNames: string[]): Promise<{
  [key: string]: {
    size: string;
    colors: string[];
    markings: string[];
    habitat: string[];
    identificationTips: string[];
  }
}> {
  const comparisons: any = {};
  
  for (const name of speciesNames) {
    const animal = await getAnimalIdentificationBySpecies(name);
    if (animal) {
      comparisons[name] = {
        size: animal.bodySize,
        colors: animal.bodyColor,
        markings: animal.distinctiveMarkings,
        habitat: animal.habitatType,
        identificationTips: animal.identificationTips
      };
    }
  }
  
  return comparisons;
}

/**
 * Get all animals with comprehensive identification data
 */
export async function getAllAnimalsIdentification(): Promise<AnimalIdentificationFeatures[]> {
  try {
    const result = await db.execute(sql`
      SELECT * FROM animal_identification_features 
      ORDER BY 
        CASE category
          WHEN 'Mammal' THEN 1
          WHEN 'Bird' THEN 2
          WHEN 'Reptile' THEN 3
          WHEN 'Amphibian' THEN 4
          WHEN 'Fish' THEN 5
          WHEN 'Fossil' THEN 6
        END,
        species_name
    `);
    
    return result.rows as unknown as AnimalIdentificationFeatures[];
  } catch (error) {
    console.error("Error fetching all animals:", error);
    return [];
  }
}

/**
 * Enhanced identification function that uses the database
 * This can be called after TensorFlow/Gemini provides initial identification
 */
export async function enhanceIdentificationWithDatabase(
  identifiedSpecies: string,
  confidence: number
): Promise<{
  species: string;
  scientificName: string;
  confidence: number;
  identificationFeatures: AnimalIdentificationFeatures | null;
  identificationTips: string[];
  similarSpecies: string[];
  verificationChecklist: string[];
}> {
  const features = await getAnimalIdentificationBySpecies(identifiedSpecies);
  
  if (!features) {
    return {
      species: identifiedSpecies,
      scientificName: "Unknown",
      confidence,
      identificationFeatures: null,
      identificationTips: [],
      similarSpecies: [],
      verificationChecklist: []
    };
  }
  
  // Create verification checklist based on key features
  const verificationChecklist = [
    `Body size: ${features.bodySize}`,
    `Colors: ${features.bodyColor.join(', ')}`,
    `Key markings: ${features.distinctiveMarkings.join(', ')}`,
    `Habitat: ${features.habitatType.join(', ')}`,
    `Activity: ${features.activityPattern || 'Unknown'}`
  ];
  
  return {
    species: features.speciesName,
    scientificName: features.scientificName,
    confidence,
    identificationFeatures: features,
    identificationTips: features.identificationTips,
    similarSpecies: features.similarSpecies || [],
    verificationChecklist
  };
}

/**
 * Database statistics
 */
export async function getDatabaseStats(): Promise<{
  totalAnimals: number;
  byCategory: { [key: string]: number };
  endangeredCount: number;
  karnatakaCount: number;
}> {
  try {
    const total = await db.execute(sql`
      SELECT COUNT(*) as count FROM animal_identification_features
    `);
    
    const byCategory = await db.execute(sql`
      SELECT category, COUNT(*) as count 
      FROM animal_identification_features 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    const endangered = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM animal_identification_features 
      WHERE conservation_status IN ('Endangered', 'Critically Endangered', 'Vulnerable')
    `);
    
    const karnataka = await db.execute(sql`
      SELECT COUNT(*) as count 
      FROM animal_identification_features 
      WHERE found_in_karnataka = true
    `);
    
    const categoryMap: { [key: string]: number } = {};
    for (const row of byCategory.rows) {
      categoryMap[row.category as string] = Number(row.count);
    }
    
    return {
      totalAnimals: Number(total.rows[0]?.count || 0),
      byCategory: categoryMap,
      endangeredCount: Number(endangered.rows[0]?.count || 0),
      karnatakaCount: Number(karnataka.rows[0]?.count || 0)
    };
  } catch (error) {
    console.error("Error fetching database stats:", error);
    return {
      totalAnimals: 0,
      byCategory: {},
      endangeredCount: 0,
      karnatakaCount: 0
    };
  }
}
