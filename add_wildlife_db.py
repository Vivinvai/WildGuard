"""
Add Indian Wildlife Species to Database
Simplified version using SQL directly
"""
import psycopg2
import json

# Database connection
conn = psycopg2.connect(
    host="localhost",
    database="wild_guard_db",
    user="postgres",
    password="pokemon1234"
)

# Indian Wildlife Data
INDIAN_WILDLIFE = [
    {
        "species_name": "Asian Elephant",
        "scientific_name": "Elephas maximus indicus",
        "common_names": ["Indian Elephant", "Asiatic Elephant"],
        "category": "Mammal",
        "conservation_status": "Endangered",
        "population": "27,000-31,000 in wild (India has 50-60%)",
        "region": "India",
        "short_description": "Largest land animal in Asia, highly intelligent with strong social bonds",
        "full_description": "Asian Elephant is smaller than African counterpart but equally magnificent. Crucial ecosystem engineers acting as seed dispersers. Highly intelligent with complex emotions and strong family bonds. Found in Western Ghats, Eastern Himalayas, and Central India.",
        "habitat": "Tropical forests, grasslands, scrublands across India. Major populations in Western Ghats, Eastern Himalayas, Central India",
        "diet": "Herbivore - 150-200 kg vegetation daily: grasses, bark, roots, leaves, fruits",
        "lifespan": "60-70 years in wild",
        "size": "Height: 2-3.5m shoulder, Weight: 3,000-5,000 kg",
        "behavior": "Highly social matriarchal herds, excellent memory, complex communication",
        "reproduction": "Gestation: 18-22 months, Single calf every 4-5 years",
        "threats": ["Habitat loss", "Human-elephant conflict", "Poaching", "Railway accidents"],
        "conservation_efforts": "Project Elephant (1992), elephant corridors, anti-poaching patrols, conflict mitigation programs",
        "image_url": "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800",
        "cultural_significance": "Sacred in Hinduism, associated with Lord Ganesha",
        "fun_facts": ["Can swim long distances", "Trunk has 40,000 muscles", "Mourns their dead"],
    },
    {
        "species_name": "Indian Rhinoceros",
        "scientific_name": "Rhinoceros unicornis",
        "common_names": ["Greater One-Horned Rhino", "Indian Rhino"],
        "category": "Mammal",
        "conservation_status": "Vulnerable",
        "population": "3,700+ (India has ~2,900)",
        "region": "India",
        "short_description": "Armored giant with single horn, conservation success story",
        "full_description": "Indian Rhinoceros is one of largest rhino species. Conservation triumph - from less than 200 in early 1900s to current numbers. Thick armor-like skin with prominent folds gives prehistoric appearance.",
        "habitat": "Alluvial grasslands, riverine forests. Kaziranga (Assam), Manas",
        "diet": "Herbivore - grasses, fruits, leaves, aquatic plants",
        "lifespan": "35-45 years in wild",
        "size": "Height: 1.7-2m shoulder, Length: 3-3.8m, Weight: 1,800-2,700 kg",
        "behavior": "Mostly solitary, territorial, excellent swimmers, semi-aquatic",
        "reproduction": "Gestation: 15-16 months, Single calf every 3-4 years",
        "threats": ["Poaching for horn", "Habitat loss", "Floods", "Disease"],
        "conservation_efforts": "Indian Rhino Vision 2020, translocation programs, strict anti-poaching, habitat restoration",
        "image_url": "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800",
        "cultural_significance": "Symbol of wetland conservation, ancient Indian art",
        "fun_facts": ["Can run 55 km/h", "Excellent smell and hearing", "Skin 4cm thick"],
    },
    {
        "species_name": "Asiatic Lion",
        "scientific_name": "Panthera leo persica",
        "common_names": ["Indian Lion", "Gir Lion"],
        "category": "Mammal",
        "conservation_status": "Endangered",
        "population": "674 (2020) - only in Gir, Gujarat",
        "region": "India",
        "short_description": "Last surviving Asiatic lions, found only in Gir Forest",
        "full_description": "Asiatic Lion once roamed Greece to India, now only in Gir Forest Gujarat. Slightly smaller than African lions with distinctive belly fold, less developed manes. Most endangered big cats.",
        "habitat": "Dry deciduous forests, scrublands, grasslands of Gir Forest",
        "diet": "Carnivore - spotted deer, sambar, nilgai, wild boar, buffalo. 10-15 kg daily",
        "lifespan": "16-18 years wild, 20 years captivity",
        "size": "Length: 1.7-2.5m, Height: 1.2m, Weight: 160-190kg (M), 110-120kg (F)",
        "behavior": "Social prides smaller than African, males hunt more, territorial",
        "reproduction": "Gestation: 100-110 days, 2-4 cubs",
        "threats": ["Limited genetic diversity", "Disease", "Human conflict", "Single location"],
        "conservation_efforts": "Protected in Gir Sanctuary, 24/7 monitoring, veterinary care, translocation plans to create second population",
        "image_url": "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800",
        "cultural_significance": "National animal symbol, Indian emblem, Buddhist texts",
        "fun_facts": ["Smaller manes than African lions", "More solitary", "Survive days without water"],
    },
    {
        "species_name": "Bengal Tiger",
        "scientific_name": "Panthera tigris tigris",
        "common_names": ["Royal Bengal Tiger", "Indian Tiger"],
        "category": "Mammal",
        "conservation_status": "Endangered",
        "population": "2,967 in India (2018) - 70% global population",
        "region": "India",
        "short_description": "National animal, most numerous tiger subspecies",
        "full_description": "Bengal Tiger most iconic Indian wildlife. Found from mangroves to Himalayas. Apex predator crucial for ecosystem. Project Tiger (1973) instrumental in recovery.",
        "habitat": "Dense forests, mangroves (Sundarbans), grasslands. Western Ghats, Central India, Sundarbans",
        "diet": "Carnivore - deer, wild boar, buffalo, gaur. 7-8 kg daily",
        "lifespan": "10-15 years wild, 20 captivity",
        "size": "Length: 2.7-3.1m (M), Height: 90-110cm, Weight: 180-260kg (M), 100-160kg (F)",
        "behavior": "Solitary, territorial, excellent swimmers, nocturnal, ambush predator",
        "reproduction": "Gestation: 93-112 days, 2-4 cubs",
        "threats": ["Poaching", "Habitat fragmentation", "Human conflict", "Prey depletion"],
        "conservation_efforts": "Project Tiger (1973), 53 tiger reserves, anti-poaching SMART patrols, corridor protection, community involvement",
        "image_url": "https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?w=800",
        "cultural_significance": "National animal, strength symbol, mythology",
        "fun_facts": ["Unique stripe pattern", "Leap 10 meters", "Roar heard 3km"],
    },
    {
        "species_name": "Indian Leopard",
        "scientific_name": "Panthera pardus fusca",
        "commonNames": ["Common Leopard", "Panther (melanistic)"],
        "category": "Mammal",
        "conservation_status": "Vulnerable",
        "population": "12,000-14,000 in India",
        "region": "India",
        "short_description": "Most adaptable big cat, survives near human settlements",
        "full_description": "Indian Leopard most widespread big cat showing remarkable adaptability. Survives close to humans. Black panthers are melanistic leopards, not separate species.",
        "habitat": "Highly adaptable - forests, grasslands, mountains, semi-arid, near cities",
        "diet": "Carnivore - deer, monkeys, rodents, birds, dogs. Stores prey in trees",
        "lifespan": "12-17 years wild",
        "size": "Length: 1.3-1.9m, Height: 60-70cm, Weight: 50-77kg (M), 29-34kg (F)",
        "behavior": "Solitary, nocturnal, excellent climber, ambush predator",
        "reproduction": "Gestation: 90-105 days, 2-3 cubs",
        "threats": ["Human conflict", "Poaching", "Habitat loss", "Road accidents"],
        "conservation_efforts": "Human-wildlife conflict mitigation, rescue centers, wildlife corridors, community awareness programs",
        "image_url": "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=800",
        "cultural_significance": "Folklore symbol of stealth and power",
        "fun_facts": ["Carry 2x weight up trees", "Fastest big cat sprinter", "Black forms common"],
    },
    {
        "species_name": "Sloth Bear",
        "scientific_name": "Melursus ursinus",
        "common_names": ["Indian Bear", "Labiated Bear"],
        "category": "Mammal",
        "conservation_status": "Vulnerable",
        "population": "6,000-11,000 in India",
        "region": "India",
        "short_description": "Shaggy bear known for termite-eating, Baloo from Jungle Book",
        "full_description": "Sloth Bear native to Indian subcontinent, inspired Baloo in Jungle Book. Not related to sloths. Specialized for termites/ants with closeable nostrils and front teeth gap.",
        "habitat": "Dry/moist forests, grasslands, scrublands. Western Ghats, Central India, Eastern Ghats",
        "diet": "Omnivore - termites, ants, fruits, honey, flowers, small mammals",
        "lifespan": "25-40 years",
        "size": "Length: 1.4-1.9m, Height: 60-90cm, Weight: 80-140kg (M), 55-95kg (F)",
        "behavior": "Nocturnal, solitary except mothers, good climbers, aggressive when threatened",
        "reproduction": "Gestation: 6-7 months, 1-2 cubs ride on mother's back",
        "threats": ["Habitat loss", "Human conflict", "Poaching for gall bladder", "Dancing bear trade (banned)"],
        "conservation_efforts": "Wildlife Protection Act, dancing bear rehabilitation, forest corridors, community-based conservation",
        "image_url": "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800",
        "cultural_significance": "Baloo inspiration, Indian folklore",
        "fun_facts": ["Close nostrils when eating termites", "Cubs ride on back", "Long curved claws"],
    },
    {
        "species_name": "Dhole",
        "scientific_name": "Cuon alpinus",
        "common_names": ["Indian Wild Dog", "Asiatic Wild Dog", "Red Dog"],
        "category": "Mammal",
        "conservation_status": "Endangered",
        "population": "949-2,215 in India (packs)",
        "region": "India",
        "short_description": "Highly social pack hunter, endangered carnivore",
        "full_description": "Dholes skilled pack hunters taking down larger prey. Unique whistling vocalizations. Crucial ecosystem role regulating herbivores.",
        "habitat": "Dense forests, scrublands, grasslands. Western Ghats, Central India, Northeast",
        "diet": "Carnivore - deer, wild boar, gaur calves, small mammals",
        "lifespan": "10-13 years wild",
        "size": "Length: 90-110cm, Height: 50cm, Weight: 12-20kg",
        "behavior": "Highly social packs (5-12), cooperative hunters, complex vocalizations",
        "reproduction": "Gestation: 60-63 days, 4-6 pups, pack raises young",
        "threats": ["Habitat loss", "Disease from domestic dogs", "Prey depletion", "Competition"],
        "conservation_efforts": "Protected areas, disease surveillance programs, prey augmentation, research on pack dynamics",
        "image_url": "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800",
        "cultural_significance": "Rudyard Kipling's works, tribal cultures",
        "fun_facts": ["Whistle to communicate", "One breeding pair per pack", "More molars than other dogs"],
    },
    {
        "species_name": "Gaur",
        "scientific_name": "Bos gaurus",
        "common_names": ["Indian Bison"],
        "category": "Mammal",
        "conservation_status": "Vulnerable",
        "population": "13,000-30,000 globally, majority India",
        "region": "India",
        "short_description": "World's largest wild cattle, massive herbivore",
        "full_description": "Gaur largest and most powerful wild cattle species. Despite size, generally shy. Bulls have massive build and distinctive white stockings.",
        "habitat": "Evergreen/deciduous forests, hills to 2,000m. Western Ghats, Central India, Northeast",
        "diet": "Herbivore - grasses, leaves, stems, bark, fruits",
        "lifespan": "25-30 years",
        "size": "Height: 1.65-2.2m shoulder, Length: 2.5-3.3m, Weight: 650-1,500kg",
        "behavior": "Social herds (females/young), solitary old bulls, crepuscular, peaceful",
        "reproduction": "Gestation: 275 days, Single calf",
        "threats": ["Habitat loss", "Disease from domestic cattle", "Poaching", "Inbreeding"],
        "conservation_efforts": "Protected in national parks, disease monitoring, anti-poaching patrols, habitat restoration",
        "image_url": "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800",
        "cultural_significance": "Sacred in tribal communities, wilderness symbol",
        "fun_facts": ["Largest wild cattle", "Weigh as much as car", "Excellent smell"],
    },
]

cursor = conn.cursor()

print("=" * 70)
print("🐾 ADDING INDIAN WILDLIFE TO POSTGRESQL DATABASE")
print("=" * 70)
print()

added = 0
skipped = 0

for animal in INDIAN_WILDLIFE:
    try:
        # Check if exists
        cursor.execute(
            "SELECT COUNT(*) FROM discover_animals WHERE species_name = %s",
            (animal["species_name"],)
        )
        exists = cursor.fetchone()[0] > 0
        
        if exists:
            print(f"⚠️  {animal['species_name']} - Already exists, skipping")
            skipped += 1
        else:
            # Insert into discover_animals
            cursor.execute("""
                INSERT INTO discover_animals (
                    species_name, scientific_name, common_names, category,
                    conservation_status, population, region, short_description,
                    full_description, habitat, diet, lifespan, size,
                    behavior, reproduction, threats, conservation_efforts,
                    image_url, cultural_significance, fun_facts
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                animal["species_name"],
                animal["scientific_name"],
                animal.get("common_names", []),
                animal["category"],
                animal["conservation_status"],
                animal["population"],
                animal["region"],
                animal["short_description"],
                animal["full_description"],
                animal["habitat"],
                animal["diet"],
                animal["lifespan"],
                animal["size"],
                animal["behavior"],
                animal["reproduction"],
                animal["threats"],
                animal["conservation_efforts"],
                animal["image_url"],
                animal.get("cultural_significance", ""),
                animal.get("fun_facts", []),
            ))
            
            # Also add to supported_animals
            cursor.execute("""
                INSERT INTO supported_animals (
                    species_name, scientific_name, conservation_status,
                    population, habitat, threats, region, category, description
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (species_name) DO NOTHING
            """, (
                animal["species_name"],
                animal["scientific_name"],
                animal["conservation_status"],
                animal["population"],
                animal["habitat"],
                animal["threats"],
                animal["region"],
                animal["category"],
                animal["short_description"],
            ))
            
            print(f"✅ Added: {animal['species_name']}")
            added += 1
            
    except Exception as e:
        print(f"❌ Error with {animal['species_name']}: {e}")

conn.commit()
cursor.close()
conn.close()

print()
print("=" * 70)
print("📊 SUMMARY")
print("=" * 70)
print(f"✅ Added: {added} new species")
print(f"⚠️  Skipped: {skipped} existing species")
print(f"🐾 Total: {len(INDIAN_WILDLIFE)} species processed")
print("=" * 70)
print()
print("🎯 Indian wildlife data successfully added to database!")
print("   These animals will now appear in:")
print("   - Discover section")
print("   - AI identification matches")
print("   - Admin dashboard")
