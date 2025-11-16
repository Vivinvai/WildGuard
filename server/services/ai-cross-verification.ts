/**
 * AI Cross-Verification System
 * Uses multiple AI providers to verify identifications for higher accuracy
 * Implements consensus-based validation for wildlife conservation
 */

import type { AnimalAnalysisResult } from './openai';
import type { FloraAnalysisResult } from './gemini';

export interface VerificationResult<T> {
  finalResult: T;
  confidence: number;
  providersUsed: string[];
  consensusLevel: 'high' | 'medium' | 'low';
  allResults?: T[];
  verificationNotes: string;
}

/**
 * Cross-verify animal identification using multiple AI providers
 * Uses Gemini, OpenAI, and Anthropic to verify each other
 */
export async function crossVerifyAnimal(base64Image: string): Promise<VerificationResult<AnimalAnalysisResult>> {
  console.log('🔍 Cross-verification mode: Using multiple AI providers for higher accuracy');
  
  const results: AnimalAnalysisResult[] = [];
  const providers: string[] = [];
  
  // Provider 1: Gemini (Primary + Verification)
  const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey !== "") {
    try {
      console.log('  → Gemini AI: Analyzing...');
      const { analyzeAnimalWithGemini } = await import("./gemini");
      const geminiResult = await analyzeAnimalWithGemini(base64Image);
      results.push(geminiResult);
      providers.push('Gemini 2.0 Flash');
      console.log(`  ✓ Gemini: ${geminiResult.speciesName} (${(geminiResult.confidence * 100).toFixed(1)}%)`);
    } catch (error) {
      console.log(`  ✗ Gemini failed:`, (error as Error).message);
    }
  }
  
  // Provider 2: OpenAI GPT-4o (Verification)
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "default_key") {
    try {
      console.log('  → OpenAI GPT-4o: Analyzing...');
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a wildlife identification expert. Analyze the uploaded image and identify the animal species. Provide detailed information.
            
            Respond with JSON in this exact format:
            {
              "speciesName": "Common Name",
              "scientificName": "Scientific Name",
              "conservationStatus": "Conservation Status",
              "population": "Population estimate or 'Unknown'",
              "habitat": "Habitat description",
              "threats": ["Threat 1", "Threat 2", "Threat 3"],
              "confidence": 0.95
            }`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please identify this animal and provide detailed conservation information."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      const openaiResult: AnimalAnalysisResult = {
        speciesName: result.speciesName || "Unknown Species",
        scientificName: result.scientificName || "Unknown",
        conservationStatus: result.conservationStatus || "Data Deficient",
        population: result.population || "Unknown",
        habitat: result.habitat || "Information not available",
        threats: Array.isArray(result.threats) ? result.threats : ["Information not available"],
        confidence: typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0.5,
      };
      
      results.push(openaiResult);
      providers.push('OpenAI GPT-4o');
      console.log(`  ✓ OpenAI: ${openaiResult.speciesName} (${(openaiResult.confidence * 100).toFixed(1)}%)`);
    } catch (error) {
      console.log(`  ✗ OpenAI failed:`, (error as Error).message);
    }
  }
  
  // Provider 3: Anthropic Claude (Verification)
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      console.log('  → Anthropic Claude: Analyzing...');
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
                  data: base64Image,
                },
              },
              {
                type: "text",
                text: `You are a wildlife identification expert. Analyze this image and identify the animal species. Provide JSON in this format:
                {
                  "speciesName": "Common Name",
                  "scientificName": "Scientific Name",
                  "conservationStatus": "Conservation Status",
                  "population": "Population estimate",
                  "habitat": "Habitat description",
                  "threats": ["Threat 1", "Threat 2", "Threat 3"],
                  "confidence": 0.95
                }`
              }
            ],
          },
        ],
      });

      const content = message.content[0];
      if (content.type === 'text') {
        const cleanedText = content.text.replace(/```json\n?|\n?```/g, '').trim();
        const result = JSON.parse(cleanedText);
        const anthropicResult: AnimalAnalysisResult = {
          speciesName: result.speciesName || "Unknown Species",
          scientificName: result.scientificName || "Unknown",
          conservationStatus: result.conservationStatus || "Data Deficient",
          population: result.population || "Unknown",
          habitat: result.habitat || "Information not available",
          threats: Array.isArray(result.threats) ? result.threats : ["Information not available"],
          confidence: typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0.5,
        };
        
        results.push(anthropicResult);
        providers.push('Anthropic Claude');
        console.log(`  ✓ Anthropic: ${anthropicResult.speciesName} (${(anthropicResult.confidence * 100).toFixed(1)}%)`);
      }
    } catch (error) {
      console.log(`  ✗ Anthropic failed:`, (error as Error).message);
    }
  }
  
  // Analyze consensus
  return analyzeConsensus(results, providers);
}

/**
 * Analyze consensus between multiple AI results
 */
function analyzeConsensus<T extends AnimalAnalysisResult | FloraAnalysisResult>(
  results: T[],
  providers: string[]
): VerificationResult<T> {
  if (results.length === 0) {
    throw new Error('No AI providers available for verification');
  }
  
  // Single provider - no consensus possible
  if (results.length === 1) {
    return {
      finalResult: results[0],
      confidence: results[0].confidence,
      providersUsed: providers,
      consensusLevel: 'low',
      allResults: results,
      verificationNotes: `Verified by ${providers[0]} only. Consider multiple providers for higher confidence.`
    };
  }
  
  // Multiple providers - check for consensus
  console.log(`\n📊 Analyzing consensus from ${results.length} AI providers...`);
  
  // Count species agreement (case-insensitive comparison of common names)
  const speciesMap = new Map<string, { count: number; results: T[] }>();
  
  results.forEach((result) => {
    const normalizedName = normalizeSpeciesName(result.speciesName);
    const existing = speciesMap.get(normalizedName);
    
    if (existing) {
      existing.count++;
      existing.results.push(result);
    } else {
      speciesMap.set(normalizedName, { count: 1, results: [result] });
    }
  });
  
  // Find majority species
  let maxCount = 0;
  let consensusSpecies: string = '';
  let consensusResults: T[] = [];
  
  speciesMap.forEach((value, key) => {
    if (value.count > maxCount) {
      maxCount = value.count;
      consensusSpecies = key;
      consensusResults = value.results;
    }
  });
  
  const agreementPercentage = (maxCount / results.length) * 100;
  console.log(`  Agreement: ${maxCount}/${results.length} providers agree on species (${agreementPercentage.toFixed(0)}%)`);
  
  // Determine consensus level
  let consensusLevel: 'high' | 'medium' | 'low';
  if (agreementPercentage >= 100) {
    consensusLevel = 'high';
  } else if (agreementPercentage >= 50) {
    consensusLevel = 'medium';
  } else {
    consensusLevel = 'low';
  }
  
  // Select best result from consensus group (highest confidence)
  const finalResult = consensusResults.reduce((best, current) => 
    current.confidence > best.confidence ? current : best
  );
  
  // Boost confidence based on consensus
  let boostedConfidence = finalResult.confidence;
  if (consensusLevel === 'high') {
    boostedConfidence = Math.min(1.0, finalResult.confidence * 1.15); // +15% for full agreement
  } else if (consensusLevel === 'medium') {
    boostedConfidence = Math.min(1.0, finalResult.confidence * 1.05); // +5% for majority
  }
  
  const verificationNotes = generateVerificationNotes(results, providers, consensusLevel, agreementPercentage);
  
  console.log(`  ✅ Final: ${finalResult.speciesName} (Confidence: ${(boostedConfidence * 100).toFixed(1)}%, Consensus: ${consensusLevel})`);
  console.log(`  ${verificationNotes}`);
  
  return {
    finalResult: { ...finalResult, confidence: boostedConfidence },
    confidence: boostedConfidence,
    providersUsed: providers,
    consensusLevel,
    allResults: results,
    verificationNotes
  };
}

/**
 * Normalize species name for comparison
 */
function normalizeSpeciesName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

/**
 * Generate human-readable verification notes
 */
function generateVerificationNotes(
  results: any[],
  providers: string[],
  consensusLevel: string,
  agreementPercentage: number
): string {
  const providerList = providers.join(', ');
  
  if (consensusLevel === 'high') {
    return `✅ High confidence: All ${results.length} AI providers (${providerList}) agree on this identification.`;
  } else if (consensusLevel === 'medium') {
    return `⚠️ Moderate confidence: ${agreementPercentage.toFixed(0)}% agreement between providers (${providerList}). Result verified by majority.`;
  } else {
    const speciesFound = Array.from(new Set(results.map(r => r.speciesName)));
    return `❓ Low consensus: Providers identified different species: ${speciesFound.join(', ')}. Using highest-confidence result.`;
  }
}

/**
 * Decide whether to use cross-verification for a request
 * Uses it for ~30% of requests to balance speed vs accuracy
 */
export function shouldUseCrossVerification(): boolean {
  // Use cross-verification 30% of the time for important identifications
  return Math.random() < 0.3;
}
