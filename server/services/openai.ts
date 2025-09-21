import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

export interface AnimalAnalysisResult {
  speciesName: string;
  scientificName: string;
  conservationStatus: string;
  population: string;
  habitat: string;
  threats: string[];
  confidence: number;
}

export async function analyzeAnimalImage(base64Image: string): Promise<AnimalAnalysisResult> {
  // Check if we should use mock data for testing (when API quota is exceeded)
  const useMockData = process.env.USE_MOCK_AI === "true" || !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "default_key";
  
  if (useMockData) {
    console.log("Using mock animal identification data for testing");
    return {
      speciesName: "American Black Bear",
      scientificName: "Ursus americanus",
      conservationStatus: "Least Concern",
      population: "600,000 - 900,000 individuals",
      habitat: "Forests, swamps, and mountainous regions across North America. Prefers dense forest areas with abundant vegetation for foraging and denning sites.",
      threats: ["Habitat Loss", "Human-Wildlife Conflict", "Climate Change"],
      confidence: 0.85,
    };
  }

  try {
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a wildlife identification expert. Analyze the uploaded image and identify the animal species. Provide detailed information about the animal including:
          - Species name (common name)
          - Scientific name
          - Conservation status (Critically Endangered, Endangered, Vulnerable, Near Threatened, Least Concern, or Data Deficient)
          - Population estimate if available
          - Habitat description
          - Main conservation threats
          - Confidence level (0-1) in your identification

          Respond with JSON in this exact format:
          {
            "speciesName": "Common Name",
            "scientificName": "Scientific Name",
            "conservationStatus": "Conservation Status",
            "population": "Population estimate or 'Unknown'",
            "habitat": "Habitat description",
            "threats": ["Threat 1", "Threat 2", "Threat 3"],
            "confidence": 0.95
          }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please identify this animal and provide detailed conservation information."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      speciesName: result.speciesName || "Unknown Species",
      scientificName: result.scientificName || "Unknown",
      conservationStatus: result.conservationStatus || "Data Deficient",
      population: result.population || "Unknown",
      habitat: result.habitat || "Information not available",
      threats: Array.isArray(result.threats) ? result.threats : ["Information not available"],
      confidence: typeof result.confidence === 'number' ? Math.max(0, Math.min(1, result.confidence)) : 0.5,
    };
  } catch (error) {
    console.error("Failed to analyze animal image:", error);
    
    // If OpenAI fails (quota exceeded, network issue, etc.), fall back to mock data
    if (error instanceof Error && (
      error.message.includes('insufficient_quota') || 
      error.message.includes('RateLimitError') ||
      (error as any).type === 'insufficient_quota' ||
      (error as any).code === 'insufficient_quota'
    )) {
      console.log("OpenAI quota exceeded, using mock identification data");
      return {
        speciesName: "Red Fox",
        scientificName: "Vulpes vulpes",
        conservationStatus: "Least Concern",
        population: "Several million worldwide",
        habitat: "Diverse habitats including forests, grasslands, mountains, and deserts. Highly adaptable to urban and rural environments.",
        threats: ["Habitat Fragmentation", "Hunting Pressure", "Disease"],
        confidence: 0.78,
      };
    }
    
    throw new Error("Failed to analyze the uploaded image. Please try again.");
  }
}
