/**
 * DeepSeek AI Service (OpenAI-compatible API)
 * Using DeepSeek's chat model through OpenAI's API interface
 */

import OpenAI from 'openai';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY || 'your_deepseek_api_key_here',
  baseURL: 'https://api.deepseek.com',
});

interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Check if DeepSeek API is configured
 */
export function isDeepSeekAvailable(): boolean {
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  return !!apiKey && apiKey !== 'your_deepseek_api_key_here';
}

/**
 * Send a chat request to DeepSeek
 */
export async function chatWithDeepSeek(
  messages: DeepSeekMessage[],
  maxTokens: number = 2048
): Promise<string> {
  if (!isDeepSeekAvailable()) {
    throw new Error('DeepSeek API key not configured');
  }

  try {
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages as any,
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return content;
    }

    throw new Error('No content in DeepSeek response');
  } catch (error: any) {
    throw new Error(`DeepSeek error: ${error.message}`);
  }
}

/**
 * Identify animal using DeepSeek AI - Enhanced with TensorFlow pre-identification
 * DeepSeek is text-only, so we use TensorFlow first then enrich with DeepSeek knowledge
 */
export async function identifyAnimalWithDeepSeek(
  tensorflowPrediction: {
    species: string;
    confidence: number;
    detectedClasses?: string[];
  },
  context?: string
): Promise<{
  species: string;
  scientificName: string;
  confidence: number;
  description: string;
  habitat: string;
  diet: string;
  behavior: string;
  conservationStatus: string;
  threats: string[];
  interestingFacts: string[];
}> {
  // Build detailed prompt with TensorFlow detection results
  const detectedInfo = tensorflowPrediction.detectedClasses 
    ? `Detected possibilities: ${tensorflowPrediction.detectedClasses.join(', ')}`
    : `Primary detection: ${tensorflowPrediction.species}`;

  const prompt = `You are a wildlife expert specializing in Karnataka, India's fauna.

An AI vision system has detected an animal in an image:
- ${detectedInfo}
- Detection confidence: ${(tensorflowPrediction.confidence * 100).toFixed(1)}%

Based on this detection, provide DETAILED information about this animal. If the detection seems uncertain, provide information for the most likely Karnataka wildlife species that matches the detected features.

${context ? `Additional context: ${context}` : ''}

Respond in this EXACT JSON format (no markdown, just raw JSON):
{
  "species": "Exact common name (e.g., Bengal Tiger, Indian Elephant)",
  "scientificName": "Full scientific name (e.g., Panthera tigris tigris)",
  "confidence": 0.85,
  "description": "Detailed 2-3 sentence description of physical appearance, size, and distinguishing features",
  "habitat": "Specific habitats in Karnataka (forests, grasslands, wetlands, etc.)",
  "diet": "What this animal eats and hunting/foraging behavior",
  "behavior": "Social behavior, activity patterns (nocturnal/diurnal), territorial habits",
  "conservationStatus": "Exact IUCN status: Critically Endangered, Endangered, Vulnerable, Near Threatened, or Least Concern",
  "threats": ["Specific threat 1", "Specific threat 2", "Specific threat 3"],
  "interestingFacts": ["Unique fact 1", "Unique fact 2", "Unique fact 3"]
}

IMPORTANT: 
- Use ONLY real Karnataka wildlife species
- Be specific and accurate with scientific names
- Provide practical, educational information
- If uncertain, clearly state the most likely species`;

  const messages: DeepSeekMessage[] = [
    {
      role: 'system',
      content: 'You are a Karnataka wildlife expert. Provide accurate, educational information about Indian wildlife. Always respond with valid JSON only.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await chatWithDeepSeek(messages, 2048);
  
  try {
    // Extract and parse JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        species: parsed.species || tensorflowPrediction.species,
        scientificName: parsed.scientificName || 'Classification pending',
        confidence: Math.min(parsed.confidence || tensorflowPrediction.confidence, 0.95),
        description: parsed.description || 'Wildlife species detected in Karnataka region.',
        habitat: parsed.habitat || 'Karnataka forests and protected areas',
        diet: parsed.diet || 'Varied diet depending on habitat availability',
        behavior: parsed.behavior || 'Natural wildlife behavior patterns',
        conservationStatus: parsed.conservationStatus || 'Assessment needed',
        threats: Array.isArray(parsed.threats) ? parsed.threats : ['Habitat loss', 'Human-wildlife conflict', 'Poaching'],
        interestingFacts: Array.isArray(parsed.interestingFacts) ? parsed.interestingFacts : ['Native to Karnataka', 'Important for ecosystem balance', 'Protected under wildlife laws'],
      };
    }
    
    // Fallback if JSON parsing fails
    return {
      species: tensorflowPrediction.species,
      scientificName: 'Classification in progress',
      confidence: tensorflowPrediction.confidence * 0.8,
      description: response.substring(0, 200),
      habitat: 'Karnataka wildlife habitats',
      diet: 'Natural diet',
      behavior: 'Wildlife behavior',
      conservationStatus: 'Status assessment pending',
      threats: ['Habitat loss', 'Human disturbance'],
      interestingFacts: ['Part of Karnataka biodiversity'],
    };
  } catch (error) {
    console.error('DeepSeek parsing error:', error);
    throw new Error('Failed to parse DeepSeek response: ' + (error as Error).message);
  }
}

/**
 * Identify plant using DeepSeek AI
 */
export async function identifyFloraWithDeepSeek(
  imageDescription: string,
  context?: string
): Promise<{
  species: string;
  scientificName: string;
  confidence: number;
  description: string;
  uses?: string[];
}> {
  const prompt = `You are a botanist specializing in Karnataka, India's flora.
Analyze this image description and identify the plant:

Image Description: ${imageDescription}
${context ? `Additional Context: ${context}` : ''}

Provide your response in the following JSON format:
{
  "species": "Common name of the plant",
  "scientificName": "Scientific name",
  "confidence": 0.0-1.0,
  "description": "Brief description of the plant",
  "uses": ["medicinal", "culinary", "ornamental", etc.]
}`;

  const messages: DeepSeekMessage[] = [
    {
      role: 'user',
      content: prompt,
    },
  ];

  const response = await chatWithDeepSeek(messages, 1024);
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return {
      species: 'Unknown Plant',
      scientificName: 'Classification pending',
      confidence: 0.5,
      description: response,
      uses: [],
    };
  } catch (error) {
    throw new Error('Failed to parse DeepSeek response');
  }
}

/**
 * General wildlife chatbot using DeepSeek
 */
export async function wildlifeChatWithDeepSeek(
  userMessage: string,
  conversationHistory: DeepSeekMessage[] = []
): Promise<string> {
  const systemMessage: DeepSeekMessage = {
    role: 'system',
    content: `You are an expert wildlife conservationist and educator specializing in Karnataka, India's biodiversity.
You help users learn about wildlife, conservation, and provide guidance on wildlife rescue and protection.
Be informative, encouraging, and always promote wildlife conservation and ethical wildlife interaction.`,
  };

  const messages: DeepSeekMessage[] = [
    systemMessage,
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage,
    },
  ];

  return await chatWithDeepSeek(messages, 2048);
}

export default {
  isDeepSeekAvailable,
  chatWithDeepSeek,
  identifyAnimalWithDeepSeek,
  identifyFloraWithDeepSeek,
  wildlifeChatWithDeepSeek,
};
