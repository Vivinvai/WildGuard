/**
 * Local AI Service - Python TensorFlow Backend
 * Provides FREE, offline AI identification using TensorFlow models via Python
 * NO API COSTS - Works completely locally
 */

import type { AnimalAnalysisResult } from './openai';
import type { FloraAnalysisResult } from './gemini';
import {
  identifyAnimalWithTensorFlow,
  identifyFloraWithTensorFlow,
  warmupTensorFlowService
} from './tensorflow-bridge';

/**
 * Pre-warm AI service on server startup
 */
export async function warmupLocalAI(): Promise<void> {
  await warmupTensorFlowService();
}

/**
 * Identify animal using Python TensorFlow service
 * FREE - No API costs, works offline via Python
 */
export async function identifyAnimalLocally(base64Image: string): Promise<AnimalAnalysisResult> {
  try {
    console.log('🎯 Using Python TensorFlow for animal identification (FREE, offline)');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    return await identifyAnimalWithTensorFlow(imageBuffer);
  } catch (error) {
    console.error('❌ Python TensorFlow identification failed:', error);
    throw new Error(`Local AI failed: ${(error as Error).message}`);
  }
}

/**
 * Identify flora using Python TensorFlow service
 * FREE - No API costs, works offline via Python
 */
export async function identifyFloraLocally(base64Image: string): Promise<FloraAnalysisResult> {
  try {
    console.log('🌿 Using Python TensorFlow for flora identification (FREE, offline)');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    return await identifyFloraWithTensorFlow(imageBuffer);
  } catch (error) {
    console.error('❌ Python TensorFlow flora identification failed:', error);
    throw new Error(`Local AI failed: ${(error as Error).message}`);
  }
}

/**
 * Stub functions for other features (to be implemented later)
 */
export async function detectThreatsLocally(base64Image: string): Promise<{ threatDetected: boolean; confidence: number; objects: string[] }> {
  return { threatDetected: false, confidence: 0, objects: [] };
}

export async function analyzeHealthLocally(base64Image: string): Promise<any> {
  throw new Error('Health analysis requires Gemini API');
}

export async function analyzeFootprintLocally(base64Image: string): Promise<any> {
  const imageBuffer = Buffer.from(base64Image, 'base64');
  const result = await identifyAnimalWithTensorFlow(imageBuffer);
  return {
    species: result.speciesName,
    scientificName: result.scientificName,
    trackCharacteristics: 'Track patterns based on species identification',
    confidence: result.confidence,
    matchedSpecies: [result.speciesName],
  };
}

export async function analyzeSoundLocally(audioData: string): Promise<any> {
  throw new Error('Sound analysis not yet implemented');
}
