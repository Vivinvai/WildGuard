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
      "https://www.youtube.com/embed/iy2cnIwt-x8", // Tiger feature 1
      "https://www.youtube.com/embed/ja4GNdU2vYc", // Tiger feature 2
      "https://www.youtube.com/embed/8EXA3mB0Mtk"  // Tiger feature 3
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
      "https://www.youtube.com/embed/L-nwRCNTx5Y", // Elephant feature 1
      "https://www.youtube.com/embed/p5LpCK0JxtA"  // Elephant feature 2
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
      "https://www.youtube.com/embed/f5LnLLoISv8", // Leopard feature 1
      "https://www.youtube.com/embed/Pb3gEdr_ti8"  // Leopard feature 2
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
  },

  {
    speciesName: "Sloth Bear",
    scientificName: "Melursus ursinus",
    commonNames: ["Indian Sloth Bear", "Labiated Bear", "Karadi (Kannada)"],
    category: "Mammal",
    conservationStatus: "Vulnerable",
    population: "~6,000-11,000 in India (2024)",
    region: "Karnataka",
    
    shortDescription: "The shaggy-coated Sloth Bear is famous for its vacuum-like ability to suck up termites and its role as Baloo in The Jungle Book.",
    fullDescription: "The Sloth Bear is a unique bear species native to the Indian subcontinent, known for its distinctive shaggy black coat and long, curved claws. Karnataka's Daroji Bear Sanctuary is India's first dedicated sloth bear sanctuary. These bears have a specialized diet of termites and ants, which they vacuum up using their specially adapted lips and palate that can close their nostrils. Despite their seemingly docile name, sloth bears are known to be aggressive when threatened and can successfully defend against tigers.",
    
    habitat: "Dry deciduous forests, scrublands, rocky outcrops, and grasslands. Found throughout Karnataka's protected areas. Daroji Sloth Bear Sanctuary in Ballari district (82.72 sq km) is a prime habitat with rocky hills and termite mounds. Also found in Bandipur, Nagarahole, and BRT.",
    
    diet: "Insectivore/Omnivore - Primary diet consists of termites, ants, and honey. Also eats fruits (especially figs, ber, mahua), flowers, and sugarcane. Can consume thousands of termites in a single feeding session. Their sucking sound can be heard from 180 meters away!",
    
    lifespan: "20-30 years in the wild, up to 40 years in captivity",
    
    size: "Length: 1.4-1.9 m; Weight: 80-140 kg (males), 55-95 kg (females); Height: 60-90 cm at shoulder",
    
    behavior: "Primarily nocturnal but often active during daytime, especially during summer. Mothers carry cubs on their backs (unique among bears). Excellent climbers despite their bulk. Create territorial markings by scratching trees and leaving scent marks. Known for loud vocalizations including huffing, roaring, and yelping.",
    
    reproduction: "Breeding occurs April-June. Gestation 6-7 months. Litter size 1-3 cubs. Cubs stay with mother for 2-3 years. Birth takes place in caves or natural shelters.",
    
    threats: ["Habitat loss", "Human-bear conflict", "Poaching (bile, paws, claws for traditional medicine)", "Historical 'dancing bear' trade", "Road accidents"],
    
    conservationEfforts: "Daroji Sloth Bear Sanctuary established in 1994. Wildlife SOS has rescued over 620 dancing bears since 1995. Conservation includes habitat protection, community awareness programs, anti-poaching patrols, and conflict mitigation through early warning systems.",
    
    protectedAreas: ["Daroji Sloth Bear Sanctuary", "Bandipur Tiger Reserve", "Nagarahole National Park", "BRT Wildlife Sanctuary", "Cauvery Wildlife Sanctuary"],
    
    imageUrl: "https://images.unsplash.com/photo-1609086998161-e70d04889518?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/QO79orOvYJA",  // Wild Karnataka documentary
      "https://www.youtube.com/embed/FShE0VifCYs",  // Sloth bear behavior
      "https://www.youtube.com/embed/NNJHc85ZRR0"   // Daroji sanctuary
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1609086998161-e70d04889518?w=600",
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=600",
      "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=600"
    ],
    
    funFacts: [
      "Inspired Baloo, the beloved bear character in Rudyard Kipling's The Jungle Book",
      "Their lips can extend outward to form a tube for sucking insects",
      "Can close their nostrils at will to prevent termites from entering",
      "Have the longest tail of any bear species (15-18 cm)",
      "Can run faster than humans despite their bulky appearance",
      "Cubs ride on mother's back - the only bear species known to do this regularly"
    ],
    
    culturalSignificance: "The Sloth Bear inspired Baloo in The Jungle Book. Historically exploited in the cruel 'dancing bear' trade, which has been banned since 1972. Now celebrated as Karnataka's unique wildlife heritage. The extinct 'Karadi Gombe' (bear dance) tradition has been replaced with conservation efforts.",
    
    didYouKnow: "Daroji Sloth Bear Sanctuary uses 'sweet licks' - honey coated on rocks - to attract bears for easier viewing! The sanctuary records the highest concentration of sloth bears anywhere in India, with over 120 individuals in just 82 sq km.",
    
    tags: ["Unique Species", "The Jungle Book", "Insectivore", "Vulnerable", "Daroji"]
  },

  {
    speciesName: "Gaur",
    scientificName: "Bos gaurus",
    commonNames: ["Indian Bison", "Wild Ox", "Kada Bisi (Kannada)"],
    category: "Mammal",
    conservationStatus: "Vulnerable",
    population: "~13,000-30,000 in India (2024)",
    region: "Karnataka",
    
    shortDescription: "The mighty Gaur is the world's largest wild cattle species and an iconic herbivore of Karnataka's forests.",
    fullDescription: "The Gaur is the largest and most powerful wild cattle species in the world, with adult males weighing up to 1,500 kg. These magnificent bovines are characterized by their massive muscular build, distinctive white 'stockings' on their legs, and curved horns. Karnataka's Bandipur and Nagarahole parks host some of India's healthiest gaur populations. They play a crucial role in forest ecosystems through seed dispersal and habitat modification.",
    
    habitat: "Dense evergreen and deciduous forests, forest edges, and grasslands. Prefer hilly terrain with good water sources. Found throughout Western Ghats protected areas. Altitude range from sea level to 2,000 meters.",
    
    diet: "Herbivore - Grazes on coarse grasses, browses on shrubs, tree shoots, and leaves. Consumes bamboo, bark, and fruits. Feeds primarily in early morning and late afternoon. Requires large quantities of water daily.",
    
    lifespan: "20-25 years in the wild, up to 30 years in captivity",
    
    size: "Length: 2.5-3.3 m (plus 70-100 cm tail); Height: 1.65-2.2 m at shoulder; Weight: 600-1,500 kg (males), 400-1,000 kg (females)",
    
    behavior: "Diurnal, most active during cooler hours. Lives in herds of 6-40 individuals led by an elder female. Adult bulls may be solitary or form bachelor groups. Known for their shy nature despite massive size. Can be aggressive when threatened, capable of charging predators including tigers.",
    
    reproduction: "Mating occurs year-round with peak during winter monsoon (November-December). Gestation period 275 days. Single calf born, stays with mother for 8-9 months. Sexual maturity at 2-3 years.",
    
    threats: ["Habitat loss and fragmentation", "Disease transmission from domestic cattle", "Poaching for meat and horns", "Human settlement encroachment", "Epidemics"],
    
    conservationEfforts: "Protected in all Karnataka wildlife sanctuaries and national parks. Population monitoring through camera traps. Habitat corridors maintained between forest patches. Disease surveillance programs. Community-based conservation initiatives.",
    
    protectedAreas: ["Bandipur National Park", "Nagarahole National Park", "BRT Wildlife Sanctuary", "Bhadra Wildlife Sanctuary", "Pushpagiri Wildlife Sanctuary"],
    
    imageUrl: "https://images.unsplash.com/photo-1534567110243-e8f085f4f5c4?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/QO79orOvYJA",  // Wild Karnataka featuring gaur
      "https://www.youtube.com/embed/BdLYGEZTcUM",  // Gaur in Indian forests
      "https://www.youtube.com/embed/2MXklbze5Zs"   // Bandipur wildlife
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1534567110243-e8f085f4f5c4?w=600",
      "https://images.unsplash.com/photo-1572276811423-e67dbfddf1a6?w=600",
      "https://images.unsplash.com/photo-1613323593608-abc90fec84ff?w=600"
    ],
    
    funFacts: [
      "Largest and tallest wild cattle species in the world",
      "A full-grown gaur bull can weigh as much as a small car!",
      "Their deep bellowing calls can be heard over a kilometer away",
      "White leg markings look like they're wearing socks",
      "Can run at speeds up to 56 km/h despite their massive size",
      "Their dung helps regenerate forests by dispersing seeds"
    ],
    
    culturalSignificance: "The gaur features in tribal folklore of Western Ghats as a symbol of strength and wilderness. In ancient times, gaur horns were prized possessions. The animal appears in rock art and tribal mythology of Karnataka's indigenous communities.",
    
    didYouKnow: "Bandipur National Park has one of the highest densities of gaur in the world! During dry season, herds of 20-40 gaurs can be seen grazing together in forest clearings, creating a spectacular wildlife viewing experience.",
    
    tags: ["Largest Wild Cattle", "Herbivore", "Forest Giant", "Vulnerable", "Western Ghats"]
  },

  {
    speciesName: "Dhole",
    scientificName: "Cuon alpinus",
    commonNames: ["Indian Wild Dog", "Asiatic Wild Dog", "Red Dog", "Whistling Dog"],
    category: "Mammal",
    conservationStatus: "Endangered",
    population: "~2,000-2,500 in India (2024)",
    region: "Karnataka",
    
    shortDescription: "The Dhole is Asia's most skilled pack hunter, capable of taking down prey 10 times their size through coordinated teamwork.",
    fullDescription: "The Dhole is one of Asia's most efficient apex predators, hunting in highly coordinated packs of 5-12 members. These rust-colored canines are known for their whistling vocalizations and remarkable teamwork. Karnataka's forests, particularly the Nilgiri landscape, host viable dhole populations. Unlike most predators, dholes allow pups and younger members to eat first - a unique social behavior. The award-winning documentary 'The Pack' filmed in Karnataka's forests showcased their sophisticated hunting strategies.",
    
    habitat: "Dense forests, forest edges, grasslands, and scrublands. Prefer areas with high prey density. Found in Western Ghats tropical and subtropical forests. Altitude range from 100 to 3,000 meters.",
    
    diet: "Carnivore - Hunts in packs to take down large prey including sambar deer, spotted deer, wild boar, and even gaur calves. Can also hunt smaller prey like hares and rodents. Highly efficient hunters with 80% success rate. Cooperative feeding behavior unique among wild dogs.",
    
    lifespan: "10-16 years in the wild",
    
    size: "Length: 88-113 cm (body), plus 40-50 cm tail; Height: 42-55 cm at shoulder; Weight: 12-20 kg; Sexual dimorphism minimal",
    
    behavior: "Diurnal pack hunters. Highly social with complex vocalizations including whistles, screams, and chatters. Use relay hunting tactics where pack members take turns chasing prey. Pups are communally raised by the pack. Home ranges of 40-80 sq km. Subordinate to tigers but can intimidate leopards.",
    
    reproduction: "Breeding season September-February. Gestation 60-63 days. Litter size 4-6 pups (can be up to 12). Pups born in dens (rock crevices, caves, or burrows). Entire pack helps raise young.",
    
    threats: ["Habitat loss and fragmentation", "Prey depletion", "Disease from domestic dogs", "Competition with tigers and leopards", "Human persecution", "Road accidents"],
    
    conservationEfforts: "Protected under Wildlife Protection Act. Habitat corridor conservation linking Karnataka forests. Disease monitoring and vaccination programs for domestic dogs in buffer zones. Research programs studying pack dynamics. Community awareness initiatives.",
    
    protectedAreas: ["Nagarahole National Park", "Bandipur Tiger Reserve", "BRT Wildlife Sanctuary", "Bhadra Wildlife Sanctuary", "Kudremukh National Park"],
    
    imageUrl: "https://images.unsplash.com/photo-1610550565034-94674f90c9ba?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/QO79orOvYJA",  // Wild Karnataka dholes
      "https://www.youtube.com/embed/axqOJbfFnAs",  // Dhole pack hunting
      "https://www.youtube.com/embed/FShE0VifCYs"   // The Pack documentary clips
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1610550565034-94674f90c9ba?w=600",
      "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600",
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=600"
    ],
    
    funFacts: [
      "Known as 'whistling dogs' due to their unique whistle-like calls",
      "Can take down prey 50 times their own body weight through pack coordination",
      "Pups eat first - unique among predators where adults usually dominate feeding",
      "Have one more molar tooth than other canids",
      "Can jump up to 2.3 meters vertically",
      "Use relay hunting strategy - pack members take turns chasing prey to exhaustion"
    ],
    
    culturalSignificance: "Featured in Rudyard Kipling's 'The Jungle Book' as the 'red dogs' that even Mowgli's wolf pack feared. The documentary 'The Pack' filmed in Karnataka won the prestigious 'Green Oscar' at Wildscreen Festival. Dholes symbolize teamwork and cooperation in conservation messaging.",
    
    didYouKnow: "Nagarahole National Park has been the filming location for two award-winning dhole documentaries - 'Wild Dog Diaries' and 'The Pack' - both shot over decades by Karnataka-based filmmakers Krupakar-Senani!",
    
    tags: ["Endangered", "Pack Hunter", "Whistling Dog", "Apex Predator", "Social Canid"]
  },

  {
    speciesName: "King Cobra",
    scientificName: "Ophiophagus hannah",
    commonNames: ["Hamadryad", "King of Snakes", "Naga (Kannada)"],
    category: "Reptile",
    conservationStatus: "Vulnerable",
    population: "Population data limited (2024)",
    region: "Karnataka",
    
    shortDescription: "The world's longest venomous snake, the King Cobra is an intelligent serpent that builds nests and guards its eggs.",
    fullDescription: "The King Cobra is the world's longest venomous snake, reaching lengths of up to 5.7 meters. Found in Karnataka's Western Ghats forests, particularly around Agumbe (known as the King Cobra capital of India), these magnificent reptiles are the only snakes that build nests. They are ophiophagous (snake-eaters), primarily feeding on other snakes including other cobras. Despite their fearsome reputation, king cobras are generally shy and will avoid confrontation when possible.",
    
    habitat: "Dense highland forests, bamboo thickets, mangroves, and forest edges. Prefer areas near streams and water sources. Western Ghats rainforests in Karnataka (Agumbe, Sharavathi Valley, Kudremukh) are prime habitats. Altitude range from lowlands to 2,000 meters.",
    
    diet: "Ophiophagus (snake-eater) - Primary diet consists of other snakes including rat snakes, pythons, and even other cobras. Occasionally eats monitor lizards. Can fast for months after a large meal. Adults may eat snakes up to 3 meters long.",
    
    lifespan: "20-25 years in the wild, up to 30 years in captivity",
    
    size: "Length: Average 3-4 m, maximum recorded 5.7 m; Weight: 6-12 kg; Hatchlings: 45-55 cm long",
    
    behavior: "Diurnal. Highly intelligent and alert. Will raise up to 1/3 of its body length and expand hood when threatened. Capable of 'standing' up to 1.8 m tall. Only snake species to build nests - female constructs leaf-litter nest and guards eggs aggressively for 60-90 days. Males perform combat 'dances' during mating season.",
    
    reproduction: "Mating season January-April. Females lay 20-50 eggs in nest mound. Incubation period 60-90 days. Female guards nest throughout incubation. Hatchlings are independent and fully venomous at birth. Sexual maturity at 5-6 years.",
    
    threats: ["Habitat loss and fragmentation", "Human-snake conflict", "Road mortality", "Traditional medicine trade", "Persecution due to fear", "Prey species depletion"],
    
    conservationEfforts: "Research programs at Agumbe Rainforest Research Station studying king cobra ecology. Community-based conservation and snake rescue networks. Anti-venom development programs. Habitat protection in Western Ghats. Public awareness campaigns about snake conservation.",
    
    protectedAreas: ["Agumbe Rainforest", "Sharavathi Valley Wildlife Sanctuary", "Kudremukh National Park", "Bhadra Wildlife Sanctuary", "Someshwara Wildlife Sanctuary"],
    
    imageUrl: "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/QO79orOvYJA",  // Wild Karnataka cobras
      "https://www.youtube.com/embed/BdLYGEZTcUM",  // Secrets of King Cobra
      "https://www.youtube.com/embed/2MXklbze5Zs"   // Agumbe king cobras
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=600",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600",
      "https://images.unsplash.com/photo-1594500111737-9e95f57ad05b?w=600"
    ],
    
    funFacts: [
      "World's longest venomous snake - can grow over 5.7 meters!",
      "Only snake species that builds nests for eggs",
      "Can deliver enough venom in one bite to kill an elephant",
      "Despite potent venom, king cobras have a relatively low human mortality rate",
      "Can 'stand up' and look a human in the eye",
      "Hiss sounds like a dog's growl due to specialized tracheal modifications"
    ],
    
    culturalSignificance: "Revered in Hindu and Buddhist traditions as 'Naga Raja' (Snake King). Features prominently in Karnataka temple iconography and folklore. Agumbe has been called the 'King Cobra Capital' and was filming location for famous TV series 'Malgudi Days'. Protected under Wildlife Protection Act as a Schedule II species.",
    
    didYouKnow: "Agumbe in Karnataka's Shimoga district is the King Cobra capital of India! The Agumbe Rainforest Research Station conducts pioneering research on king cobra ecology, including radio-telemetry tracking - the first such study in the wild.",
    
    tags: ["World's Longest Venomous Snake", "Nest Builder", "Snake Eater", "Vulnerable", "Agumbe"]
  },

  {
    speciesName: "Malabar Giant Squirrel",
    scientificName: "Ratufa indica",
    commonNames: ["Indian Giant Squirrel", "Shekru (Marathi)", "Aani (Kannada)"],
    category: "Mammal",
    conservationStatus: "Least Concern",
    population: "Stable in protected Western Ghats forests (2024)",
    region: "Karnataka",
    
    shortDescription: "The spectacular Malabar Giant Squirrel is India's most colorful squirrel, sporting a rainbow coat of purple, maroon, and orange.",
    fullDescription: "The Malabar Giant Squirrel is one of the world's most striking rodents, with brilliant multicolored fur ranging from deep maroon and purple to bright orange and cream. Growing up to 3 feet in length including their magnificent bushy tail, these arboreal acrobats are endemic to India's Western Ghats. They spend most of their lives in the forest canopy, rarely descending to the ground. Their spectacular leaps between trees, sometimes spanning 6 meters, make them a favorite among wildlife enthusiasts in Karnataka's forests.",
    
    habitat: "Tropical and subtropical evergreen forests, moist deciduous forests. Confined to tree canopy at heights of 15-25 meters. Found in Western Ghats forests across Karnataka. Altitude range 180-2,300 meters. Prefers dense forest cover with tall trees.",
    
    diet: "Herbivore - Feeds on fruits, flowers, bark, nuts, seeds, and tree sap. Favorites include figs, jackfruit, mangoes, and tamarind. Holds food in front paws while eating. Plays crucial role in seed dispersal for forest regeneration.",
    
    lifespan: "Up to 20 years in wild, rarely kept in captivity",
    
    size: "Head-body length: 25-50 cm; Tail length: 25-60 cm; Total length: Up to 1 meter; Weight: 1.5-3 kg",
    
    behavior: "Diurnal and arboreal. Extremely agile jumpers, leaping up to 6 meters between trees. Solitary or found in small family groups. Build large spherical nests (dreys) from twigs and leaves. Communicate through loud clicking/chattering sounds. Freezes against tree trunks when threatened, using cryptic coloration for camouflage.",
    
    reproduction: "Breeding season varies by region, typically January-September. Gestation 28-35 days. Litter size 1-3. Young are born in nest dreys. Reach sexual maturity at 9-12 months.",
    
    threats: ["Habitat loss and deforestation", "Forest fragmentation", "Hunting for meat and bushy tail", "Pet trade", "Monoculture plantations replacing natural forests"],
    
    conservationEfforts: "Protected under Wildlife Protection Act Schedule II. Conservation focus on Western Ghats forest preservation. Habitat corridor maintenance. Nest box programs in degraded areas. Public awareness about endemic species importance.",
    
    protectedAreas: ["Sharavathi Valley Wildlife Sanctuary", "Someshwara Wildlife Sanctuary", "Dandeli-Anshi Tiger Reserve", "Kudremukh National Park", "Pushpagiri Wildlife Sanctuary"],
    
    imageUrl: "https://images.unsplash.com/photo-1619968575724-91f0f6cf5a64?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/QO79orOvYJA",  // Wild Karnataka featuring giant squirrel
      "https://www.youtube.com/embed/FShE0VifCYs",  // Malabar Giant Squirrel behavior
      "https://www.youtube.com/embed/NNJHc85ZRR0"   // Western Ghats wildlife
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1619968575724-91f0f6cf5a64?w=600",
      "https://images.unsplash.com/photo-1566659842149-c9e9e71e2c5d?w=600",
      "https://images.unsplash.com/photo-1607619424970-5eb47e752fe5?w=600"
    ],
    
    funFacts: [
      "One of the world's most colorful squirrels - each individual has unique coloration!",
      "Can jump up to 6 meters (20 feet) from tree to tree",
      "Their tail alone can be as long as their entire body",
      "Spend almost their entire lives in trees, rarely touching the ground",
      "Can rotate their hind feet 180 degrees for descending trees head-first",
      "Create multiple nests within their territory for different purposes"
    ],
    
    culturalSignificance: "Endemic to India and symbol of Western Ghats biodiversity. Featured in state wildlife awareness programs. Local communities consider sightings auspicious. The species has become an icon for forest conservation in Karnataka.",
    
    didYouKnow: "The Malabar Giant Squirrel's spectacular coloring serves as camouflage! In the dappled light of the forest canopy, their bright patches actually help them blend into the alternating patches of sunlight and shadow.",
    
    tags: ["Endemic", "Colorful", "Arboreal", "Seed Disperser", "Western Ghats"]
  },

  {
    speciesName: "Sambar Deer",
    scientificName: "Rusa unicolor",
    commonNames: ["Indian Sambar", "Large Brown Deer", "Kadave Maan (Kannada)"],
    category: "Mammal",
    conservationStatus: "Vulnerable",
    population: "Stable in Karnataka protected areas (2024)",
    region: "Karnataka",
    
    shortDescription: "The majestic Sambar is India's largest deer species and a primary prey animal for tigers and dholes.",
    fullDescription: "The Sambar is the largest deer species in India, with adult stags sporting impressive antlers up to 110 cm long. These robust deer are crucial to forest ecosystems as a primary prey species for tigers, leopards, and dholes. Found throughout Karnataka's forests, sambars are excellent swimmers and often take refuge in water bodies to escape predators. Their loud alarm calls warn other forest animals of danger. The species plays a vital role in maintaining predator-prey balance in the ecosystem.",
    
    habitat: "Dense forests, forest edges, grasslands near water, and hilly terrain. Prefer areas with thick cover and permanent water sources. Found throughout Western Ghats and Eastern Ghats forests in Karnataka. Altitude range from sea level to 3,500 meters.",
    
    diet: "Herbivore - Browsers and grazers feeding on grasses, leaves, shoots, fallen fruits, aquatic plants, and bark. Feed primarily during dawn, dusk, and night. Require regular access to water.",
    
    lifespan: "16-20 years in the wild, up to 26 years in captivity",
    
    size: "Head-body length: 1.6-2.7 m; Shoulder height: 1.0-1.6 m; Weight: 100-315 kg (males), 75-185 kg (females); Antlers: Up to 110 cm",
    
    behavior: "Crepuscular and nocturnal. Lives in small herds of 2-6 individuals, though solitary males are common. Excellent swimmers and often enter water to escape predators or feed on aquatic vegetation. Stags shed and regrow antlers annually. Known for loud, honking alarm calls that can be heard over a kilometer away.",
    
    reproduction: "Breeding occurs throughout year with peak in November-December. Gestation 240-270 days. Single fawn born, occasionally twins. Fawns are spotted for camouflage. Sexual maturity at 2-3 years.",
    
    threats: ["Habitat loss", "Poaching for meat and antlers", "Predation pressure", "Disease transmission from livestock", "Human disturbance"],
    
    conservationEfforts: "Protected in all Karnataka wildlife sanctuaries. Anti-poaching patrols in tiger reserves. Population monitoring through camera traps. Habitat management including water hole development. Disease surveillance programs.",
    
    protectedAreas: ["Bandipur National Park", "Nagarahole National Park", "Bhadra Wildlife Sanctuary", "BRT Wildlife Sanctuary", "Cauvery Wildlife Sanctuary"],
    
    imageUrl: "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/QO79orOvYJA",  // Wild Karnataka sambars
      "https://www.youtube.com/embed/BdLYGEZTcUM",  // Sambar deer behavior
      "https://www.youtube.com/embed/axqOJbfFnAs"   // Tiger-sambar interactions
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=600",
      "https://images.unsplash.com/photo-1605181685754-7e22e1e5e7b3?w=600",
      "https://images.unsplash.com/photo-1534567110243-e8f085f4f5c4?w=600"
    ],
    
    funFacts: [
      "Largest deer species in India!",
      "Can swim across wide rivers and even in ocean waters between islands",
      "Their alarm call warns the entire forest of predator presence",
      "Antlers are shed and regrown annually - full regrowth takes 60-75 days",
      "Can jump up to 2.5 meters high when alarmed",
      "Form the primary prey base (40-50%) for tigers in many reserves"
    ],
    
    culturalSignificance: "Featured in ancient Indian hunting literature and Mughal court paintings. Sambar meat has historical significance in tribal cuisine (though now protected). The species appears in Karnataka forest folklore as the 'voice of the forest' due to its alarm calls.",
    
    didYouKnow: "Sambar deer in Bandipur and Nagarahole have developed a fascinating mutualistic relationship with langurs - the monkeys drop fruits while feeding in trees, and the deer benefit from the bounty below!",
    
    tags: ["Largest Indian Deer", "Tiger Prey", "Swimmer", "Forest Guardian", "Herbivore"]
  },

  {
    speciesName: "Spotted Deer",
    scientificName: "Axis axis",
    commonNames: ["Chital", "Axis Deer", "Chittal Maan (Kannada)"],
    category: "Mammal",
    conservationStatus: "Least Concern",
    population: "Abundant in Karnataka protected areas (2024)",
    region: "Karnataka",
    
    shortDescription: "The beautiful Spotted Deer, with its distinctive white spots, is the most common deer in Indian forests and a favorite prey of big cats.",
    fullDescription: "The Spotted Deer or Chital is one of the most beautiful deer species, characterized by its reddish-brown coat adorned with white spots that persist throughout life. They are highly gregarious, often seen in large herds of 20-30 individuals in Karnataka's forests. Chitals form an interesting symbiotic relationship with langur monkeys - the langurs feed in trees and drop fruits, while the deer benefit from both the food and the langurs' excellent predator detection abilities. Their musical alarm calls are a common forest sound.",
    
    habitat: "Open forests, forest edges, grasslands, and meadows. Prefer areas with mix of grass and tree cover. Abundant throughout Karnataka's protected areas. Altitude range from plains to 1,000 meters. Require proximity to water sources.",
    
    diet: "Herbivore - Primarily grazers feeding on fresh grasses, but also browse on leaves, flowers, and fallen fruits. Benefit from fruits dropped by feeding langurs. Feed in early morning and late afternoon. Need regular water intake.",
    
    lifespan: "20-25 years in wild, up to 30 years in captivity",
    
    size: "Head-body length: 1.1-1.4 m; Shoulder height: 65-90 cm; Weight: 30-90 kg (males), 25-45 kg (females); Antlers: Up to 1 meter (three-tined)",
    
    behavior: "Diurnal with peaks of activity at dawn and dusk. Highly social, living in mixed herds of males, females, and young. During rut, stags become territorial and emit rutting calls. Often associate with langur troops for mutual benefit. Excellent swimmers. Known for their grace and alertness.",
    
    reproduction: "Breed throughout year with peaks during monsoon. Gestation period 210-238 days. Usually single fawn, occasionally twins. Fawns are hidden in vegetation for first few weeks. Sexual maturity at 14-17 months for females, 2-3 years for males.",
    
    threats: ["Predation (natural - forms 60% of tiger diet)", "Poaching for meat", "Habitat modification", "Disease outbreaks", "Livestock competition for grazing"],
    
    conservationEfforts: "Thrives in protected areas due to predator-prey management. Population monitoring in tiger reserves. Grassland management benefits chital populations. Water hole development in dry zones.",
    
    protectedAreas: ["Bandipur National Park", "Nagarahole National Park", "BRT Wildlife Sanctuary", "Bhadra Wildlife Sanctuary", "Cauvery Wildlife Sanctuary"],
    
    imageUrl: "https://images.unsplash.com/photo-1560155738-e7d8f0b5d30c?w=800",
    
    videoUrls: [
      "https://www.youtube.com/embed/QO79orOvYJA",  // Wild Karnataka chitals
      "https://www.youtube.com/embed/FShE0VifCYs",  // Spotted deer behavior
      "https://www.youtube.com/embed/2MXklbze5Zs"   // Chital and langur mutualism
    ],
    
    galleryImages: [
      "https://images.unsplash.com/photo-1560155738-e7d8f0b5d30c?w=600",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600",
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600"
    ],
    
    funFacts: [
      "Only deer species to retain spots throughout adult life",
      "Form mutualistic relationships with langur monkeys - nature's best teamwork!",
      "Can produce 3-4 young per year under optimal conditions",
      "Their spotted coat provides perfect camouflage in dappled forest light",
      "Stags produce a distinctive 'alarm bark' when sensing danger",
      "Most abundant prey species in many Indian tiger reserves"
    ],
    
    culturalSignificance: "Featured prominently in Indian art, poetry, and mythology as symbol of beauty and grace. Associated with Lord Krishna in Hindu iconography. The chital's spotted coat inspired traditional textile patterns in Karnataka. Popular subject in wildlife photography.",
    
    didYouKnow: "Chital deer maintain an amazing partnership with langur monkeys in Karnataka's forests! The langurs act as 'lookouts' in trees while feeding, dropping fruits for the deer below, and the deer alert the langurs to ground predators - a perfect example of nature's cooperation!",
    
    tags: ["Beautiful", "Abundant", "Tiger Prey", "Langur Partner", "Graceful"]
  }
];
