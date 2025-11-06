import { GoogleGenerativeAI } from "@google/generative-ai";

export interface FloraAnalysisResult {
  speciesName: string;
  scientificName: string;
  conservationStatus: string;
  habitat: string;
  uses: string[];
  threats: string[];
  confidence: number;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeFloraWithGemini(imageBase64: string): Promise<FloraAnalysisResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a botanical expert specializing in flora identification, particularly in India and Karnataka region. Analyze this image and identify the plant species.

IMPORTANT: You must respond with a valid JSON object in exactly this format:
{
  "speciesName": "Common name of the plant",
  "scientificName": "Scientific name in Latin",
  "conservationStatus": "One of: Least Concern, Near Threatened, Vulnerable, Endangered, Critically Endangered, Extinct in the Wild, Extinct, Data Deficient",
  "habitat": "Detailed description of natural habitat, climate, soil type, and distribution in India/Karnataka",
  "uses": ["Traditional use 1", "Medicinal use 2", "Ecological importance 3"],
  "threats": ["Primary threat 1", "Primary threat 2", "Primary threat 3"],
  "confidence": 0.85
}

Be as accurate as possible in your identification. Focus on plants native to or commonly found in Karnataka, India. If you cannot clearly identify the species, provide your best estimate and lower the confidence score. Always include realistic conservation data, traditional uses (medicinal, cultural, ecological), and conservation threats for the identified species.`;

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

    // Ensure uses is an array
    if (!Array.isArray(result.uses)) {
      result.uses = ["Traditional Medicine", "Ecological Importance", "Cultural Significance"];
    }

    // Ensure threats is an array
    if (!Array.isArray(result.threats)) {
      result.threats = ["Habitat Loss", "Climate Change", "Over-harvesting"];
    }

    // Ensure confidence is a valid number
    if (typeof result.confidence !== 'number' || result.confidence < 0 || result.confidence > 1) {
      result.confidence = 0.75;
    }

    // Default habitat if missing
    if (!result.habitat) {
      result.habitat = "Habitat data unavailable";
    }

    return result;
  } catch (error) {
    console.error("Gemini flora analysis failed:", error);
    throw new Error("Failed to analyze flora image with Gemini: " + (error as Error).message);
  }
}
