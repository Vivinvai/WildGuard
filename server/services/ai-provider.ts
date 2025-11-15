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
 * Main AI analysis function with comprehensive fallback support
 */
export async function analyzeWithAI(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
  const errors: string[] = [];

  // Try Gemini first (free tier available, fast)
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

  // Try OpenAI as second option
  if (openaiClient && !request.audioBase64) { // OpenAI doesn't support audio in vision API
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

  // Try Anthropic as third option
  if (anthropicClient && !request.audioBase64) { // Anthropic doesn't support audio
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

  // All AI providers failed
  throw new Error(`All AI providers failed. Errors: ${errors.join("; ")}`);
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
