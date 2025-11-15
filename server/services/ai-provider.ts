/**
 * Unified AI Provider Service
 * Provides multi-tier fallback support for all AI conservation features
 * Priority: Gemini 2.0 Flash → OpenAI GPT-4 → Anthropic Claude → Educational/Deterministic Logic
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

// Initialize AI clients
const geminiClient = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "") 
  : null;

const openaiClient = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) 
  : null;

const anthropicClient = process.env.ANTHROPIC_API_KEY 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) 
  : null;

export interface AIAnalysisRequest {
  prompt: string;
  imageBase64?: string;
  audioBase64?: string;
  mimeType?: string;
  expectedJsonSchema?: any;
  featureType?: "poaching" | "health" | "sound" | "footprint" | "enhancement" | "chat" | "general";
  fallbackData?: any; // Fallback data when all AI providers fail
}

export interface AIAnalysisResponse {
  result: any;
  provider: "gemini" | "openai" | "anthropic" | "educational";
  confidence: number;
}

/**
 * Attempt analysis with Gemini 2.0 Flash
 */
async function tryGemini(request: AIAnalysisRequest): Promise<any> {
  if (!geminiClient) {
    throw new Error("Gemini client not configured");
  }

  const model = geminiClient.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const parts: any[] = [request.prompt];
  
  if (request.imageBase64) {
    parts.push({
      inlineData: {
        data: request.imageBase64,
        mimeType: request.mimeType || "image/jpeg",
      },
    });
  }

  if (request.audioBase64) {
    parts.push({
      inlineData: {
        data: request.audioBase64,
        mimeType: request.mimeType || "audio/wav",
      },
    });
  }

  const genResult = await model.generateContent(parts);
  const responseText = genResult.response.text();
  
  // Clean and parse JSON response
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleanedText);
}

/**
 * Attempt analysis with OpenAI GPT-4
 */
async function tryOpenAI(request: AIAnalysisRequest): Promise<any> {
  if (!openaiClient) {
    throw new Error("OpenAI client not configured");
  }

  const messages: any[] = [];
  
  if (request.imageBase64) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: request.prompt },
        {
          type: "image_url",
          image_url: {
            url: `data:${request.mimeType || "image/jpeg"};base64,${request.imageBase64}`,
          },
        },
      ],
    });
  } else {
    messages.push({
      role: "user",
      content: request.prompt,
    });
  }

  const response = await openaiClient.chat.completions.create({
    model: "gpt-4o",
    messages,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return JSON.parse(content);
}

/**
 * Attempt analysis with Anthropic Claude
 */
async function tryAnthropic(request: AIAnalysisRequest): Promise<any> {
  if (!anthropicClient) {
    throw new Error("Anthropic client not configured");
  }

  const content: any[] = [];
  
  if (request.imageBase64) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: request.mimeType || "image/jpeg",
        data: request.imageBase64,
      },
    });
  }
  
  content.push({
    type: "text",
    text: request.prompt,
  });

  const response = await anthropicClient.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content,
      },
    ],
  });

  const textContent = response.content.find((c: any) => c.type === "text") as any;
  if (!textContent || !textContent.text) {
    throw new Error("Empty response from Anthropic");
  }

  // Clean and parse JSON response
  const cleanedText = (textContent.text as string).replace(/```json\n?|\n?```/g, '').trim();
  return JSON.parse(cleanedText);
}

/**
 * Generate educational fallback data based on feature type
 */
function generateEducationalFallback(request: AIAnalysisRequest): any {
  console.log(`ℹ️ Generating educational fallback for feature: ${request.featureType || 'general'}`);
  
  // If custom fallback data provided, use it
  if (request.fallbackData) {
    return request.fallbackData;
  }
  
  // Default educational responses by feature type
  switch (request.featureType) {
    case "poaching":
      return {
        threatDetected: false,
        threatLevel: "none",
        confidence: 0.0,
        detectedActivities: [],
        suspiciousObjects: [],
        evidenceDescription: "⚠️ EDUCATIONAL MODE - No AI analysis performed. For accurate poaching detection, configure GOOGLE_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY. This feature uses computer vision to detect illegal activities in protected areas.",
        recommendations: ["Configure AI provider keys for real-time analysis", "Review camera trap footage manually", "Contact local forest department for support"],
      };
    
    case "health":
      return {
        healthStatus: "unknown",
        confidence: 0.0,
        symptoms: [],
        diagnosis: "⚠️ EDUCATIONAL MODE - No AI analysis performed. For accurate health assessment, configure GOOGLE_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY. This feature analyzes animal images for signs of injury, disease, or distress.",
        recommendations: ["Configure AI provider keys for real-time analysis", "Consult wildlife veterinarian", "Monitor animal behavior regularly"],
        severity: "unknown",
      };
    
    case "sound":
      return {
        speciesDetected: [],
        confidence: 0.0,
        soundType: "unknown",
        analysis: "⚠️ EDUCATIONAL MODE - No AI analysis performed. For accurate bioacoustic analysis, configure GOOGLE_API_KEY. This feature identifies wildlife from audio recordings using AI-powered sound pattern recognition.",
        recommendations: ["Configure Gemini API key for audio analysis", "Use high-quality recording equipment", "Record during peak wildlife activity hours"],
      };
    
    case "footprint":
      return {
        speciesName: "Unknown",
        confidence: 0.0,
        footprintCharacteristics: [],
        analysis: "⚠️ EDUCATIONAL MODE - No AI analysis performed. For accurate footprint recognition, configure GOOGLE_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY. This feature identifies wildlife species from track and scat images.",
        recommendations: ["Configure AI provider keys for real-time analysis", "Ensure clear, well-lit photos of tracks", "Include size reference in image"],
      };
    
    case "enhancement":
      return {
        enhanced: false,
        confidence: 0.0,
        speciesName: "Unknown",
        analysis: "⚠️ EDUCATIONAL MODE - No AI analysis performed. For partial image enhancement and identification, configure GOOGLE_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY. This feature reconstructs obscured wildlife images.",
        recommendations: ["Configure AI provider keys for real-time analysis", "Provide best available image quality", "Try multiple angles if possible"],
      };
    
    case "chat":
      return {
        message: "⚠️ Educational Mode Active - For AI-powered conservation assistance, please configure GOOGLE_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY. I can still help you access platform data like wildlife sightings, botanical gardens, and conservation resources!",
        sources: ["Platform documentation", "Educational databases"],
      };
    
    default:
      return {
        success: false,
        confidence: 0.0,
        message: "⚠️ EDUCATIONAL MODE - No AI analysis performed. Configure GOOGLE_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY for AI-powered analysis.",
      };
  }
}

/**
 * Main AI analysis function with comprehensive fallback support
 * GUARANTEES SUCCESS - never throws, always returns educational data as last resort
 */
export async function analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  const errors: string[] = [];

  // Try Gemini first (free tier available, fast, supports audio)
  if (geminiClient) {
    try {
      console.log("🤖 Attempting Gemini 2.0 Flash analysis...");
      const result = await tryGemini(request);
      console.log("✅ Gemini analysis successful");
      return {
        result,
        provider: "gemini",
        confidence: result.confidence || 0.85,
      };
    } catch (error) {
      const errorMsg = `Gemini failed: ${(error as Error).message}`;
      console.log(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }

  // Try OpenAI as second option (no audio support)
  if (openaiClient && !request.audioBase64) {
    try {
      console.log("🤖 Attempting OpenAI GPT-4 analysis...");
      const result = await tryOpenAI(request);
      console.log("✅ OpenAI analysis successful");
      return {
        result,
        provider: "openai",
        confidence: result.confidence || 0.80,
      };
    } catch (error) {
      const errorMsg = `OpenAI failed: ${(error as Error).message}`;
      console.log(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }

  // Try Anthropic as third option (no audio support)
  if (anthropicClient && !request.audioBase64) {
    try {
      console.log("🤖 Attempting Anthropic Claude analysis...");
      const result = await tryAnthropic(request);
      console.log("✅ Anthropic analysis successful");
      return {
        result,
        provider: "anthropic",
        confidence: result.confidence || 0.82,
      };
    } catch (error) {
      const errorMsg = `Anthropic failed: ${(error as Error).message}`;
      console.log(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    }
  }

  // FINAL FALLBACK: Educational mode - ALWAYS succeeds
  console.log("⚠️ All AI providers unavailable or failed");
  console.log(`📚 Returning educational fallback data (feature: ${request.featureType || 'general'})`);
  
  const educationalResult = generateEducationalFallback(request);
  
  return {
    result: educationalResult,
    provider: "educational",
    confidence: 0.0, // Zero confidence indicates educational mode
  };
}

/**
 * Check which AI providers are available
 */
export function getAvailableProviders(): string[] {
  const providers: string[] = [];
  if (geminiClient) providers.push("gemini");
  if (openaiClient) providers.push("openai");
  if (anthropicClient) providers.push("anthropic");
  return providers;
}

/**
 * Get provider status for debugging
 */
export function getProviderStatus() {
  return {
    gemini: !!geminiClient,
    openai: !!openaiClient,
    anthropic: !!anthropicClient,
    available: getAvailableProviders(),
  };
}
