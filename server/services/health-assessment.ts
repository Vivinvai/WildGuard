import { GoogleGenerativeAI } from "@google/generative-ai";

export interface HealthAssessmentResult {
  animalIdentified: string;
  overallHealthStatus: "healthy" | "minor_issues" | "moderate_concern" | "critical" | "emergency";
  confidence: number;
  visualSymptoms: {
    injuries: string[];
    malnutrition: boolean;
    skinConditions: string[];
    abnormalBehavior: string[];
  };
  detectedConditions: string[];
  severity: string;
  treatmentRecommendations: string[];
  veterinaryAlertRequired: boolean;
  followUpRequired: boolean;
  detailedAnalysis: string;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function assessAnimalHealth(imageBase64: string): Promise<HealthAssessmentResult> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a wildlife veterinary AI expert analyzing animal images for health issues.

Carefully examine the animal for:
- Visible injuries (wounds, fractures, bleeding)
- Signs of malnutrition (visible ribs, sunken eyes, poor coat condition)
- Skin conditions (mange, lesions, parasites, hair loss)
- Abnormal posture or movement
- Behavioral indicators of distress
- Physical deformities or abnormalities
- Signs of disease (discharge, swelling, limping)

Provide a comprehensive JSON response in this exact format:
{
  "animalIdentified": "Species name",
  "overallHealthStatus": "healthy" | "minor_issues" | "moderate_concern" | "critical" | "emergency",
  "confidence": 0.85,
  "visualSymptoms": {
    "injuries": ["Wound on left leg", "Abrasion on flank"],
    "malnutrition": false,
    "skinConditions": ["Mange on shoulder area"],
    "abnormalBehavior": ["Limping on right front leg"]
  },
  "detectedConditions": ["Laceration", "Possible infection", "Mange"],
  "severity": "Detailed severity assessment",
  "treatmentRecommendations": ["Clean and dress wound", "Administer antibiotics", "Monitor for 48 hours"],
  "veterinaryAlertRequired": true/false,
  "followUpRequired": true/false,
  "detailedAnalysis": "Comprehensive description of health assessment"
}

Health status definitions:
- healthy: No visible health concerns
- minor_issues: Small wounds, minor parasites, manageable conditions
- moderate_concern: Significant injuries or illness requiring treatment
- critical: Severe injuries, advanced disease, immediate care needed
- emergency: Life-threatening condition, urgent veterinary intervention required

Be thorough, specific, and err on the side of caution for wildlife welfare.`;

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
      animalIdentified: result.animalIdentified || "Unknown species",
      overallHealthStatus: result.overallHealthStatus || "healthy",
      confidence: result.confidence || 0.7,
      visualSymptoms: {
        injuries: result.visualSymptoms?.injuries || [],
        malnutrition: result.visualSymptoms?.malnutrition || false,
        skinConditions: result.visualSymptoms?.skinConditions || [],
        abnormalBehavior: result.visualSymptoms?.abnormalBehavior || [],
      },
      detectedConditions: result.detectedConditions || [],
      severity: result.severity || "No significant concerns detected",
      treatmentRecommendations: result.treatmentRecommendations || [],
      veterinaryAlertRequired: result.veterinaryAlertRequired || false,
      followUpRequired: result.followUpRequired || false,
      detailedAnalysis: result.detailedAnalysis || "Health assessment completed successfully",
    };
  } catch (error) {
    console.error("Health assessment failed:", error);
    throw new Error("Failed to assess animal health: " + (error as Error).message);
  }
}
