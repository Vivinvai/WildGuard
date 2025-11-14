import { GoogleGenerativeAI } from "@google/generative-ai";

export interface PartialImageResult {
  speciesIdentified: string;
  alternativeSpecies: string[];
  primaryConfidence: number;
  alternativeConfidences: { species: string; confidence: number }[];
  imageQuality: "very_poor" | "poor" | "fair" | "good" | "excellent";
  visibilityPercentage: number;
  conservationStatus: string;
  detectionDetails: string;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function enhanceAndIdentifyPartialImage(
  imageBase64: string
): Promise<PartialImageResult> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are an expert wildlife camera trap analyst specializing in partial and obscured animal identification.

Analyze this camera trap image which may be:
- Blurry or low quality
- Partially visible animal (only showing part of the body)
- Obscured by vegetation or shadows
- Captured at night with infrared
- Motion-blurred

Your task:
1. Identify the animal species despite poor image quality
2. Provide confidence scores for primary identification and alternatives
3. Assess what percentage of the animal is visible
4. Rate overall image quality
5. Explain what visual clues led to identification

Provide detailed JSON response:
{
  "speciesIdentified": "Primary species identification",
  "alternativeSpecies": ["Alternative 1", "Alternative 2", "Alternative 3"],
  "primaryConfidence": 0.75,
  "alternativeConfidences": [
    {"species": "Alternative 1", "confidence": 0.15},
    {"species": "Alternative 2", "confidence": 0.08}
  ],
  "imageQuality": "very_poor|poor|fair|good|excellent",
  "visibilityPercentage": 45,
  "conservationStatus": "Conservation status of primary species",
  "detectionDetails": "Detailed explanation of what features were visible and how identification was made despite image limitations. Mention visible body parts, distinctive markings, size estimation, habitat context, etc."
}

Focus on Karnataka wildlife: Tiger, Leopard, Elephant, Gaur, Sambar, Wild Dog, Sloth Bear, etc.`;

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
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanedText);

    return {
      speciesIdentified: result.speciesIdentified || "Unknown species",
      alternativeSpecies: result.alternativeSpecies || [],
      primaryConfidence: result.primaryConfidence || 0.5,
      alternativeConfidences: result.alternativeConfidences || [],
      imageQuality: result.imageQuality || "poor",
      visibilityPercentage: result.visibilityPercentage || 0,
      conservationStatus: result.conservationStatus || "Unknown",
      detectionDetails: result.detectionDetails || "Unable to determine details from image",
    };
  } catch (error) {
    console.error("Partial image enhancement failed:", error);
    throw new Error("Failed to enhance and identify partial image: " + (error as Error).message);
  }
}
