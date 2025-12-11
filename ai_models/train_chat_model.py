"""
Custom Wildlife Conservation Chat AI
Trains a lightweight neural network on common wildlife questions
"""

import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
import pickle

# Training data - Comprehensive wildlife conservation questions and answers
TRAINING_DATA = [
    # Asiatic Lions (Enhanced)
    {
        "question": "Tell me about Asiatic Lions",
        "answer": "🦁 Asiatic Lions are critically endangered with only about 674 individuals (2020 census) living exclusively in Gir Forest National Park, Gujarat, India. They're slightly smaller than African lions with distinctive belly folds and less developed manes. Their population recovered remarkably from just 20 lions in 1913 through dedicated conservation efforts."
    },
    {
        "question": "Where do Asiatic Lions live?",
        "answer": "🦁 Asiatic Lions are found only in Gir Forest National Park and the surrounding Gir landscape in Gujarat, India - their last remaining natural habitat globally. They inhabit dry deciduous forests, scrublands, and grasslands across approximately 1,400 sq km."
    },
    {
        "question": "How many Asiatic Lions are left?",
        "answer": "🦁 As of 2020, there are 674 Asiatic Lions in the wild, all in Gujarat's Gir landscape. This represents a remarkable conservation success - the population was down to just 20 individuals in 1913. Numbers have grown steadily due to protection and habitat management."
    },
    {
        "question": "What do Asiatic Lions eat?",
        "answer": "🦁 Asiatic Lions primarily hunt chital (spotted deer), sambar deer, nilgai (blue bull), wild boar, and domestic livestock. They hunt cooperatively, with lionesses doing most hunting. An adult lion needs 5-7 kg of meat daily but can consume up to 25 kg in one meal."
    },
    {
        "question": "Why are Asiatic Lions endangered?",
        "answer": "🦁 Asiatic Lions are endangered due to limited range (only Gir Forest), small population size making them vulnerable to disease outbreaks, human-lion conflict, poaching, and genetic bottleneck effects. All lions are descended from a tiny founder population, reducing genetic diversity."
    },
    {
        "question": "asiatic lion",
        "answer": "🦁 Asiatic Lions (Panthera leo persica) are a subspecies found only in India's Gir Forest. They differ from African lions with sparser manes, pronounced belly folds, and smaller size. Once ranged from Turkey to India, now restricted to 1,400 sq km in Gujarat with 674 individuals."
    },
    
    # Bengal Tigers (Enhanced with more variations)
    {
        "question": "Tell me about Bengal Tigers",
        "answer": "🐅 Bengal Tigers (Panthera tigris tigris) are India's national animal with 2,967 individuals (2018 census) - 70% of world's wild tigers. They're apex predators weighing 180-260 kg, measuring up to 3.1m in length. Found in diverse habitats from Himalayan foothills to mangrove swamps, they face threats from poaching, habitat loss, and prey depletion."
    },
    {
        "question": "How many tigers are left in India?",
        "answer": "🐅 India has 2,967 Bengal Tigers (2018 census), representing about 70% of the global wild tiger population. Major populations are in Sundarbans (96), Corbett (231), Bandipur-Nagarhole complex (143), Kaziranga (104), and Ranthambore (71). Tiger numbers increased from 1,411 in 2006."
    },
    {
        "question": "What threatens tigers?",
        "answer": "🐅 Bengal Tigers face multiple critical threats: 1) Poaching for bones, skin, and body parts used in traditional medicine (black market value: $10,000-50,000 per tiger), 2) Habitat loss and fragmentation from deforestation, 3) Prey depletion from illegal hunting, 4) Human-wildlife conflict, and 5) Climate change affecting Sundarbans habitat."
    },
    {
        "question": "tiger",
        "answer": "🐅 Tigers are the largest cat species and India's national animal. Bengal Tigers are endangered with 2,967 in India. They're solitary hunters covering territories of 20-100 sq km, hunt deer and wild boar, and are crucial for ecosystem balance. Project Tiger (1973) helped double their population."
    },
    {
        "question": "bengal tiger",
        "answer": "🐅 Bengal Tigers are the most numerous tiger subspecies with 2,967 in India. They inhabit diverse ecosystems - tropical rainforests, mangroves, deciduous forests, and grasslands. Adult males weigh 220kg, females 140kg. They're solitary, territorial, and can take down prey twice their size."
    },
    {
        "question": "What do tigers eat?",
        "answer": "🐅 Tigers are carnivores feeding on deer (chital, sambar, barasingha), wild pigs, nilgai, gaur, and water buffalo. They need 15-20 kg meat weekly, hunting every 5-6 days. They ambush prey, using powerful jaws for a fatal neck bite. Can drag prey weighing 200+ kg."
    },
    {
        "question": "How fast can tigers run?",
        "answer": "🐅 Tigers can run at speeds of 49-65 km/h (30-40 mph) in short bursts of 10-20 seconds. They're not endurance runners but excellent ambush predators, relying on stealth and surprise rather than speed. They can leap 8-10 meters horizontally and 4-5 meters vertically."
    },
    
    # Asian Elephants
    {
        "question": "Tell me about Asian Elephants",
        "answer": "🐘 Asian Elephants are endangered with 27,000-31,000 individuals in India. They're smaller than African elephants with smaller ears and only some males have tusks. They face threats from habitat fragmentation, human-elephant conflict (crop raiding), and poaching for ivory and meat."
    },
    {
        "question": "Why are elephants endangered?",
        "answer": "🐘 Asian Elephants are endangered due to severe habitat loss (80% lost in recent decades), fragmentation of elephant corridors, human-elephant conflict over agricultural land, and poaching. They need vast ranges but are increasingly confined to isolated forest patches."
    },
    {
        "question": "How can we protect elephants?",
        "answer": "🐘 Protect elephants by: supporting elephant corridors to connect fragmented habitats, using early warning systems to prevent crop raiding, avoiding products made from ivory, supporting anti-poaching efforts, and backing organizations working on human-elephant coexistence."
    },
    
    # Indian Rhinoceros
    {
        "question": "Tell me about Indian Rhinoceros",
        "answer": "🦏 Indian Rhinoceros (Greater One-Horned Rhino) is vulnerable with about 3,700 individuals. They're the second-largest land mammal in Asia, have a single horn, and thick armor-like skin. Found mainly in Kaziranga and Manas National Parks. Conservation success story - recovered from less than 200 in 1900s."
    },
    {
        "question": "Where are Indian rhinos found?",
        "answer": "🦏 Indian Rhinoceros are found primarily in Northeast India (Assam) and Nepal. Kaziranga National Park in Assam hosts the largest population with over 2,400 rhinos. They prefer tall grasslands and riverine forests."
    },
    
    # Snow Leopards
    {
        "question": "Tell me about Snow Leopards",
        "answer": "❄️🐆 Snow Leopards are endangered big cats living in the Himalayas at 3,000-4,500m elevation. India has 400-700 snow leopards in Ladakh, Himachal Pradesh, Uttarakhand, Sikkim, and Arunachal Pradesh. They face threats from poaching, prey depletion, and human-wildlife conflict."
    },
    {
        "question": "Where do snow leopards live?",
        "answer": "❄️🐆 Snow Leopards inhabit high-altitude regions (3,000-4,500m) in the Himalayas. In India, they're found in Ladakh, Himachal Pradesh, Uttarakhand, Sikkim, and Arunachal Pradesh. They prefer rocky, barren terrain with cliffs and ridges."
    },
    
    # Red Pandas
    {
        "question": "Tell me about Red Pandas",
        "answer": "🐼 Red Pandas are endangered with less than 10,000 left globally. In India, they're found in Sikkim, West Bengal (Darjeeling), and Arunachal Pradesh. They live in temperate forests at 2,200-4,800m elevation and eat primarily bamboo. Habitat loss and fragmentation are major threats."
    },
    
    # Indian Wild Dogs (Dholes)
    {
        "question": "Tell me about Dholes",
        "answer": "🐕 Dholes (Indian Wild Dogs) are endangered wild canids with only 2,500 left in India. They live in packs, are excellent hunters, and play a crucial role in ecosystem balance. Found in Western Ghats, Central India, and Northeast. Threats include habitat loss, prey depletion, and disease from domestic dogs."
    },
    
    # Sloth Bears
    {
        "question": "Tell me about Sloth Bears",
        "answer": "🐻 Sloth Bears are vulnerable and found across India. They're insectivores with a specialized diet of termites and ants, using their long claws and lips to extract insects. Face threats from habitat loss, poaching for bile and body parts, and human-bear conflict."
    },
    
    # Great Indian Bustard
    {
        "question": "Tell me about Great Indian Bustard",
        "answer": "🦅 Great Indian Bustard is critically endangered with less than 150 individuals left. One of India's heaviest flying birds, found in grasslands of Rajasthan, Gujarat, and Maharashtra. Main threats are power line collisions, habitat loss to agriculture, and hunting."
    },
    
    # Gharials
    {
        "question": "Tell me about Gharials",
        "answer": "🐊 Gharials are critically endangered crocodilians with distinctive long, narrow snouts. Less than 650 adults remain in rivers of North India and Nepal. They're fish-eaters and harmless to humans. Threats include river pollution, dam construction, fishing nets, and sand mining."
    },
    
    # Ganges River Dolphins
    {
        "question": "Tell me about Ganges Dolphins",
        "answer": "🐬 Ganges River Dolphins are endangered freshwater dolphins with about 2,500-3,000 left. They're blind (use echolocation) and found in Ganges-Brahmaputra river systems. Major threats are river pollution, dam construction, fishing nets, and boat traffic."
    },
    
    # Western Ghats Biodiversity
    {
        "question": "What wildlife is in Western Ghats?",
        "answer": "🌿 Western Ghats is a UNESCO World Heritage Site and biodiversity hotspot. Home to Bengal Tigers, Asian Elephants, Lion-tailed Macaques, Nilgiri Tahr, Malabar Giant Squirrels, King Cobras, and over 325 globally threatened species. Contains 27% of India's plant species despite covering only 6% of land."
    },
    {
        "question": "Why are Western Ghats important?",
        "answer": "🌿 Western Ghats are one of world's 8 biodiversity hotspots with exceptional endemism - 325 globally threatened species, 178 amphibian species (138 endemic), and 508 bird species. They regulate monsoons, provide water to 245 million people, and harbor ancient rainforests older than Himalayas."
    },
    
    # Conservation Actions
    {
        "question": "How can I help wildlife conservation?",
        "answer": "🌍 You can help by: 1) Supporting wildlife NGOs financially, 2) Avoiding products from endangered species (ivory, tiger parts, etc.), 3) Reducing plastic use, 4) Supporting sustainable tourism at national parks, 5) Spreading awareness, 6) Planting native trees, 7) Reporting wildlife crimes, 8) Choosing eco-friendly products."
    },
    {
        "question": "What is wildlife conservation?",
        "answer": "🌍 Wildlife conservation protects animal and plant species from extinction through habitat protection, anti-poaching efforts, captive breeding, wildlife corridors, community involvement, and policy advocacy. It maintains biodiversity, ecosystem balance, and ensures future generations can experience wild nature."
    },
    {
        "question": "Why is conservation important?",
        "answer": "🌍 Conservation is crucial because: biodiversity maintains ecosystem balance, wildlife provides economic benefits through tourism, many medicines come from wild plants/animals, ecosystems provide services like clean air/water, and every species has intrinsic value. Mass extinction threatens human survival."
    },
    
    # Medicinal Plants
    {
        "question": "Tell me about medicinal plants in India",
        "answer": "🌿💊 India has over 8,000 medicinal plant species. Important ones include Neem (antibacterial), Tulsi/Holy Basil (immunity), Ashwagandha (stress relief), Turmeric (anti-inflammatory), Brahmi (brain health), and Aloe Vera (skin care). Many are endangered due to over-harvesting."
    },
    {
        "question": "What is Neem used for?",
        "answer": "🌿 Neem tree has powerful antibacterial, antifungal, and antiviral properties. Used for skin diseases, dental care, pest control, and boosting immunity. Every part - leaves, bark, seeds, oil - has medicinal value. It's called 'village pharmacy' in India."
    },
    {
        "question": "What is Tulsi?",
        "answer": "🌿 Tulsi (Holy Basil) is a sacred medicinal plant with strong immunity-boosting, anti-stress, and respiratory benefits. Rich in antioxidants, it helps with cough, cold, fever, and anxiety. Revered in Hinduism and found in most Indian homes."
    },
    
    # Sacred Trees
    {
        "question": "What are sacred trees in India?",
        "answer": "🌳 Sacred trees in India include Peepal (Bodhi tree - Buddha's enlightenment), Banyan (national tree), Neem (village deity), Tulsi (holy basil), Bel (Lord Shiva), and Ashoka (sorrowless tree). These trees are protected through religious reverence, aiding conservation."
    },
    {
        "question": "Why is Peepal tree sacred?",
        "answer": "🌳 Peepal (Bodhi tree) is sacred because Buddha attained enlightenment under it. Worshipped in Hinduism, Buddhism, and Jainism. It releases oxygen even at night, making it ecologically valuable. Often found near temples and protected by communities."
    },
    
    # National Parks
    {
        "question": "What are major national parks in India?",
        "answer": "🏞️ Major national parks: Jim Corbett (first NP, tigers), Kaziranga (rhinos), Ranthambore (tigers), Gir (Asiatic lions), Sundarbans (mangrove tigers), Bandhavgarh (highest tiger density), Kanha (Barasingha), Periyar (elephants), and Hemis (snow leopards)."
    },
    {
        "question": "Tell me about Jim Corbett National Park",
        "answer": "🏞️ Jim Corbett National Park (1936) is India's oldest national park in Uttarakhand. Named after hunter-turned-conservationist Jim Corbett, it's famous for Bengal Tigers and was first to come under Project Tiger (1973). Home to 600+ elephant species and 600+ bird species."
    },
    
    # Climate Change Impact
    {
        "question": "How does climate change affect wildlife?",
        "answer": "🌡️ Climate change threatens wildlife through: habitat loss (melting glaciers for snow leopards, rising seas for Sundarbans tigers), altered food availability, disease spread, coral bleaching, shifted migration patterns, and extreme weather events. Polar and mountain species are most vulnerable."
    },
    {
        "question": "What is habitat loss?",
        "answer": "🌳 Habitat loss is the destruction or degradation of natural environments where species live. Caused by deforestation, urbanization, agriculture, mining, and infrastructure. It's the #1 threat to wildlife - 80% of endangered species are threatened by habitat loss."
    },
    
    # Human-Wildlife Conflict
    {
        "question": "What is human-wildlife conflict?",
        "answer": "⚠️ Human-wildlife conflict occurs when wildlife needs overlap with human activities, causing damage or danger. Examples: elephants raiding crops, leopards attacking livestock, tigers entering villages. Solutions include early warning systems, compensation schemes, wildlife corridors, and community involvement."
    },
    {
        "question": "How to prevent crop raiding by elephants?",
        "answer": "🐘 Prevent elephant crop raiding with: electric fences, early warning systems (SMS alerts), beehive fences (elephants fear bees), chili-tobacco smoke, trenches, community watch programs, and cultivating crops elephants dislike. Compensation for affected farmers is also important."
    },
    
    # Poaching
    {
        "question": "What is poaching?",
        "answer": "🚫 Poaching is illegal hunting/capturing of wild animals. Driven by demand for ivory, tiger bones, rhino horns, pangolin scales, and exotic pets. Despite bans, organized crime networks fuel poaching. Anti-poaching involves rangers, technology (drones, camera traps), and reducing demand."
    },
    {
        "question": "How to stop poaching?",
        "answer": "🚫 Stop poaching through: 1) Stricter law enforcement and penalties, 2) Technology (drones, AI, camera traps), 3) Community ranger programs, 4) Reducing demand through awareness, 5) Alternative livelihoods for former poachers, 6) International cooperation, 7) Forensic wildlife crime labs."
    },
    
    # Endangered Species Act
    {
        "question": "What is Wildlife Protection Act?",
        "answer": "📜 Wildlife Protection Act 1972 is India's primary law for wildlife conservation. Provides protection to endangered species, establishes national parks/sanctuaries, prohibits hunting, regulates trade, and prescribes penalties. Schedule I species (tigers, elephants, rhinos) get absolute protection."
    },
    
    # Specific Flora
    {
        "question": "What is Neelakurinji?",
        "answer": "💜 Neelakurinji (Strobilanthes kunthiana) is a rare shrub that blooms once in 12 years, covering Western Ghats hills in purple-blue flowers. Next bloom expected in 2030. Found in Kerala and Tamil Nadu. The name means 'blue mountain flower' in Malayalam."
    },
    {
        "question": "What are endangered plants in India?",
        "answer": "🌱 Endangered plants in India include: Neelakurinji (12-year bloom cycle), Pitcher Plants (insectivorous), Sapria himalayana (parasitic flower), Blue Vanda (orchid), Malabar Lily, Assam Catkin Yew, and many medicinal plants like Sarpagandha, Kuth, and Jatamansi due to over-harvesting."
    },
    
    # Ecosystem Services
    {
        "question": "What are ecosystem services?",
        "answer": "🌍 Ecosystem services are benefits nature provides: 1) Provisioning (food, water, medicine), 2) Regulating (climate, floods, disease), 3) Supporting (pollination, soil formation, oxygen), 4) Cultural (recreation, spiritual). Estimated value: $125 trillion/year globally."
    },
    
    # Pollinators
    {
        "question": "Why are pollinators important?",
        "answer": "🐝 Pollinators (bees, butterflies, birds, bats) are crucial for 75% of food crops and 90% of wild plants. They contribute to ₹60,000+ crore annually to Indian agriculture. Threats include pesticides, habitat loss, and climate change. Pollinator decline threatens food security."
    },
    {
        "question": "How to help pollinators?",
        "answer": "🐝 Help pollinators by: planting native flowering plants, avoiding pesticides, creating bee hotels, leaving wild areas in gardens, planting diverse flowers (different bloom times), providing water sources, and supporting organic farming. Even small gardens make a difference!"
    },
    
    # Invasive Species
    {
        "question": "What are invasive species?",
        "answer": "🚨 Invasive species are non-native organisms that harm ecosystems. In India: Water Hyacinth (clogs water bodies), Lantana (chokes forests), African Catfish (threatens native fish), Prosopis juliflora (alters grasslands). They outcompete native species and disrupt ecosystem balance."
    },
    
    # Karnataka Specific
    {
        "question": "What wildlife is in Karnataka?",
        "answer": "🐅 Karnataka has exceptional wildlife: 524 tigers (highest in India), 6,000+ elephants, Asiatic Wild Dogs, Sloth Bears, Leopards, Gaur (Indian Bison), Lion-tailed Macaques, and 500+ bird species. Major reserves: Bandipur, Nagarhole, Bannerghatta, Dandeli-Anshi, and Bhadra."
    },
    {
        "question": "Tell me about Bandipur National Park",
        "answer": "🐅 Bandipur National Park (Karnataka) is part of Nilgiri Biosphere Reserve and has one of India's highest tiger and elephant populations. 874 sq km of deciduous forests. Part of the world's largest wild tiger population corridor. Also home to Dholes, Gaur, and 200+ bird species."
    },
    
    # General Questions
    {
        "question": "Hello",
        "answer": "🌿 Hello! I'm WildGuard AI, your wildlife and flora conservation assistant. I can help you learn about endangered species, conservation efforts, medicinal plants, national parks, and how you can help protect nature. What would you like to know?"
    },
    {
        "question": "Hi",
        "answer": "🌿 Hi there! I specialize in wildlife and plant conservation, especially species from India and Karnataka. Ask me about endangered animals, medicinal plants, conservation strategies, or how you can make a difference!"
    },
    {
        "question": "Thank you",
        "answer": "🌿 You're welcome! Remember, every action counts in conservation - spread awareness, reduce plastic, support wildlife organizations, and respect nature. Together we can protect our incredible biodiversity! 🌍"
    },
    {
        "question": "What can you do?",
        "answer": "🌿 I can help you with: 1) Information about endangered species (tigers, elephants, rhinos, etc.), 2) Medicinal plants and their uses, 3) Sacred trees and flora, 4) Conservation strategies, 5) National parks and wildlife reserves, 6) How you can help wildlife, 7) Human-wildlife conflict solutions. What interests you?"
    },
    
    # More specific animals
    {
        "question": "Tell me about Indian Pangolin",
        "answer": "🦔 Indian Pangolin is critically endangered and the world's most trafficked mammal. They're scaly anteaters with protective armor, eat ants/termites, and are harmless. Poached for scales (false medicinal claims) and meat. India has strict protection laws but illegal trade continues."
    },
    {
        "question": "What is Lion-tailed Macaque?",
        "answer": "🐒 Lion-tailed Macaque is an endangered primate endemic to Western Ghats rainforests. Named for its lion-like tail tuft, has a silver mane and black body. Only 3,500-4,000 remain due to habitat loss. Found in Karnataka, Kerala, and Tamil Nadu."
    },
    {
        "question": "Tell me about Nilgiri Tahr",
        "answer": "🐐 Nilgiri Tahr is an endangered mountain goat endemic to Western Ghats (Nilgiri Hills, Anamalai, Periyar). Males have curved horns and saddle-shaped coat. About 3,000 remain. Tamil Nadu's state animal. Threats include habitat loss and poaching."
    },
    {
        "question": "What is Indian Giant Squirrel?",
        "answer": "🐿️ Indian Giant Squirrel (Malabar Giant Squirrel) is a large, colorful squirrel endemic to Indian forests. Can be purple, maroon, orange with white patches. Lives in Western Ghats and Eastern Ghats canopy. Vulnerable due to deforestation but not critically endangered."
    },
    
    # More conservation topics
    {
        "question": "What is Project Tiger?",
        "answer": "🐅 Project Tiger (1973) is India's flagship conservation program to save Bengal Tigers from extinction. Started with 9 tiger reserves, now 53. Combines habitat protection, anti-poaching, prey base conservation, and community involvement. India's tiger population increased from 1,411 (2006) to ~3,000 (2022)."
    },
    {
        "question": "What is Project Elephant?",
        "answer": "🐘 Project Elephant (1992) aims to protect elephants, their habitat, and migration corridors. Addresses human-elephant conflict, provides veterinary care, and involves local communities. India has 33 elephant reserves covering 65,814 sq km across 14 states."
    },
    {
        "question": "What is biodiversity?",
        "answer": "🌈 Biodiversity is the variety of all life on Earth - species, genes, and ecosystems. India is a megadiverse country with 7-8% of world's species despite having only 2.4% of land. Biodiversity provides food, medicine, climate regulation, and cultural value."
    },
    {
        "question": "What is an ecosystem?",
        "answer": "🌿 An ecosystem is a community of living organisms (plants, animals, microbes) interacting with their non-living environment (water, air, soil, climate). Examples: forests, grasslands, wetlands, coral reefs. Each organism plays a role in maintaining balance."
    },
    {
        "question": "What is a food chain?",
        "answer": "🍽️ A food chain shows energy transfer in an ecosystem: plants (producers) → herbivores (primary consumers) → carnivores (secondary consumers) → apex predators. Example: Grass → Deer → Tiger. Removing any link disrupts the entire ecosystem."
    },
    
    # Wetlands and Marine
    {
        "question": "What are wetlands?",
        "answer": "💧 Wetlands are areas where water covers soil seasonally or permanently - marshes, swamps, mangroves, lakes. They're biodiversity hotspots, filter water, control floods, recharge groundwater, and sequester carbon. India has 49 Ramsar sites (internationally important wetlands)."
    },
    {
        "question": "Tell me about Sundarbans",
        "answer": "🌊 Sundarbans is the world's largest mangrove forest (10,000 sq km) in India-Bangladesh. UNESCO World Heritage Site, home to Bengal Tigers (swimming tigers!), saltwater crocodiles, Gangetic dolphins, and Olive Ridley turtles. Severely threatened by rising sea levels and cyclones."
    },
    {
        "question": "What are coral reefs?",
        "answer": "🪸 Coral reefs are underwater ecosystems with immense biodiversity - called 'rainforests of the sea'. India has reefs in Andaman & Nicobar, Lakshadweep, Gulf of Mannar, and Gulf of Kutch. Threatened by warming waters (bleaching), pollution, and overfishing."
    },
    
    # More plants
    {
        "question": "What is Sandalwood?",
        "answer": "🌳 Sandalwood (Chandan) is a valuable tree native to South India, prized for fragrant heartwood used in perfumes, cosmetics, and religious ceremonies. Karnataka is major producer. Severely threatened by illegal felling - now protected and cultivated under strict monitoring."
    },
    {
        "question": "What is Teak?",
        "answer": "🌳 Teak is a valuable timber tree native to South and Southeast Asia. Has durable, water-resistant wood used in furniture and shipbuilding. India has significant teak plantations. Natural teak forests are declining due to over-exploitation."
    },
    
    # Birds
    {
        "question": "What birds are endangered in India?",
        "answer": "🦅 Endangered Indian birds: Great Indian Bustard (<150 left), Bengal Florican, Forest Owlet, White-bellied Heron, Jerdon's Courser, Indian Vultures (95% decline due to Diclofenac), Spoon-billed Sandpiper. Threats include habitat loss, hunting, and poisoning."
    },
    {
        "question": "Why did vultures decline?",
        "answer": "🦅 Indian vulture populations crashed 99% in 1990s-2000s due to Diclofenac, a veterinary drug. Vultures died after eating carcasses of treated cattle. Diclofenac is now banned, and captive breeding programs are helping recovery. Vultures are crucial for disposing carcasses and preventing disease."
    },
    
    # Reptiles
    {
        "question": "Tell me about King Cobra",
        "answer": "🐍 King Cobra is the world's longest venomous snake (up to 5.5m), found in Western Ghats and Northeast India. Despite fearsome reputation, they're shy and rarely attack unless provoked. Endangered due to habitat loss and persecution. They eat other snakes and are crucial for rodent control."
    },
    {
        "question": "What is Indian Python?",
        "answer": "🐍 Indian Python (Python molurus) is a non-venomous constrictor snake found across India. Can grow up to 4-5m. Plays vital role in controlling rodent populations. Protected under Schedule I of Wildlife Protection Act. Threatened by habitat loss and illegal skin trade."
    },
]

# Add more variations and related questions
def generate_variations(data):
    """Generate question variations for better training"""
    variations = []
    for item in data:
        variations.append(item)
        # Add lowercase version
        variations.append({
            "question": item["question"].lower(),
            "answer": item["answer"]
        })
        # Add question mark variations
        if "?" not in item["question"]:
            variations.append({
                "question": item["question"] + "?",
                "answer": item["answer"]
            })
    return variations

# Prepare training data
print("📚 Preparing training data...")
training_data = generate_variations(TRAINING_DATA)
print(f"✅ Total training samples: {len(training_data)}")

questions = [item["question"] for item in training_data]
answers = [item["answer"] for item in training_data]

# Vectorize questions using TF-IDF
print("\n🔤 Vectorizing questions...")
vectorizer = TfidfVectorizer(
    max_features=500,
    ngram_range=(1, 3),
    stop_words='english',
    lowercase=True
)
X = vectorizer.fit_transform(questions).toarray()

# Create answer index mapping
unique_answers = list(set(answers))
answer_to_idx = {ans: idx for idx, ans in enumerate(unique_answers)}
idx_to_answer = {idx: ans for ans, idx in answer_to_idx.items()}
y = np.array([answer_to_idx[ans] for ans in answers])

print(f"✅ Unique answers: {len(unique_answers)}")
print(f"✅ Input features: {X.shape[1]}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build neural network
print("\n🧠 Building neural network...")
model = keras.Sequential([
    layers.Dense(256, activation='relu', input_shape=(X.shape[1],)),
    layers.Dropout(0.3),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(64, activation='relu'),
    layers.Dense(len(unique_answers), activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

print(model.summary())

# Train model
print("\n🏋️ Training model...")
history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=16,
    validation_split=0.2,
    verbose=1,
    callbacks=[
        keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
        keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
    ]
)

# Evaluate
print("\n📊 Evaluating model...")
test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"✅ Test Accuracy: {test_accuracy * 100:.2f}%")

# Save model and artifacts
print("\n💾 Saving model...")
model.save('wildlife_chat_model.keras')
with open('vectorizer.pkl', 'wb') as f:
    pickle.dump(vectorizer, f)
with open('answer_mapping.pkl', 'wb') as f:
    pickle.dump(idx_to_answer, f)

print("\n✅ Model trained and saved successfully!")
print(f"📁 Files created:")
print(f"  - wildlife_chat_model.keras")
print(f"  - vectorizer.pkl")
print(f"  - answer_mapping.pkl")

# Test some predictions
print("\n🧪 Testing predictions...")
test_questions = [
    "Tell me about tigers",
    "How many elephants in India?",
    "What is conservation?",
    "Where do snow leopards live?"
]

for q in test_questions:
    X_pred = vectorizer.transform([q]).toarray()
    pred_idx = np.argmax(model.predict(X_pred, verbose=0))
    confidence = np.max(model.predict(X_pred, verbose=0))
    print(f"\n❓ Q: {q}")
    print(f"🎯 Confidence: {confidence * 100:.1f}%")
    print(f"💬 A: {idx_to_answer[pred_idx][:100]}...")

print("\n✅ Training complete! Model is ready to use.")
