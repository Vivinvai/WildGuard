import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SoundDetectionResult {
  speciesIdentified: string;
  scientificName: string;
  soundType: "call" | "song" | "alarm" | "territorial" | "distress";
  confidence: number;
  frequency: string;
  duration: number;
  conservationStatus: string;
  additionalNotes: string;
  habitatInfo: string;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function analyzeBioacousticSound(
  audioBase64: string,
  location?: { latitude: number; longitude: number }
): Promise<SoundDetectionResult> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are a wildlife bioacoustics expert analyzing animal sounds from India, particularly Karnataka.

Analyze this audio recording and identify the species making the sound.

Focus on:
- Bird calls, songs, and alarm calls
- Mammal vocalizations (tiger roars, elephant trumpets, deer calls)
- Reptile sounds (frog calls, snake hisses)
- Sound type classification (call, song, alarm, territorial, distress)
- Frequency characteristics
- Conservation status of the species

Provide detailed analysis in JSON format:
{
  "speciesIdentified": "Common species name",
  "scientificName": "Scientific name in Latin",
  "soundType": "call|song|alarm|territorial|distress",
  "confidence": 0.85,
  "frequency": "Frequency range (e.g., 2-4 kHz)",
  "duration": 3.5,
  "conservationStatus": "Least Concern|Near Threatened|Vulnerable|Endangered|Critically Endangered",
  "additionalNotes": "Detailed description of the sound characteristics",
  "habitatInfo": "Typical habitat and behavior context for this vocalization"
}

Be specific about Indian wildlife, particularly species found in Karnataka's forests and wildlife sanctuaries.`;

    const genResult = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: audioBase64,
          mimeType: "audio/mp3",
        },
      },
    ]);

    const responseText = genResult.response.text();
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanedText);

    return {
      speciesIdentified: result.speciesIdentified || "Unknown species",
      scientificName: result.scientificName || "Unknown",
      soundType: result.soundType || "call",
      confidence: result.confidence || 0.5,
      frequency: result.frequency || "Unknown",
      duration: result.duration || 0,
      conservationStatus: result.conservationStatus || "Unknown",
      additionalNotes: result.additionalNotes || "",
      habitatInfo: result.habitatInfo || "",
    };
  } catch (error) {
    console.error("Sound detection failed:", error);
    throw new Error("Failed to analyze bioacoustic sound: " + (error as Error).message);
  }
}
