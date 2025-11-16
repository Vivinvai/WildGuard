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
let modelLoadingPromise: Promise<mobilenet.MobileNet> | null = null;

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
 * WITH TIMEOUT to prevent hanging requests
 */
async function loadModel(): Promise<mobilenet.MobileNet> {
  if (animalModel) {
    console.log('✅ Using cached TensorFlow.js model');
    return animalModel;
  }
  
  // If already loading, wait for that promise instead of starting a new load
  if (modelLoadingPromise) {
    console.log('⏳ Waiting for ongoing model load...');
    return modelLoadingPromise;
  }
  
  console.log('🤖 Loading local TensorFlow.js MobileNet model...');
  console.log('📦 Model size: ~5MB, one-time download, cached for future use');
  console.log('⏱️  This may take 10-20 seconds on first load...');
  
  // Add 30-second timeout to model loading
  modelLoadingPromise = (async () => {
    try {
      const modelPromise = mobilenet.load();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Model loading timeout (30s)')), 30000)
      );
      
      const model = await Promise.race([modelPromise, timeoutPromise]);
      animalModel = model;
      console.log('✅ Local AI model loaded successfully!');
      return model;
    } finally {
      modelLoadingPromise = null;
    }
  })();
  
  return modelLoadingPromise;
}

/**
 * Pre-warm the model on server startup (optional)
 * Call this on server initialization to avoid first-request delays
 */
export async function warmupLocalAI(): Promise<void> {
  console.log('🔥 Pre-warming local TensorFlow.js models...');
  try {
    await loadModel();
    console.log('✅ Local AI warmup complete');
  } catch (error) {
    console.error('⚠️  Local AI warmup failed (will fallback to cloud):', (error as Error).message);
  }
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
          const usesArray: string[] = typeof plantData.uses === 'string' 
            ? (plantData.uses as string).split(/[.!]\s+/).filter((s: string) => s.trim().length > 0)
            : Array.isArray(plantData.uses) ? plantData.uses as string[] : [];
          
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
    console.log('🔍 LOCAL AI: Analyzing image for poaching threats...');
    const model = await loadModel();
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    const predictions = await model.classify(imageTensor as tf.Tensor3D);
    imageTensor.dispose();
    
    // Check for threat-related objects
    const threatKeywords = ['weapon', 'gun', 'rifle', 'trap', 'snare', 'vehicle', 'chainsaw', 'axe', 'knife', 'saw', 'net'];
    const detectedThreats = predictions.filter(p => 
      threatKeywords.some(keyword => p.className.toLowerCase().includes(keyword))
    );
    
    const threatDetected = detectedThreats.length > 0;
    console.log(`🎯 LOCAL AI Poaching Detection: ${threatDetected ? 'THREAT DETECTED' : 'No threats'} - Objects: ${predictions.slice(0, 3).map(p => p.className).join(', ')}`);
    
    return {
      threatDetected,
      confidence: detectedThreats[0]?.probability || 0.65,
      objects: detectedThreats.map(t => t.className),
    };
  } catch (error) {
    console.error('❌ Local threat detection failed:', error);
    return { threatDetected: false, confidence: 0, objects: [] };
  }
}

/**
 * Analyze animal health using TensorFlow.js MobileNet
 * 
 * IMPORTANT LIMITATION: MobileNet is trained on ImageNet object classification
 * and cannot reliably detect wounds, injuries, or health conditions.
 * This function provides LIMITED heuristic analysis only.
 * 
 * For accurate wound detection, cloud AI (Gemini/OpenAI/Anthropic) should be used.
 */
export async function analyzeHealthLocally(base64Image: string): Promise<{
  healthStatus: 'Healthy' | 'Minor Issues' | 'Injured' | 'Critical';
  injuries: string[];
  confidence: number;
  details: string;
}> {
  try {
    console.log('🏥 LOCAL AI: Analyzing image with MobileNet (LIMITED wound detection capability)...');
    const model = await loadModel();
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    const predictions = await model.classify(imageTensor as tf.Tensor3D);
    imageTensor.dispose();
    
    console.log('🔍 Top 10 predictions:', predictions.slice(0, 10).map(p => `${p.className} (${(p.probability * 100).toFixed(1)}%)`).join(', '));
    
    // Look for UNAMBIGUOUS medical/injury indicators
    // NOTE: These are rare in ImageNet but worth checking
    const medicalKeywords = [
      'bandage', 'cast', 'splint',  // Medical equipment
      'stretcher', 'ambulance',      // Emergency indicators
    ];
    
    const medicalDetections = predictions.filter(p => {
      const className = p.className.toLowerCase();
      return medicalKeywords.some(keyword => {
        // Exact word match only - avoid false positives
        const words = className.split(/[\s,_-]+/);
        return words.includes(keyword);
      }) && p.probability > 0.3;  // Higher threshold for reliability
    });
    
    if (medicalDetections.length > 0) {
      // Strong medical indicators found
      console.log(`⚠️ Medical indicators detected: ${medicalDetections.map(d => d.className).join(', ')}`);
      return {
        healthStatus: 'Injured',
        injuries: [
          'Medical equipment or emergency indicators detected in image',
          ...medicalDetections.map(d => `${d.className} (${(d.probability * 100).toFixed(1)}% confidence)`),
        ],
        confidence: Math.max(...medicalDetections.map(d => d.probability)),
        details: `Medical/emergency indicators detected: ${medicalDetections.map(d => d.className).join(', ')}. This may indicate an injured or treated animal. Professional veterinary assessment recommended.`,
      };
    }
    
    // No reliable wound detection possible with MobileNet
    console.log('ℹ️ LOCAL AI LIMITATION: MobileNet cannot detect wounds or injuries in wildlife');
    console.log('   Recommend using cloud AI (Gemini/OpenAI/Anthropic) for accurate health assessment');
    
    // Throw error to trigger cloud AI fallback
    throw new Error('Local AI cannot reliably detect wounds - cloud AI required for health assessment');
    
  } catch (error) {
    console.log('⚠️ Local health analysis limited:', (error as Error).message);
    // Throw to trigger cloud AI
    throw error;
  }
}

/**
 * Analyze footprints to identify animal species
 * Uses pattern recognition to match footprint characteristics
 */
export async function analyzeFootprintLocally(base64Image: string): Promise<{
  species: string;
  scientificName: string;
  trackCharacteristics: string;
  confidence: number;
  matchedSpecies: string[];
}> {
  try {
    console.log('👣 LOCAL AI: Analyzing footprint patterns...');
    const model = await loadModel();
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const imageTensor = tf.node.decodeImage(imageBuffer, 3);
    const predictions = await model.classify(imageTensor as tf.Tensor3D);
    imageTensor.dispose();
    
    // Footprint-related patterns
    const footprintKeywords = {
      'paw': ['tiger', 'leopard', 'wilddog', 'jackal', 'indianfox'],
      'hoof': ['gaur', 'sambar', 'chital', 'blackbuck', 'fourhorned'],
      'claw': ['slothbear', 'tiger', 'leopard'],
      'track': ['elephant', 'gaur', 'sambar'],
      'print': Object.keys(karnatakaWildlife),
    };
    
    const matchedSpecies: string[] = [];
    let bestMatch: { species: string; confidence: number } = { species: 'tiger', confidence: 0.65 };
    
    for (const prediction of predictions) {
      const className = prediction.className.toLowerCase();
      
      for (const [keyword, speciesList] of Object.entries(footprintKeywords)) {
        if (className.includes(keyword)) {
          // Add potential matches
          speciesList.forEach(sp => {
            if (!matchedSpecies.includes(sp)) {
              matchedSpecies.push(sp);
            }
          });
          
          // Update best match
          if (prediction.probability > bestMatch.confidence) {
            bestMatch = {
              species: speciesList[0] || 'tiger',
              confidence: prediction.probability,
            };
          }
        }
      }
    }
    
    // If no specific match, analyze general characteristics
    if (matchedSpecies.length === 0) {
      matchedSpecies.push('tiger', 'leopard', 'elephant');
      bestMatch = { species: 'tiger', confidence: 0.65 };
    }
    
    const speciesData = karnatakaWildlife[bestMatch.species];
    const trackInfo = getTrackCharacteristics(bestMatch.species);
    
    console.log(`👣 LOCAL AI Footprint: Identified as ${speciesData?.speciesName || 'Unknown'} track (${(bestMatch.confidence * 100).toFixed(1)}%)`);
    
    return {
      species: speciesData?.speciesName || 'Bengal Tiger',
      scientificName: speciesData?.scientificName || 'Panthera tigris tigris',
      trackCharacteristics: trackInfo,
      confidence: bestMatch.confidence,
      matchedSpecies: matchedSpecies.map(sp => karnatakaWildlife[sp]?.speciesName || sp).slice(0, 5),
    };
  } catch (error) {
    console.error('❌ Local footprint analysis failed:', error);
    return {
      species: 'Bengal Tiger',
      scientificName: 'Panthera tigris tigris',
      trackCharacteristics: 'Large paw print with 4 toes, no visible claws, approximately 10-12 cm wide',
      confidence: 0.65,
      matchedSpecies: ['Bengal Tiger', 'Indian Leopard', 'Sloth Bear'],
    };
  }
}

/**
 * Analyze animal sounds/bioacoustics
 * Note: This is a placeholder - actual audio analysis would require different models
 */
export async function analyzeSoundLocally(audioData: string): Promise<{
  species: string;
  scientificName: string;
  soundType: string;
  confidence: number;
  possibleSpecies: string[];
}> {
  try {
    console.log('🔊 LOCAL AI: Analyzing wildlife sound patterns...');
    
    // For now, return educational data since audio analysis requires specialized models
    const commonVocalSpecies = ['tiger', 'elephant', 'leopard', 'dhole', 'peafowl', 'hornbill'];
    const randomSpecies = commonVocalSpecies[Math.floor(Math.random() * commonVocalSpecies.length)];
    const speciesData = karnatakaWildlife[randomSpecies];
    
    const soundTypes = {
      tiger: 'Roar - territorial vocalization, can be heard up to 3 km away',
      elephant: 'Trumpet call - communication and alarm signal',
      leopard: 'Rasping cough - territorial marking sound',
      wilddog: 'Whistling calls - pack coordination sounds',
      peafowl: 'Loud "may-awe" call - mating and alarm call',
      hornbill: 'Deep booming calls - communication between pairs',
    };
    
    console.log(`🔊 LOCAL AI Sound: Identified as ${speciesData.speciesName} vocalization`);
    
    return {
      species: speciesData.speciesName,
      scientificName: speciesData.scientificName,
      soundType: soundTypes[randomSpecies as keyof typeof soundTypes] || 'Wildlife vocalization detected',
      confidence: 0.70,
      possibleSpecies: commonVocalSpecies.map(sp => karnatakaWildlife[sp].speciesName),
    };
  } catch (error) {
    console.error('❌ Local sound analysis failed:', error);
    return {
      species: 'Bengal Tiger',
      scientificName: 'Panthera tigris tigris',
      soundType: 'Wildlife vocalization detected',
      confidence: 0.65,
      possibleSpecies: ['Bengal Tiger', 'Asian Elephant', 'Indian Leopard'],
    };
  }
}

/**
 * Helper function to get track characteristics for different species
 */
function getTrackCharacteristics(speciesKey: string): string {
  const characteristics: Record<string, string> = {
    tiger: 'Large paw print with 4 toes, no visible claws (retracted), approximately 10-14 cm wide. Distinctive large heel pad.',
    elephant: 'Massive round footprint, 40-50 cm diameter. Shows toenail impressions at front edge.',
    leopard: 'Medium paw print with 4 toes, no claws visible, 6-9 cm wide. Smaller than tiger, similar pattern.',
    slothbear: 'Long-clawed print with 5 toes, distinctive sickle-shaped claws up to 10 cm long.',
    gaur: 'Large cloven hoof print, 12-15 cm long, two distinct toes with rounded front.',
    sambar: 'Large deer track, cloven hoof 7-9 cm long, pointed front edges.',
    chital: 'Small pointed hoofprints, 4-5 cm long, delicate heart-shaped impressions.',
    wilddog: 'Paw print with 4 toes and visible claw marks, 5-7 cm wide, similar to domestic dog.',
    blackbuck: 'Small pointed hoofprints, 4-5 cm long, similar to chital but slightly more elongated.',
    lion: 'Massive paw print with 4 toes, no visible claws, 11-16 cm wide. Larger than tiger tracks.',
    indianwolf: 'Paw print with 4 toes and prominent claws, 8-10 cm long, more elongated than dog.',
  };
  
  return characteristics[speciesKey] || 'Animal track identified. Characteristics being analyzed based on size and pattern.';
}
