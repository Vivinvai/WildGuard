import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

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

const HEALTH_PROMPT = `You are a wildlife veterinary AI expert analyzing animal images for health issues.

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
  "veterinaryAlertRequired": true,
  "followUpRequired": true,
  "detailedAnalysis": "Comprehensive description of health assessment"
}

Health status definitions:
- healthy: No visible health concerns
- minor_issues: Small wounds, minor parasites, manageable conditions
- moderate_concern: Significant injuries or illness requiring treatment
- critical: Severe injuries, advanced disease, immediate care needed
- emergency: Life-threatening condition, urgent veterinary intervention required

Be thorough, specific, and err on the side of caution for wildlife welfare.`;

/**
 * Assess animal health with HYBRID approach
 * Local AI extracts features → Gemini analyzes with context
 * Gemini → OpenAI → Anthropic for maximum reliability
 */
export async function assessAnimalHealth(
  imageBase64: string, 
  visualFeatures?: {
    featureDescription: string;
    visualCues: {
      hasRedTones: boolean;
      hasDarkPatches: boolean;
      hasUnusualColors: boolean;
    };
    topCategories: string[];
  }
): Promise<HealthAssessmentResult> {
  // Try Gemini first (fastest, cost-effective)
  if (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY) {
    try {
      console.log("🌐 Attempting health assessment with Gemini" + (visualFeatures ? " (with Local AI features)" : "") + "...");
      return await assessWithGemini(imageBase64, visualFeatures);
    } catch (geminiError) {
      console.log("⚠️ Gemini failed, trying OpenAI...", (geminiError as Error).message);
    }
  }
  
  // Try OpenAI if Gemini unavailable/failed
  if (process.env.OPENAI_API_KEY) {
    try {
      console.log("🌐 Attempting health assessment with OpenAI...");
      return await assessWithOpenAI(imageBase64, visualFeatures);
    } catch (openaiError) {
      console.log("⚠️ OpenAI failed, trying Anthropic...", (openaiError as Error).message);
    }
  }
  
  // Try Anthropic as final cloud option
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      console.log("🌐 Attempting health assessment with Anthropic...");
      return await assessWithAnthropic(imageBase64, visualFeatures);
    } catch (anthropicError) {
      console.log("❌ All cloud providers failed:", (anthropicError as Error).message);
    }
  }
  
  throw new Error("No cloud AI providers available for health assessment");
}

async function assessWithGemini(
  imageBase64: string,
  visualFeatures?: {
    featureDescription: string;
    visualCues: {
      hasRedTones: boolean;
      hasDarkPatches: boolean;
      hasUnusualColors: boolean;
    };
    topCategories: string[];
  }
): Promise<HealthAssessmentResult> {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Gemini API key not configured");
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  // Enhanced prompt with Local AI features
  let enhancedPrompt = HEALTH_PROMPT;
  if (visualFeatures) {
    const cues: string[] = [];
    if (visualFeatures.visualCues.hasRedTones) cues.push("prominent red/orange tones (POSSIBLE BLOOD/WOUNDS)");
    if (visualFeatures.visualCues.hasDarkPatches) cues.push("dark patches detected");
    if (visualFeatures.visualCues.hasUnusualColors) cues.push("unusual color variance patterns");
    
    enhancedPrompt += `\n\n🔍 PRE-ANALYSIS BY LOCAL AI:\n${visualFeatures.featureDescription}\n` +
      `Possible species: ${visualFeatures.topCategories.join(', ')}\n` +
      (cues.length > 0 ? `⚠️ VISUAL CUES DETECTED: ${cues.join('; ')}\n` : '') +
      `\nPlease perform detailed health assessment focusing on these pre-identified visual cues.`;
  }

  const genResult = await model.generateContent([
    enhancedPrompt,
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
}

async function assessWithOpenAI(
  imageBase64: string,
  visualFeatures?: {
    featureDescription: string;
    visualCues: {
      hasRedTones: boolean;
      hasDarkPatches: boolean;
      hasUnusualColors: boolean;
    };
    topCategories: string[];
  }
): Promise<HealthAssessmentResult> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key not configured");
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Enhanced prompt with Local AI features if available
  let enhancedPrompt = HEALTH_PROMPT;
  if (visualFeatures) {
    const cues: string[] = [];
    if (visualFeatures.visualCues.hasRedTones) cues.push("prominent red/orange tones (POSSIBLE BLOOD/WOUNDS)");
    if (visualFeatures.visualCues.hasDarkPatches) cues.push("dark patches detected");
    if (visualFeatures.visualCues.hasUnusualColors) cues.push("unusual color variance patterns");
    
    enhancedPrompt += `\n\n🔍 PRE-ANALYSIS BY LOCAL AI:\n${visualFeatures.featureDescription}\n` +
      `Possible species: ${visualFeatures.topCategories.join(', ')}\n` +
      (cues.length > 0 ? `⚠️ VISUAL CUES DETECTED: ${cues.join('; ')}\n` : '') +
      `\nPlease perform detailed health assessment focusing on these pre-identified visual cues.`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: enhancedPrompt },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
  });

  const responseText = completion.choices[0].message.content || "{}";
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
  const result = JSON.parse(cleanedText);

  return {
    animalIdentified: result.animalIdentified || "Unknown species",
    overallHealthStatus: result.overallHealthStatus || "healthy",
    confidence: result.confidence || 0.75,
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
}

async function assessWithAnthropic(
  imageBase64: string,
  visualFeatures?: {
    featureDescription: string;
    visualCues: {
      hasRedTones: boolean;
      hasDarkPatches: boolean;
      hasUnusualColors: boolean;
    };
    topCategories: string[];
  }
): Promise<HealthAssessmentResult> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("Anthropic API key not configured");
  
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Enhanced prompt with Local AI features if available
  let enhancedPrompt = HEALTH_PROMPT;
  if (visualFeatures) {
    const cues: string[] = [];
    if (visualFeatures.visualCues.hasRedTones) cues.push("prominent red/orange tones (POSSIBLE BLOOD/WOUNDS)");
    if (visualFeatures.visualCues.hasDarkPatches) cues.push("dark patches detected");
    if (visualFeatures.visualCues.hasUnusualColors) cues.push("unusual color variance patterns");
    
    enhancedPrompt += `\n\n🔍 PRE-ANALYSIS BY LOCAL AI:\n${visualFeatures.featureDescription}\n` +
      `Possible species: ${visualFeatures.topCategories.join(', ')}\n` +
      (cues.length > 0 ? `⚠️ VISUAL CUES DETECTED: ${cues.join('; ')}\n` : '') +
      `\nPlease perform detailed health assessment focusing on these pre-identified visual cues.`;
  }

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: enhancedPrompt,
          },
        ],
      },
    ],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : "{}";
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
  const result = JSON.parse(cleanedText);

  return {
    animalIdentified: result.animalIdentified || "Unknown species",
    overallHealthStatus: result.overallHealthStatus || "healthy",
    confidence: result.confidence || 0.8,
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
}
