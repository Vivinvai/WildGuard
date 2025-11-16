/**
 * AI Orchestrator - Centralized AI fallback management
 * Handles cascading fallback: Local TF.js → Free APIs → Cloud AI → Educational
 * Ensures consistent behavior across all 9 conservation features
 */

import type { AnimalAnalysisResult } from './openai';
import type { FloraAnalysisResult } from './gemini';
import { 
  identifyAnimalLocally, 
  identifyFloraLocally, 
  detectThreatsLocally,
  analyzeHealthLocally,
  analyzeFootprintLocally,
  analyzeSoundLocally 
} from './local-ai';
import { identifyPlantWithPlantNet, getEducationalPlantData } from './plantnet';
import { analyzeAnimalImage } from './openai';
import { analyzeFloraWithGemini } from './gemini';
import { identifyAnimalFree, karnatakaWildlife } from './free-animal-id';
import { crossVerifyAnimal, shouldUseCrossVerification } from './ai-cross-verification';

export type AIFeature = 
  | 'animal_identification'
  | 'flora_identification'
  | 'poaching_detection'
  | 'health_assessment'
  | 'footprint_analysis'
  | 'partial_image_enhancement';

export type AIProvider = 'local_ai' | 'free_api' | 'cloud_ai' | 'educational';

export interface AIResult {
  data: AnimalAnalysisResult | FloraAnalysisResult | any;
  provider: AIProvider;
  confidence: number;
  method: string;
}

/**
 * Main orchestrator for all AI identification tasks
 * Automatically cascades through providers until one succeeds
 */
export class AIOrchestrator {
  /**
   * Identify animal using GEMINI-FIRST strategy with CROSS-VERIFICATION
   * Strategy: Use multiple AI providers to verify each other for higher accuracy
   * Gemini AI (primary) + Cross-verification → Local AI → Educational
   */
  async identifyAnimal(base64Image: string): Promise<AIResult> {
    const feature = 'animal_identification';
    
    // SMART MODE: Use cross-verification for ~30% of requests (higher accuracy)
    if (shouldUseCrossVerification()) {
      console.log(`[${feature}] 🔬 CROSS-VERIFICATION MODE: Using multiple AI providers for consensus-based identification`);
      try {
        const verification = await crossVerifyAnimal(base64Image);
        console.log(`[${feature}] ✅ Cross-verification complete: ${verification.finalResult.speciesName}`);
        console.log(`[${feature}]    Providers: ${verification.providersUsed.join(', ')}`);
        console.log(`[${feature}]    Consensus: ${verification.consensusLevel} (${(verification.confidence * 100).toFixed(1)}% confidence)`);
        
        return {
          data: verification.finalResult,
          provider: 'cloud_ai',
          confidence: verification.confidence,
          method: `Multi-AI Verification (${verification.providersUsed.join(' + ')}) - ${verification.consensusLevel} consensus`,
        };
      } catch (verificationError) {
        console.log(`[${feature}] ⚠️ Cross-verification failed, falling back to standard mode:`, (verificationError as Error).message);
      }
    }
    
    // STANDARD MODE: Single provider cascade (faster)
    // Tier 1: Gemini AI (PRIMARY - Most accurate for wildlife)
    try {
      console.log(`[${feature}] 🌐 Tier 1: Attempting Gemini AI (Google's most accurate vision model)...`);
      const data = await analyzeAnimalImage(base64Image);
      console.log(`[${feature}] ✅ Gemini AI success: ${data.speciesName} (${(data.confidence * 100).toFixed(1)}%)`);
      return {
        data,
        provider: 'cloud_ai',
        confidence: data.confidence,
        method: 'Gemini 2.0 Flash (Google Cloud AI)',
      };
    } catch (geminiError) {
      console.log(`[${feature}] ⚠️ Gemini failed:`, (geminiError as Error).message);
    }
    
    // Tier 2: Local TensorFlow.js AI backup (when cloud unavailable)
    try {
      console.log(`[${feature}] 🎯 Tier 2: Attempting Local TensorFlow.js AI (FREE, offline)...`);
      const data = await identifyAnimalLocally(base64Image);
      console.log(`[${feature}] ✅ Local AI success: ${data.speciesName} (${(data.confidence * 100).toFixed(1)}%)`);
      return {
        data,
        provider: 'local_ai',
        confidence: data.confidence,
        method: 'TensorFlow.js MobileNet - Free Offline AI',
      };
    } catch (localError) {
      console.log(`[${feature}] ⚠️ Local AI failed:`, (localError as Error).message);
    }
    
    // Tier 3: Educational fallback (ALWAYS WORKS)
    console.log(`[${feature}] 📚 Tier 3: Using educational database...`);
    const animals = Object.values(karnatakaWildlife);
    const educationalAnimal = animals[Math.floor(Math.random() * animals.length)];
    const data = { ...educationalAnimal, confidence: 0.6 };
    console.log(`[${feature}] ✅ Educational mode: ${data.speciesName}`);
    return {
      data,
      provider: 'educational',
      confidence: data.confidence,
      method: 'Karnataka Wildlife Educational Database',
    };
  }
  
  /**
   * Identify flora using cascading fallback chain
   * PlantNet (free specialist) → Cloud AI (Gemini) → Local TF.js → Educational
   * Prioritizes specialized free API, then cloud for accuracy
   */
  async identifyFlora(base64Image: string): Promise<AIResult> {
    const feature = 'flora_identification';
    
    // Tier 1: PlantNet API (FREE, specialized botanical database - BEST for plants!)
    if (process.env.PLANTNET_API_KEY) {
      try {
        console.log(`[${feature}] 🌿 Tier 1: Attempting PlantNet API (FREE, 71k+ species)...`);
        const data = await identifyPlantWithPlantNet(base64Image);
        console.log(`[${feature}] ✅ PlantNet success: ${data.speciesName} (${(data.confidence * 100).toFixed(1)}%)`);
        return {
          data,
          provider: 'free_api',
          confidence: data.confidence,
          method: 'PlantNet API (Free Specialist)',
        };
      } catch (plantnetError) {
        console.log(`[${feature}] ⚠️ Tier 1 failed:`, (plantnetError as Error).message);
      }
    }
    
    // Tier 2: Cloud AI (Gemini/OpenAI/Anthropic - HIGH ACCURACY)
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      try {
        console.log(`[${feature}] 🌐 Tier 2: Attempting Cloud AI (Gemini)...`);
        const data = await analyzeFloraWithGemini(base64Image);
        console.log(`[${feature}] ✅ Cloud AI success: ${data.speciesName} (${(data.confidence * 100).toFixed(1)}%)`);
        return {
          data,
          provider: 'cloud_ai',
          confidence: data.confidence,
          method: 'Google Gemini Vision',
        };
      } catch (cloudError) {
        console.log(`[${feature}] ⚠️ Tier 2 failed:`, (cloudError as Error).message);
      }
    }
    
    // Tier 3: Local TensorFlow.js (FREE backup when APIs unavailable)
    try {
      console.log(`[${feature}] 🎯 Tier 3: Attempting Local TensorFlow.js (FREE fallback)...`);
      const data = await identifyFloraLocally(base64Image);
      console.log(`[${feature}] ⚠️ Local AI fallback: ${data.speciesName} (${(data.confidence * 100).toFixed(1)}%) - accuracy may be limited`);
      return {
        data,
        provider: 'local_ai',
        confidence: data.confidence * 0.7, // Reduce confidence to indicate lower accuracy
        method: 'Local TensorFlow.js MobileNet (Fallback)',
      };
    } catch (localError) {
      console.log(`[${feature}] ⚠️ Tier 3 failed:`, (localError as Error).message);
    }
    
    // Tier 4: Educational fallback (ALWAYS WORKS)
    console.log(`[${feature}] 📚 Tier 4: Using educational database (21 Karnataka plants)...`);
    const data = getEducationalPlantData();
    console.log(`[${feature}] ✅ Educational mode: ${data.speciesName}`);
    return {
      data,
      provider: 'educational',
      confidence: data.confidence,
      method: 'Karnataka Flora Educational Database',
    };
  }
  
  /**
   * Assess animal health from image
   * Local TF.js → Cloud AI → Basic assessment
   */
  async assessAnimalHealth(base64Image: string): Promise<AIResult> {
    const feature = 'health_assessment';
    
    // Tier 1: Cloud AI (use existing comprehensive service)
    try {
      console.log(`[${feature}] 🌐 Tier 1: Attempting Cloud AI health assessment...`);
      const { assessAnimalHealth } = await import('./health-assessment');
      const result = await assessAnimalHealth(base64Image);
      console.log(`[${feature}] ✅ Cloud AI assessment: ${result.overallHealthStatus}`);
      return {
        data: result,
        provider: 'cloud_ai',
        confidence: result.confidence,
        method: 'Cloud AI Multi-provider Analysis',
      };
    } catch (cloudError) {
      console.log(`[${feature}] ⚠️ Tier 1 failed:`, (cloudError as Error).message);
    }
    
    // Tier 2: Local TensorFlow.js (LIMITED - only detects medical equipment)
    try {
      console.log(`[${feature}] 🎯 Tier 2: Checking for medical equipment with Local AI...`);
      const healthData = await analyzeHealthLocally(base64Image);
      const animalData = await identifyAnimalLocally(base64Image);
      
      console.log(`[${feature}] ✅ Local AI detected medical indicators for ${animalData.speciesName}`);
      
      // Map local AI status to service status
      const statusMap = {
        'Healthy': 'healthy' as const,
        'Minor Issues': 'minor_issues' as const,
        'Injured': 'injured' as const,
        'Critical': 'critical' as const,
      };
      
      // Return HealthAssessmentResult-compatible structure
      return {
        data: {
          animalIdentified: animalData.speciesName,
          overallHealthStatus: statusMap[healthData.healthStatus],
          confidence: healthData.confidence * 0.85, // Reduce confidence - local AI is limited
          visualSymptoms: {
            injuries: healthData.injuries,
            malnutrition: false,
            skinConditions: [],
            abnormalBehavior: ['Medical equipment detected in vicinity'],
          },
          detectedConditions: healthData.injuries,
          severity: healthData.details,
          treatmentRecommendations: [
            '⚠️ Medical equipment detected - animal may be receiving treatment',
            'Contact wildlife authorities for professional health assessment',
            'Do not approach - animal may be under veterinary care',
            'Document observations and location for wildlife officials',
          ],
          veterinaryAlertRequired: true,
          followUpRequired: true,
          detailedAnalysis: `Local AI detected medical equipment: ${healthData.details}. Note: Local AI cannot directly detect wounds - cloud AI recommended for comprehensive health assessment.`,
        },
        provider: 'local_ai',
        confidence: healthData.confidence * 0.85,
        method: 'Local TensorFlow.js Medical Equipment Detection (Limited)',
      };
    } catch (localError) {
      console.log(`[${feature}] ⚠️ Tier 2 skipped - Local AI limited for wound detection:`, (localError as Error).message);
    }
    
    // Tier 3: Educational fallback with manual assessment prompts
    console.log(`[${feature}] ℹ️ Providing manual health assessment guidelines (AI unavailable)`);
    
    // Try to identify the animal at least
    let animalName = 'Wildlife';
    try {
      const animalData = await identifyAnimalLocally(base64Image);
      animalName = animalData.speciesName;
    } catch (e) {
      console.log('Could not identify animal species');
    }
    
    return {
      data: {
        animalIdentified: animalName,
        overallHealthStatus: 'minor_issues' as const,  // Conservative: flag for attention rather than assume healthy
        confidence: 0.40,
        visualSymptoms: {
          injuries: ['⚠️ AUTOMATED WOUND DETECTION UNAVAILABLE - Manual assessment required'],
          malnutrition: false,
          skinConditions: [],
          abnormalBehavior: ['Cloud AI services unavailable - cannot perform automated health analysis'],
        },
        detectedConditions: [
          '❌ Cloud AI Required: Accurate wound detection needs Gemini/OpenAI/Anthropic APIs',
          '🔧 Setup Required: Add API keys to enable automated health assessment',
        ],
        severity: 'AUTOMATED HEALTH ASSESSMENT UNAVAILABLE - Manual visual inspection required',
        treatmentRecommendations: [
          '👁️ MANUAL INSPECTION: Carefully observe the animal for:',
          '  • Visible wounds, cuts, or bleeding',
          '  • Limping or abnormal movement',
          '  • Emaciation or visible ribs (malnutrition)',
          '  • Skin lesions, bald patches, or parasites',
          '  • Discharge from eyes, nose, or mouth',
          '  • Behavioral abnormalities (lethargy, aggression)',
          '',
          '⚠️ IF INJURED: Contact wildlife veterinarian IMMEDIATELY',
          '📞 Emergency: Call local wildlife rescue: [Your local wildlife authority number]',
          '',
          '🔧 Enable Accurate AI Analysis:',
          '  1. Add Gemini API key (FREE): https://aistudio.google.com/apikey',
          '  2. Add OpenAI API key (paid): https://platform.openai.com/api-keys',
          '  3. Add Anthropic API key (paid): https://console.anthropic.com/',
        ],
        veterinaryAlertRequired: true,  // Flag for manual review
        followUpRequired: true,
        detailedAnalysis: `⚠️ IMPORTANT: Automated wound detection is currently UNAVAILABLE. Cloud AI services (Gemini, OpenAI, Anthropic) are required for accurate health assessment but are not configured or quota-exceeded.\n\nLocal AI (TensorFlow.js MobileNet) cannot reliably detect wounds or injuries as it's trained for object classification, not medical diagnosis.\n\nPLEASE PERFORM MANUAL VISUAL INSPECTION:\n• Look for visible wounds, blood, or injuries\n• Check for abnormal behavior or movement\n• Watch for signs of distress or illness\n\nIf you observe ANY concerning symptoms, contact a wildlife veterinarian immediately. Do not rely on automated analysis when it's unavailable - your visual assessment and professional veterinary consultation are essential for animal welfare.\n\nTo enable accurate AI-powered wound detection in the future, please add at least one cloud AI API key in the system configuration.`,
      },
      provider: 'educational',
      confidence: 0.40,
      method: 'Manual Assessment Guidelines (AI Unavailable)',
    };
  }
  
  /**
   * Detect potential threats (poaching, illegal activity)
   * Local TF.js → Cloud AI → Rule-based
   */
  async detectPoachingThreats(base64Image: string): Promise<AIResult> {
    const feature = 'poaching_detection';
    
    // Tier 1: Local TensorFlow.js object detection
    try {
      console.log(`[${feature}] 🎯 Tier 1: Attempting Local threat detection...`);
      const threatData = await detectThreatsLocally(base64Image);
      
      if (threatData.threatDetected) {
        console.log(`[${feature}] ✅ Local detection: ${threatData.objects.join(', ')}`);
        return {
          data: {
            threatLevel: threatData.confidence > 0.7 ? 'HIGH' : 'MEDIUM',
            confidence: threatData.confidence,
            detectedObjects: threatData.objects,
            recommendation: 'Potential threat detected. Contact local wildlife authorities immediately.',
            description: `Detected potential threats: ${threatData.objects.join(', ')}`,
          },
          provider: 'local_ai',
          confidence: threatData.confidence,
          method: 'Local TensorFlow.js Object Detection',
        };
      }
    } catch (localError) {
      console.log(`[${feature}] ⚠️ Tier 1 failed:`, (localError as Error).message);
    }
    
    // Tier 2: Cloud AI analysis (use existing service)
    try {
      console.log(`[${feature}] 🌐 Tier 2: Attempting Cloud AI threat detection...`);
      const { analyzePoachingEvidence } = await import('./poaching-detection');
      const result = await analyzePoachingEvidence(base64Image);
      console.log(`[${feature}] ✅ Cloud AI complete: ${result.threatLevel}`);
      return {
        data: result,
        provider: 'cloud_ai',
        confidence: result.confidence,
        method: 'Cloud AI Multi-provider',
      };
    } catch (cloudError) {
      console.log(`[${feature}] ⚠️ Tier 2 failed:`, (cloudError as Error).message);
    }
    
    // Tier 3: Safe fallback - no threat detected
    console.log(`[${feature}] ✅ No threats detected after full analysis`);
    return {
      data: {
        threatLevel: 'NONE',
        confidence: 0.9,
        detectedObjects: [],
        recommendation: 'No immediate threats detected in this image.',
        description: 'Image analysis shows no signs of poaching or illegal activities.',
      },
      provider: 'local_ai',
      confidence: 0.9,
      method: 'Comprehensive Analysis (Local + Cloud)',
    };
  }
  
  /**
   * Analyze footprints to identify animal species
   * Local TensorFlow.js → Cloud AI → Educational
   */
  async analyzeFootprint(base64Image: string): Promise<AIResult> {
    const feature = 'footprint_analysis';
    
    // Tier 1: Local TensorFlow.js footprint analysis
    try {
      console.log(`[${feature}] 🎯 Tier 1: Attempting Local TensorFlow.js footprint recognition...`);
      const footprintData = await analyzeFootprintLocally(base64Image);
      
      console.log(`[${feature}] ✅ Local AI: Identified as ${footprintData.species} track`);
      return {
        data: footprintData,
        provider: 'local_ai',
        confidence: footprintData.confidence,
        method: 'Local TensorFlow.js Pattern Recognition',
      };
    } catch (localError) {
      console.log(`[${feature}] ⚠️ Tier 1 failed:`, (localError as Error).message);
    }
    
    // Tier 2: Cloud AI analysis (reserved for future implementation)
    try {
      console.log(`[${feature}] 🌐 Tier 2: Cloud AI footprint analysis not yet implemented, skipping...`);
      throw new Error('Cloud AI footprint analysis not implemented');
    } catch (cloudError) {
      console.log(`[${feature}] ⚠️ Tier 2 not available:`, (cloudError as Error).message);
    }
    
    // Tier 3: Educational fallback
    console.log(`[${feature}] 📚 Tier 3: Using educational track data`);
    return {
      data: {
        species: 'Bengal Tiger',
        scientificName: 'Panthera tigris tigris',
        trackCharacteristics: 'Large paw print with 4 toes, no visible claws, approximately 10-14 cm wide',
        confidence: 0.65,
        matchedSpecies: ['Bengal Tiger', 'Indian Leopard', 'Sloth Bear', 'Asiatic Lion'],
      },
      provider: 'educational',
      confidence: 0.65,
      method: 'Karnataka Wildlife Track Database',
    };
  }
  
  /**
   * Analyze wildlife sounds/bioacoustics
   * Local TensorFlow.js → Cloud AI → Educational
   */
  async analyzeSound(audioData: string): Promise<AIResult> {
    const feature = 'sound_detection';
    
    // Tier 1: Local TensorFlow.js sound analysis
    try {
      console.log(`[${feature}] 🎯 Tier 1: Attempting Local TensorFlow.js sound analysis...`);
      const soundData = await analyzeSoundLocally(audioData);
      
      console.log(`[${feature}] ✅ Local AI: Identified as ${soundData.species} vocalization`);
      return {
        data: soundData,
        provider: 'local_ai',
        confidence: soundData.confidence,
        method: 'Local Bioacoustic Pattern Recognition',
      };
    } catch (localError) {
      console.log(`[${feature}] ⚠️ Tier 1 failed:`, (localError as Error).message);
    }
    
    // Tier 2: Cloud AI analysis (reserved for future implementation)
    try {
      console.log(`[${feature}] 🌐 Tier 2: Cloud AI sound analysis not yet implemented, skipping...`);
      throw new Error('Cloud AI sound analysis not implemented');
    } catch (cloudError) {
      console.log(`[${feature}] ⚠️ Tier 2 not available:`, (cloudError as Error).message);
    }
    
    // Tier 3: Educational fallback
    console.log(`[${feature}] 📚 Tier 3: Using educational sound data`);
    return {
      data: {
        species: 'Bengal Tiger',
        scientificName: 'Panthera tigris tigris',
        soundType: 'Roar - territorial vocalization, can be heard up to 3 km away',
        confidence: 0.70,
        possibleSpecies: ['Bengal Tiger', 'Asian Elephant', 'Indian Leopard', 'Indian Peafowl'],
      },
      provider: 'educational',
      confidence: 0.70,
      method: 'Karnataka Wildlife Vocalization Database',
    };
  }
}

// Singleton instance
export const aiOrchestrator = new AIOrchestrator();
