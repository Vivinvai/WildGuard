import { GoogleGenerativeAI } from "@google/generative-ai";

export interface FootprintRecognitionResult {
  speciesIdentified: string;
  scientificName: string;
  confidence: number;
  footprintSize: number;
  trackPattern: "walking" | "running" | "stalking" | "grazing";
  conservationStatus: string;
  additionalDetails: string;
  identificationFeatures: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function recognizeFootprint(imageBase64: string): Promise<FootprintRecognitionResult> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a wildlife tracking expert specializing in Indian fauna footprint identification.

Analyze this footprint image and identify the animal species.

Key identification features to examine:
- Print size and shape
- Number of toes/digits
- Claw marks presence
- Pad shape and configuration
- Gait pattern (if multiple prints visible)
- Track width and stride length

Common Karnataka wildlife footprints:
- Tiger: Large, round, 4 toes, no claw marks, 90-115mm
- Leopard: Medium, round, 4 toes, no claw marks, 50-75mm
- Elephant: Massive, circular, 40-50cm diameter
- Sambar deer: Cloven hooves, heart-shaped, 70-90mm
- Wild dog: 4 toes, oval, claw marks, 50-65mm
- Sloth bear: Large, elongated, 5 toes, long claw marks

Provide detailed JSON response:
{
  "speciesIdentified": "Common name",
  "scientificName": "Scientific name",
  "confidence": 0.85,
  "footprintSize": 75.5,
  "trackPattern": "walking|running|stalking|grazing",
  "conservationStatus": "Status",
  "additionalDetails": "Detailed identification explanation",
  "identificationFeatures": ["Feature 1", "Feature 2", "Feature 3"]
}`;

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
      scientificName: result.scientificName || "Unknown",
      confidence: result.confidence || 0.5,
      footprintSize: result.footprintSize || 0,
      trackPattern: result.trackPattern || "walking",
      conservationStatus: result.conservationStatus || "Unknown",
      additionalDetails: result.additionalDetails || "",
      identificationFeatures: result.identificationFeatures || [],
    };
  } catch (error) {
    console.error("Footprint recognition failed:", error);
    throw new Error("Failed to recognize footprint: " + (error as Error).message);
  }
}
