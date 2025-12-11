/**
 * Claude (Anthropic) AI Service for Animal Identification
 * Uses Claude 3.5 Sonnet for wildlife identification
 */

import Anthropic from "@anthropic-ai/sdk";
import type { AnimalAnalysisResult } from './openai';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Analyze animal image using Claude
 */
export async function analyzeAnimalWithClaude(base64Image: string): Promise<AnimalAnalysisResult> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }
  
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  
  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
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
            text: `Identify this animal. Provide a JSON response with this structure:
{
  "speciesName": "Common name (e.g., Bengal Tiger)",
  "scientificName": "Scientific name",
  "conservationStatus": "IUCN status",
  "confidence": 0.95,
  "habitat": "Where it lives",
  "threats": ["threat1", "threat2"],
  "population": "Population info"
}

Focus on Indian wildlife if applicable. Be specific and accurate.`
          }
        ],
      },
    ],
  });
  
  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }
  
  const text = content.text;
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse Claude response');
  }
  
  const data = JSON.parse(jsonMatch[0]);
  
  return {
    speciesName: data.speciesName || 'Unknown',
    scientificName: data.scientificName || 'Unknown',
    conservationStatus: data.conservationStatus || 'Unknown',
    confidence: data.confidence || 0.7,
    habitat: data.habitat || 'Unknown',
    threats: data.threats || [],
    population: data.population || 'Unknown'
  };
}
