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
  turmeric: {
    speciesName: "Turmeric",
    scientificName: "Curcuma longa",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to South Asia, widely cultivated in Karnataka. Requires warm humid climate with rainfall. Grown in home gardens and commercial farms.",
    uses: "Golden spice of India. Used in cooking, traditional medicine (anti-inflammatory, antiseptic), cosmetics, religious ceremonies. Curcumin has proven health benefits.",
    threats: ["Monoculture Farming", "Soil Degradation"],
    confidence: 0.93,
  },
  tulsi: {
    speciesName: "Holy Basil (Tulsi)",
    scientificName: "Ocimum tenuiflorum",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to Indian subcontinent, grown throughout Karnataka in households and temple gardens. Adapts to various soil conditions.",
    uses: "Sacred plant in Hinduism. Powerful adaptogen in Ayurveda for immunity, stress relief. Leaves used in tea, medicines. Essential oil in aromatherapy.",
    threats: ["Habitat Loss", "Chemical Contamination"],
    confidence: 0.95,
  },
  ashwagandha: {
    speciesName: "Ashwagandha (Indian Ginseng)",
    scientificName: "Withania somnifera",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to India, grows in dry regions of Karnataka. Prefers well-drained soils in arid and semi-arid areas.",
    uses: "Premier adaptogenic herb in Ayurveda. Roots used for stress relief, vitality, immunity. Globally popular as natural supplement.",
    threats: ["Over-harvesting", "Habitat Loss"],
    confidence: 0.88,
  },
  teak: {
    speciesName: "Teak",
    scientificName: "Tectona grandis",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to South Asia, extensively planted in Karnataka's forests and plantations. Prefers monsoon forests with dry season.",
    uses: "Premium timber for furniture, shipbuilding, construction. Highly durable and water-resistant. Major source of forest revenue.",
    threats: ["Over-exploitation", "Illegal Logging", "Plantation Monoculture"],
    confidence: 0.91,
  },
  rosewood: {
    speciesName: "Indian Rosewood",
    scientificName: "Dalbergia latifolia",
    conservationStatus: "Vulnerable",
    endangeredAlert: "⚠️ VULNERABLE: Over-exploited for premium timber. Protected under CITES. Sustainable harvesting essential.",
    isEndangered: true,
    habitat: "Native to India, found in moist deciduous forests of Karnataka's Western Ghats. Slow-growing valuable timber tree.",
    uses: "Highly prized timber for furniture, musical instruments (guitars, pianos), carvings. Dark heartwood with beautiful grain.",
    threats: ["Illegal Logging", "Over-exploitation", "Habitat Loss"],
    confidence: 0.82,
  },
  bamboo: {
    speciesName: "Bamboo",
    scientificName: "Bambusa bambos",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Widespread across Karnataka in forests, roadsides, village commons. Fast-growing grass that thrives in tropical climates.",
    uses: "Construction material, furniture, handicrafts, paper pulp. Edible shoots. Critical for rural economy and wildlife habitat (elephants, birds).",
    threats: ["Over-harvesting", "Habitat Conversion"],
    confidence: 0.90,
  },
  peepal: {
    speciesName: "Sacred Fig (Peepal)",
    scientificName: "Ficus religiosa",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to India, found throughout Karnataka in temples, villages, roadsides. Large deciduous tree, often planted near sacred sites.",
    uses: "Sacred to Hindus and Buddhists (Buddha's enlightenment). Medicinal bark and leaves. Provides excellent shade, oxygen. Supports biodiversity.",
    threats: ["Urban Development", "Infrastructure Conflicts"],
    confidence: 0.89,
  },
  arjuna: {
    speciesName: "Arjuna Tree",
    scientificName: "Terminalia arjuna",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to India, found along rivers and streams in Karnataka. Prefers moist habitats in sub-Himalayan tracts and Western Ghats.",
    uses: "Bark is cardio-protective in Ayurveda (heart health). Used in traditional medicine for circulatory disorders. Timber for construction.",
    threats: ["Riverbank Erosion", "Over-harvesting of Bark"],
    confidence: 0.85,
  },
  amla: {
    speciesName: "Indian Gooseberry (Amla)",
    scientificName: "Phyllanthus emblica",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to India, found in deciduous forests and cultivated across Karnataka. Drought-tolerant, adapts to various soils.",
    uses: "Richest natural source of Vitamin C. Sacred fruit in Hinduism. Used in Ayurveda (Chyawanprash), pickles, juice. Hair care (amla oil).",
    threats: ["Habitat Loss", "Over-collection"],
    confidence: 0.92,
  },
  lotus: {
    speciesName: "Sacred Lotus",
    scientificName: "Nelumbo nucifera",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "National flower of India. Grows in shallow water bodies, ponds, lakes across Karnataka. Rooted in mud with floating leaves.",
    uses: "Sacred in Hinduism and Buddhism. Edible seeds, roots, leaves. Medicinal properties. Ornamental aquatic plant.",
    threats: ["Wetland Loss", "Pollution", "Climate Change"],
    confidence: 0.94,
  },
  curry: {
    speciesName: "Curry Leaf Tree",
    scientificName: "Murraya koenigii",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to India, widely cultivated in Karnataka in home gardens and farms. Prefers warm humid climate.",
    uses: "Essential ingredient in Indian cuisine. Leaves used fresh for flavoring. Medicinal uses: diabetes management, digestion. Rich in antioxidants.",
    threats: ["Habitat Loss", "Over-harvesting"],
    confidence: 0.93,
  },
  tamarind: {
    speciesName: "Tamarind",
    scientificName: "Tamarindus indica",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Naturalized throughout India, common in Karnataka's dry deciduous forests and villages. Drought-tolerant long-lived tree.",
    uses: "Fruit pulp used in cooking (sourness), traditional medicine (digestive, laxative). Wood for furniture. Shade tree.",
    threats: ["Climate Change", "Deforestation"],
    confidence: 0.91,
  },
  coconut: {
    speciesName: "Coconut Palm",
    scientificName: "Cocos nucifera",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Extensively cultivated in coastal and southern Karnataka. Thrives in tropical coastal areas with sandy soil.",
    uses: "Tree of Life. Water, meat, oil, coir, shell, wood - all parts useful. Essential for coastal communities' economy and culture.",
    threats: ["Pests (Rhinoceros Beetle)", "Diseases (Wilt)", "Climate Change"],
    confidence: 0.94,
  },
  pepper: {
    speciesName: "Black Pepper",
    scientificName: "Piper nigrum",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to Western Ghats of India. Climbing vine grown in Karnataka's coffee estates and spice gardens. Requires shade and rainfall.",
    uses: "King of Spices. Globally traded spice, medicinal (digestion, anti-inflammatory). Essential oil. Major export crop.",
    threats: ["Disease (Quick Wilt)", "Climate Change"],
    confidence: 0.90,
  },
  cardamom: {
    speciesName: "Cardamom",
    scientificName: "Elettaria cardamomum",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to Western Ghats, grown in Karnataka's hill regions (Kodagu, Chikmagalur). Requires cool moist shade.",
    uses: "Queen of Spices. Aromatic spice in cooking, beverages (chai). Digestive aid in Ayurveda. Major export crop.",
    threats: ["Habitat Loss", "Climate Change", "Pests"],
    confidence: 0.88,
  },
  betel: {
    speciesName: "Betel Leaf",
    scientificName: "Piper betle",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Climbing vine cultivated throughout Karnataka in betel gardens. Requires warm humid climate with partial shade.",
    uses: "Cultural significance in ceremonies, hospitality. Chewed with areca nut. Medicinal: antiseptic, digestive. Economic crop.",
    threats: ["Pesticide Use", "Declining Demand"],
    confidence: 0.87,
  },
  aloe: {
    speciesName: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Naturalized in India, widely cultivated in Karnataka. Drought-tolerant succulent, grows in arid and semi-arid regions.",
    uses: "Medicinal plant. Gel for skin care, burns, wounds. Ayurvedic medicine (digestive, immunity). Commercial cosmetics and health products.",
    threats: ["Over-harvesting", "Quality Degradation"],
    confidence: 0.92,
  },
  hibiscus: {
    speciesName: "Hibiscus",
    scientificName: "Hibiscus rosa-sinensis",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Widely cultivated across Karnataka in gardens and homes. Tropical shrub with showy flowers.",
    uses: "Ornamental plant, sacred in Hindu worship. Flowers for hair care, natural dye. Traditional medicine (blood pressure, skin).",
    threats: ["Pests", "Diseases"],
    confidence: 0.90,
  },
  jasmine: {
    speciesName: "Jasmine",
    scientificName: "Jasminum sambac",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Native to India, cultivated throughout Karnataka for fragrant flowers. Climbing shrub in gardens and commercial farms.",
    uses: "Highly fragrant flowers for garlands, perfumes, tea. Cultural significance in ceremonies. Essential oil in aromatherapy.",
    threats: ["Pests", "Climate Change"],
    confidence: 0.91,
  },
  marigold: {
    speciesName: "Marigold",
    scientificName: "Tagetes erecta",
    conservationStatus: "Least Concern",
    endangeredAlert: null,
    isEndangered: false,
    habitat: "Widely cultivated across Karnataka. Annual flowering plant in gardens, farms, temple offerings.",
    uses: "Flowers for religious offerings, garlands, festivals (Diwali). Natural pest repellent. Dye from petals.",
    threats: ["Pests", "Diseases"],
    confidence: 0.93,
  },
};

export function getEducationalPlantData(): FloraAnalysisResult {
  console.log("=== Educational Mode (No API Keys Configured) ===");
  console.log("ℹ For accurate plant identification, add PLANTNET_API_KEY (free from https://my.plantnet.org/)");
  console.log("ℹ Or add GOOGLE_API_KEY for AI-powered identification");
  console.log("ℹ Showing educational example of Karnataka flora instead");
  
  const plants = Object.values(karnatakaFlora);
  const educationalExample = plants[Math.floor(Math.random() * plants.length)];
  
  return {
    ...educationalExample,
    speciesName: `EDUCATIONAL MODE: ${educationalExample.speciesName}`,
    habitat: `⚠️ NO IMAGE ANALYSIS PERFORMED - API key required for identification.\n\nEducational Example:\n${educationalExample.habitat}`,
    confidence: 0.0, // Zero confidence = no actual identification
  };
}

export { karnatakaFlora };
