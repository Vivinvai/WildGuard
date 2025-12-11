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
  description?: string;
}

export async function analyzeAnimalImage(base64Image: string): Promise<AnimalAnalysisResult> {
  console.log("=== Animal Identification Pipeline ===");
  
  // PRIORITY 1: Try Gemini if API key is available (works well, free tier available)
  const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey !== "") {
    console.log("✓ Using Gemini AI (Free tier available, accurate identification)");
    try {
      const { analyzeAnimalWithGemini } = await import("./gemini");
      const geminiResult = await analyzeAnimalWithGemini(base64Image);
      console.log(`✓ Gemini identified: ${geminiResult.speciesName} (${(geminiResult.confidence * 100).toFixed(1)}% confidence)`);
      return geminiResult;
    } catch (geminiError) {
      console.log("✗ Gemini AI failed, trying OpenAI...", (geminiError as Error).message);
    }
  } else {
    console.log("ℹ No GOOGLE_API_KEY or GEMINI_API_KEY configured");
  }

  // PRIORITY 2: Try OpenAI if API key is available
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "default_key") {
    console.log("✓ Using OpenAI GPT-4o for identification");
    try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
    console.log(`✓ OpenAI identified: ${result.speciesName}`);
    
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
      console.log("✗ OpenAI failed, trying Anthropic...", (error as Error).message);
    }
  } else {
    console.log("ℹ No OPENAI_API_KEY configured");
  }

  // PRIORITY 3: Try Anthropic as final cloud option
  if (process.env.ANTHROPIC_API_KEY) {
    console.log("✓ Using Anthropic Claude for identification");
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: base64Image,
                },
              },
              {
                type: "text",
                text: `You are a wildlife identification expert. Analyze the uploaded image and identify the animal species. Provide detailed information about the animal including:
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
}`,
              },
            ],
          },
        ],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : "{}";
      const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
      const result = JSON.parse(cleanedText);
      
      console.log(`✓ Anthropic identified: ${result.speciesName}`);
      
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
      console.log("✗ Anthropic failed:", (error as Error).message);
    }
  } else {
    console.log("ℹ No ANTHROPIC_API_KEY configured");
  }

  // All cloud AI providers failed - throw error so orchestrator can try Local AI
  console.log("✗ All cloud AI providers failed or unavailable");
  throw new Error("All cloud AI providers failed - falling back to local processing");
}

// Legacy code below - preserved but unused after refactoring
const LEGACY_indianAnimals = [
    // Karnataka Wildlife
    {
      speciesName: "Bengal Tiger",
      scientificName: "Panthera tigris tigris",
      conservationStatus: "Endangered",
      population: "2,500-3,000 individuals in India",
      habitat: "Dense forests, grasslands, and mangrove swamps. Karnataka's Bandipur and Nagarhole National Parks.",
      threats: ["Poaching", "Habitat Loss", "Human-Wildlife Conflict"],
      confidence: 0.95,
    },
    {
      speciesName: "Asian Elephant",
      scientificName: "Elephas maximus",
      conservationStatus: "Endangered",
      population: "27,000-31,000 individuals in India",
      habitat: "Tropical forests and grasslands of Karnataka, including Bandipur and Nagarhole.",
      threats: ["Habitat Fragmentation", "Human-Elephant Conflict", "Poaching"],
      confidence: 0.93,
    },
    {
      speciesName: "Indian Leopard",
      scientificName: "Panthera pardus fusca",
      conservationStatus: "Vulnerable",
      population: "12,000-14,000 individuals in India",
      habitat: "Forests, grasslands, and rocky areas across Karnataka's Western Ghats.",
      threats: ["Habitat Loss", "Poaching", "Human-Wildlife Conflict"],
      confidence: 0.91,
    },
    {
      speciesName: "Indian Wild Dog (Dhole)",
      scientificName: "Cuon alpinus",
      conservationStatus: "Endangered",
      population: "2,500 individuals worldwide",
      habitat: "Dense forests and grasslands of Karnataka, particularly in Nagarhole and Bandipur.",
      threats: ["Habitat Loss", "Human-Wildlife Conflict", "Disease from Domestic Dogs"],
      confidence: 0.89,
    },
    {
      speciesName: "Sloth Bear",
      scientificName: "Melursus ursinus",
      conservationStatus: "Vulnerable",
      population: "10,000-20,000 individuals in India",
      habitat: "Dry deciduous forests and grasslands of Karnataka.",
      threats: ["Habitat Loss", "Human-Wildlife Conflict", "Poaching"],
      confidence: 0.87,
    },
    {
      speciesName: "Indian Giant Squirrel",
      scientificName: "Ratufa indica",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Deciduous and evergreen forests of Karnataka's Western Ghats.",
      threats: ["Deforestation", "Habitat Fragmentation"],
      confidence: 0.85,
    },
    {
      speciesName: "Gaur (Indian Bison)",
      scientificName: "Bos gaurus",
      conservationStatus: "Vulnerable",
      population: "13,000-30,000 individuals in India",
      habitat: "Dense forests and grasslands of Karnataka, especially in Bandipur.",
      threats: ["Habitat Loss", "Disease from Cattle", "Hunting"],
      confidence: 0.92,
    },
    {
      speciesName: "Sambar Deer",
      scientificName: "Rusa unicolor",
      conservationStatus: "Vulnerable",
      population: "Population declining",
      habitat: "Dense forests and grasslands across Karnataka.",
      threats: ["Hunting", "Habitat Loss", "Competition with Livestock"],
      confidence: 0.88,
    },
    {
      speciesName: "Chital (Spotted Deer)",
      scientificName: "Axis axis",
      conservationStatus: "Least Concern",
      population: "Population stable in protected areas",
      habitat: "Open forests and grasslands throughout Karnataka.",
      threats: ["Hunting", "Habitat Conversion"],
      confidence: 0.86,
    },
    {
      speciesName: "Wild Boar",
      scientificName: "Sus scrofa",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests, grasslands, and agricultural areas across Karnataka.",
      threats: ["Human-Wildlife Conflict", "Hunting"],
      confidence: 0.84,
    },
    {
      speciesName: "Langur (Hanuman Langur)",
      scientificName: "Semnopithecus entellus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests and urban areas throughout Karnataka.",
      threats: ["Habitat Loss", "Human-Wildlife Conflict"],
      confidence: 0.82,
    },
    {
      speciesName: "Bonnet Macaque",
      scientificName: "Macaca radiata",
      conservationStatus: "Vulnerable",
      population: "Population declining",
      habitat: "Forests and urban areas of Karnataka.",
      threats: ["Habitat Loss", "Human-Wildlife Conflict"],
      confidence: 0.80,
    },
    // Indian Birds of Karnataka
    {
      speciesName: "Indian Peafowl",
      scientificName: "Pavo cristatus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests, agricultural areas, and gardens throughout Karnataka.",
      threats: ["Habitat Loss", "Hunting"],
      confidence: 0.90,
    },
    {
      speciesName: "Great Indian Hornbill",
      scientificName: "Buceros bicornis",
      conservationStatus: "Vulnerable",
      population: "13,000-15,000 individuals globally",
      habitat: "Dense forests of Karnataka's Western Ghats.",
      threats: ["Deforestation", "Hunting", "Habitat Fragmentation"],
      confidence: 0.94,
    },
    {
      speciesName: "Malabar Pied Hornbill",
      scientificName: "Anthracoceros coronatus",
      conservationStatus: "Near Threatened",
      population: "Population declining",
      habitat: "Evergreen forests of Karnataka's Western Ghats.",
      threats: ["Deforestation", "Habitat Loss"],
      confidence: 0.88,
    },
    {
      speciesName: "Indian Roller",
      scientificName: "Coracias benghalensis",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Open countryside and agricultural areas in Karnataka.",
      threats: ["Pesticide Use", "Habitat Conversion"],
      confidence: 0.85,
    },
    {
      speciesName: "Black Kite",
      scientificName: "Milvus migrans",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Urban and rural areas throughout Karnataka.",
      threats: ["Pollution", "Habitat Degradation"],
      confidence: 0.83,
    },
    {
      speciesName: "Brahminy Kite",
      scientificName: "Haliastur indus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Wetlands and coastal areas of Karnataka.",
      threats: ["Pollution", "Habitat Loss"],
      confidence: 0.81,
    },
    // Reptiles
    {
      speciesName: "King Cobra",
      scientificName: "Ophiophagus hannah",
      conservationStatus: "Vulnerable",
      population: "Population declining",
      habitat: "Dense forests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss", "Human-Wildlife Conflict", "Hunting"],
      confidence: 0.92,
    },
    {
      speciesName: "Indian Rock Python",
      scientificName: "Python molurus",
      conservationStatus: "Near Threatened",
      population: "Population declining",
      habitat: "Forests and grasslands of Karnataka.",
      threats: ["Habitat Loss", "Hunting", "Collection for Pet Trade"],
      confidence: 0.89,
    },
    {
      speciesName: "Indian Star Tortoise",
      scientificName: "Geochelone elegans",
      conservationStatus: "Vulnerable",
      population: "Population declining",
      habitat: "Dry deciduous forests and scrublands of Karnataka.",
      threats: ["Collection for Pet Trade", "Habitat Loss"],
      confidence: 0.87,
    },
    {
      speciesName: "Monitor Lizard",
      scientificName: "Varanus bengalensis",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests, grasslands, and urban areas in Karnataka.",
      threats: ["Habitat Loss", "Hunting"],
      confidence: 0.84,
    },
    // Marine/Aquatic Life from Karnataka Coast
    {
      speciesName: "Olive Ridley Sea Turtle",
      scientificName: "Lepidochelys olivacea",
      conservationStatus: "Vulnerable",
      population: "Population declining",
      habitat: "Coastal waters and beaches of Karnataka.",
      threats: ["Fishing Nets", "Beach Development", "Pollution"],
      confidence: 0.91,
    },
    {
      speciesName: "Indian Flying Fox",
      scientificName: "Pteropus giganteus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests and urban areas throughout Karnataka.",
      threats: ["Habitat Loss", "Hunting"],
      confidence: 0.86,
    },
    // More Karnataka Endemic Species
    {
      speciesName: "Nilgiri Tahr",
      scientificName: "Nilgiritragus hylocrius",
      conservationStatus: "Endangered",
      population: "3,000 individuals",
      habitat: "High altitude grasslands of Western Ghats in Karnataka.",
      threats: ["Habitat Loss", "Invasive Species", "Hunting"],
      confidence: 0.93,
    },
    {
      speciesName: "Lion-tailed Macaque",
      scientificName: "Macaca silenus",
      conservationStatus: "Endangered",
      population: "4,000 individuals",
      habitat: "Rainforests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss", "Fragmentation"],
      confidence: 0.95,
    },
    {
      speciesName: "Malabar Giant Squirrel",
      scientificName: "Ratufa indica",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Deciduous forests of Karnataka's Western Ghats.",
      threats: ["Deforestation", "Hunting"],
      confidence: 0.88,
    },
    {
      speciesName: "Indian Pangolin",
      scientificName: "Manis crassicaudata",
      conservationStatus: "Endangered",
      population: "Population severely declining",
      habitat: "Forests and grasslands of Karnataka.",
      threats: ["Poaching", "Habitat Loss", "Illegal Trade"],
      confidence: 0.90,
    },
    {
      speciesName: "Rusty-spotted Cat",
      scientificName: "Prionailurus rubiginosus",
      conservationStatus: "Near Threatened",
      population: "10,000 individuals estimated",
      habitat: "Dry deciduous forests and grasslands of Karnataka.",
      threats: ["Habitat Loss", "Human-Wildlife Conflict"],
      confidence: 0.87,
    },
    {
      speciesName: "Jungle Cat",
      scientificName: "Felis chaus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Grasslands and agricultural areas in Karnataka.",
      threats: ["Habitat Conversion", "Human-Wildlife Conflict"],
      confidence: 0.85,
    },
    {
      speciesName: "Indian Jackal",
      scientificName: "Canis aureus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Open grasslands and agricultural areas in Karnataka.",
      threats: ["Human-Wildlife Conflict", "Habitat Loss"],
      confidence: 0.83,
    },
    // Birds unique to Western Ghats/Karnataka
    {
      speciesName: "Malabar Whistling Thrush",
      scientificName: "Myophonus horsfieldii",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Streams and forests of Karnataka's Western Ghats.",
      threats: ["Habitat Degradation"],
      confidence: 0.86,
    },
    {
      speciesName: "Indian Grey Hornbill",
      scientificName: "Ocyceros birostris",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Dry deciduous forests of Karnataka.",
      threats: ["Habitat Loss"],
      confidence: 0.84,
    },
    {
      speciesName: "White-bellied Treepie",
      scientificName: "Dendrocitta leucogastra",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss"],
      confidence: 0.82,
    },
    // Amphibians
    {
      speciesName: "Indian Bull Frog",
      scientificName: "Hoplobatrachus tigerinus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Wetlands and agricultural areas in Karnataka.",
      threats: ["Pollution", "Habitat Loss"],
      confidence: 0.80,
    },
    // Butterflies
    {
      speciesName: "Southern Birdwing",
      scientificName: "Troides minos",
      conservationStatus: "Near Threatened",
      population: "Population declining",
      habitat: "Forests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss", "Collection"],
      confidence: 0.88,
    },
    {
      speciesName: "Common Rose",
      scientificName: "Pachliopta aristolochiae",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Gardens and forests throughout Karnataka.",
      threats: ["Habitat Loss"],
      confidence: 0.85,
    },
    // Fish
    {
      speciesName: "Mahseer",
      scientificName: "Tor khudree",
      conservationStatus: "Endangered",
      population: "Population severely declining",
      habitat: "Rivers and streams of Karnataka.",
      threats: ["Dam Construction", "Pollution", "Overfishing"],
      confidence: 0.89,
    },
    // More mammals
    {
      speciesName: "Four-horned Antelope",
      scientificName: "Tetracerus quadricornis",
      conservationStatus: "Vulnerable",
      population: "10,000 individuals estimated",
      habitat: "Grasslands and open forests of Karnataka.",
      threats: ["Habitat Loss", "Hunting"],
      confidence: 0.86,
    },
    {
      speciesName: "Indian Muntjac",
      scientificName: "Muntiacus muntjak",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Dense forests of Karnataka.",
      threats: ["Hunting", "Habitat Loss"],
      confidence: 0.84,
    },
    {
      speciesName: "Indian Hare",
      scientificName: "Lepus nigricollis",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Grasslands and agricultural areas in Karnataka.",
      threats: ["Hunting", "Habitat Conversion"],
      confidence: 0.82,
    },
    {
      speciesName: "Indian Porcupine",
      scientificName: "Hystrix indica",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests and rocky areas of Karnataka.",
      threats: ["Hunting", "Habitat Loss"],
      confidence: 0.80,
    },
    // Additional endemic species
    {
      speciesName: "Grizzled Giant Squirrel",
      scientificName: "Ratufa macroura",
      conservationStatus: "Near Threatened",
      population: "Population declining",
      habitat: "Evergreen forests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss", "Fragmentation"],
      confidence: 0.91,
    },
    {
      speciesName: "Indian Giant Flying Squirrel",
      scientificName: "Petaurista philippensis",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Dense forests of Karnataka's Western Ghats.",
      threats: ["Deforestation"],
      confidence: 0.87,
    },
    // Additional bird species
    {
      speciesName: "Crimson-backed Sunbird",
      scientificName: "Leptocoma minima",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Gardens and forests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss"],
      confidence: 0.85,
    },
    {
      speciesName: "Small Sunbird",
      scientificName: "Cinnyris minimus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests of Karnataka's Western Ghats.",
      threats: ["Habitat Degradation"],
      confidence: 0.83,
    },
    {
      speciesName: "White-cheeked Barbet",
      scientificName: "Psilopogon viridis",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Forests of Karnataka's Western Ghats.",
      threats: ["Deforestation"],
      confidence: 0.84,
    },
    {
      speciesName: "Malabar Barbet",
      scientificName: "Psilopogon malabaricus",
      conservationStatus: "Least Concern",
      population: "Population stable",
      habitat: "Evergreen forests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss"],
      confidence: 0.86,
    },
    {
      speciesName: "Kerala Laughingthrush",
      scientificName: "Trochalopteron fairbanki",
      conservationStatus: "Vulnerable",
      population: "Population declining",
      habitat: "High altitude forests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss", "Climate Change"],
      confidence: 0.88,
    },
    {
      speciesName: "Nilgiri Flycatcher",
      scientificName: "Eumyias albicaudatus",
      conservationStatus: "Near Threatened",
      population: "Population declining",
      habitat: "High altitude forests of Karnataka's Western Ghats.",
      threats: ["Habitat Loss"],
      confidence: 0.87,
    }
  ];
