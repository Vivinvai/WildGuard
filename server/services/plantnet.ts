// Free PlantNet API integration for plant identification
// Requires free API key from https://my.plantnet.org/

import type { FloraAnalysisResult } from "./gemini";

const PLANTNET_API_URL = "https://my-api.plantnet.org/v2/identify/all";

interface PlantNetResult {
  score: number;
  species: {
    scientificName: string;
    scientificNameWithoutAuthor: string;
    commonNames: string[];
    family?: {
      scientificName: string;
    };
  };
  gbif?: {
    id: string;
  };
}

interface PlantNetResponse {
  query: {
    project: string;
    images: string[];
    organs: string[];
  };
  bestMatch: string;
  results: PlantNetResult[];
  remainingIdentificationRequests: number;
}

export async function identifyPlantWithPlantNet(imageBase64: string): Promise<FloraAnalysisResult> {
  const apiKey = process.env.PLANTNET_API_KEY;
  
  if (!apiKey) {
    throw new Error("PLANTNET_API_KEY not configured. Get free key from https://my.plantnet.org/");
  }

  try {
    // Convert base64 to blob
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    // Create form data
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
    formData.append('images', blob, 'plant.jpg');
    formData.append('organs', 'auto');

    const response = await fetch(`${PLANTNET_API_URL}?api-key=${apiKey}&include-related-images=true`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PlantNet API error: ${response.status} - ${error}`);
    }

    const data: PlantNetResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error("No plant species identified in the image");
    }

    const topResult = data.results[0];
    const species = topResult.species;
    
    // Map to our schema
    const result: FloraAnalysisResult = {
      speciesName: species.commonNames?.[0] || species.scientificNameWithoutAuthor,
      scientificName: species.scientificName,
      conservationStatus: "Data Deficient", // PlantNet doesn't provide this
      endangeredAlert: null,
      isEndangered: false,
      habitat: "Information available via external databases",
      uses: `Common name: ${species.commonNames?.join(", ") || "Unknown"}. Family: ${species.family?.scientificName || "Unknown"}`,
      threats: ["Habitat Loss", "Climate Change"],
      confidence: topResult.score,
    };

    console.log(`PlantNet identified: ${result.speciesName} (${result.scientificName}) with ${(topResult.score * 100).toFixed(1)}% confidence`);
    console.log(`Remaining requests: ${data.remainingIdentificationRequests}`);

    return result;
  } catch (error) {
    console.error("PlantNet identification failed:", error);
    throw error;
  }
}

// Educational fallback for plants (Karnataka flora)
const karnatakaFlora: Record<string, FloraAnalysisResult> = {
  sandalwood: {
    speciesName: "Indian Sandalwood",
    scientificName: "Santalum album",
    conservationStatus: "Vulnerable",
    endangeredAlert: "This species is threatened due to over-exploitation for its valuable aromatic wood. Protected under CITES Appendix II.",
    isEndangered: true,
    habitat: "Dry deciduous and scrub forests of Karnataka, particularly in Marayur, Kollegal, and MM Hills regions. Requires host plants for parasitic roots.",
    uses: "Highly valued for fragrant heartwood used in perfumes, incense, and traditional medicine. Essential oil used in aromatherapy. Sacred wood in Hindu and Buddhist traditions.",
    threats: ["Illegal Harvesting", "Smuggling", "Habitat Loss", "Lack of Natural Regeneration"],
    confidence: 0.80,
  },
  jackfruit: {
    speciesName: "Jackfruit",
    scientificName: "Artocarpus heterophyllus",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to Western Ghats of India, widely cultivated across Karnataka in home gardens and commercial plantations. Thrives in humid tropical lowlands.",
    uses: "State fruit of Kerala and Tamil Nadu. Fruits consumed fresh or cooked, seeds roasted. Wood used for furniture and musical instruments. Young fruits used as vegetable.",
    threats: ["Climate Change", "Pests and Diseases"],
    confidence: 0.92,
  },
  mango: {
    speciesName: "Indian Mango",
    scientificName: "Mangifera indica",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to South Asia, extensively cultivated throughout Karnataka. Prefers tropical and subtropical climates with distinct dry season.",
    uses: "National fruit of India. Fruits consumed fresh, dried, or pickled. Leaves used in ceremonies. Traditional medicine uses include bark for diarrhea, leaves for diabetes.",
    threats: ["Pests", "Climate Variability", "Diseases"],
    confidence: 0.95,
  },
  banyan: {
    speciesName: "Banyan Tree",
    scientificName: "Ficus benghalensis",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Found throughout India including Karnataka, in forests, villages, and temple grounds. Prop roots allow massive spread. Can survive in various soil types.",
    uses: "National tree of India. Sacred in Hinduism and Buddhism. Latex used in traditional medicine. Provides extensive shade for community gatherings. Aerial roots used for ropes.",
    threats: ["Urban Development", "Pruning for Infrastructure"],
    confidence: 0.88,
  },
  neem: {
    speciesName: "Neem Tree",
    scientificName: "Azadirachta indica",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to Indian subcontinent, commonly found across Karnataka in villages, roadsides, and dry deciduous forests. Drought-resistant and hardy.",
    uses: "Known as 'Divine Tree' and 'Village Pharmacy'. All parts medicinal: leaves for skin conditions, oil for pest control, twigs for dental care. Seed oil is natural insecticide.",
    threats: ["Over-exploitation", "Climate Change"],
    confidence: 0.90,
  },
};

export function getEducationalPlantData(): FloraAnalysisResult {
  const plants = Object.values(karnatakaFlora);
  return plants[Math.floor(Math.random() * plants.length)];
}

export { karnatakaFlora };
