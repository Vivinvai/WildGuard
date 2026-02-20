/**
 * Animal Injury Detection Service using YOLOv11
 * Uses trained model from "Injured Animals/Animal Injury/yolo11n.pt"
 * Detects: buffalo, cat, cow, dog, injured, person
 */

export interface InjuryDetectionResult {
  healthStatus: "healthy" | "injured" | "unknown";
  confidence: number;
  animalDetected: string | null;
  injuryDetails: {
    detected: boolean;
    description: string;
    severity: "none" | "minor" | "moderate" | "severe";
  };
  detections: {
    injured: number;
    animals: number;
    total: number;
  };
  location: {
    latitude: number | null;
    longitude: number | null;
  };
  timestamp: string;
  recommendations: string[];
}

const INJURY_YOLO_SERVICE_URL = 'http://localhost:5005';

/**
 * Check if YOLOv11 injury detection service is available
 */
async function checkInjuryYoloService(): Promise<boolean> {
  try {
    const response = await fetch(`${INJURY_YOLO_SERVICE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Analyze image for injured animals using YOLOv11 model
 * Model detects: buffalo, cat, cow, dog, injured, person
 * 
 * NOTE: Custom model currently unavailable (overwritten with COCO model).
 * Service provides animal detection as fallback.
 */
async function analyzeWithInjuryYolo(imageBase64: string): Promise<InjuryDetectionResult> {
  try {
    console.log('🔵 Calling Gemini injury detection service...');
    
    const response = await fetch(`${INJURY_YOLO_SERVICE_URL}/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`Injury detection service error: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('📊 RAW RESPONSE FROM PYTHON SERVICE:');
    console.log(JSON.stringify(data, null, 2));
    
    // Check if service returned success
    if (!data.success) {
      throw new Error(data.error || 'Detection failed');
    }
    
    console.log('✅ Response validated, mapping data...');
    console.log(`   Source: ${data.source}`);
    console.log(`   Animal: ${data.animalDetected}`);
    console.log(`   Status: ${data.healthStatus}`);
    console.log(`   Injury: ${data.injuryDetails?.detected}`);
    
    // Map Gemini AI response to our format
    const healthStatusMap: Record<string, "healthy" | "injured" | "unknown"> = {
      "healthy": "healthy",
      "injured": "injured",
      "critical": "injured",
      "unknown": "unknown",
    };

    const detectedInjury = data.injuryDetails?.detected || false;
    const animalName = data.animalDetected || null;
    const confidence = data.confidence || 0;
    
    const result = {
      healthStatus: detectedInjury ? "injured" : (animalName ? "healthy" : "unknown"),
      confidence: confidence,
      animalDetected: animalName,
      injuryDetails: {
        detected: detectedInjury,
        description: data.injuryDetails?.description || 'No detailed analysis available',
        severity: data.injuryDetails?.severity || 'none',
      },
      detections: {
        injured: detectedInjury ? 1 : 0,
        animals: data.detections?.animals || (animalName ? 1 : 0),
        total: data.detections?.total || (animalName ? 1 : 0),
      },
      location: { latitude: null, longitude: null },
      timestamp: new Date().toISOString(),
      recommendations: data.recommendations || [],
    };
    
    console.log('📤 FINAL RESULT TO FRONTEND:');
    console.log(JSON.stringify(result, null, 2));
    
    return result;
  } catch (error) {
    console.error('❌ Injury detection service failed:', error);
    throw error;
  }
}

/**
 * Main function to detect injured animals in an image
 * Uses YOLOv11 model trained on animal injury dataset
 */
export async function detectInjuredAnimals(
  imageBase64: string,
  latitude?: number,
  longitude?: number
): Promise<InjuryDetectionResult> {
  console.log('🏥 Starting Animal Injury Detection...');

  // Check if injury detection service is available
  const isYoloAvailable = await checkInjuryYoloService();

  if (isYoloAvailable) {
    console.log('✅ Using YOLOv11 injury detection model');
    const result = await analyzeWithInjuryYolo(imageBase64);
    
    // Add location if provided
    if (latitude !== undefined && longitude !== undefined) {
      result.location = { latitude, longitude };
    }
    
    return result;
  }

  // Fallback when service is unavailable
  console.log('⚠️ YOLOv11 injury service unavailable, using fallback');
  return {
    healthStatus: "unknown",
    confidence: 0,
    animalDetected: null,
    injuryDetails: {
      detected: false,
      description: 'Injury detection service unavailable',
      severity: 'none',
    },
    detections: {
      injured: 0,
      animals: 0,
      total: 0,
    },
    location: {
      latitude: latitude || null,
      longitude: longitude || null,
    },
    timestamp: new Date().toISOString(),
    recommendations: [
      'Injury detection service is currently unavailable',
      'Please try again later or contact support',
    ],
  };
}

/**
 * Save injury detection result to database
 */
export async function saveInjuryDetectionToDb(
  result: InjuryDetectionResult,
  imageUrl: string,
  userId?: string
): Promise<void> {
  // This will be implemented when integrated with routes
  console.log('💾 Saving injury detection to database:', {
    healthStatus: result.healthStatus,
    animalDetected: result.animalDetected,
    confidence: result.confidence,
    userId,
  });
}
