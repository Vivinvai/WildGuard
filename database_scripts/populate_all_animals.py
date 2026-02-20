#!/usr/bin/env python3
"""
Populate Wild_Guard_DB with all 90 animals from the custom model
Maps each model class to its Indian species equivalent with proper conservation status
"""

import psycopg2
from psycopg2.extras import execute_values
import sys

# Database connection
DB_CONFIG = {
    'dbname': 'wild_guard_db',
    'user': 'postgres',
    'password': 'pokemon1234',
    'host': 'localhost',
    'port': '5432'
}

# Mapping of model class names to Indian wildlife species
# Format: model_class -> (species_name, scientific_name, conservation_status, region, habitat, threats, description, population)
ANIMAL_DATA = {
    "elephant": (
        "Asian Elephant",
        "Elephas maximus indicus",
        "Endangered",
        "India",
        "Tropical forests, grasslands, and river valleys across India",
        ["Habitat loss", "Human-wildlife conflict", "Poaching for ivory"],
        "The Asian Elephant is smaller than its African cousin with smaller ears. India hosts 50-60% of the global population. They are highly intelligent, social animals living in matriarchal herds. Protected under Schedule I of Wildlife Protection Act.",
        "27,000-31,000 in wild (India has 50-60% of global population)"
    ),
    "tiger": (
        "Bengal Tiger",
        "Panthera tigris tigris",
        "Endangered",
        "India",
        "Dense forests, mangroves, grasslands across India",
        ["Habitat fragmentation", "Poaching", "Human-wildlife conflict", "Prey depletion"],
        "The Bengal Tiger is the national animal of India. India hosts 70% of the world's tiger population. They are apex predators crucial for ecosystem balance. Project Tiger has helped increase numbers from 1,411 (2006) to 2,967 (2018).",
        "2,967 in India (2018 census) - 70% of global tiger population"
    ),
    "lion": (
        "Asiatic Lion",
        "Panthera leo persica",
        "Endangered",
        "India",
        "Dry deciduous forests and grasslands of Gir, Gujarat",
        ["Limited habitat range", "Disease susceptibility", "Genetic bottleneck"],
        "The Asiatic Lion is found only in Gir Forest National Park, Gujarat - the last remaining wild population. They are smaller than African lions with a distinctive belly fold. Conservation efforts have increased population from 180 (1974) to 674 (2020).",
        "674 (2020) - only population in Gir Forest, Gujarat"
    ),
    "leopard": (
        "Indian Leopard",
        "Panthera pardus fusca",
        "Vulnerable",
        "India",
        "Forests, mountains, urban peripheries across India",
        ["Habitat loss", "Human-wildlife conflict", "Poaching for skin"],
        "The Indian Leopard is highly adaptable and found across India, even near human settlements. They are nocturnal solitary hunters. India has the highest leopard population globally, estimated 12,000-14,000. Protected under Schedule I.",
        "12,000-14,000 across India (most adaptable big cat)"
    ),
    "rhinoceros": (
        "Indian Rhinoceros",
        "Rhinoceros unicornis",
        "Vulnerable",
        "India",
        "Grasslands and riverine forests of Northeast India",
        ["Poaching for horn", "Habitat loss", "Flooding"],
        "The Indian Rhinoceros (Greater One-Horned Rhino) is the largest of Asian rhinos. Found mainly in Kaziranga (Assam) and Chitwan (Nepal). They are excellent swimmers. Conservation success story with population increasing from ~200 (1900s) to 3,700+ today.",
        "3,700+ globally, ~2,500 in India (mainly Assam)"
    ),
    "deer": (
        "Spotted Deer (Chital)",
        "Axis axis",
        "Least Concern",
        "India",
        "Forests, grasslands across India",
        ["Habitat degradation", "Hunting (illegal)"],
        "Spotted Deer or Chital is the most common deer species in India. Recognized by white spots on reddish-brown coat. They live in herds and form symbiotic relationships with langurs for predator warning. Important prey species for tigers and leopards.",
        "Common across Indian forests"
    ),
    "antelope": (
        "Blackbuck",
        "Antilope cervicapra",
        "Least Concern (recovered from Near Threatened)",
        "India",
        "Open grasslands and scrublands across India",
        ["Habitat conversion to agriculture", "Illegal hunting"],
        "Blackbuck is India's only antelope species. Males are distinctive with spiral horns and black-white coloration. They are among the fastest animals reaching 80 km/h. Sacred in Indian culture. Conservation efforts have recovered population to 50,000+.",
        "50,000+ in India"
    ),
    "whale": (
        "Blue Whale",
        "Balaenoptera musculus",
        "Endangered",
        "Indian Ocean",
        "Migrate through Indian waters, especially off Sri Lankan coast",
        ["Ship strikes", "Entanglement in fishing gear", "Ocean pollution", "Climate change"],
        "Blue Whales are the largest animals on Earth. They migrate through Indian Ocean waters. Sightings have increased off Mirissa (Sri Lanka). They feed on krill and can consume 4 tons per day. Protected under Schedule I of Wildlife Protection Act.",
        "Migrate through Indian Ocean waters seasonally"
    ),
    "dolphin": (
        "Gangetic Dolphin",
        "Platanista gangetica",
        "Endangered",
        "India",
        "Ganges, Brahmaputra, Meghna, and Karnaphuli river systems",
        ["River pollution", "Dam construction", "Fishing net entanglement", "Habitat degradation"],
        "The Gangetic Dolphin (Susu) is India's national aquatic animal. They are functionally blind, using echolocation to navigate. Found only in South Asian river systems. Indicator species for river health. Protected under Schedule I.",
        "~3,500 in India (Ganges-Brahmaputra-Meghna river systems)"
    ),
    "snake": (
        "Indian Cobra",
        "Naja naja",
        "Vulnerable",
        "India",
        "Forests, agricultural lands, urban areas across India",
        ["Habitat loss", "Persecution by humans", "Roadkill"],
        "The Indian Cobra (Spectacled Cobra) is one of the 'Big Four' venomous snakes in India. Recognizable by hood with spectacle marking. Despite fear, they are shy and avoid humans. Important rodent controllers. Protected under Schedule II.",
        "Common but declining in some areas"
    ),
    "lizard": (
        "Bengal Monitor Lizard",
        "Varanus bengalensis",
        "Least Concern",
        "India",
        "Forests, grasslands, agricultural areas across India",
        ["Habitat loss", "Illegal wildlife trade for skin"],
        "Bengal Monitor Lizard is one of the largest lizards in India. They are excellent climbers and swimmers. Feed on insects, small mammals, birds, and eggs. Often mistaken for dangerous but are harmless to humans. Protected under Schedule I.",
        "Common across India"
    ),
    "eagle": (
        "Crested Serpent Eagle",
        "Spilornis cheela",
        "Least Concern",
        "India",
        "Forests across India, especially Western Ghats and Northeast",
        ["Deforestation", "Pesticide poisoning"],
        "Crested Serpent Eagle is a medium-sized raptor specializing in hunting reptiles. Distinctive crest and loud calls. Often seen perched on trees scanning for prey. Important for controlling snake and lizard populations in forests.",
        "Common across Indian forests"
    ),
    "hornbill": (
        "Great Indian Hornbill",
        "Buceros bicornis",
        "Vulnerable",
        "India",
        "Tropical evergreen forests of Western Ghats and Northeast India",
        ["Deforestation", "Hunting for casque", "Nest cavity shortage"],
        "Great Indian Hornbill is state bird of Kerala and Arunachal Pradesh. Distinctive large yellow casque on bill. Important seed dispersers for forest ecosystems. Unique nesting behavior - female seals herself in tree cavity. Protected under Schedule I.",
        "Declining, estimated few thousand in India"
    ),
    "flamingo": (
        "Greater Flamingo",
        "Phoenicopterus roseus",
        "Least Concern",
        "India",
        "Coastal lagoons, salt pans, especially Kutch and Chilika",
        ["Habitat disturbance", "Pollution", "Climate change affecting breeding"],
        "Greater Flamingo is the largest flamingo species. Thousands migrate to India annually, especially to Rann of Kutch and Chilika Lake. Pink color from carotenoids in diet. They are filter feeders consuming algae and small crustaceans.",
        "Thousands migrate to India annually"
    ),
    "fox": (
        "Bengal Fox",
        "Vulpes bengalensis",
        "Least Concern",
        "India",
        "Grasslands, scrublands, agricultural areas across India",
        ["Habitat loss", "Persecution", "Roadkill"],
        "Bengal Fox is endemic to Indian subcontinent. Smaller than red fox with distinctive black ear tips. Monogamous pairs with strong family bonds. They are important rodent controllers in agricultural areas. Active during early morning and evening.",
        "Common in suitable habitats across India"
    ),
    "bear": (
        "Sloth Bear",
        "Melursus ursinus",
        "Vulnerable",
        "India",
        "Forests across India, especially deciduous and dry forests",
        ["Habitat loss", "Human-wildlife conflict", "Poaching for bile and body parts"],
        "Sloth Bear is India's only bear species in most regions. Specialized insectivores with long claws for termite mounds. Distinctive shaggy coat and pale V-shaped chest mark. They are excellent climbers. Protected under Schedule I.",
        "10,000-20,000 in India"
    ),
    "wolf": (
        "Indian Wolf",
        "Canis lupus pallipes",
        "Endangered (India)",
        "India",
        "Grasslands, scrublands, semi-arid regions of central India",
        ["Habitat loss", "Prey depletion", "Human persecution", "Roadkill"],
        "Indian Wolf is smaller than European wolves and lacks the iconic howl. They live in smaller packs (3-4). Critically endangered with only 2,000-3,000 remaining. Found in grasslands of Maharashtra, Gujarat, Rajasthan. Protected under Schedule I.",
        "2,000-3,000 in India"
    ),
    "hyena": (
        "Striped Hyena",
        "Hyaena hyaena",
        "Near Threatened",
        "India",
        "Scrublands, grasslands, semi-arid regions across India",
        ["Habitat loss", "Persecution due to misconceptions", "Roadkill"],
        "Striped Hyena is India's only hyena species. Solitary or small family groups unlike African spotted hyenas. Powerful jaws can crush bones. Scavengers play crucial role in ecosystem cleanup. Often feared but shy and avoid humans.",
        "Declining population across India"
    ),
    "bison": (
        "Gaur (Indian Bison)",
        "Bos gaurus",
        "Vulnerable",
        "India",
        "Forests of Western Ghats, Central India, Northeast",
        ["Habitat loss", "Diseases from domestic cattle", "Poaching"],
        "Gaur is the largest bovine species and India's tallest wild animal (up to 2.2m). Despite name, not true bison. Massive muscular build with distinctive white stockings. Live in herds led by old female. State animal of Goa and Bihar.",
        "13,000-30,000 globally, majority in India"
    ),
    "boar": (
        "Wild Boar",
        "Sus scrofa",
        "Least Concern",
        "India",
        "Forests, grasslands, agricultural areas across India",
        ["Human-wildlife conflict (crop raiding)", "Hunting (legal in some areas)"],
        "Wild Boar is widespread across India. Highly adaptable omnivores causing significant crop damage. Strong swimmers and can run up to 40 km/h. Live in sounders (groups) led by matriarch. Ancestor of domestic pigs. Important prey for tigers and leopards.",
        "Very common across India"
    ),
    "porcupine": (
        "Indian Crested Porcupine",
        "Hystrix indica",
        "Least Concern",
        "India",
        "Forests, rocky areas, agricultural lands across India",
        ["Habitat loss", "Persecution (crop damage)", "Roadkill"],
        "Indian Crested Porcupine is the largest rodent in India. Distinctive quills can reach 50cm. Nocturnal herbivores living in burrows. Quills rattle as warning before backing into predators. Important seed dispersers. Protected under Schedule IV.",
        "Common across India"
    ),
    "otter": (
        "Smooth-coated Otter",
        "Lutrogale perspicillata",
        "Vulnerable",
        "India",
        "Rivers, wetlands, coastal areas across India",
        ["Habitat loss", "Water pollution", "Fishing net entanglement", "Illegal wildlife trade"],
        "Smooth-coated Otter is the largest otter in Asia. Excellent swimmers with webbed feet. Live in family groups and are highly social. They hunt fish cooperatively. Indicator species for wetland health. Protected under Schedule II.",
        "Declining across Indian wetlands"
    ),
    "monkey": (
        "Hoolock Gibbon",
        "Hoolock hoolock",
        "Endangered",
        "India",
        "Tropical rainforests of Northeast India",
        ["Habitat loss", "Hunting", "Fragmentation isolating populations"],
        "Hoolock Gibbon is India's only ape species. Found in Northeast India. Distinctive territorial songs at dawn. Arboreal, rarely descending to ground. Monogamous pairs with strong bonds. Males are black, females buff-colored. Protected under Schedule I.",
        "~5,000 in Northeast India"
    ),
    "chimpanzee": (
        "Not Native - See Hoolock Gibbon",
        "Hoolock hoolock",
        "Endangered",
        "India",
        "Tropical rainforests of Northeast India (Hoolock Gibbon as closest relative)",
        ["Habitat loss", "Hunting", "Fragmentation"],
        "Chimpanzees are not native to India. The closest relative is the Hoolock Gibbon - India's only ape species found in Northeast. Gibbons are smaller apes known for their songs and arboreal lifestyle. Protected under Schedule I.",
        "~5,000 Hoolock Gibbons in Northeast India"
    ),
    "gorilla": (
        "Not Native - See Hoolock Gibbon",
        "Hoolock hoolock",
        "Endangered",
        "India",
        "Tropical rainforests of Northeast India (Hoolock Gibbon as closest relative)",
        ["Habitat loss", "Hunting", "Fragmentation"],
        "Gorillas are not native to India. The closest relative is the Hoolock Gibbon - India's only ape species. Found in tropical rainforests of Assam, Arunachal Pradesh, Meghalaya, Mizoram. Important seed dispersers. Protected under Schedule I.",
        "~5,000 Hoolock Gibbons in Northeast India"
    ),
    "orangutan": (
        "Not Native - See Hoolock Gibbon",
        "Hoolock hoolock",
        "Endangered",
        "India",
        "Tropical rainforests of Northeast India (Hoolock Gibbon as closest relative)",
        ["Habitat loss", "Hunting", "Fragmentation"],
        "Orangutans are not native to India. The Hoolock Gibbon is India's only ape, found in Northeast rainforests. They are brachiators swinging through canopy. Fruit-eating with important ecological role as seed dispersers.",
        "~5,000 Hoolock Gibbons in Northeast India"
    ),
    "panda": (
        "Red Panda (Not Giant Panda)",
        "Ailurus fulgens",
        "Endangered",
        "India",
        "Himalayan temperate forests of Sikkim, West Bengal, Arunachal Pradesh",
        ["Habitat loss", "Deforestation", "Poaching", "Climate change"],
        "Red Panda (not the Giant Panda) is found in India's Eastern Himalayas. Arboreal mammals with reddish fur and bushy tail. Primarily bamboo eaters. State animal of Sikkim. Shy and solitary. Protected under Schedule I of Wildlife Protection Act.",
        "Estimated few hundred in Indian Himalayas"
    ),
    "koala": (
        "Not Native to India",
        "Phascolarctos cinereus",
        "Not Applicable",
        "Australia",
        "Eucalyptus forests of Australia (Not found in India)",
        ["Not applicable to India"],
        "Koalas are native to Australia and not found in India. They are marsupials that feed exclusively on eucalyptus leaves. India's arboreal mammals include Hoolock Gibbons, Flying Squirrels, and various Langur species.",
        "Not found in India - Native to Australia"
    ),
    "kangaroo": (
        "Not Native to India",
        "Macropus spp.",
        "Not Applicable",
        "Australia",
        "Grasslands of Australia (Not found in India)",
        ["Not applicable to India"],
        "Kangaroos are marsupials native to Australia, not found in India. India's hopping mammals include various rodent species. For large herbivores, see Indian species like Blackbuck, Deer, or Nilgai.",
        "Not found in India - Native to Australia"
    ),
    "wombat": (
        "Not Native to India",
        "Vombatus ursinus",
        "Not Applicable",
        "Australia",
        "Forests of Australia (Not found in India)",
        ["Not applicable to India"],
        "Wombats are marsupials native to Australia, not found in India. They are burrowing herbivores. India's burrowing mammals include Indian Crested Porcupine, various mongoose species, and Indian Fox.",
        "Not found in India - Native to Australia"
    ),
    "zebra": (
        "Not Native to India",
        "Equus zebra/quagga/grevyi",
        "Not Applicable",
        "Africa",
        "African grasslands and savannas (Not found in India)",
        ["Not applicable to India"],
        "Zebras are native to Africa, not found in wild in India. For similar striped patterns in India, see Tigers. For wild equines in India, see Indian Wild Ass (Khur) found in Little Rann of Kutch, Gujarat.",
        "Not found in India - Native to Africa"
    ),
    "hippopotamus": (
        "Not Native to India",
        "Hippopotamus amphibius",
        "Not Applicable",
        "Africa",
        "African rivers and lakes (Not found in India)",
        ["Not applicable to India"],
        "Hippopotamuses are native to Africa, not found in India. India's large semi-aquatic mammals include Gangetic Dolphins, Smooth-coated Otters, and Marsh Crocodiles (Mugger).",
        "Not found in India - Native to Africa"
    ),
    "okapi": (
        "Not Native to India",
        "Okapia johnstoni",
        "Not Applicable",
        "Africa",
        "Congo rainforests (Not found in India)",
        ["Not applicable to India"],
        "Okapi are native to Congo rainforests in Africa, not found in India. They are relatives of giraffes. India's forest ungulates include Gaur, Sambar, Muntjac, and various deer species.",
        "Not found in India - Native to Africa"
    ),
    "penguin": (
        "Not Native to India",
        "Spheniscidae family",
        "Not Applicable",
        "Antarctica/Southern Hemisphere",
        "Cold regions - not India",
        ["Not applicable to India"],
        "Penguins are found in Antarctica and Southern Hemisphere, not in India. India's diving birds include Little Grebe, cormorants, and various duck species. India has rich waterfowl diversity in wetlands.",
        "Not found in India - Native to Southern Hemisphere"
    ),
    "seal": (
        "Not Native to India",
        "Pinnipedia",
        "Not Applicable",
        "Cold regions",
        "Arctic/Antarctic regions - not India",
        ["Not applicable to India"],
        "Seals are marine mammals of cold regions, not resident in Indian waters. India's marine mammals include Blue Whales, Dugongs, Gangetic Dolphins, Irrawaddy Dolphins, and various porpoise species.",
        "Not found in India - Cold water species"
    ),
    "reindeer": (
        "Not Native to India",
        "Rangifer tarandus",
        "Not Applicable",
        "Arctic regions",
        "Arctic tundra (Not found in India)",
        ["Not applicable to India"],
        "Reindeer (Caribou) are Arctic species, not found in India. India's deer species include Spotted Deer (Chital), Sambar, Barasingha (Swamp Deer), Hangul (Kashmir Stag), Hog Deer, and Muntjac.",
        "Not found in India - Arctic species"
    ),
    "crow": (
        "House Crow",
        "Corvus splendens",
        "Least Concern",
        "India",
        "Urban areas, agricultural lands across India",
        ["None - highly adaptable"],
        "House Crow is one of the most common and adaptable birds in India. Highly intelligent with problem-solving abilities. Omnivorous scavengers important for urban waste management. Form large roosts. Can recognize individual human faces.",
        "Extremely common across India"
    ),
    "parrot": (
        "Rose-ringed Parakeet",
        "Psittacula krameri",
        "Least Concern",
        "India",
        "Forests, agricultural areas, urban parks across India",
        ["Illegal wildlife trade (declining)", "Habitat loss"],
        "Rose-ringed Parakeet (Indian Ringneck) is the most common parrot in India. Distinctive red beak and green plumage. Males have pink-black neck ring. Noisy flocks often seen in urban areas. Feed on fruits, seeds, and nectar. Protected under Wildlife Protection Act.",
        "Common across India"
    ),
    "owl": (
        "Spotted Owlet",
        "Athene brama",
        "Least Concern",
        "India",
        "Open habitats, agricultural lands, urban areas across India",
        ["Habitat loss", "Pesticide poisoning"],
        "Spotted Owlet is the most common owl in India. Small owl with spotted plumage. Unlike most owls, partly diurnal (active during day). Often seen in pairs perched on trees or buildings. Important rodent controllers. Considered sacred in some cultures.",
        "Very common across India"
    ),
    "sparrow": (
        "House Sparrow",
        "Passer domesticus",
        "Least Concern (declining in urban areas)",
        "India",
        "Urban areas, agricultural lands across India",
        ["Urban development", "Loss of nesting sites", "Pollution", "Pesticides"],
        "House Sparrow is intimately associated with human habitations. Declining in major cities due to modern architecture, pollution, and lack of insects. March 20 is World Sparrow Day. Important insect controllers. Community efforts to provide nest boxes helping conservation.",
        "Common but declining in urban areas"
    ),
    "duck": (
        "Spot-billed Duck",
        "Anas poecilorhyncha",
        "Least Concern",
        "India",
        "Wetlands, lakes, rivers across India",
        ["Wetland degradation", "Pollution", "Hunting (regulated)"],
        "Spot-billed Duck is a common resident waterfowl in India. Distinctive yellow-tipped black bill with red spots. Dabbling ducks feeding on aquatic plants and invertebrates. Important indicator of wetland health. Often seen in urban lakes and ponds.",
        "Common across Indian wetlands"
    ),
    "goose": (
        "Bar-headed Goose",
        "Anser indicus",
        "Least Concern",
        "India (winter migrant)",
        "High-altitude wetlands, migrate over Himalayas",
        ["Habitat degradation", "Disturbance", "Climate change affecting migration"],
        "Bar-headed Goose is famous for flying over Himalayas during migration - highest flying bird migration. Winter visitors to India from Central Asian breeding grounds. Distinctive two black bars on white head. Large flocks seen in northern wetlands.",
        "Thousands winter in India annually"
    ),
    "swan": (
        "Mute Swan (Rare Winter Visitor)",
        "Cygnus olor",
        "Least Concern (globally)",
        "India (rare)",
        "Rare winter visitor to Kashmir wetlands",
        ["Not a regular species in India"],
        "Mute Swans are rare winter visitors to India, occasionally seen in Kashmir wetlands. Distinctive orange bill with black knob. India's regular waterfowl include Bar-headed Geese, various duck species, and migratory cranes.",
        "Rare vagrant to India"
    ),
    "turkey": (
        "Not Native to India",
        "Meleagris gallopavo",
        "Not Applicable",
        "North America",
        "Native to Americas (Not found in wild in India)",
        ["Not applicable to India"],
        "Turkeys are native to North America, not found in wild in India. India's large ground birds include Indian Peafowl (national bird), Great Indian Bustard, and various pheasant species in Himalayas.",
        "Not found in India - Native to Americas"
    ),
    "peacock": (
        "Indian Peafowl",
        "Pavo cristatus",
        "Least Concern",
        "India",
        "Forests, agricultural areas, urban peripheries across India",
        ["Habitat loss", "Illegal hunting (rare due to protected status)"],
        "Indian Peafowl (Peacock/Peahen) is India's national bird. Males have spectacular iridescent blue-green tail feathers displayed during courtship. Associated with Lord Krishna in Hindu mythology. Excellent snake hunters. Protected under Schedule I. Found throughout India except extreme northeast.",
        "Common across India"
    ),
    "pigeon": (
        "Rock Pigeon",
        "Columba livia",
        "Least Concern",
        "India",
        "Urban areas, cliffs, agricultural lands across India",
        ["None - highly successful urban adapter"],
        "Rock Pigeon is one of the most successful urban birds globally. Ancestor of domestic pigeons. Highly adaptable with diverse color morphs. Excellent navigators with magnetic sense. Important seed dispersers. Feed young with 'crop milk'. Common in all Indian cities.",
        "Extremely common across India"
    ),
    "hummingbird": (
        "Purple Sunbird (India's Hummingbird equivalent)",
        "Cinnyris asiaticus",
        "Least Concern",
        "India",
        "Gardens, forests, scrublands across India",
        ["Habitat loss", "Pesticides affecting insects and nectar sources"],
        "True hummingbirds are not found in India (Americas only). Purple Sunbird is the ecological equivalent - tiny nectar-feeding bird with iridescent plumage. Males are metallic purple-black. Important pollinators. Hover briefly while feeding. Build hanging pouch nests.",
        "Common across India"
    ),
    "woodpecker": (
        "Greater Flameback",
        "Chrysocolaptes guttacristatus",
        "Least Concern",
        "India",
        "Forests, groves, urban areas across India",
        ["Deforestation", "Loss of old trees with nesting cavities"],
        "Greater Flameback is one of India's largest and most striking woodpeckers. Golden-backed with black stripes and crimson crest. Loud calls. Excavate nest cavities providing homes for other species. Important insect controllers removing bark beetles. Found in forests and wooded urban areas.",
        "Common across Indian forests"
    ),
    "sandpiper": (
        "Common Sandpiper",
        "Actitis hypoleucos",
        "Least Concern",
        "India (winter migrant)",
        "Wetlands, riversides, coastal areas across India",
        ["Wetland degradation", "Pollution", "Disturbance"],
        "Common Sandpiper is a widespread winter migrant to India. Distinctive bobbing walk along water edges. Feeds on insects and small invertebrates. Important indicator of wetland health. Migrate from Eurasian breeding grounds. Found on almost any waterbody.",
        "Common winter migrant across India"
    ),
    "pelecaniformes": (
        "Spot-billed Pelican",
        "Pelecanus philippensis",
        "Near Threatened",
        "India",
        "Large wetlands, lakes, estuaries across India",
        ["Wetland loss", "Disturbance", "Fishing net entanglement", "Pollution"],
        "Spot-billed Pelican is a large waterbird native to India. Distinctive large bill with pouch for catching fish. Colonial nesters in trees near water. Important fish-eating birds in wetland ecosystems. Population declining due to habitat loss. Found in major wetlands.",
        "Few thousand across Indian subcontinent"
    ),
    "crab": (
        "Indian Horseshoe Crab",
        "Tachypleus gigas",
        "Endangered",
        "India",
        "Coastal waters and beaches along Indian coasts",
        ["Habitat loss", "Overharvesting", "Pollution", "Coastal development"],
        "Indian Horseshoe Crab is a 'living fossil' unchanged for 450 million years. Not true crabs but related to spiders. Important for medical research (blood detects bacterial contamination). Found along Indian coasts, especially Odisha. Protected under Wildlife Protection Act Schedule IV.",
        "Declining along Indian coasts"
    ),
    "lobster": (
        "Indian Spiny Lobster",
        "Panulirus homarus",
        "Data Deficient",
        "India",
        "Rocky reefs along Indian coasts",
        ["Overfishing", "Habitat degradation", "Climate change"],
        "Indian Spiny Lobster is found in Indo-Pacific waters including Indian coasts. Lacks large claws unlike American lobsters. Important commercially. Nocturnal scavengers. Long antennae for sensing. Regulated fishing seasons to ensure sustainability.",
        "Found along Indian coasts - commercially harvested"
    ),
    "octopus": (
        "Indian Octopus",
        "Cistopus indicus",
        "Not Evaluated",
        "India",
        "Rocky and coral reefs along Indian coasts",
        ["Overfishing", "Habitat degradation", "Pollution"],
        "Indian Octopus (Day Octopus) is common in Indian coastal waters. Highly intelligent invertebrates with problem-solving abilities. Can change color and texture instantly. Eight arms with suckers. Important in marine food webs. Commercially harvested in some regions.",
        "Common along Indian coasts"
    ),
    "oyster": (
        "Indian Backwater Oyster",
        "Crassostrea madrasensis",
        "Not Evaluated",
        "India",
        "Estuaries and backwaters along Indian coasts",
        ["Water pollution", "Overharvesting", "Habitat loss"],
        "Indian Backwater Oyster is found in estuaries and backwaters, especially Kerala and West Bengal. Filter feeders improving water quality. Commercially important for aquaculture. Form reefs providing habitat for other species. Sensitive to pollution - good water quality indicators.",
        "Common in Indian backwaters and estuaries"
    ),
    "squid": (
        "Indian Squid",
        "Loligo duvaucelii",
        "Not Evaluated",
        "India",
        "Coastal waters along Indian coasts",
        ["Overfishing", "Climate change", "Ocean acidification"],
        "Indian Squid is an important commercial species in India. Fast swimmers with jet propulsion. Can change color for camouflage and communication. Short lifespan (1 year). Important prey for many marine predators. Major fishing resource in Arabian Sea and Bay of Bengal.",
        "Common in Indian coastal waters"
    ),
    "starfish": (
        "Indian Sea Star",
        "Fromia indica/Pentaceraster spp.",
        "Not Evaluated",
        "India",
        "Coral reefs and rocky shores along Indian coasts",
        ["Coral reef degradation", "Collection for trade", "Pollution", "Climate change"],
        "Indian Sea Stars are found along Indian coasts, especially in coral reefs. Important predators controlling mussel and barnacle populations. Can regenerate lost arms. Tube feet for movement. Various species with different colors. Indicator of healthy coral reef ecosystems.",
        "Common in Indian coastal reefs"
    ),
    "seahorse": (
        "Three-spot Seahorse",
        "Hippocampus trimaculatus",
        "Vulnerable",
        "India",
        "Coastal waters, seagrass beds along Indian coasts",
        ["Habitat loss", "Illegal wildlife trade", "Bycatch in fishing", "Pollution"],
        "Three-spot Seahorse is found in Indian coastal waters. Males carry eggs in brood pouch - unique among vertebrates. Poor swimmers relying on camouflage. Important in traditional medicine (leading to overharvesting). Protected under Wildlife Protection Act Schedule I.",
        "Declining due to trade and habitat loss"
    ),
    "jellyfish": (
        "Moon Jellyfish",
        "Aurelia aurita",
        "Not Evaluated",
        "India",
        "Coastal waters and harbors along Indian coasts",
        ["Climate change causing blooms", "Pollution"],
        "Moon Jellyfish is common in Indian coastal waters. Translucent bell with four horseshoe-shaped gonads visible. Mild sting to humans. Can form massive blooms. Important food for sea turtles. Increasing in numbers globally due to climate change and overfishing of predators.",
        "Common in Indian coastal waters"
    ),
    "shark": (
        "Whale Shark",
        "Rhincodon typus",
        "Endangered",
        "India",
        "Coastal waters, especially Gujarat coast",
        ["Bycatch", "Ship strikes", "Habitat degradation", "Climate change"],
        "Whale Shark is the world's largest fish (up to 12m). Filter feeders consuming plankton - harmless to humans. Regular visitors to Gujarat coast (Saurashtra). Important ecotourism attraction. Protected under Schedule I of Wildlife Protection Act. India has conservation programs.",
        "Regular visitors to Gujarat coast"
    ),
    "turtle": (
        "Olive Ridley Sea Turtle",
        "Lepidochelys olivacea",
        "Vulnerable",
        "India",
        "Coastal waters, mass nesting beaches in Odisha",
        ["Fishing net entanglement", "Beach erosion", "Light pollution", "Poaching (reduced)", "Marine debris"],
        "Olive Ridley is the smallest sea turtle. Famous for mass nesting (arribada) at Odisha beaches - one of world's largest rookeries. Hatchlings face predators and light pollution. Protected under Schedule I. Conservation efforts by Forest Department and organizations like Operation Kachhapa.",
        "Hundreds of thousands nest in Odisha annually"
    ),
    "cat": (
        "Jungle Cat",
        "Felis chaus",
        "Least Concern",
        "India",
        "Wetlands, grasslands, scrublands across India",
        ["Habitat loss", "Wetland drainage", "Human persecution"],
        "Jungle Cat (Reed Cat/Swamp Cat) is India's most common wild cat. Medium-sized with long legs and short tail. Prefers wetland and grassland habitats. Excellent rodent controllers. Active during dawn and dusk. Protected under Schedule II of Wildlife Protection Act.",
        "Common across India in suitable habitats"
    ),
    "dog": (
        "Dhole (Indian Wild Dog)",
        "Cuon alpinus",
        "Endangered",
        "India",
        "Forests across India, especially Central India and Western Ghats",
        ["Habitat loss", "Prey depletion", "Disease from domestic dogs", "Human persecution"],
        "Dhole (Whistling Dog) is India's wild canid. Hunt in packs using whistle-like calls for communication. Cooperative hunters can take down prey larger than themselves. More endangered than tigers. Crucial role in ecosystem. Protected under Schedule II becoming Schedule I.",
        "949-2,215 in India (in packs)"
    ),
    "hamster": (
        "Indian Palm Squirrel (India's small rodent)",
        "Funambulus palmarum",
        "Least Concern",
        "India",
        "Urban areas, forests, gardens across India",
        ["None - highly adaptable"],
        "Hamsters are not native to India. Indian Palm Squirrel (Three-striped Squirrel) is a common small rodent. Distinctive three white stripes on back. Diurnal and arboreal. Important seed dispersers. Common in gardens and urban areas. Associated with Lord Rama in Hindu mythology.",
        "Extremely common across India"
    ),
    "mouse": (
        "Indian Field Mouse",
        "Mus booduga",
        "Least Concern",
        "India",
        "Agricultural fields, grasslands across India",
        ["Habitat loss", "Pesticides"],
        "Indian Field Mouse is a native wild mouse species. Important prey for snakes, owls, and small carnivores. Can cause agricultural damage but also consume insect pests. Part of natural ecosystem balance. Different from invasive house mouse.",
        "Common across India"
    ),
    "rat": (
        "Indian Bandicoot Rat",
        "Bandicota bengalensis",
        "Least Concern",
        "India",
        "Agricultural areas, wetlands, urban peripheries",
        ["Habitat conversion", "Persecution as pest"],
        "Indian Bandicoot Rat is a large rodent native to India. Agricultural pest but also important in ecosystem. Creates extensive burrow systems. Omnivorous diet. Important prey for many predators including snakes and raptors. Different from invasive urban rats.",
        "Common across India"
    ),
    "squirrel": (
        "Indian Giant Squirrel (Malabar Giant Squirrel)",
        "Ratufa indica",
        "Least Concern",
        "India",
        "Forests of Western Ghats and Central India",
        ["Deforestation", "Habitat fragmentation"],
        "Indian Giant Squirrel is one of the largest squirrels in the world (up to 1m including tail). Spectacular multi-colored fur (maroon, purple, orange). Arboreal, rarely descending to ground. Important seed dispersers. State animal of Maharashtra. Protected under Schedule II.",
        "Common in Western Ghats forests"
    ),
    "hare": (
        "Indian Hare (Black-naped Hare)",
        "Lepus nigricollis",
        "Least Concern",
        "India",
        "Grasslands, scrublands, agricultural areas across India",
        ["Habitat loss", "Hunting (illegal)", "Agricultural intensification"],
        "Indian Hare is widespread across India. Distinctive black nape stripe. Solitary unlike rabbits. Fast runners reaching 70+ km/h. Important prey for predators. Crepuscular (active dawn/dusk). Different from introduced European rabbits. Protected under Schedule IV.",
        "Common across India"
    ),
    "hedgehog": (
        "Indian Hedgehog",
        "Paraechinus micropus",
        "Least Concern",
        "India",
        "Dry regions of Northwest India, Pakistan",
        ["Habitat loss", "Roadkill", "Pesticides"],
        "Indian Hedgehog (Desert Hedgehog) is found in arid regions of Northwest India. Nocturnal insectivores with spiny coat. Hibernate during extreme heat. Important pest controllers eating scorpions, centipedes, and insects. Can survive long periods without water.",
        "Common in suitable habitats in Northwest India"
    ),
    "raccoon": (
        "Not Native - See Indian Grey Mongoose",
        "Herpestes edwardsii",
        "Least Concern",
        "India",
        "Forests, scrublands, agricultural areas across India",
        ["Habitat loss", "Roadkill"],
        "Raccoons are not native to India. Indian Grey Mongoose is ecologically similar - adaptable omnivore. Famous for fighting cobras (though not immune to venom). Diurnal unlike most mongooses. Important rodent and snake controllers. Protected under Schedule II.",
        "Common across India"
    ),
    "possum": (
        "Not Native to India",
        "Marsupial - not found in India",
        "Not Applicable",
        "Australia/Americas",
        "Not found in India",
        ["Not applicable"],
        "Possums are marsupials not found in India (native to Australia and Americas). India's nocturnal arboreal mammals include flying squirrels, lorises, and various civets.",
        "Not found in India"
    ),
    "badger": (
        "Indian Honey Badger (Ratel)",
        "Mellivora capensis indica",
        "Least Concern",
        "India",
        "Forests, grasslands across India",
        ["Habitat loss", "Human persecution", "Roadkill"],
        "Indian Honey Badger (Ratel) is renowned as one of the most fearless animals. Tough skin immune to bee stings and some snake venom. Omnivorous eating honey, small animals, insects. Powerful diggers. Despite fierce reputation, generally avoid humans. Protected under Schedule I.",
        "Uncommon across India"
    ),
    "bat": (
        "Indian Flying Fox",
        "Pteropus medius/giganteus",
        "Least Concern (but declining)",
        "India",
        "Forests, urban areas across India",
        ["Habitat loss", "Persecution", "Disturbance to roosts", "Electrocution on power lines"],
        "Indian Flying Fox is one of the largest bats. Wingspan up to 1.5m. Fruit bats crucial for pollination and seed dispersal of forest trees. Form large colonies (thousands). Often persecuted despite being harmless. Protected under Schedule V. Important for forest regeneration.",
        "Common but declining across India"
    ),
    "bee": (
        "Giant Honey Bee (Apis dorsata)",
        "Not Evaluated",
        "India",
        "Forests, agricultural areas across India",
        ["Habitat loss", "Pesticides", "Climate change", "Unsustainable harvesting"],
        "Giant Honey Bee is India's largest bee species. Build single exposed combs on trees, cliffs. Migrate seasonally. Important pollinators for wild plants and crops. More aggressive than domesticated bees. Traditional honey harvesting from wild colonies. Critical for forest ecology.",
        "Common across India but facing threats"
    ),
    "beetle": (
        "Rhinoceros Beetle",
        "Oryctes rhinoceros",
        "Not Evaluated",
        "India",
        "Coconut plantations, forests across India",
        ["Habitat loss", "Pesticides"],
        "Rhinoceros Beetle is a large beetle found across India. Males have distinctive horn. Larvae live in decaying wood, adults on palm trees. Can cause damage to coconut palms. Important in decomposition and nutrient cycling. One of strongest animals relative to body size.",
        "Common across India"
    ),
    "butterfly": (
        "Southern Birdwing",
        "Troides minos",
        "Least Concern (legally protected)",
        "India",
        "Forests of Western Ghats and South India",
        ["Habitat loss", "Illegal collection", "Deforestation"],
        "Southern Birdwing is India's largest butterfly (wingspan up to 190mm). Spectacular black and yellow coloration. Males more colorful than females. Larvae feed on Aristolochia vines. Important pollinators. Protected under Schedule I of Wildlife Protection Act - illegal to collect.",
        "Found in Western Ghats and South India"
    ),
    "caterpillar": (
        "Atlas Moth Caterpillar (largest)",
        "Attacus atlas",
        "Not Evaluated",
        "India",
        "Forests across India, especially Northeast",
        ["Deforestation", "Climate change"],
        "Atlas Moth caterpillar develops into one of the world's largest moths (wingspan up to 30cm). Caterpillars are large, green with white waxy coating. Feed on various tree leaves. Important in silk production in some regions (Fagara silk). Found in forests across India.",
        "Common in forested areas"
    ),
    "cockroach": (
        "Indian Cockroach",
        "Periplaneta americana/Blatta orientalis",
        "Not Evaluated",
        "India",
        "Urban areas, forests across India",
        ["None - highly successful"],
        "Indian Cockroaches (various species) are ancient insects (350 million years). Important decomposers in forests. Urban species are pests but forest species are ecologically important. Can survive extreme conditions. Food for many insectivores. Part of healthy ecosystems.",
        "Extremely common"
    ),
    "dragonfly": (
        "Indian Skimmer",
        "Orthetrum chrysis/sabina",
        "Vulnerable (Indian Skimmer specific)",
        "India",
        "Rivers and wetlands across India",
        ["River pollution", "Sand mining", "Habitat degradation"],
        "Dragonflies are important predators of mosquitoes and other insects. India has over 500 species. Indian Skimmer is a vulnerable species. Dragonflies are indicators of wetland health. Ancient insects (300 million years). Excellent fliers with 360° vision. Adults and larvae are predators.",
        "Common across India (various species)"
    ),
    "fly": (
        "Robber Fly (predatory species)",
        "Asilidae family",
        "Not Evaluated",
        "India",
        "Various habitats across India",
        ["Habitat loss", "Pesticides"],
        "While common flies are pests, many native fly species are ecologically important. Robber Flies are predatory, hunting other insects mid-air. Hoverflies pollinate flowers. Fruit flies aid decomposition. Important food for birds and other insectivores. Part of natural ecosystems.",
        "Various species common across India"
    ),
    "grasshopper": (
        "Indian Grasshopper",
        "Acrididae family",
        "Not Evaluated",
        "India",
        "Grasslands, agricultural areas across India",
        ["Habitat loss", "Pesticides"],
        "Indian Grasshoppers (various species) are important herbivores in grassland ecosystems. Some species can form destructive locust swarms. Important food for birds, reptiles, and small mammals. Part of food chain. Desert Locust is a significant agricultural pest during outbreaks.",
        "Common across India"
    ),
    "ladybugs": (
        "Indian Ladybird Beetle",
        "Coccinellidae family",
        "Not Evaluated",
        "India",
        "Agricultural areas, gardens across India",
        ["Pesticides killing beneficial insects"],
        "Indian Ladybird Beetles are beneficial predators of aphids and other pests. Important for biological pest control in agriculture. Various species with different spot patterns. Both adults and larvae consume large numbers of pests. Should be protected and encouraged in farms and gardens.",
        "Common across India - beneficial species"
    ),
    "mosquito": (
        "Indian Mosquito (various species)",
        "Culicidae family",
        "Not Evaluated",
        "India",
        "Wetlands, urban areas across India",
        ["None - highly successful"],
        "Indian Mosquitoes (over 400 species) include disease vectors like Anopheles (malaria), Aedes (dengue), and Culex. Despite being pests, they are important food for fish, dragonflies, birds, and bats. Aquatic larvae filter water. Control should be targeted at disease vectors, not all species.",
        "Extremely common across India"
    ),
    "moth": (
        "Atlas Moth",
        "Attacus atlas",
        "Not Evaluated",
        "India",
        "Forests across India, especially Northeast",
        ["Deforestation", "Light pollution", "Climate change"],
        "Atlas Moth is one of the largest moths in the world (wingspan up to 30cm). Found in Northeast India and Western Ghats. Adults don't feed - live on stored energy from caterpillar stage. Important pollinators. Wing patterns resemble snake heads for predator deterrence. Used for silk production (Fagara silk).",
        "Found in forested areas, especially Northeast"
    ),
    "cow": (
        "Indian Gaur (Wild Cattle)",
        "Bos gaurus",
        "Vulnerable",
        "India",
        "Forests of Western Ghats, Central India, Northeast",
        ["Habitat loss", "Disease from domestic cattle", "Poaching"],
        "While domestic cows are common, India's wild cattle is the Gaur (Indian Bison) - the largest bovine. Massive muscular build reaching 2.2m height. Distinctive white stockings. Live in herds. State animal of Goa and Bihar. Important ecosystem engineers. Protected under Schedule I.",
        "13,000-30,000 globally, majority in India"
    ),
    "donkey": (
        "Indian Wild Ass (Khur)",
        "Equus hemionus khur",
        "Endangered",
        "India",
        "Little Rann of Kutch, Gujarat",
        ["Habitat loss", "Disease", "Limited habitat range", "Climate change"],
        "Domestic donkeys are common, but India's wild equine is the Indian Wild Ass (Khur). Found only in Little Rann of Kutch, Gujarat. Fastest Indian animal (up to 70-80 km/h). Distinctive dorsal stripe. Population recovered from 870 (1969) to 6,000+ through conservation. Protected under Schedule I.",
        "6,000+ in Little Rann of Kutch, Gujarat"
    ),
    "goldfish": (
        "Indian Carp species",
        "Labeo rohita (Rohu) and others",
        "Least Concern",
        "India",
        "Rivers and lakes across India",
        ["Water pollution", "Overfishing", "Habitat degradation"],
        "Goldfish are not native (Chinese origin). India's native ornamental fish include Rohu, Catla, and various barbs. Indian Carp species are important in aquaculture and wild fisheries. Many colorful native fish like Rainbow Sharkminnow, Flying Barb exist in Indian waters.",
        "Native carp species common across India"
    ),
    "goat": (
        "Indian Ibex (Wild Goat)",
        "Capra sibirica",
        "Near Threatened",
        "India",
        "Himalayan regions of Ladakh, Himachal Pradesh",
        ["Habitat loss", "Competition with livestock", "Poaching", "Climate change"],
        "While domestic goats are common, India's wild goat is the Siberian Ibex. Found in high-altitude Himalayas (Ladakh, Spiti). Males have impressive curved horns up to 1.5m. Excellent climbers on steep cliffs. Important prey for Snow Leopards. Protected under Schedule I.",
        "Few thousand in Indian Himalayas"
    ),
    "horse": (
        "Indian Wild Ass (Khur)",
        "Equus hemionus khur",
        "Endangered",
        "India",
        "Little Rann of Kutch, Gujarat",
        ["Habitat loss", "Disease", "Limited range"],
        "While domestic horses are common, India's only wild equine is the Indian Wild Ass (Khur), not a true horse but closely related. Found exclusively in Little Rann of Kutch. Fastest Indian land animal reaching 70-80 km/h. Golden-brown coat with dark dorsal stripe. Protected under Schedule I.",
        "6,000+ in Little Rann of Kutch, Gujarat"
    ),
    "ox": (
        "Indian Gaur",
        "Bos gaurus",
        "Vulnerable",
        "India",
        "Forests of Western Ghats, Central India, Northeast",
        ["Habitat loss", "Disease from domestic cattle", "Poaching"],
        "While domestic oxen are common, India's wild bovine is the Gaur (Indian Bison). India's tallest wild animal and largest bovine species. Massive muscular build with distinctive white stockings. Important forest ecosystem engineers. State animal of Goa and Bihar. Protected under Schedule I.",
        "13,000-30,000 globally, majority in India"
    ),
    "pig": (
        "Wild Boar",
        "Sus scrofa",
        "Least Concern",
        "India",
        "Forests, grasslands, agricultural areas across India",
        ["Human-wildlife conflict", "Hunting"],
        "Wild Boar is the wild ancestor of domestic pigs. Highly adaptable omnivores found across India. Strong swimmers and fast runners (40 km/h). Live in matriarchal sounders. Significant agricultural pest but also important prey for tigers and leopards. Ecosystem engineers rooting soil.",
        "Very common across India"
    ),
    "sheep": (
        "Himalayan Blue Sheep (Bharal)",
        "Pseudois nayaur",
        "Least Concern",
        "India",
        "High-altitude Himalayas",
        ["Climate change", "Competition with livestock", "Predation pressure"],
        "While domestic sheep are common, India's wild sheep is the Himalayan Blue Sheep (Bharal). Found in high-altitude regions (3,000-5,500m) of Ladakh and Himachal. Bluish-grey coat. Important prey for Snow Leopards. Intermediate between goats and sheep. Protected under Schedule III.",
        "Few thousand in Indian Himalayas"
    ),
    "coyote": (
        "Golden Jackal (India's wild canid)",
        "Canis aureus",
        "Least Concern",
        "India",
        "Grasslands, scrublands, agricultural areas across India",
        ["Habitat loss", "Persecution", "Roadkill"],
        "Coyotes are not found in India (North American species). India's ecological equivalent is the Golden Jackal. Omnivorous scavengers and hunters. Often seen in pairs or small family groups. Important in seed dispersal and ecosystem cleanup. Adaptable to human-modified landscapes.",
        "Common across India"
    )
}

def populate_database():
    """Populate the database with all 90 animal species"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        # First, clear existing data
        print("Clearing existing data...")
        cur.execute("DELETE FROM supported_animals;")
        
        # Prepare data for batch insert
        animals_to_insert = []
        for model_class, animal_data in ANIMAL_DATA.items():
            # Unpack the tuple safely
            if len(animal_data) == 8:
                species_name, scientific_name, conservation_status, region, habitat, threats, description, population = animal_data
            else:
                print(f"⚠️  Skipping {model_class}: Invalid data format (expected 8 values, got {len(animal_data)})")
                continue
            
            # Determine category based on classification
            if model_class in ["antelope", "deer", "bison", "boar", "elephant", "rhinoceros", "hippopotamus", "gaur"]:
                category = "mammal_herbivore"
            elif model_class in ["tiger", "lion", "leopard", "bear", "wolf", "hyena", "fox"]:
                category = "mammal_carnivore"
            elif model_class in ["monkey", "chimpanzee", "gorilla", "orangutan", "panda"]:
                category = "primate"
            elif model_class in ["crow", "eagle", "hornbill", "flamingo", "parrot", "owl", "sparrow", "duck", "goose", "swan", "turkey", "peacock", "pigeon", "hummingbird", "woodpecker", "sandpiper", "pelecaniformes"]:
                category = "bird"
            elif model_class in ["snake", "lizard", "turtle"]:
                category = "reptile"
            elif model_class in ["whale", "dolphin", "seal"]:
                category = "marine_mammal"
            elif model_class in ["crab", "lobster", "octopus", "oyster", "squid", "starfish", "seahorse", "jellyfish", "shark"]:
                category = "marine_invertebrate"
            elif model_class in ["bat", "otter", "porcupine", "cat", "dog", "hamster", "mouse", "rat", "squirrel", "hare", "hedgehog", "raccoon", "possum", "badger"]:
                category = "mammal_small"
            elif model_class in ["bee", "beetle", "butterfly", "caterpillar", "cockroach", "dragonfly", "fly", "grasshopper", "ladybugs", "mosquito", "moth"]:
                category = "insect"
            elif model_class in ["cow", "donkey", "goldfish", "goat", "horse", "ox", "pig", "sheep", "coyote"]:
                category = "domesticated_wild_relative"
            else:
                category = "other"
            
            animals_to_insert.append((
                species_name,
                scientific_name,
                conservation_status,
                population,
                habitat,
                threats,
                region,
                category,
                description
            ))
        
        # Batch insert
        print(f"\nInserting {len(animals_to_insert)} animals into database...")
        insert_query = """
            INSERT INTO supported_animals 
            (species_name, scientific_name, conservation_status, population, habitat, threats, region, category, description)
            VALUES %s
        """
        execute_values(cur, insert_query, animals_to_insert)
        
        conn.commit()
        
        # Verify insertion
        cur.execute("SELECT COUNT(*) FROM supported_animals;")
        count = cur.fetchone()[0]
        print(f"\n✅ Successfully populated database with {count} animals!")
        
        # Show sample entries
        print("\n📊 Sample entries:")
        cur.execute("""
            SELECT species_name, scientific_name, conservation_status, category 
            FROM supported_animals 
            ORDER BY species_name 
            LIMIT 10;
        """)
        
        print("\n{:<30} {:<30} {:<20} {:<20}".format("Species Name", "Scientific Name", "Conservation", "Category"))
        print("-" * 100)
        for row in cur.fetchall():
            print("{:<30} {:<30} {:<20} {:<20}".format(row[0][:28], row[1][:28], row[2][:18], row[3][:18]))
        
        # Show conservation status summary
        print("\n📈 Conservation Status Summary:")
        cur.execute("""
            SELECT conservation_status, COUNT(*) as count 
            FROM supported_animals 
            GROUP BY conservation_status 
            ORDER BY count DESC;
        """)
        for row in cur.fetchall():
            print(f"  {row[0]}: {row[1]} species")
        
        cur.close()
        conn.close()
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=" * 100)
    print("🐯 WILD GUARD - Database Population Script")
    print("=" * 100)
    print("\nPopulating Wild_Guard_DB with all 90 animals from custom model...")
    print("Mapping model classes to Indian wildlife species with conservation data\n")
    
    success = populate_database()
    
    if success:
        print("\n" + "=" * 100)
        print("✅ DATABASE POPULATION COMPLETE!")
        print("=" * 100)
        sys.exit(0)
    else:
        print("\n❌ Database population failed!")
        sys.exit(1)
