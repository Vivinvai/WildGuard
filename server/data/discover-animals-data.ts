// Amazing wildlife data for Discover page with videos and comprehensive information
import type { InsertDiscoverAnimal } from "@shared/schema";

export const discoverAnimalsData: Omit<InsertDiscoverAnimal, 'viewCount' | 'featured'>[] = [
  {
    speciesName: "Bengal Tiger",
    scientificName: "Panthera tigris tigris",
    commonNames: ["Royal Bengal Tiger", "Indian Tiger", "Bagheera"],
    category: "Mammal",
    conservationStatus: "Endangered",
    population: "~2,500-3,000 in India (2024)",
    region: "Karnataka",
    
    shortDescription: "The majestic Bengal Tiger is India's national animal and apex predator of Karnataka's forests.",
    fullDescription: "The Bengal Tiger (Panthera tigris tigris) is one of the most iconic big cats in the world and serves as India's national animal. Found in the dense forests of Bandipur, Nagarahole, and BRT Tiger Reserves in Karnataka, these magnificent creatures are the apex predators of their ecosystems. Adult male tigers can weigh up to 250 kg and measure over 3 meters in length including their tail. Their distinctive orange coat with black stripes provides excellent camouflage in the forest undergrowth. Tigers are solitary hunters, primarily active during dawn and dusk, and can take down prey as large as gaur (Indian bison) and sambar deer.",
    
    habitat: "Dense deciduous and evergreen forests, grasslands near water sources. Bengal Tigers in Karnataka primarily inhabit the Western Ghats forest complexes including Bandipur Tiger Reserve (874 sq km), Nagarahole National Park (643 sq km), and Bhadra Wildlife Sanctuary (490 sq km). They require large territories - males need 60-100 sq km while females need 20-60 sq km.",
    
    diet: "Carnivore - Primarily hunts large ungulates including sambar deer, spotted deer (chital), wild boar, gaur, and occasionally smaller prey like monkeys and birds. An adult tiger consumes 15-20 kg of meat in a single sitting and can eat up to 40 kg when hungry.",
    
    lifespan: "10-15 years in the wild, up to 20 years in captivity",
    
    size: "Length: 2.7-3.1 m (males), 2.4-2.7 m (females); Weight: 180-260 kg (males), 110-180 kg (females); Tail: 85-95 cm",
    
    behavior: "Solitary and territorial. Tigers mark their territory using scent markings, scratches on trees, and vocalizations. They are excellent swimmers and often cool off in water bodies during hot days. Unlike other big cats, tigers are comfortable in water and can swim several kilometers. They communicate through roars (can be heard up to 3 km away), grunts, and purrs.",
    
    reproduction: "Females reach sexual maturity at 3-4 years, males at 4-5 years. Gestation period is 93-112 days, producing litters of 2-4 cubs. Cubs stay with mother for 2-3 years learning hunting skills.",
    
    threats: ["Habitat loss and fragmentation", "Poaching for illegal wildlife trade", "Human-wildlife conflict", "Prey depletion", "Infrastructure development through tiger corridors"],
    
    conservationEfforts: "Project Tiger (launched 1973) has been instrumental in tiger conservation. Karnataka hosts India's highest tiger population. Conservation strategies include: anti-poaching patrols, habitat restoration, wildlife corridors maintenance, community-based conservation programs, and real-time monitoring using camera traps and radio collars.",
    
    protectedAreas: ["Bandipur Tiger Reserve", "Nagarahole National Park", "BRT Tiger Reserve", "Bhadra Wildlife Sanctuary", "Dandeli-Anshi Tiger Reserve"],
    
    imageUrl: "https://images.unsplash.com/photo-1615963244664-5b845b2025ee?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/XCBGJXCu4P8",  // BBC Earth Tiger documentary
      "https://www.youtube.com/embed/BdLYGEZTcUM",  // National Geographic Tigers
      "https://www.youtube.com/embed/2MXklbze5Zs"   // Tiger hunting behavior
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600",
      "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600",
      "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600"
    ],
    
    funFacts: [
      "A tiger's roar can be heard from 3 kilometers away!",
      "Each tiger has a unique stripe pattern, like human fingerprints",
      "Tigers can leap up to 10 meters in a single bound",
      "They can run at speeds of up to 65 km/h in short bursts",
      "Tigers have excellent night vision - 6 times better than humans",
      "A tiger's saliva has antiseptic properties that help clean wounds"
    ],
    
    culturalSignificance: "The tiger holds immense cultural significance in India, representing power, courage, and royalty. It's featured in ancient Hindu mythology as the vahana (vehicle) of Goddess Durga. The tiger is India's national animal and appears on currency and government emblems.",
    
    didYouKnow: "Karnataka's tiger population increased from 406 in 2014 to 563 in 2023, making it the state with the highest tiger population in India! The Bandipur-Nagarahole landscape is considered one of the world's best tiger habitats.",
    
    tags: ["Big Cat", "Apex Predator", "National Animal", "Project Tiger", "Karnataka Wildlife"]
  },
  
  {
    speciesName: "Asian Elephant",
    scientificName: "Elephas maximus indicus",
    commonNames: ["Indian Elephant", "Asiatic Elephant", "Aane (Kannada)"],
    category: "Mammal",
    conservationStatus: "Endangered",
    population: "~6,000 in Karnataka, ~27,000 in India (2024)",
    region: "Karnataka",
    
    shortDescription: "Gentle giants of Karnataka's forests, Asian Elephants are highly intelligent and socially complex mammals.",
    fullDescription: "The Asian Elephant is the largest land mammal in Asia and plays a crucial ecosystem role as a keystone species. In Karnataka, elephants are found in the Western Ghats forests, with major populations in Bandipur, Nagarahole, and the Mysuru-Kodagu elephant corridor. These intelligent creatures live in matriarchal herds led by the oldest female. Adult males can weigh up to 5,500 kg and stand 2.75 meters tall at the shoulder. Elephants are essential for forest regeneration as they disperse seeds over vast distances.",
    
    habitat: "Tropical deciduous forests, evergreen forests, grasslands, and riverine areas. Require large home ranges (up to 500 sq km) with access to water sources. Karnataka's elephant habitats include the Nilgiri Biosphere Reserve, which connects protected areas across state boundaries.",
    
    diet: "Herbivore - Consumes 150-200 kg of vegetation daily including grasses, bark, roots, leaves, and fruits. Spends 16-18 hours per day feeding. Requires 80-200 liters of water daily.",
    
    lifespan: "60-70 years in the wild, can live up to 80 years in exceptional cases",
    
    size: "Height: 2.5-3.0 m (at shoulder); Weight: 2,700-5,500 kg (males), 2,200-3,500 kg (females); Trunk: 1.5-2.0 m long",
    
    behavior: "Highly social, living in family groups of 6-20 individuals. Elephants display remarkable intelligence, problem-solving abilities, and emotional depth including mourning their dead. They communicate through infrasound (frequencies below human hearing range), which can travel several kilometers. Known for their excellent memory and ability to recognize hundreds of individual elephants.",
    
    reproduction: "Females mature at 10-15 years, males at 12-15 years. Longest gestation period of any land mammal: 18-22 months. Usually give birth to a single calf weighing 90-120 kg. Calves are raised by the entire herd.",
    
    threats: ["Habitat fragmentation", "Human-elephant conflict (crop raiding)", "Railway and road accidents", "Poaching for ivory", "Climate change affecting water availability"],
    
    conservationEfforts: "Project Elephant (1992) focuses on elephant conservation. Efforts include: elephant corridors restoration, anti-poaching measures, solar-powered electric fences, early warning systems for human-elephant conflict, railway track modifications, and community compensation schemes.",
    
    protectedAreas: ["Bandipur National Park", "Nagarahole National Park", "BRT Wildlife Sanctuary", "Kabini Reservoir", "Mysuru-Kodagu Elephant Corridor"],
    
    imageUrl: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/FShE0VifCYs",  // BBC Earth Elephant Intelligence
      "https://www.youtube.com/embed/TPbroUDQN9k",  // Elephant Families
      "https://www.youtube.com/embed/FDxmQN3F5bI"   // Wild Karnataka Elephants
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600",
      "https://images.unsplash.com/photo-1605181685754-7e22e1e5e7b3?w=600",
      "https://images.unsplash.com/photo-1598983261583-2c7c812e67c5?w=600"
    ],
    
    funFacts: [
      "Elephants can detect seismic signals through their feet and communicate over vast distances",
      "Their trunks contain over 40,000 muscles (humans have ~640 muscles in total)",
      "Elephants can swim for 6 hours continuously",
      "They show empathy and help injured herd members",
      "Elephant tusks are actually elongated incisor teeth that continue growing throughout their lives",
      "They can recognize themselves in mirrors, a sign of high intelligence"
    ],
    
    culturalSignificance: "Elephants are deeply revered in Indian culture. Lord Ganesha, one of Hinduism's most worshipped deities, has an elephant head. Elephants participate in temple festivals (like Mysore Dasara) and are symbols of wisdom, strength, and good fortune.",
    
    didYouKnow: "The Kabini River area in Karnataka is famous for Asia's largest congregation of wild Asian Elephants during the dry season, where over 200 elephants gather near the reservoir!",
    
    tags: ["Megafauna", "Keystone Species", "Intelligent", "Endangered", "Project Elephant"]
  },
  
  {
    speciesName: "Indian Leopard",
    scientificName: "Panthera pardus fusca",
    commonNames: ["Indian Panther", "Cheetah (commonly misnamed)", "Chiratai (Kannada)"],
    category: "Mammal",
    conservationStatus: "Vulnerable",
    population: "~12,000-14,000 in India, ~1,150 in Karnataka (2024)",
    region: "Karnataka",
    
    shortDescription: "The adaptable and elusive Indian Leopard thrives in diverse habitats from dense forests to urban fringes.",
    fullDescription: "The Indian Leopard is one of the most adaptable big cats, found in a wide range of habitats across Karnataka including forests, grasslands, and even near human settlements. These nocturnal hunters are solitary and incredibly stealthy. Leopards are powerful climbers and often hoist their kills into trees to protect them from scavengers. They have the widest distribution of any wild cat in India, demonstrating remarkable adaptability to human-modified landscapes.",
    
    habitat: "Highly adaptable - tropical rainforests, dry deciduous forests, scrublands, grasslands, agricultural areas, and urban peripheries. Can survive in fragmented habitats where tigers cannot. Found throughout Karnataka's Western Ghats and in areas close to human habitation.",
    
    diet: "Carnivore - Opportunistic hunter feeding on deer, wild boar, monkeys, rodents, birds, and occasionally livestock. Can kill prey up to 10 times their own weight. Known for storing kills in trees. Requires 3-5 kg of meat daily.",
    
    lifespan: "12-17 years in the wild, up to 23 years in captivity",
    
    size: "Length: 1.2-1.4 m (body), plus 0.9-1.1 m tail; Weight: 50-77 kg (males), 29-34 kg (females); Height: 60-70 cm at shoulder",
    
    behavior: "Primarily nocturnal and crepuscular (active at dawn/dusk). Solitary except during mating season. Excellent climbers who rest in trees during day. Territorial, marking areas with scent and scratch marks. Can carry prey heavier than themselves up trees. Renowned for stealth - can stalk prey silently.",
    
    reproduction: "Females mature at 2-3 years, males at 2-3 years. Gestation period 90-105 days. Litter size 2-4 cubs. Cubs stay with mother for 18-24 months. Melanistic leopards (black panthers) occasionally occur in Karnataka's wet forests.",
    
    threats: ["Human-wildlife conflict", "Poaching for skin and bones", "Habitat loss", "Road accidents", "Decline in natural prey", "Persecution due to livestock predation"],
    
    conservationEfforts: "Part of Project Leopard initiatives. Conservation measures: wildlife corridors, compensation for livestock losses, community awareness programs, anti-poaching patrols, camera trap monitoring, and conflict mitigation strategies. Karnataka Forest Department's rapid response teams handle leopard-human encounters.",
    
    protectedAreas: ["Bandipur Tiger Reserve", "Nagarahole National Park", "Bhadra Wildlife Sanctuary", "Sharavathi Valley Wildlife Sanctuary", "Biligiri Rangaswamy Temple Wildlife Sanctuary"],
    
    imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/FShE0VifCYs",  // Leopard hunting techniques
      "https://www.youtube.com/embed/axqOJbfFnAs",  // BBC Leopard documentary
      "https://www.youtube.com/embed/NNJHc85ZRR0"   // Karnataka leopards
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600",
      "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600",
      "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?w=600"
    ],
    
    funFacts: [
      "Leopards can run at speeds of up to 58 km/h",
      "They can leap 6 meters horizontally and 3 meters vertically",
      "A leopard's spots are called 'rosettes'",
      "Black panthers are melanistic leopards - they still have spots visible in certain light",
      "Leopards can carry prey twice their weight up a tree",
      "They are the smallest of the big cats but pound-for-pound the strongest"
    ],
    
    culturalSignificance: "In Karnataka folklore, the leopard represents cunning and adaptability. The melanistic variant (black panther) features prominently in Kodava culture and Kannada literature. The ghost of the Kemmanagundi leopard is part of local legends.",
    
    didYouKnow: "Karnataka's Dandeli-Anshi region has one of the highest densities of melanistic leopards (black panthers) in the world! The black coat is caused by a genetic mutation and provides excellent camouflage in dense forests.",
    
    tags: ["Big Cat", "Adaptable", "Nocturnal", "Tree Climber", "Black Panther"]
  }
];
