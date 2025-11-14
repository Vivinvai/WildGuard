import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IStorage } from "../storage";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export interface ChatbotResponse {
  message: string;
  intent: "sighting_query" | "weather_query" | "species_info" | "conservation_data" | "general";
  dataSource: "live_api" | "database" | "static" | "multiple";
  relatedData?: any;
}

export async function getWildlifeChatbotResponse(
  userMessage: string,
  storage: IStorage
): Promise<ChatbotResponse> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY not configured");
    }

    // Get live data from database
    const recentSightings = await storage.getAnimalSightings();
    const wildlifeCenters = await storage.getWildlifeCenters();

    // Build context for AI
    const sightingsContext = recentSightings.length > 0 
      ? `Recent animal sightings: ${recentSightings.slice(0, 5).map((s: any) => 
          `${s.location} - Status: ${s.animalStatus}`
        ).join('; ')}`
      : "No recent sightings";

    const centersContext = `Wildlife centers in Karnataka: ${wildlifeCenters.slice(0, 3).map((c: any) => c.name).join(', ')}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const prompt = `You are WildGuard Assistant, an AI chatbot helping with wildlife conservation in Karnataka, India.

Context:
- You have access to live wildlife sighting data
- You know about Karnataka's protected areas and wildlife centers
- You can provide species information, conservation status, and safety tips

Current Live Data:
${sightingsContext}
${centersContext}

User Question: "${userMessage}"

Provide a helpful, informative response. If the question is about:
- Recent sightings: Use the live data provided
- Species information: Provide detailed info about Indian wildlife
- Safety: Give practical wildlife encounter advice
- Conservation: Share conservation efforts and how users can help
- Centers/Locations: Mention the wildlife centers available

Respond in JSON format:
{
  "message": "Your detailed, helpful response",
  "intent": "sighting_query|weather_query|species_info|conservation_data|general",
  "dataSource": "live_api|database|static|multiple"
}

Be conversational, informative, and encourage wildlife conservation.`;

    const genResult = await model.generateContent(prompt);
    const responseText = genResult.response.text();
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanedText);

    return {
      message: result.message || "I'm here to help with wildlife conservation questions!",
      intent: result.intent || "general",
      dataSource: result.dataSource || "static",
      relatedData: result.intent === "sighting_query" ? recentSightings.slice(0, 3) : undefined,
    };
  } catch (error) {
    console.error("Chatbot error:", error);
    return {
      message: "I'm sorry, I encountered an error. Please try asking your question again.",
      intent: "general",
      dataSource: "static",
    };
  }
}
