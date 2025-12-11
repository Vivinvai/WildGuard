/**
 * Dual Gemini Verification System
 * 
 * Uses TWO separate Gemini API calls for cross-verification:
 * 1. First Gemini: Visual description + identification
 * 2. Second Gemini: Independent identification
 * 3. Compare results for consensus
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export interface VisualDescription {
  overallAppearance: string;
  colorPatterns: string[];
  distinctiveFeatures: string[];
  bodyStructure: string;
  environmentContext: string;
  estimatedSize: string;
}

export interface GeminiIdentification {
  speciesName: string;
  scientificName: string;
  confidence: number;
  reasoning: string;
}

export interface DualGeminiResult {
  visualDescription: VisualDescription;
  firstIdentification: GeminiIdentification;
  secondIdentification: GeminiIdentification;
  consensus: {
    agreed: boolean;
    finalSpecies: string;
    finalScientificName: string;
    finalConfidence: number;
    comparisonNotes: string;
  };
  conservationData: {
    status: string;
    population: string;
    habitat: string;
    threats: string[];
  };
  processingTimeMs: number;
}

/**
 * Step 1: Get visual description from first Gemini call
 */
async function getVisualDescription(imageBase64: string): Promise<{
  description: VisualDescription;
  identification: GeminiIdentification;
}> {
  const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("GOOGLE_API_KEY or GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a wildlife expert analyzing this image. Provide a detailed visual description AND your identification.

STEP 1: Describe what you SEE in the image (be very specific about visual details)
STEP 2: Based on these visual clues, identify the species

Respond with a valid JSON object in EXACTLY this format:
{
  "visualDescription": {
    "overallAppearance": "General description of the animal's appearance",
    "colorPatterns": ["Color 1", "Color 2", "Pattern description"],
    "distinctiveFeatures": ["Feature 1", "Feature 2", "Feature 3"],
    "bodyStructure": "Description of body shape, size, proportions",
    "environmentContext": "What environment/setting is visible in the image",
    "estimatedSize": "Size category: Very Small / Small / Medium / Large / Very Large"
  },
  "identification": {
    "speciesName": "Common name of the species",
    "scientificName": "Scientific name in Latin",
    "confidence": 0.85,
    "reasoning": "Explain why you identified this species based on the visual features you described"
  }
}

Be extremely detailed in your visual description. Look for:
- Fur/feather/scale patterns and colors
- Body proportions and structure
- Facial features, ear shape, eye placement
- Tail characteristics
- Limb structure
- Any distinctive markings or features
- Size relative to environment`;

  const genResult = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    },
  ]);

  const responseText = genResult.response.text();
  if (!responseText) {
    throw new Error("Empty response from Gemini (First Call)");
  }

  const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
  const result = JSON.parse(cleanedText);

  return {
    description: result.visualDescription,
    identification: result.identification
  };
}

/**
 * Step 2: Get independent identification from second Gemini call
 */
async function getIndependentIdentification(imageBase64: string): Promise<GeminiIdentification> {
  const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("GOOGLE_API_KEY or GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a wildlife identification expert. Analyze this image and identify the animal species with high precision.

Respond with a valid JSON object in EXACTLY this format:
{
  "speciesName": "Common name of the species",
  "scientificName": "Scientific name in Latin",
  "confidence": 0.85,
  "reasoning": "Explain the key features that led to this identification"
}

Focus on accuracy. Consider:
- Body structure and proportions
- Color patterns and markings
- Habitat/environment visible
- Any distinctive anatomical features
- Geographic distribution likelihood

If you're uncertain, provide your best estimate and adjust confidence accordingly.`;

  const genResult = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg",
      },
    },
  ]);

  const responseText = genResult.response.text();
  if (!responseText) {
    throw new Error("Empty response from Gemini (Second Call)");
  }

  const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleanedText);
}

/**
 * Step 3: Get conservation data for identified species
 */
async function getConservationData(speciesName: string, scientificName: string): Promise<{
  status: string;
  population: string;
  habitat: string;
  threats: string[];
}> {
  const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("GOOGLE_API_KEY or GEMINI_API_KEY not configured");
  }

  const genAI = new GoogleGenerativeAI(geminiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Provide detailed conservation data for: ${speciesName} (${scientificName})

Respond with a valid JSON object in EXACTLY this format:
{
  "status": "Conservation status: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, etc.",
  "population": "Current population estimate with units and trend",
  "habitat": "Detailed habitat description and geographic distribution",
  "threats": ["Primary threat 1", "Primary threat 2", "Primary threat 3", "Primary threat 4"]
}

Use latest IUCN data and be specific about:
- Exact conservation status
- Population numbers and trends
- Natural habitat and range
- Major threats to survival`;

  const genResult = await model.generateContent(prompt);
  const responseText = genResult.response.text();
  
  if (!responseText) {
    return {
      status: "Unknown",
      population: "Data unavailable",
      habitat: "Data unavailable",
      threats: ["Data unavailable"]
    };
  }

  const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleanedText);
}

/**
 * Main function: Dual Gemini verification with cross-reference
 */
export async function analyzewithDualGemini(imageBase64: string): Promise<DualGeminiResult> {
  const startTime = Date.now();

  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║  🔬 DUAL GEMINI VERIFICATION SYSTEM                       ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  // STEP 1: First Gemini - Visual description + identification
  console.log("📸 Step 1: Getting visual description from Gemini #1...");
  const firstCall = await getVisualDescription(imageBase64);
  console.log(`✅ Gemini #1 identified: ${firstCall.identification.speciesName}`);
  console.log(`   Scientific: ${firstCall.identification.scientificName}`);
  console.log(`   Confidence: ${(firstCall.identification.confidence * 100).toFixed(1)}%`);
  console.log(`   Visual features noted: ${firstCall.description.distinctiveFeatures.length} features\n`);

  // STEP 2: Second Gemini - Independent identification
  console.log("🔍 Step 2: Getting independent identification from Gemini #2...");
  const secondCall = await getIndependentIdentification(imageBase64);
  console.log(`✅ Gemini #2 identified: ${secondCall.speciesName}`);
  console.log(`   Scientific: ${secondCall.scientificName}`);
  console.log(`   Confidence: ${(secondCall.confidence * 100).toFixed(1)}%\n`);

  // STEP 3: Compare results for consensus
  console.log("⚖️  Step 3: Comparing results for consensus...");
  const speciesMatch = firstCall.identification.speciesName.toLowerCase().includes(secondCall.speciesName.toLowerCase()) ||
                       secondCall.speciesName.toLowerCase().includes(firstCall.identification.speciesName.toLowerCase());
  
  const scientificMatch = firstCall.identification.scientificName.toLowerCase() === secondCall.scientificName.toLowerCase();
  
  const agreed = speciesMatch || scientificMatch;
  
  let finalSpecies: string;
  let finalScientificName: string;
  let finalConfidence: number;
  let comparisonNotes: string;

  if (agreed) {
    // Both Gemini calls agree - use higher confidence result
    if (firstCall.identification.confidence >= secondCall.confidence) {
      finalSpecies = firstCall.identification.speciesName;
      finalScientificName = firstCall.identification.scientificName;
      finalConfidence = Math.min(firstCall.identification.confidence * 1.1, 0.99); // Boost confidence slightly
    } else {
      finalSpecies = secondCall.speciesName;
      finalScientificName = secondCall.scientificName;
      finalConfidence = Math.min(secondCall.confidence * 1.1, 0.99);
    }
    comparisonNotes = `✅ CONSENSUS REACHED: Both Gemini instances identified the same species. High confidence result.`;
    console.log("✅ CONSENSUS: Both Gemini calls agree!");
  } else {
    // Disagreement - use higher confidence or flag uncertainty
    if (firstCall.identification.confidence >= secondCall.confidence) {
      finalSpecies = firstCall.identification.speciesName;
      finalScientificName = firstCall.identification.scientificName;
      finalConfidence = firstCall.identification.confidence * 0.8; // Reduce confidence due to disagreement
    } else {
      finalSpecies = secondCall.speciesName;
      finalScientificName = secondCall.scientificName;
      finalConfidence = secondCall.confidence * 0.8;
    }
    comparisonNotes = `⚠️ DISAGREEMENT: Gemini #1 identified as "${firstCall.identification.speciesName}" while Gemini #2 identified as "${secondCall.speciesName}". Using higher confidence result but flagging uncertainty. Consider manual verification.`;
    console.log("⚠️  WARNING: Gemini calls disagree on species identification!");
    console.log(`   Gemini #1: ${firstCall.identification.speciesName}`);
    console.log(`   Gemini #2: ${secondCall.speciesName}`);
  }

  // STEP 4: Get conservation data
  console.log(`\n🌍 Step 4: Fetching conservation data for ${finalSpecies}...`);
  const conservationData = await getConservationData(finalSpecies, finalScientificName);
  console.log(`✅ Conservation Status: ${conservationData.status}`);

  const processingTimeMs = Date.now() - startTime;
  console.log(`\n⏱️  Total processing time: ${processingTimeMs}ms`);
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  return {
    visualDescription: firstCall.description,
    firstIdentification: firstCall.identification,
    secondIdentification: secondCall,
    consensus: {
      agreed,
      finalSpecies,
      finalScientificName,
      finalConfidence,
      comparisonNotes
    },
    conservationData,
    processingTimeMs
  };
}

/**
 * Export for animal identification with dual verification
 */
export async function analyzeAnimalImage(imageBase64: string) {
  const result = await analyzewithDualGemini(imageBase64);
  
  // Return in format compatible with existing system
  return {
    speciesName: result.consensus.finalSpecies,
    scientificName: result.consensus.finalScientificName,
    conservationStatus: result.conservationData.status,
    population: result.conservationData.population,
    habitat: result.conservationData.habitat,
    threats: result.conservationData.threats,
    confidence: result.consensus.finalConfidence,
    
    // Additional data from dual verification
    visualDescription: result.visualDescription,
    verificationDetails: {
      firstGeminiResult: result.firstIdentification,
      secondGeminiResult: result.secondIdentification,
      consensusReached: result.consensus.agreed,
      comparisonNotes: result.consensus.comparisonNotes
    },
    processingTimeMs: result.processingTimeMs
  };
}
