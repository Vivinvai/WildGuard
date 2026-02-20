"""
Simple TensorFlow Animal ID Service - Fast Startup
Uses pre-trained MobileNetV2 from Keras Applications
Enhanced with PostgreSQL Database Integration
"""

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import sys
import logging

# Import PostgreSQL wildlife database integration
try:
    from wildlife_database import wildlife_db
    logger = logging.getLogger(__name__)
    logger.info("✅ PostgreSQL wildlife database integration loaded")
except Exception as e:
    wildlife_db = None
    logger = logging.getLogger(__name__)
    logger.warning(f"⚠️ PostgreSQL integration unavailable: {e}")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Disable TensorFlow warnings
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
tf.get_logger().setLevel('ERROR')

# Load MobileNetV2 model (downloaded once, cached locally)
logger.info("Loading MobileNetV2 model...")
try:
    model = MobileNetV2(weights='imagenet', include_top=True)
    logger.info("✅ MobileNetV2 model loaded successfully!")
except Exception as e:
    logger.error(f"❌ Failed to load model: {e}")
    sys.exit(1)

# Wildlife Database - 90+ species with Indian regional focus
WILDLIFE_DATABASE = {
    'tiger': {
        'name': 'Indian Bengal Tiger',
        'scientific': 'Panthera tigris tigris',
        'category': 'Big Cat',
        'habitat': 'Indian subcontinent forests, grasslands, and mangroves',
        'conservation': 'Endangered',
        'population': '~3,167 in India',
        'info': 'The Indian Bengal Tiger is the national animal of India and a powerful apex predator. It plays a vital role in maintaining forest ecosystem balance.'
    },
    'lion': {
        'name': 'Asiatic Lion',
        'scientific': 'Panthera leo persica',
        'category': 'Big Cat',
        'habitat': 'Gir Forest National Park, Gujarat, India',
        'conservation': 'Endangered',
        'population': '~670 in India',
        'info': 'Asiatic Lions are found only in the Gir Forest of Gujarat. They live in smaller prides compared to African lions.'
    },
    'leopard': {
        'name': 'Indian Leopard',
        'scientific': 'Panthera pardus fusca',
        'category': 'Big Cat',
        'habitat': 'Forests, grasslands, and rocky terrains across India',
        'conservation': 'Vulnerable',
        'population': '~13,000 in India',
        'info': 'The Indian Leopard is the most adaptable and widespread big cat in India. It can live close to human settlements and forests.'
    },
    'cheetah': {
        'name': 'Cheetah (Reintroduced)',
        'scientific': 'Acinonyx jubatus',
        'category': 'Big Cat',
        'habitat': 'Kuno National Park, Madhya Pradesh (reintroduction site)',
        'conservation': 'Vulnerable (IUCN Red List)',
        'info': 'Extinct in India since 1952, now being reintroduced from Africa to restore population.'
    },
    'jaguar': {
        'name': 'Jaguar',
        'scientific': 'Panthera onca',
        'category': 'Big Cat',
        'habitat': 'Not native to India (Americas)',
        'conservation': 'Near Threatened',
        'info': 'Not found in India. Native to South and Central America.'
    },
    'elephant': {
        'name': 'Indian Elephant',
        'scientific': 'Elephas maximus indicus',
        'category': 'Mammal',
        'habitat': 'Forests of South and Northeast India',
        'conservation': 'Endangered',
        'population': '~27,000 in India',
        'info': 'Indian Elephants are smaller than African elephants. Found in Western Ghats, Northeast India, and central forests. They are highly intelligent and play a key role in forest regeneration. Sacred in Hindu culture.'
    },
    'rhinoceros': {
        'name': 'Indian Rhinoceros (Greater One-Horned Rhino)',
        'scientific': 'Rhinoceros unicornis',
        'category': 'Mammal',
        'habitat': 'Kaziranga National Park, Assam and other Northeast reserves',
        'conservation': 'Vulnerable',
        'population': '~3,700 in India',
        'info': 'Found mainly in Kaziranga and Manas National Parks in Assam. Has single horn and armor-like skin. Success story of conservation efforts in India. Largest rhino species in Asia.'
    },
    'hippopotamus': {
        'name': 'Hippopotamus',
        'scientific': 'Hippopotamus amphibius',
        'category': 'Mammal',
        'habitat': 'Not native to India (Africa)',
        'conservation': 'Vulnerable',
        'info': 'Not found in India. Native to sub-Saharan Africa.'
    },
    'giraffe': {
        'name': 'Giraffe',
        'scientific': 'Giraffa camelopardalis',
        'category': 'Mammal',
        'habitat': 'Not native to India (Africa)',
        'conservation': 'Vulnerable',
        'info': 'Not found in India. Native to African savannas.'
    },
    'zebra': {
        'name': 'Zebra',
        'scientific': 'Equus zebra',
        'category': 'Mammal',
        'habitat': 'Not native to India (Africa)',
        'conservation': 'Various',
        'info': 'Not found in India. Native to African grasslands.'
    },
    'bear': {
        'name': 'Sloth Bear',
        'scientific': 'Melursus ursinus',
        'category': 'Bear',
        'habitat': 'Forests across India, especially Western Ghats',
        'conservation': 'Vulnerable',
        'population': '~6,000-8,000 in India',
        'info': 'Native to Indian subcontinent. Known for eating termites and ants using their long claws and snout. Shaggy black fur with distinctive V-shaped chest mark.'
    },
    'panda': {
        'name': 'Giant Panda',
        'scientific': 'Ailuropoda melanoleuca',
        'category': 'Bear',
        'habitat': 'Not native to India (China)',
        'conservation': 'Vulnerable',
        'info': 'Not found in India. Native to China bamboo forests.'
    },
    'polar_bear': {
        'name': 'Polar Bear',
        'scientific': 'Ursus maritimus',
        'category': 'Bear',
        'habitat': 'Not native to India (Arctic)',
        'conservation': 'Vulnerable',
        'info': 'Not found in India. Native to Arctic regions.'
    },
    'wolf': {
        'name': 'Indian Wolf',
        'scientific': 'Canis lupus pallipes',
        'category': 'Canine',
        'habitat': 'Grasslands and scrublands of central India',
        'conservation': 'Endangered',
        'population': '~2,000-3,000 in India',
        'info': 'Smaller wolf subspecies endemic to Indian subcontinent. Pack hunters found in grasslands and scrublands. Often confused with jackals. Critically endangered due to habitat loss.'
    },
    'coyote': {
        'name': 'Golden Jackal',
        'scientific': 'Canis aureus',
        'category': 'Canine',
        'habitat': 'Widespread across India in various habitats',
        'conservation': 'Least Concern',
        'info': 'Common wild canine in India. Often seen near villages. Opportunistic omnivore.'
    },
    'fox': {
        'name': 'Indian Fox (Bengal Fox)',
        'scientific': 'Vulpes bengalensis',
        'category': 'Canine',
        'habitat': 'Grasslands and semi-arid regions of India',
        'conservation': 'Least Concern',
        'population': 'Common in grasslands and semi-arid regions',
        'info': 'Endemic to Indian subcontinent. Small fox with distinctive black-tipped tail and rusty-red coat. Found in open grasslands and agricultural areas.'
    },
    'hyena': {
        'name': 'Striped Hyena',
        'scientific': 'Hyaena hyaena',
        'category': 'Carnivore',
        'habitat': 'Arid regions of Gujarat, Rajasthan, Madhya Pradesh',
        'conservation': 'Near Threatened',
        'population': '~5,000-10,000 in India',
        'info': 'Only hyena species found in India. Nocturnal scavenger and hunter found in arid and semi-arid regions. Has distinctive striped coat and powerful jaws.'
    },
    'deer': {
        'name': 'Spotted Deer (Chital)',
        'scientific': 'Axis axis',
        'category': 'Herbivore',
        'habitat': 'Forests and grasslands across India',
        'conservation': 'Least Concern',
        'population': 'Over 1,000,000 in India',
        'info': 'Most common and beautiful deer in India with distinctive spotted coat. Often seen in large herds. Important prey species for tigers and leopards.'
    },
    'antelope': {
        'name': 'Blackbuck (Indian Antelope)',
        'scientific': 'Antilope cervicapra',
        'category': 'Herbivore',
        'habitat': 'Grasslands and open plains of India',
        'conservation': 'Least Concern',
        'population': '~50,000 in India (protected)',
        'info': 'Sacred to Hindu culture and associated with Lord Krishna. Males have distinctive spiral horns and glossy black coat. Fast runners reaching speeds of 80 km/h.'
    },
    'bison': {
        'name': 'Indian Gaur (Indian Bison)',
        'scientific': 'Bos gaurus',
        'category': 'Herbivore',
        'habitat': 'Forests of Western Ghats, Central India, Northeast',
        'conservation': 'Vulnerable',
        'population': '~21,000 in India',
        'info': 'Largest bovine species in the world. Powerful build with distinctive white stockings on legs. State animal of Goa and Bihar. Found in dense forests.'
    },
    'buffalo': {
        'name': 'Wild Water Buffalo',
        'scientific': 'Bubalus arnee',
        'category': 'Herbivore',
        'habitat': 'Kaziranga, Manas National Parks in Northeast India',
        'conservation': 'Endangered',
        'population': '~200-300 in India',
        'info': 'Ancestor of domestic buffalo. Critically endangered in wild. Massive curved horns. Found primarily in Assam national parks.'
    },
    'boar': {
        'name': 'Indian Wild Boar',
        'scientific': 'Sus scrofa cristatus',
        'category': 'Mammal',
        'habitat': 'Forests, grasslands across India',
        'conservation': 'Least Concern',
        'population': 'Very common throughout India',
        'info': 'Common wild pig found across India. Important prey species for tigers and leopards. Often raids crops causing human-wildlife conflict. Omnivorous and highly adaptable.'
    },
    'gorilla': {
        'name': 'Gorilla',
        'scientific': 'Gorilla',
        'category': 'Primate',
        'habitat': 'Not native to India (Africa)',
        'conservation': 'Critically Endangered',
        'info': 'Not found in India. Native to African forests.'
    },
    'chimpanzee': {
        'name': 'Chimpanzee',
        'scientific': 'Pan troglodytes',
        'category': 'Primate',
        'habitat': 'Not native to India (Africa)',
        'conservation': 'Endangered',
        'info': 'Not found in India. Native to African forests.'
    },
    'orangutan': {
        'name': 'Orangutan',
        'scientific': 'Pongo',
        'category': 'Primate',
        'habitat': 'Not native to India (Indonesia/Malaysia)',
        'conservation': 'Critically Endangered',
        'info': 'Not found in India. Native to Sumatra and Borneo.'
    },
    'monkey': {
        'name': 'Rhesus Macaque (Indian Monkey)',
        'scientific': 'Macaca mulatta',
        'category': 'Primate',
        'habitat': 'Widespread across India - forests, cities, temples',
        'conservation': 'Least Concern',
        'population': 'Very abundant throughout India',
        'info': 'Most common monkey in India. Highly adaptable and intelligent. Sacred in Hindu culture, especially associated with Lord Hanuman. Found even in cities and temples.'
    },
    'kangaroo': {
        'name': 'Kangaroo',
        'scientific': 'Macropodidae',
        'category': 'Marsupial',
        'habitat': 'Not native to India (Australia)',
        'conservation': 'Various',
        'info': 'Not found in India. Native to Australia.'
    },
    'koala': {
        'name': 'Koala',
        'scientific': 'Phascolarctos cinereus',
        'category': 'Marsupial',
        'habitat': 'Not native to India (Australia)',
        'conservation': 'Vulnerable',
        'info': 'Not found in India. Native to Australia.'
    },
    'wombat': {
        'name': 'Wombat',
        'scientific': 'Vombatidae',
        'category': 'Marsupial',
        'habitat': 'Not native to India (Australia)',
        'conservation': 'Various',
        'info': 'Not found in India. Native to Australia.'
    },
    'eagle': {
        'name': 'Indian Eagle (Crested Serpent Eagle)',
        'scientific': 'Spilornis cheela',
        'category': 'Bird of Prey',
        'habitat': 'Forests across India',
        'conservation': 'Least Concern',
        'info': 'Common raptor in Indian forests. Known for hunting snakes and reptiles.'
    },
    'owl': {
        'name': 'Indian Spotted Owlet',
        'scientific': 'Athene brama',
        'category': 'Bird',
        'habitat': 'Open habitats, farmlands, urban areas across India',
        'conservation': 'Least Concern',
        'info': 'Small owl common in India. Often seen during daytime. Associated with goddess Lakshmi.'
    },
    'flamingo': {
        'name': 'Greater Flamingo',
        'scientific': 'Phoenicopterus roseus',
        'category': 'Bird',
        'habitat': 'Coastal areas, wetlands (Kutch, Chilika Lake)',
        'conservation': 'Least Concern',
        'info': 'Migratory bird visiting India. Large flocks seen in Gujarat and Odisha wetlands.'
    },
    'penguin': {
        'name': 'Penguin',
        'scientific': 'Spheniscidae',
        'category': 'Bird',
        'habitat': 'Not native to India (Antarctica/Southern Hemisphere)',
        'conservation': 'Various',
        'info': 'Not found in India. Native to Southern Hemisphere.'
    },
    'parrot': {
        'name': 'Indian Rose-Ringed Parakeet',
        'scientific': 'Psittacula krameri',
        'category': 'Bird',
        'habitat': 'Widespread across India in forests and urban areas',
        'conservation': 'Least Concern',
        'info': 'Most common parrot in India. Bright green with distinctive neck ring. Often kept as pets.'
    },
    'peacock': {
        'name': 'Indian Peafowl (Peacock)',
        'scientific': 'Pavo cristatus',
        'category': 'Bird',
        'habitat': 'Forests, farmlands across India',
        'conservation': 'Least Concern',
        'population': 'Millions in India',
        'info': 'National bird of India. Males have spectacular iridescent blue-green tail display with eye-spots. Sacred bird in Hindu and Buddhist traditions. Found throughout Indian subcontinent.'
    },
    'duck': {
        'name': 'Indian Spot-Billed Duck',
        'scientific': 'Anas poecilorhyncha',
        'category': 'Bird',
        'habitat': 'Wetlands, lakes, rivers across India',
        'conservation': 'Least Concern',
        'info': 'Common resident duck in India. Found in freshwater habitats.'
    },
    'goose': {
        'name': 'Bar-Headed Goose',
        'scientific': 'Anser indicus',
        'category': 'Bird',
        'habitat': 'High-altitude lakes in Himalayas (summer), wetlands (winter)',
        'conservation': 'Least Concern',
        'info': 'Migratory goose. Famous for flying over Himalayas at extreme altitudes.'
    },
    'swan': {
        'name': 'Swan (Migratory)',
        'scientific': 'Cygnus',
        'category': 'Bird',
        'habitat': 'Rare visitor to North Indian wetlands',
        'conservation': 'Various',
        'info': 'Not commonly found in India. Occasional migratory visitors to northern wetlands.'
    },
    'crow': {
        'name': 'Indian House Crow',
        'scientific': 'Corvus splendens',
        'category': 'Bird',
        'habitat': 'Urban and rural areas across India',
        'conservation': 'Least Concern',
        'info': 'Extremely common in India. Highly intelligent and adaptable. Often seen in cities.'
    },
    'sparrow': {
        'name': 'House Sparrow',
        'scientific': 'Passer domesticus',
        'category': 'Bird',
        'habitat': 'Urban and rural areas across India',
        'conservation': 'Least Concern (declining in cities)',
        'info': 'Once very common in Indian cities. Now declining due to urbanization and pollution.'
    },
    'pigeon': {
        'name': 'Rock Pigeon (Blue Rock Pigeon)',
        'scientific': 'Columba livia',
        'category': 'Bird',
        'habitat': 'Urban and rural areas across India',
        'conservation': 'Least Concern',
        'info': 'Very common in Indian cities. Ancestor of domestic pigeons. Often fed at temples.'
    },
    'hummingbird': {
        'name': 'Sunbird (India\'s Hummingbird)',
        'scientific': 'Nectariniidae',
        'category': 'Bird',
        'habitat': 'Gardens, forests across India',
        'conservation': 'Least Concern',
        'info': 'India has no true hummingbirds. Sunbirds fill similar ecological niche - small, nectar-feeding, colorful.'
    },
    'hornbill': {
        'name': 'Indian Great Hornbill',
        'scientific': 'Buceros bicornis',
        'category': 'Bird',
        'habitat': 'Western Ghats and Northeast forests',
        'conservation': 'Vulnerable (IUCN Red List)',
        'info': 'State bird of Kerala and Arunachal Pradesh. Large distinctive casque on bill. Important seed disperser.'
    },
    'woodpecker': {
        'name': 'Indian Golden-Backed Woodpecker',
        'scientific': 'Dinopium benghalense',
        'category': 'Bird',
        'habitat': 'Forests and woodlands across India',
        'conservation': 'Least Concern',
        'info': 'Common woodpecker in India. Golden-yellow back with distinctive black and white face.'
    },
    'snake': {
        'name': 'Indian Python (Rock Python)',
        'scientific': 'Python molurus',
        'category': 'Reptile',
        'habitat': 'Forests, grasslands, near water bodies across India',
        'conservation': 'Least Concern (protected in India)',
        'info': 'Non-venomous constrictor. One of largest snakes in India. Protected under Wildlife Act.'
    },
    'cobra': {
        'name': 'Indian Cobra (Spectacled Cobra)',
        'scientific': 'Naja naja',
        'category': 'Reptile',
        'habitat': 'Throughout India in various habitats',
        'conservation': 'Least Concern',
        'population': 'Common but declining',
        'info': 'Highly venomous snake with iconic hood marking. Sacred in Hindu culture as associated with Lord Shiva. Responsible for many snakebites in India. Protected under Wildlife Act.'
    },
    'lizard': {
        'name': 'Indian Monitor Lizard (Bengal Monitor)',
        'scientific': 'Varanus bengalensis',
        'category': 'Reptile',
        'habitat': 'Throughout India in various habitats',
        'conservation': 'Least Concern (protected in India)',
        'info': 'Large lizard found across India. Often mistaken for small crocodile. Protected species.'
    },
    'turtle': {
        'name': 'Indian Flapshell Turtle',
        'scientific': 'Lissemys punctata',
        'category': 'Reptile',
        'habitat': 'Rivers, ponds, wetlands across India',
        'conservation': 'Vulnerable',
        'info': 'Freshwater turtle native to India. Leathery shell that can close completely. Often seen basking.'
    },
    'crocodile': {
        'name': 'Mugger Crocodile (Indian Crocodile)',
        'scientific': 'Crocodylus palustris',
        'category': 'Reptile',
        'habitat': 'Rivers, lakes throughout India',
        'conservation': 'Vulnerable',
        'population': '~5,000-10,000 in India',
        'info': 'Most common crocodile in India. Also called marsh crocodile. Found in freshwater habitats. Important apex predator in aquatic ecosystems.'
    },
    'alligator': {
        'name': 'Saltwater Crocodile (in India)',
        'scientific': 'Crocodylus porosus',
        'category': 'Reptile',
        'habitat': 'Sundarbans, Andaman Islands, coastal areas',
        'conservation': 'Least Concern (protected in India)',
        'info': 'Largest living reptile. Found in Sundarbans. True alligators not native to India.'
    },
    'frog': {
        'name': 'Indian Bullfrog',
        'scientific': 'Hoplobatrachus tigerinus',
        'category': 'Amphibian',
        'habitat': 'Wetlands, rice fields across India',
        'conservation': 'Least Concern',
        'info': 'Large common frog. Males turn bright yellow during monsoon breeding season.'
    },
    'dolphin': {
        'name': 'Gangetic Dolphin (Indian River Dolphin)',
        'scientific': 'Platanista gangetica',
        'category': 'Marine Mammal',
        'habitat': 'Ganges, Brahmaputra river systems',
        'conservation': 'Endangered',
        'population': '~2,500-3,000 in India',
        'info': 'National aquatic animal of India. Nearly blind freshwater dolphin using echolocation. Found only in Ganges-Brahmaputra-Meghna river system. Critically important indicator of river health.'
    },
    'whale': {
        'name': 'Blue Whale (visiting Indian waters)',
        'scientific': 'Balaenoptera musculus',
        'category': 'Marine Mammal',
        'habitat': 'Indian Ocean waters',
        'conservation': 'Endangered',
        'info': 'Largest animal on Earth. Occasionally spotted in Indian Ocean waters off Indian coast.'
    },
    'seal': {
        'name': 'Seal',
        'scientific': 'Phocidae',
        'category': 'Marine Mammal',
        'habitat': 'Not commonly found in Indian waters',
        'conservation': 'Various',
        'info': 'Rare visitors to Indian coastal waters. Not native to region.'
    },
    'shark': {
        'name': 'Whale Shark (visiting Indian waters)',
        'scientific': 'Rhincodon typus',
        'category': 'Fish',
        'habitat': 'Coastal waters off Gujarat, Kerala',
        'conservation': 'Endangered',
        'info': 'Largest fish species. Seen off Gujarat coast. Filter feeder, harmless to humans.'
    },
    'octopus': {
        'name': 'Common Octopus',
        'scientific': 'Octopus vulgaris',
        'category': 'Cephalopod',
        'habitat': 'Coastal waters around India',
        'conservation': 'Least Concern',
        'info': 'Found in Indian coastal waters. Important marine species.'
    },
    'squid': {
        'name': 'Indian Squid',
        'scientific': 'Loligo duvaucelii',
        'category': 'Cephalopod',
        'habitat': 'Coastal waters around India',
        'conservation': 'Least Concern',
        'info': 'Common in Indian waters. Important fishery species.'
    },
    'jellyfish': {
        'name': 'Jellyfish',
        'scientific': 'Medusozoa',
        'category': 'Cnidarian',
        'habitat': 'Coastal waters around India',
        'conservation': 'Various',
        'info': 'Various species found in Indian waters. Can sting swimmers.'
    },
    'crab': {
        'name': 'Indian Mud Crab',
        'scientific': 'Scylla serrata',
        'category': 'Crustacean',
        'habitat': 'Mangroves, estuaries along Indian coast',
        'conservation': 'Not Evaluated',
        'info': 'Common in Indian mangroves and coastal areas. Important food source.'
    },
    'lobster': {
        'name': 'Indian Spiny Lobster',
        'scientific': 'Panulirus homarus',
        'category': 'Crustacean',
        'habitat': 'Rocky coastal waters around India',
        'conservation': 'Not Evaluated',
        'info': 'Found in Indian coastal waters. Important commercial species.'
    },
    'starfish': {
        'name': 'Crown-of-thorns Starfish',
        'scientific': 'Acanthaster planci',
        'category': 'Echinoderm',
        'habitat': 'Coral reefs in Lakshadweep, Andaman Islands',
        'conservation': 'Not Evaluated',
        'info': 'Found in Indian coral reefs. Can damage coral when in large numbers.'
    },
    'seahorse': {
        'name': 'Indian Seahorse',
        'scientific': 'Hippocampus kuda',
        'category': 'Fish',
        'habitat': 'Coastal waters, seagrass beds around India',
        'conservation': 'Vulnerable',
        'info': 'Found in Indian coastal waters. Threatened by habitat loss and collection.'
    },
    'otter': {
        'name': 'Smooth-Coated Otter',
        'scientific': 'Lutrogale perspicillata',
        'category': 'Mammal',
        'habitat': 'Rivers, wetlands across India',
        'conservation': 'Vulnerable (IUCN Red List)',
        'info': 'Found in Indian rivers and wetlands. Social animals, often seen in groups.'
    },
    'raccoon': {
        'name': 'Raccoon',
        'scientific': 'Procyon lotor',
        'category': 'Mammal',
        'habitat': 'Not native to India (North America)',
        'conservation': 'Least Concern',
        'info': 'Not found in India. Native to North America.'
    },
    'badger': {
        'name': 'Indian Honey Badger (Ratel)',
        'scientific': 'Mellivora capensis',
        'category': 'Mammal',
        'habitat': 'Dry forests, grasslands in parts of India',
        'conservation': 'Least Concern',
        'info': 'Found in parts of India. Fearless predator known for attacking bee hives for honey.'
    },
    'porcupine': {
        'name': 'Indian Crested Porcupine',
        'scientific': 'Hystrix indica',
        'category': 'Rodent',
        'habitat': 'Forests, scrublands across India',
        'conservation': 'Least Concern',
        'info': 'Large rodent with distinctive quills. Nocturnal. Often raids crops.'
    },
    'squirrel': {
        'name': 'Indian Palm Squirrel',
        'scientific': 'Funambulus palmarum',
        'category': 'Rodent',
        'habitat': 'Urban and rural areas across India',
        'conservation': 'Least Concern',
        'info': 'Very common striped squirrel. Often seen in gardens and parks. Three distinctive stripes.'
    },
    'hamster': {
        'name': 'Hamster',
        'scientific': 'Cricetinae',
        'category': 'Rodent',
        'habitat': 'Not native to India',
        'conservation': 'Various',
        'info': 'Not found in wild in India. Popular as pets.'
    },
    'rat': {
        'name': 'Indian Rat (Bandicoot)',
        'scientific': 'Bandicota bengalensis',
        'category': 'Rodent',
        'habitat': 'Urban and rural areas across India',
        'conservation': 'Least Concern',
        'info': 'Large rat common in India. Agricultural pest but also important in ecosystem.'
    },
    'mouse': {
        'name': 'Indian Field Mouse',
        'scientific': 'Mus booduga',
        'category': 'Rodent',
        'habitat': 'Fields, grasslands across India',
        'conservation': 'Least Concern',
        'info': 'Small mouse found in Indian fields. Important prey for snakes and birds of prey.'
    },
    'hedgehog': {
        'name': 'Indian Long-Eared Hedgehog',
        'scientific': 'Hemiechinus collaris',
        'category': 'Mammal',
        'habitat': 'Dry regions of Northwest India',
        'conservation': 'Least Concern',
        'info': 'Found in arid regions of India. Distinctive long ears. Nocturnal insectivore.'
    },
    'bat': {
        'name': 'Indian Flying Fox (Fruit Bat)',
        'scientific': 'Pteropus giganteus',
        'category': 'Mammal',
        'habitat': 'Throughout India in trees near water',
        'conservation': 'Least Concern',
        'info': 'Large fruit bat common in India. Important pollinators. Roost in large colonies in trees.'
    },
    'butterfly': {
        'name': 'Indian Monarch Butterfly',
        'scientific': 'Danaus chrysippus',
        'category': 'Insect',
        'habitat': 'Gardens, fields across India',
        'conservation': 'Not Evaluated',
        'info': 'Common orange butterfly in India. Important pollinator. Larvae feed on milkweed.'
    },
    'bee': {
        'name': 'Indian Honey Bee',
        'scientific': 'Apis cerana indica',
        'category': 'Insect',
        'habitat': 'Throughout India',
        'conservation': 'Not Evaluated',
        'info': 'Native honey bee of India. Important pollinator and honey producer. Smaller than European bees.'
    },
    'dragonfly': {
        'name': 'Indian Dragonfly',
        'scientific': 'Pantala flavescens',
        'category': 'Insect',
        'habitat': 'Near water bodies across India',
        'conservation': 'Not Evaluated',
        'info': 'Common in India. Excellent fliers. Help control mosquito populations.'
    },
    'ladybug': {
        'name': 'Asian Ladybug',
        'scientific': 'Harmonia axyridis',
        'category': 'Insect',
        'habitat': 'Gardens, fields across Asia including India',
        'conservation': 'Not Evaluated',
        'info': 'Found in India. Beneficial insect that eats aphids and pests.'
    },
    'red_panda': {
        'name': 'Red Panda',
        'scientific': 'Ailurus fulgens',
        'category': 'Mammal',
        'habitat': 'Eastern Himalayas in Sikkim, Arunachal Pradesh, West Bengal',
        'conservation': 'Endangered',
        'population': '~6,000-7,000 in India',
        'info': 'Found in high-altitude forests of Eastern Himalayas. Arboreal mammal that feeds mainly on bamboo. State animal of Sikkim. Critically important for biodiversity conservation.'
    },
    'great_indian_bustard': {
        'name': 'Great Indian Bustard',
        'scientific': 'Ardeotis nigriceps',
        'category': 'Bird',
        'habitat': 'Grasslands of Rajasthan, Gujarat, Maharashtra',
        'conservation': 'Critically Endangered',
        'population': '~150 remaining in India',
        'info': 'One of the heaviest flying birds in the world. Found in dry grasslands and scrublands. Critically endangered with less than 150 individuals remaining. Conservation priority species.'
    },
    'crested_serpent_eagle': {
        'name': 'Crested Serpent Eagle',
        'scientific': 'Spilornis cheela',
        'category': 'Bird of Prey',
        'habitat': 'Forests across India',
        'conservation': 'Least Concern',
        'population': 'Common throughout forested regions',
        'info': 'Medium-sized raptor commonly found in Indian forests. Known for hunting snakes and reptiles. Distinctive crest on head and loud whistling call.'
    },
}

# ImageNet to Wildlife mapping - maps ImageNet labels to our database
IMAGENET_TO_WILDLIFE = {
    # BIG CATS - Map to Indian species
    'tiger': 'tiger',  # Maps to Indian Bengal Tiger
    'tiger_cat': 'tiger',  # Maps to Indian Bengal Tiger
    'Bengal_tiger': 'tiger',
    'lion': 'lion',  # Maps to Asiatic Lion
    'African_lion': 'lion',  # Also maps to Asiatic Lion (context-based)
    'leopard': 'leopard',  # Maps to Indian Leopard
    'cheetah': 'cheetah',
    'jaguar': 'jaguar',
    'snow_leopard': 'leopard',
    
    # ELEPHANTS - Map to Indian Elephant
    'elephant': 'elephant',  # Maps to Indian Elephant
    'African_elephant': 'elephant',  # Maps to Indian Elephant (context)
    'Indian_elephant': 'elephant',
    'tusker': 'elephant',  # Maps to Indian Elephant
    
    # RHINOCEROS
    'rhinoceros': 'rhinoceros',
    'hippopotamus': 'hippopotamus',
    'giraffe': 'giraffe',
    'zebra': 'zebra',
    'bear': 'bear',
    'brown_bear': 'bear',
    'American_black_bear': 'bear',
    'polar_bear': 'polar_bear',
    'panda': 'panda',
    'giant_panda': 'panda',
    'lesser_panda': 'red_panda',
    'red_panda': 'red_panda',
    'wolf': 'wolf',
    'timber_wolf': 'wolf',
    'white_wolf': 'wolf',
    'red_wolf': 'wolf',
    'coyote': 'coyote',
    'fox': 'fox',
    'red_fox': 'fox',
    'grey_fox': 'fox',
    'kit_fox': 'fox',
    'Arctic_fox': 'fox',
    'hyena': 'hyena',
    'deer': 'deer',
    'impala': 'antelope',
    'gazelle': 'antelope',
    'antelope': 'antelope',
    'hartebeest': 'antelope',
    'bison': 'bison',
    'American_bison': 'bison',
    'buffalo': 'buffalo',
    'water_buffalo': 'buffalo',
    'wild_boar': 'boar',
    'warthog': 'boar',
    'hog': 'boar',
    'gorilla': 'gorilla',
    'chimpanzee': 'chimpanzee',
    'orangutan': 'orangutan',
    'monkey': 'monkey',
    'macaque': 'monkey',
    'baboon': 'monkey',
    'langur': 'monkey',
    'capuchin': 'monkey',
    'kangaroo': 'kangaroo',
    'koala': 'koala',
    'wombat': 'wombat',
    'eagle': 'eagle',
    'bald_eagle': 'eagle',
    'golden_eagle': 'eagle',
    'serpent_eagle': 'crested_serpent_eagle',
    'crested_serpent_eagle': 'crested_serpent_eagle',
    'owl': 'owl',
    'great_grey_owl': 'owl',
    'flamingo': 'flamingo',
    'penguin': 'penguin',
    'king_penguin': 'penguin',
    'parrot': 'parrot',
    'African_grey': 'parrot',
    'macaw': 'parrot',
    'cockatoo': 'parrot',
    'peacock': 'peacock',
    'duck': 'duck',
    'goose': 'goose',
    'swan': 'swan',
    'black_swan': 'swan',
    'crow': 'crow',
    'raven': 'crow',
    'magpie': 'crow',
    'sparrow': 'sparrow',
    'pigeon': 'pigeon',
    'hummingbird': 'hummingbird',
    'hornbill': 'hornbill',
    'toucan': 'hornbill',
    'woodpecker': 'woodpecker',
    'snake': 'snake',
    'cobra': 'cobra',
    'king_cobra': 'cobra',
    'Indian_cobra': 'cobra',
    'boa_constrictor': 'snake',
    'rock_python': 'snake',
    'python': 'snake',
    'lizard': 'lizard',
    'komodo_dragon': 'lizard',
    'iguana': 'lizard',
    'turtle': 'turtle',
    'terrapin': 'turtle',
    'tortoise': 'turtle',
    'crocodile': 'crocodile',
    'American_alligator': 'alligator',
    'alligator': 'alligator',
    'tailed_frog': 'frog',
    'tree_frog': 'frog',
    'bullfrog': 'frog',
    'killer_whale': 'whale',
    'grey_whale': 'whale',
    'sea_lion': 'seal',
    'seal': 'seal',
    'great_white_shark': 'shark',
    'hammerhead': 'shark',
    'tiger_shark': 'shark',
}

def preprocess_image(image_bytes):
    """Preprocess image for MobileNetV2"""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, 0)
        img_array = preprocess_input(img_array)
        return img_array
    except Exception as e:
        raise ValueError(f"Invalid image: {e}")

def map_to_wildlife(imagenet_label):
    """Map ImageNet label to wildlife name using database"""
    label_lower = imagenet_label.lower().replace(' ', '_').replace('-', '_')
    
    # Filter out non-animal objects
    NON_ANIMAL_KEYWORDS = [
        'cart', 'wagon', 'vehicle', 'bicycle', 'car', 'truck', 'boat', 'oxcart',
        'furniture', 'table', 'chair', 'bench', 'building', 'house',
        'food', 'bread', 'cake', 'pizza', 'tool', 'weapon', 'gun',
        'clothing', 'shoe', 'hat', 'ball', 'umbrella', 'bag', 'book', 'carton'
    ]
    
    # Check if it's a non-animal object
    for keyword in NON_ANIMAL_KEYWORDS:
        if keyword in label_lower:
            return None  # Filter out completely
    
    # Try to find in mapping
    wildlife_key = IMAGENET_TO_WILDLIFE.get(imagenet_label)
    if not wildlife_key:
        wildlife_key = IMAGENET_TO_WILDLIFE.get(label_lower)
    
    # Get from database
    if wildlife_key and wildlife_key in WILDLIFE_DATABASE:
        animal = WILDLIFE_DATABASE[wildlife_key]
        return {
            'name': animal['name'],
            'scientific_name': animal['scientific'],
            'category': animal['category'],
            'habitat': animal.get('habitat', 'Various habitats'),
            'conservation': animal.get('conservation', 'Not evaluated'),
            'info': animal.get('info', 'Wildlife species'),
            'database_match': True
        }
    
    # Fallback to cleaned label  
    return {
        'name': imagenet_label.replace('_', ' ').title(),
        'scientific_name': 'Unknown',
        'category': 'Unclassified',
        'habitat': 'Unknown',
        'conservation': 'Not evaluated',
        'info': 'Species not in wildlife database',
        'database_match': False
    }

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'TensorFlow Animal Identification',
        'model': 'MobileNetV2',
        'version': tf.__version__
    })

@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'service': 'WildGuard Animal Identification API',
        'version': '2.0-FAST',
        'model': 'MobileNetV2 (ImageNet)',
        'endpoints': {
            'health': 'GET /health',
            'identify': 'POST /identify/animal',
            'flora': 'POST /identify/flora'
        },
        'status': 'online'
    })

@app.route('/identify/animal', methods=['POST'])
def identify_animal():
    """Identify animal from image"""
    try:
        # Get image from request
        if 'image' not in request.files and 'image' not in request.json:
            return jsonify({'error': 'No image provided'}), 400
        
        # Handle file upload or base64
        if 'image' in request.files:
            image_bytes = request.files['image'].read()
        else:
            import base64
            image_data = request.json['image']
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_data)
        
        # Preprocess and predict
        img_array = preprocess_image(image_bytes)
        predictions = model.predict(img_array, verbose=0)
        
        # Decode predictions - get top 10 to filter better
        decoded = decode_predictions(predictions, top=10)[0]
        
        # Format results with wildlife mapping and filter out non-animals
        all_results = []
        animal_results = []
        
        # Track similar species that need prioritization
        tiger_results = []  # Track tiger vs tiger_cat
        elephant_results = []  # Track elephant vs African_elephant
        wolf_results = []  # Track wolf vs coyote
        bear_results = []  # Track different bear types
        
        for i, (imagenet_id, label, score) in enumerate(decoded):
            wildlife_data = map_to_wildlife(label)
            
            # Skip non-animal objects
            if wildlife_data is None:
                continue
                
            result = {
                'rank': len(animal_results) + 1,
                'species': wildlife_data['name'],
                'scientific_name': wildlife_data['scientific_name'],
                'category': wildlife_data['category'],
                'habitat': wildlife_data.get('habitat', 'Various habitats'),
                'conservation': wildlife_data.get('conservation', 'Not evaluated'),
                'info': wildlife_data.get('info', ''),
                'confidence': float(score),
                'imagenet_label': label,
                'in_database': wildlife_data['database_match'],
                'population': wildlife_data.get('population', '')
            }
            
            # Track tiger detections - prefer 'tiger' over 'tiger_cat'
            if label in ['tiger', 'tiger_cat']:
                tiger_results.append((label, score, result))
            
            # Track elephant detections - prefer 'elephant' (Indian) over 'African_elephant'
            elif label in ['elephant', 'Indian_elephant', 'African_elephant']:
                elephant_results.append((label, score, result))
            
            # Track wolf detections - prefer 'wolf' over 'coyote' for Indian context
            elif label in ['wolf', 'timber_wolf', 'white_wolf', 'coyote']:
                wolf_results.append((label, score, result))
            
            # Track bear detections - prefer specific types
            elif label in ['bear', 'brown_bear', 'American_black_bear', 'sloth_bear']:
                bear_results.append((label, score, result))
            
            animal_results.append(result)
            
            # Stop after finding 8 animal matches for better filtering
            if len(animal_results) >= 8:
                break
        
        # Prioritize correct species based on Indian context
        
        # If we detected both 'tiger' and 'tiger_cat', boost the real 'tiger'
        if len(tiger_results) > 1:
            for label, score, result in tiger_results:
                if label == 'tiger':
                    if animal_results[0]['imagenet_label'] != 'tiger':
                        animal_results = [r for r in animal_results if r['imagenet_label'] != result['imagenet_label']]
                        animal_results.insert(0, result)
                    break
        
        # Prioritize Indian Elephant over African Elephant
        if len(elephant_results) > 1:
            for label, score, result in elephant_results:
                if label in ['elephant', 'Indian_elephant']:
                    if animal_results[0]['imagenet_label'] not in ['elephant', 'Indian_elephant']:
                        animal_results = [r for r in animal_results if r['imagenet_label'] != result['imagenet_label']]
                        animal_results.insert(0, result)
                    break
        
        # Prioritize wolf over coyote for Indian context
        if len(wolf_results) > 1:
            for label, score, result in wolf_results:
                if label in ['wolf', 'timber_wolf']:
                    if animal_results[0]['imagenet_label'] not in ['wolf', 'timber_wolf']:
                        animal_results = [r for r in animal_results if r['imagenet_label'] != result['imagenet_label']]
                        animal_results.insert(0, result)
                    break
        
        # Prioritize Sloth Bear for Indian context
        if len(bear_results) > 1:
            for label, score, result in bear_results:
                if label == 'sloth_bear':
                    if animal_results[0]['imagenet_label'] != 'sloth_bear':
                        animal_results = [r for r in animal_results if r['imagenet_label'] != result['imagenet_label']]
                        animal_results.insert(0, result)
                    break
        
        # Limit to top 5 results after prioritization
        animal_results = animal_results[:5]
        
        # Use the best animal result
        if len(animal_results) > 0:
            primary = animal_results[0]
            
            # ✨ ENHANCED: Enrich with PostgreSQL database if available
            if wildlife_db and wildlife_db.conn:
                enriched = wildlife_db.enrich_identification(primary['species'], primary)
                if enriched.get('database_enhanced'):
                    logger.info(f"✅ Enriched with PostgreSQL: {enriched['species']}")
                    primary = enriched
            
            results = animal_results
            
            # Add confidence notes
            if primary['confidence'] < 0.15:
                primary['note'] = "⚠️ Very low confidence - image may be unclear or animal not in frame"
            elif primary['confidence'] < 0.40:
                primary['note'] = "⚠️ Low confidence - animal may be partially visible or in unusual position"
            elif primary['confidence'] < 0.70:
                primary['note'] = "✓ Moderate confidence - reasonable identification"
            else:
                primary['note'] = "✓✓ High confidence identification"
                
            # Add detailed database info
            if primary.get('in_database') or primary.get('database_enhanced'):
                habitat = primary.get('habitat', 'Various habitats')
                conservation = primary.get('conservation_status', primary.get('conservation', 'Not evaluated'))
                primary['note'] += f"\n📍 Habitat: {habitat}\n🔴 Status: {conservation}"
        else:
            # If no animals detected, still try to return SOMETHING from all_results
            if len(all_results) > 0:
                primary = all_results[0]
                primary['note'] = "⚠️ Low confidence - detected object may not be an animal"
                results = all_results[:5]
            else:
                # Absolutely nothing detected
                primary = {
                    'rank': 1,
                    'species': 'Unknown Animal',
                    'scientific_name': 'Unknown',
                    'category': 'Unidentified',
                    'habitat': 'Unknown',
                    'conservation': 'Not evaluated',
                    'confidence': 0.1,
                    'imagenet_label': 'none',
                    'note': '⚠️ Could not identify animal - please upload a clearer image with animal clearly visible'
                }
                results = []
        
        logger.info(f"Identified: {primary['species']} ({primary['confidence']*100:.1f}%)")
        
        # Build response with database information  
        response = {
            'success': True,
            'species': primary.get('species', primary.get('name', 'Unknown Animal')),
            'scientific_name': primary.get('scientific_name', 'Unknown'),
            'category': primary.get('category', 'Animal'),
            'habitat': primary.get('habitat', 'Various habitats'),
            'conservation_status': primary.get('conservation_status', primary.get('conservation', 'Not evaluated')),
            'population': primary.get('population', 'Data unavailable'),
            'threats': primary.get('threats', []),
            'region': primary.get('region', 'Various regions'),
            'description': primary.get('description', primary.get('info', 'Wildlife species information')),
            'info': primary.get('info', ''),
            'confidence': primary['confidence'],
            'note': primary.get('note', ''),
            'results': results,
            'model': 'MobileNetV2 + PostgreSQL Wildlife Database',
            'database_enhanced': primary.get('database_enhanced', False),
            
            # Legacy fields for compatibility
            'animal': primary.get('species', primary.get('name', 'Unknown')),
            'scientificName': primary.get('scientific_name', ''),
            'commonNames': [primary.get('species', primary.get('name', 'Unknown'))],
            'conservationStatus': primary.get('conservation_status', primary.get('conservation', 'Check IUCN Red List')),
            'alternativePredictions': results[1:] if len(results) > 1 else []
        }
        
        return jsonify(response)
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Error: {e}")
        return jsonify({'error': f'Internal error: {str(e)}'}), 500

@app.route('/identify/flora', methods=['POST'])
def identify_flora():
    """Identify plant from image (uses same model, different mapping)"""
    try:
        if 'image' not in request.files and 'image' not in request.json:
            return jsonify({'error': 'No image provided'}), 400
        
        # Handle file upload or base64
        if 'image' in request.files:
            image_bytes = request.files['image'].read()
        else:
            import base64
            image_data = request.json['image']
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_data)
        
        # Preprocess and predict
        img_array = preprocess_image(image_bytes)
        predictions = model.predict(img_array, verbose=0)
        
        # Decode predictions
        decoded = decode_predictions(predictions, top=5)[0]
        
        # Format results
        results = []
        for i, (_, label, score) in enumerate(decoded):
            results.append({
                'rank': i + 1,
                'name': label.replace('_', ' ').title(),
                'confidence': float(score)
            })
        
        return jsonify({
            'success': True,
            'plant': results[0]['name'],
            'confidence': results[0]['confidence'],
            'results': results
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("="*60)
    logger.info("🐾 WildGuard Animal Identification Service")
    logger.info(f"TensorFlow: {tf.__version__}")
    logger.info("Model: MobileNetV2 (Fast Startup)")
    logger.info("="*60)
    logger.info("\n✅ Starting server on http://localhost:5004")
    logger.info("Endpoints:")
    logger.info("  GET  /health              - Health check")
    logger.info("  POST /identify/animal     - Identify animal")
    logger.info("  POST /identify/flora      - Identify plant")
    logger.info("="*60)
    logger.info("\n🚀 Service ready!\n")
    
    app.run(host='0.0.0.0', port=5004, debug=False, threaded=True)
