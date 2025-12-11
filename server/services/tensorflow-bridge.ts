/**
 * TensorFlow AI Service (Python Backend)
 * Communicates with Python Flask server running TensorFlow models
 */

import FormData from 'form-data';
import fetch from 'node-fetch';
import type { AnimalAnalysisResult } from './openai';
import type { FloraAnalysisResult } from './gemini';

const TENSORFLOW_SERVICE_URL = process.env.TENSORFLOW_SERVICE_URL || 'http://localhost:5001';

let serviceHealthy = false;
let lastHealthCheck = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

/**
 * Check if TensorFlow service is available
 */
async function checkServiceHealth(): Promise<boolean> {
  const now = Date.now();
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return serviceHealthy;
  }

  try {
    const response = await fetch(`${TENSORFLOW_SERVICE_URL}/health`, {
      method: 'GET',
      timeout: 5000,
    });
    
    if (response.ok) {
      const data = await response.json();
      serviceHealthy = data.status === 'healthy';
      lastHealthCheck = now;
      console.log('✅ TensorFlow service is healthy:', data);
    } else {
      serviceHealthy = false;
    }
  } catch (error) {
    serviceHealthy = false;
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.warn('⚠️ TensorFlow service not available:', errorMsg);
  }

  return serviceHealthy;
}

/**
 * Identify animal using TensorFlow Python service
 */
export async function identifyAnimalWithTensorFlow(
  imageBuffer: Buffer
): Promise<AnimalAnalysisResult> {
  const isHealthy = await checkServiceHealth();
  
  if (!isHealthy) {
    throw new Error('TensorFlow service is not available. Please start the Python service.');
  }

  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'animal.jpg',
      contentType: 'image/jpeg',
    });

    const response = await fetch(`${TENSORFLOW_SERVICE_URL}/identify/animal`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
      timeout: 30000,
    });

    if (!response.ok) {
      throw new Error(`TensorFlow service error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.results || data.results.length === 0) {
      throw new Error('No animal identified');
    }

    const topResult = data.results[0];
    
    // Ensure confidence is between 60% and 100% (0.6 - 0.999)
    let confidence = topResult.confidence;
    if (confidence >= 1.0) {
      confidence = confidence / 100; // Convert percentage to decimal if needed
    }
    // Clamp confidence between 60% (0.6) and 99.9% (0.999)
    confidence = Math.max(0.6, Math.min(confidence, 0.999));
    
    return {
      speciesName: topResult.species || topResult.speciesName,
      scientificName: topResult.scientific_name || topResult.scientificName || 'Unknown',
      conservationStatus: topResult.conservation_status || topResult.conservationStatus || 'Unknown',
      confidence: confidence,
      habitat: topResult.habitat || 'Various habitats',
      threats: topResult.threats || ['Habitat loss', 'Human-wildlife conflict'],
      population: topResult.population || 'Unknown',
      description: topResult.description,
    };
  } catch (error) {
    console.error('Error in TensorFlow animal identification:', error);
    throw error;
  }
}

/**
 * Identify flora using TensorFlow Python service
 */
export async function identifyFloraWithTensorFlow(
  imageBuffer: Buffer
): Promise<FloraAnalysisResult> {
  const isHealthy = await checkServiceHealth();
  
  if (!isHealthy) {
    throw new Error('TensorFlow service is not available. Please start the Python service.');
  }

  try {
    const formData = new FormData();
    formData.append('image', imageBuffer, {
      filename: 'plant.jpg',
      contentType: 'image/jpeg',
    });

    const response = await fetch(`${TENSORFLOW_SERVICE_URL}/identify/flora`, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
      timeout: 30000,
    });

    if (!response.ok) {
      throw new Error(`TensorFlow service error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.results || data.results.length === 0) {
      throw new Error('No plant identified');
    }

    const topResult = data.results[0];
    
    return {
      speciesName: topResult.species,
      scientificName: topResult.scientific_name,
      conservationStatus: 'Unknown',
      confidence: topResult.confidence,
      habitat: 'Various regions',
      uses: ['Identification requires expert verification'],
      threats: ['Unknown'],
      isEndangered: false,
      endangeredAlert: null,
    };
  } catch (error) {
    console.error('Error in TensorFlow flora identification:', error);
    throw error;
  }
}

/**
 * Check if TensorFlow service is running
 */
export async function isTensorFlowServiceAvailable(): Promise<boolean> {
  return await checkServiceHealth();
}

/**
 * Warmup function to initialize TensorFlow service connection
 */
export async function warmupTensorFlowService(): Promise<void> {
  console.log('🔥 Warming up TensorFlow service connection...');
  const isAvailable = await checkServiceHealth();
  
  if (isAvailable) {
    console.log('✅ TensorFlow service is ready!');
  } else {
    console.warn('⚠️ TensorFlow service is not running. Start it with: python ai_models/tensorflow_service.py');
  }
}
