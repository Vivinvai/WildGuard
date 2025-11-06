import { GoogleGenerativeAI } from "@google/generative-ai";

export interface PoachingAnalysisResult {
  threatDetected: boolean;
  threatLevel: "none" | "low" | "medium" | "high" | "critical";
  confidence: number;
  detectedActivities: string[];
  suspiciousObjects: string[];
  location: {
    latitude: number | null;
    longitude: number | null;
  };
  timestamp: string;
  recommendations: string[];
  evidenceDescription: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzePoachingEvidence(
  imageBase64: string,
  location?: { latitude: number; longitude: number }
): Promise<PoachingAnalysisResult> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a wildlife law enforcement AI analyzing camera trap or drone footage for suspicious poaching activities.

Analyze this image for:
- Human presence in protected areas
- Weapons (guns, traps, snares)
- Hunting equipment or vehicles
- Dead or injured animals
- Evidence of illegal logging or encampment
- Suspicious nighttime activities
- Wire snares or traps

Provide a detailed JSON response in this exact format:
{
  "threatDetected": true/false,
  "threatLevel": "none" | "low" | "medium" | "high" | "critical",
  "confidence": 0.85,
  "detectedActivities": ["Activity 1", "Activity 2"],
  "suspiciousObjects": ["Object 1", "Object 2"],
  "evidenceDescription": "Detailed description of what you see",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Threat levels:
- none: No suspicious activity
- low: Possible human presence, needs verification
- medium: Suspicious equipment or activity detected
- high: Clear evidence of illegal activity
- critical: Immediate threat to wildlife (weapons, active hunting)

Be thorough and specific in your analysis.`;

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
      threatDetected: result.threatDetected || false,
      threatLevel: result.threatLevel || "none",
      confidence: result.confidence || 0.5,
      detectedActivities: result.detectedActivities || [],
      suspiciousObjects: result.suspiciousObjects || [],
      location: {
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
      },
      timestamp: new Date().toISOString(),
      recommendations: result.recommendations || [],
      evidenceDescription: result.evidenceDescription || "No detailed description available",
    };
  } catch (error) {
    console.error("Poaching detection failed:", error);
    throw new Error("Failed to analyze poaching evidence: " + (error as Error).message);
  }
}

// Real-world Karnataka wildlife data for population analysis
export const karnatakaWildlifeData = {
  tigers: {
    total: 563,
    reserves: {
      bandipur: 126,
      nagarahole: 141,
      brt: 68,
      bhadra: 49,
      kali: 9,
    },
    trend: "stable",
    lastCensus: "2022",
  },
  elephants: {
    total: 6395,
    reserves: {
      bandipur: 1116,
      nagarahole: 831,
      brt: 619,
      mmHills: 706,
    },
    density: 0.34,
    trend: "increasing",
    lastCensus: "2023",
  },
  leopards: {
    total: 1783,
    trend: "stable",
    lastCensus: "2018",
  },
};
