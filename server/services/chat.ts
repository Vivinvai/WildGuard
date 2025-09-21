import OpenAI from "openai";
import { analyzeAnimalWithGemini } from "./gemini";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

export async function generateChatResponse(userMessage: string): Promise<string> {
  // Create a specialized prompt for wildlife conservation and endangered animals
  const systemPrompt = `You are WildGuard AI, a knowledgeable and passionate wildlife conservation expert. You specialize in:

- Endangered and threatened animal species
- Wildlife conservation efforts and strategies
- Habitat protection and restoration
- Human-wildlife conflict solutions
- Conservation success stories
- How individuals can help protect wildlife
- Environmental threats facing animals
- Protected areas and national parks
- Wildlife rehabilitation and rescue

Guidelines:
- Provide accurate, helpful information about wildlife conservation
- Be encouraging about conservation efforts
- Suggest actionable ways people can help
- Focus on endangered animals from Karnataka, India, and globally
- Be concise but informative (aim for 2-4 sentences unless more detail is requested)
- If asked about non-conservation topics, politely redirect to wildlife conservation
- Use a warm, educational tone that inspires people to care about wildlife

User question: ${userMessage}`;

  // Try OpenAI first if available
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "default_key") {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (content) {
        console.log("Chat response generated using OpenAI");
        return content.trim();
      }
    } catch (error) {
      console.error("OpenAI chat failed:", error);
    }
  }

  // Try Gemini AI as fallback
  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const result = await model.generateContent(systemPrompt);
      const response = result.response.text();
      
      if (response) {
        console.log("Chat response generated using Gemini");
        return response.trim();
      }
    } catch (error) {
      console.error("Gemini chat failed:", error);
    }
  }

  // Fallback to conservation knowledge base
  console.log("Both AI services failed, using conservation knowledge fallback");
  return generateConservationResponse(userMessage);
}

function generateConservationResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Basic keyword-based responses for common conservation questions
  if (message.includes('tiger') || message.includes('bengal tiger')) {
    return "🐅 Bengal Tigers are critically endangered with only 2,500-3,000 left in India. They face threats from poaching, habitat loss, and human-wildlife conflict. You can help by supporting tiger conservation organizations, avoiding products made from tiger parts, and visiting responsible wildlife sanctuaries that fund conservation efforts.";
  }
  
  if (message.includes('elephant') || message.includes('asian elephant')) {
    return "🐘 Asian Elephants are endangered with 27,000-31,000 individuals in India. Major threats include habitat fragmentation and human-elephant conflict. Support conservation by adopting sustainable palm oil practices, supporting corridor creation projects, and donating to elephant rescue centers.";
  }
  
  if (message.includes('leopard') || message.includes('indian leopard')) {
    return "🐆 Indian Leopards are vulnerable with 12,000-14,000 individuals. They're remarkably adaptable but face habitat loss and retaliatory killing. Help by supporting livestock protection programs that reduce human-leopard conflict and promoting coexistence strategies in rural communities.";
  }
  
  if (message.includes('rhinoceros') || message.includes('rhino')) {
    return "🦏 Rhinos are critically endangered due to poaching for their horns. Greater One-horned Rhinos have recovered from near extinction thanks to conservation efforts. Support anti-poaching units, rhino sanctuaries, and education programs that reduce demand for rhino horn products.";
  }
  
  if (message.includes('orangutan')) {
    return "🦧 Orangutans are critically endangered with habitat destruction being the main threat. Support sustainable palm oil, avoid products causing deforestation, and donate to orangutan rehabilitation centers. Each purchase decision can help protect their rainforest homes.";
  }
  
  if (message.includes('panda') || message.includes('giant panda')) {
    return "🐼 Giant Pandas have recovered from 'Endangered' to 'Vulnerable' status! This conservation success story shows what's possible. Support panda conservation through WWF, visit responsible zoos that fund field conservation, and protect bamboo forest habitats.";
  }
  
  if (message.includes('polar bear')) {
    return "🐻‍❄️ Polar Bears are threatened by climate change as Arctic ice melts. Reduce your carbon footprint, support renewable energy, and advocate for climate action. Small changes in energy use can help preserve their icy habitat.";
  }
  
  if (message.includes('coral') || message.includes('reef')) {
    return "🐠 Coral reefs support 25% of marine species but are threatened by climate change and pollution. Help by using reef-safe sunscreen, reducing carbon emissions, and supporting marine protected areas. Healthy oceans support countless endangered marine species.";
  }
  
  if (message.includes('forest') || message.includes('deforestation')) {
    return "🌳 Forests are home to 80% of terrestrial species. Combat deforestation by choosing sustainable products, reducing paper use, and supporting reforestation projects. Every tree saved helps protect countless endangered species that depend on forest habitats.";
  }
  
  if (message.includes('help') || message.includes('what can i do')) {
    return "🌍 You can help endangered animals by: 1) Supporting conservation organizations, 2) Making sustainable consumer choices, 3) Reducing your carbon footprint, 4) Volunteering for local wildlife projects, 5) Spreading awareness about conservation issues. Every action counts!";
  }
  
  if (message.includes('karnataka') || message.includes('bandipur') || message.includes('nagarhole')) {
    return "🌿 Karnataka's Western Ghats are a biodiversity hotspot! Visit Bandipur and Nagarhole National Parks responsibly. These parks protect tigers, elephants, and many endemic species. Support eco-tourism that funds conservation and provides alternative livelihoods for local communities.";
  }
  
  if (message.includes('climate change') || message.includes('global warming')) {
    return "🌡️ Climate change is a major threat to wildlife, altering habitats and migration patterns. Combat it by using renewable energy, supporting climate-friendly policies, and reducing consumption. Protecting the planet's climate protects endangered species worldwide.";
  }
  
  // General conservation response
  return "🦎 Wildlife conservation is crucial for maintaining biodiversity and healthy ecosystems. Every species plays a vital role in their habitat. You can help by supporting conservation organizations, making sustainable choices, and spreading awareness about endangered animals. What specific animal or conservation topic would you like to learn about?";
}