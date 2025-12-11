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
  detections?: {
    total: number;
    weapons: number;
    humans: number;
    vehicles: number;
    animals: number;
  };
}

const YOLO_SERVICE_URL = 'http://localhost:5002';

/**
 * Check if YOLOv11 poaching detection service is available
 */
async function checkYoloService(): Promise<boolean> {
  try {
    const response = await fetch(`${YOLO_SERVICE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Analyze poaching evidence using YOLOv11 model
 * Detects weapons (guns, knives, crossbows), humans, vehicles near wildlife
 */
async function analyzeWithYolo(imageBase64: string): Promise<PoachingAnalysisResult> {
  try {
    const response = await fetch(`${YOLO_SERVICE_URL}/detect-poaching`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      throw new Error(`YOLOv11 service error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'YOLOv11 detection failed');
    }

    return {
      threatDetected: data.threatDetected,
      threatLevel: data.threatLevel,
      confidence: data.confidence,
      detectedActivities: data.detectedActivities || [],
      suspiciousObjects: data.suspiciousObjects || [],
      location: { latitude: null, longitude: null },
      timestamp: new Date().toISOString(),
      recommendations: data.recommendations || [],
      evidenceDescription: data.evidenceDescription || 'No threats detected',
      detections: data.detections,
    };
  } catch (error) {
    console.error('YOLOv11 detection failed:', error);
    throw error;
  }
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

/**
 * Fallback: Analyze poaching evidence using Gemini AI
 */
async function analyzeWithGemini(imageBase64: string): Promise<PoachingAnalysisResult> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY not configured");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `You are a wildlife law enforcement AI analyzing camera trap or drone footage for suspicious poaching activities.

Analyze this image for:
- Human presence in protected areas
- Weapons (guns, knives, crossbows, traps, snares)
- Hunting equipment or vehicles (cars, trucks, bikes)
- Dead or injured animals
- Suspicious nighttime activities

Provide a detailed JSON response in this exact format:
{
  "threatDetected": true/false,
  "threatLevel": "none" | "low" | "medium" | "high" | "critical",
  "confidence": 0.85,
  "detectedActivities": ["Activity 1", "Activity 2"],
  "suspiciousObjects": ["Object 1", "Object 2"],
  "evidenceDescription": "Detailed description",
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

Threat levels:
- none: No suspicious activity
- low: Possible human presence
- medium: Suspicious equipment detected
- high: Clear evidence of illegal activity
- critical: Weapons or active hunting detected

Be specific in your analysis.`;

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
    location: { latitude: null, longitude: null },
    timestamp: new Date().toISOString(),
    recommendations: result.recommendations || [],
    evidenceDescription: result.evidenceDescription || "No detailed description available",
  };
}

/**
 * Main poaching detection function
 * Uses YOLOv11 model (primary) with Gemini AI fallback
 */
export async function analyzePoachingEvidence(
  imageBase64: string,
  location?: { latitude: number; longitude: number }
): Promise<PoachingAnalysisResult> {
  try {
    console.log('🔍 Starting poaching detection analysis...');
    
    // Try YOLOv11 first (best for weapon/vehicle/human detection)
    const yoloAvailable = await checkYoloService();
    
    if (yoloAvailable) {
      console.log('✅ Using YOLOv11 poaching detection model');
      const result = await analyzeWithYolo(imageBase64);
      
      // Add location if provided
      if (location) {
        result.location = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      }
      
      console.log(`🎯 YOLOv11 Result: ${result.threatLevel} threat (${(result.confidence * 100).toFixed(1)}%)`);
      return result;
    }
    
    // Fallback to Gemini AI
    console.log('⚠️ YOLOv11 unavailable, using Gemini AI fallback');
    const result = await analyzeWithGemini(imageBase64);
    
    if (location) {
      result.location = {
        latitude: location.latitude,
        longitude: location.longitude,
      };
    }
    
    return result;
    
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
