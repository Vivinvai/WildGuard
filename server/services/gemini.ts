import { GoogleGenAI } from "@google/genai";

export interface AnimalAnalysisResult {
  speciesName: string;
  scientificName: string;
  conservationStatus: string;
  population: string;
  habitat: string;
  threats: string[];
  confidence: number;
}

// DON'T DELETE THIS COMMENT - Based on javascript_gemini blueprint
// Using Gemini 2.5 Flash for animal identification

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeAnimalWithGemini(imageBase64: string): Promise<AnimalAnalysisResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const model = ai.generativeModel({ model: "gemini-2.5-flash" });

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

    const genResult = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { 
              inlineData: { 
                data: imageBase64, 
                mimeType: 'image/jpeg' 
              } 
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

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