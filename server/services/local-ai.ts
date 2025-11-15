/**
 * Local TensorFlow.js AI Service
 * Provides FREE, offline AI identification using pre-trained models
 * NO API COSTS - Works completely locally
 */

import * as tf from '@tensorflow/tfjs-node';
import * as mobilenet from '@tensorflow-models/mobilenet';
import type { AnimalAnalysisResult } from './openai';
import type { FloraAnalysisResult } from './gemini';
import { karnatakaWildlife } from './free-animal-id';

// Cache for loaded models
let animalModel: mobilenet.MobileNet | null = null;

// Karnataka-specific mappings from MobileNet classes to local species
const ANIMAL_MAPPINGS: Record<string, string> = {
  'tiger': 'tiger',
  'tiger cat': 'tiger',
  'indian elephant': 'elephant',
  'elephant': 'elephant',
  'african elephant': 'elephant',
  'leopard': 'leopard',
  'jaguar': 'leopard',
  'cheetah': 'leopard',
  'sloth bear': 'slothbear',
  'american black bear': 'slothbear',
  'brown bear': 'slothbear',
  'ox': 'gaur',
  'water buffalo': 'gaur',
  'ram': 'gaur',
  'wild boar': 'wildboar',
  'hog': 'wildboar',
  'pig': 'wildboar',
  'warthog': 'wildboar',
  'fox': 'jackal',
  'coyote': 'jackal',
  'dingo': 'jackal',
  'african hunting dog': 'wilddog',
  'wild dog': 'wilddog',
  'macaque': 'macaque',
  'baboon': 'macaque',
  'patas': 'macaque',
  'langur': 'langur',
  'colobus': 'langur',
  'peacock': 'peafowl',
  'peafowl': 'peafowl',
  'cobra': 'kingcobra',
  'king snake': 'kingcobra',
  'rock python': 'pythonindian',
  'indian cobra': 'kingcobra',
};

const FLORA_MAPPINGS: Record<string, string> = {
  'jackfruit': 'jackfruit',
  'pineapple': 'jackfruit',
  'mango': 'mango',
  'banana': 'mango',
  'coconut': 'coconut',
  'acorn': 'coconut',
  'neem tree': 'neem',
  'oak tree': 'banyan',
  'banyan': 'banyan',
};

/**
 * Load MobileNet model (cached after first load)
 */
async function loadModel(): Promise<mobilenet.MobileNet> {
  if (animalModel) {
    return animalModel;
  }
  
  console.log('🤖 Loading local TensorFlow.js MobileNet model...');
  console.log('📦 Model size: ~5MB, one-time download, cached for future use');
  
  animalModel = await mobilenet.load();
  console.log('✅ Local AI model loaded successfully!');
  
  return animalModel;
}

/**
 * Identify animal using local TensorFlow.js model
 * FREE - No API costs, works offline
 */
export async function identifyAnimalLocally(base64Image: string): Promise<AnimalAnalysisResult> {
  try {
    console.log('🎯 Using LOCAL TensorFlow.js for animal identification (FREE, offline)');
    
    // Load model
    const model = await loadModel();
    
    // Convert base64 to tensor
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    
    // Get predictions
    const predictions = await model.classify(imageTensor as tf.Tensor3D);
    
    // Clean up tensor
    imageTensor.dispose();
    
    console.log('🔍 Top predictions:', predictions.slice(0, 3).map(p => `${p.className} (${(p.probability * 100).toFixed(1)}%)`).join(', '));
    
    // Try to map to Karnataka species
    const topPrediction = predictions[0];
    const className = topPrediction.className.toLowerCase();
    
    // Check if we can map to a Karnataka species
    for (const [key, localSpecies] of Object.entries(ANIMAL_MAPPINGS)) {
      if (className.includes(key)) {
        const speciesData = karnatakaWildlife[localSpecies];
        if (speciesData) {
          console.log(`✅ Matched to Karnataka species: ${speciesData.speciesName}`);
          return {
            ...speciesData,
            confidence: topPrediction.probability,
          };
        }
      }
    }
    
    // If no match, return generic result based on top prediction
    console.log('ℹ️ No Karnataka match, returning generic identification');
    return {
      speciesName: topPrediction.className,
      scientificName: "Classification from ImageNet dataset",
      conservationStatus: "Data Deficient",
      population: "Population data not available for this species",
      habitat: `This appears to be a ${topPrediction.className}. For detailed conservation information about Karnataka wildlife, try uploading an image of a local species.`,
      threats: ["Habitat Loss", "Climate Change", "Human Activity"],
      confidence: topPrediction.probability,
    };
  } catch (error) {
    console.error('❌ Local AI identification failed:', error);
    throw new Error(`Local AI failed: ${(error as Error).message}`);
  }
}

/**
 * Identify flora using local TensorFlow.js model
 * FREE - No API costs, works offline
 */
export async function identifyFloraLocally(base64Image: string): Promise<FloraAnalysisResult> {
  try {
    console.log('🌿 Using LOCAL TensorFlow.js for flora identification (FREE, offline)');
    
    // Load model
    const model = await loadModel();
    
    // Convert base64 to tensor
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    
    // Get predictions
    const predictions = await model.classify(imageTensor as tf.Tensor3D);
    
    // Clean up tensor
    imageTensor.dispose();
    
    console.log('🔍 Top predictions:', predictions.slice(0, 3).map(p => `${p.className} (${(p.probability * 100).toFixed(1)}%)`).join(', '));
    
    // Try to map to Karnataka flora
    const topPrediction = predictions[0];
    const className = topPrediction.className.toLowerCase();
    
    // Check if we can map to a Karnataka plant
    for (const [key, localPlant] of Object.entries(FLORA_MAPPINGS)) {
      if (className.includes(key)) {
        // Import flora database
        const { karnatakaFlora } = await import('./plantnet');
        const plantData = karnatakaFlora[localPlant];
        if (plantData) {
          console.log(`✅ Matched to Karnataka flora: ${plantData.speciesName}`);
          
          // Normalize uses to array
          const usesArray = typeof plantData.uses === 'string' 
            ? plantData.uses.split(/[.!]\s+/).filter((s: string) => s.trim().length > 0)
            : Array.isArray(plantData.uses) ? plantData.uses : [];
          
          return {
            ...plantData,
            uses: usesArray,
            confidence: topPrediction.probability,
          };
        }
      }
    }
    
    // If no match, return generic result
    console.log('ℹ️ No Karnataka match, returning generic identification');
    return {
      speciesName: topPrediction.className,
      scientificName: "Classification from ImageNet dataset",
      conservationStatus: "Data Deficient",
      endangeredAlert: null,
      isEndangered: false,
      habitat: `This appears to be related to ${topPrediction.className}. For detailed information about Karnataka flora, try uploading an image of a local plant species.`,
      uses: [`Identified as ${topPrediction.className} using local AI`, "For traditional uses, upload a Karnataka-native plant"],
      threats: ["Habitat Loss", "Climate Change", "Over-harvesting"],
      confidence: topPrediction.probability,
    };
  } catch (error) {
    console.error('❌ Local flora identification failed:', error);
    throw new Error(`Local AI failed: ${(error as Error).message}`);
  }
}

/**
 * Check if image contains potential threats (for poaching detection)
 */
export async function detectThreatsLocally(base64Image: string): Promise<{ threatDetected: boolean; confidence: number; objects: string[] }> {
  try {
    const model = await loadModel();
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    const predictions = await model.classify(imageTensor as tf.Tensor3D);
    imageTensor.dispose();
    
    // Check for threat-related objects
    const threatKeywords = ['weapon', 'gun', 'rifle', 'trap', 'snare', 'vehicle', 'chainsaw', 'axe'];
    const detectedThreats = predictions.filter(p => 
      threatKeywords.some(keyword => p.className.toLowerCase().includes(keyword))
    );
    
    return {
      threatDetected: detectedThreats.length > 0,
      confidence: detectedThreats[0]?.probability || 0,
      objects: detectedThreats.map(t => t.className),
    };
  } catch (error) {
    console.error('Local threat detection failed:', error);
    return { threatDetected: false, confidence: 0, objects: [] };
  }
}
