import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AnimalAnalysisResult {
  speciesName: string;
  scientificName: string;
  conservationStatus: string;
  population: string;
  habitat: string;
  threats: string[];
  confidence: number;
}

export interface FloraAnalysisResult {
  speciesName: string;
  scientificName: string;
  conservationStatus: string;
  endangeredAlert: string | null; // Alert message if endangered
  isEndangered: boolean;
  habitat: string;
  uses: string;
  threats: string[];
  confidence: number;
}

// DON'T DELETE THIS COMMENT - Based on javascript_gemini blueprint
// Using Gemini 2.5 Flash for animal identification

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function analyzeAnimalWithGemini(imageBase64: string): Promise<AnimalAnalysisResult> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a wildlife identification expert. Analyze this image and identify the animal species.

IMPORTANT: You must respond with a valid JSON object in exactly this format:
{
  "speciesName": "Common name of the species",
  "scientificName": "Scientific name in Latin",
  "conservationStatus": "One of: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, Extinct in the Wild, Extinct",
  "population": "Current population estimate with units",
  "habitat": "Detailed description of natural habitat and distribution",
  "threats": ["Primary threat 1", "Primary threat 2", "Primary threat 3"],
  "confidence": 0.85
}

Be as accurate as possible in your identification. If you cannot clearly identify the species, provide your best estimate and lower the confidence score. Always include realistic conservation data for the identified species.`;

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
      throw new Error("Empty response from Gemini");
    }

    // Strip code fences if present and parse JSON
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanedText);
    
    // Validate the response structure
    if (!result.speciesName || !result.scientificName || !result.conservationStatus) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Ensure threats is an array
    if (!Array.isArray(result.threats)) {
      result.threats = ["Habitat Loss", "Climate Change", "Human Interference"];
    }

    // Ensure confidence is a valid number
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      result.confidence = 0.75;
    }

    // Default population if missing
    if (!result.population) {
      result.population = "Population data unavailable";
    }

    return result;
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("Failed to analyze image with Gemini: " + (error as Error).message);
  }
}

export async function analyzeFloraWithGemini(imageBase64: string): Promise<FloraAnalysisResult> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a botanical identification expert specializing in Indian flora and endangered plant species. Analyze this image and identify the plant species.

IMPORTANT: You must respond with a valid JSON object in exactly this format:
{
  "speciesName": "Common name of the plant",
  "scientificName": "Scientific botanical name in Latin",
  "conservationStatus": "One of: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, Extinct in the Wild, Extinct, Not Evaluated, Data Deficient",
  "isEndangered": true/false (true if status is Vulnerable, Endangered, or Critically Endangered),
  "endangeredAlert": "If endangered, provide a specific conservation alert message explaining the threat level and urgency. Otherwise null.",
  "habitat": "Detailed description of natural habitat, distribution, and ecological requirements",
  "uses": "Traditional, medicinal, cultural, or ecological uses. Include Ayurvedic properties if applicable.",
  "threats": ["Primary threat 1", "Primary threat 2", "Primary threat 3"],
  "confidence": 0.85
}

ENDANGERED STATUS DETECTION:
- Mark isEndangered as TRUE if conservation status is Vulnerable, Endangered, or Critically Endangered
- For endangered plants, provide a clear endangeredAlert like:
  "⚠️ CRITICALLY ENDANGERED: This species faces imminent extinction risk. Illegal collection and habitat loss threaten survival. Protected under Wildlife Act."
  "⚠️ ENDANGERED: Population declining rapidly due to overharvesting for medicinal use. Immediate conservation action needed."
  "⚠️ VULNERABLE: Habitat degradation threatens this species. Sustainable practices required."
- If NOT endangered (Least Concern, Near Threatened), set endangeredAlert to null

Focus on accuracy, especially for Karnataka and Western Ghats endemic species. Include specific conservation data, traditional uses, and ecological importance.`;

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
      throw new Error("Empty response from Gemini");
    }

    // Strip code fences if present and parse JSON
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanedText);
    
    // Validate the response structure
    if (!result.speciesName || !result.scientificName || !result.conservationStatus) {
      throw new Error("Invalid response structure from Gemini");
    }

    // Ensure threats is an array
    if (!Array.isArray(result.threats)) {
      result.threats = ["Habitat Loss", "Climate Change", "Overharvesting"];
    }

    // Ensure confidence is a valid number
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      result.confidence = 0.75;
    }

    // Validate and set endangered status
    const endangeredStatuses = ['Vulnerable', 'Endangered', 'Critically Endangered'];
    if (typeof result.isEndangered !== 'boolean') {
      result.isEndangered = endangeredStatuses.some(status => 
        result.conservationStatus?.includes(status)
      );
    }

    // Ensure endangeredAlert is present for endangered species
    if (result.isEndangered && !result.endangeredAlert) {
      const status = result.conservationStatus.toUpperCase();
      result.endangeredAlert = `⚠️ ${status}: This plant species requires urgent conservation attention. Please do not disturb or collect wild specimens.`;
    } else if (!result.isEndangered) {
      result.endangeredAlert = null;
    }

    // Default values if missing
    if (!result.habitat) {
      result.habitat = "Habitat information unavailable";
    }
    if (!result.uses) {
      result.uses = "Traditional uses being researched";
    }

    return result;
  } catch (error) {
    console.error("Gemini flora analysis failed:", error);
    throw new Error("Failed to analyze plant image with Gemini: " + (error as Error).message);
  }
}