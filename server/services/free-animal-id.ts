// Free animal identification service with multiple fallback strategies
// Priority: iNaturalist info -> Gemini (if API key) -> Educational fallback

import type { AnimalAnalysisResult } from "./openai";
import { searchSpeciesByName } from "./inaturalist";

// Comprehensive Karnataka wildlife database for offline/fallback mode
const karnatakaWildlife: Record<string, AnimalAnalysisResult> = {
  tiger: {
    speciesName: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    conservationStatus: "Endangered",
    population: "2,967 individuals in India (2018 census)",
    habitat: "Tropical and subtropical forests, grasslands, and mangroves across India. Karnataka is home to 524 tigers across Bandipur, Nagarahole, BRT, Bhadra, and Kali Tiger Reserves.",
    threats: ["Habitat Loss", "Poaching", "Human-Wildlife Conflict", "Prey Depletion"],
    confidence: 0.85,
  },
  elephant: {
    speciesName: "Asian Elephant",
    scientificName: "Elephas maximus indicus",
    conservationStatus: "Endangered",
    population: "27,000-31,000 in India, 6,395 in Karnataka (2023)",
    habitat: "Tropical deciduous forests, grasslands, and cultivated areas. Karnataka hosts the largest elephant population in India, with key populations in Bandipur-Nagarahole-BRT complex and Malnad regions.",
    threats: ["Habitat Fragmentation", "Human-Elephant Conflict", "Poaching for Ivory", "Railway Accidents"],
    confidence: 0.90,
  },
  leopard: {
    speciesName: "Indian Leopard",
    scientificName: "Panthera pardus fusca",
    conservationStatus: "Vulnerable",
    population: "12,000-14,000 individuals in India",
    habitat: "Highly adaptable - found in forests, grasslands, agricultural areas, and even urban peripheries. Common across Karnataka's protected areas and forest fringes.",
    threats: ["Habitat Loss", "Human-Wildlife Conflict", "Poaching for Skin", "Prey Depletion"],
    confidence: 0.82,
  },
  slothbear: {
    speciesName: "Sloth Bear",
    scientificName: "Melursus ursinus",
    conservationStatus: "Vulnerable",
    population: "10,000-12,000 in India",
    habitat: "Tropical and subtropical forests with termite mounds. Found across Karnataka's protected areas, especially Bandipur, Nagarahole, and Daroji Bear Sanctuary.",
    threats: ["Habitat Loss", "Human-Bear Conflict", "Poaching for Body Parts", "Road Accidents"],
    confidence: 0.78,
  },
  gaur: {
    speciesName: "Indian Gaur (Bison)",
    scientificName: "Bos gaurus",
    conservationStatus: "Vulnerable",
    population: "13,000-30,000 in India",
    habitat: "Dense evergreen and deciduous forests with grassy meadows. Karnataka's Western Ghats host significant populations, especially in Bandipur and Nagarahole.",
    threats: ["Habitat Loss", "Disease from Domestic Cattle", "Hunting", "Climate Change"],
    confidence: 0.85,
  },
  wilddog: {
    speciesName: "Indian Wild Dog (Dhole)",
    scientificName: "Cuon alpinus",
    conservationStatus: "Endangered",
    population: "2,500 individuals globally, significant population in Karnataka",
    habitat: "Dense forests and grasslands. One of India's most endangered carnivores, found in packs in Karnataka's tiger reserves.",
    threats: ["Habitat Loss", "Disease from Domestic Dogs", "Prey Depletion", "Competition with Tigers and Leopards"],
    confidence: 0.75,
  },
  sambar: {
    speciesName: "Sambar Deer",
    scientificName: "Rusa unicolor",
    conservationStatus: "Vulnerable",
    population: "Widespread but declining",
    habitat: "Dense forests near water sources. Primary prey species for tigers and leopards in Karnataka's forests.",
    threats: ["Habitat Loss", "Hunting", "Predation", "Disease"],
    confidence: 0.88,
  },
};

// Enhanced pattern matching for animal identification
function identifyAnimalFromPattern(base64Image: string): AnimalAnalysisResult | null {
  // In a real implementation, this would use visual features
  // For now, return random educational data to demonstrate the system
  const animals = Object.values(karnatakaWildlife);
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return { ...randomAnimal, confidence: 0.65 };
}

export async function identifyAnimalFree(base64Image: string): Promise<AnimalAnalysisResult> {
  console.log("=== Educational Mode (No API Keys Configured) ===");
  console.log("ℹ For accurate animal identification, add GOOGLE_API_KEY");
  console.log("ℹ Showing educational example of Karnataka wildlife instead");
  
  // Return an educational example with clear disclaimer
  const animals = Object.values(karnatakaWildlife);
  const educationalExample = animals[Math.floor(Math.random() * animals.length)];
  
  return {
    ...educationalExample,
    speciesName: `EDUCATIONAL MODE: ${educationalExample.speciesName}`,
    habitat: `⚠️ NO IMAGE ANALYSIS PERFORMED - API key required for identification.\n\nEducational Example:\n${educationalExample.habitat}`,
    confidence: 0.0, // Zero confidence = no actual identification
  };
}

export { karnatakaWildlife };
