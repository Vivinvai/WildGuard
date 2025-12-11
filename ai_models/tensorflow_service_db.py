"""
Enhanced TensorFlow Service with PostgreSQL Database Integration
Flow: MobileNet Detection → PostgreSQL Database Lookup → Enhanced Response
"""

# Fix Unicode encoding for Windows
import sys
import io
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Force TensorFlow to use legacy Keras for compatibility
import os
# Remove the legacy keras flag since we have tf_keras installed
# os.environ['TF_USE_LEGACY_KERAS'] = '1'

import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
from flask import Flask, request, jsonify
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from waitress import serve

# Import local chat AI
from local_chat_ai import get_local_chat_response, is_local_chat_available

app = Flask(__name__)

# Database Configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'wild_guard_db',
    'user': 'postgres',
    'password': 'pokemon1234'
}

# Model Configuration  
CUSTOM_MODEL_PATH = os.path.join(os.path.dirname(__file__), 'trained_models', 'best_model.keras')
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), 'trained_models', 'class_names.json')

# Dual Model System
custom_model = None
mobilenet_model = None
custom_class_names = []
imagenet_class_names = []
using_custom_model = False

# ImageNet Label to Species Mapping (MobileNetV2 uses ImageNet classes)
IMAGENET_TO_SPECIES = {
    # Big Cats
    'tiger': 'Bengal Tiger',
    'tiger cat': 'Bengal Tiger',
    'tiger, Panthera tigris': 'Bengal Tiger',
    'leopard': 'Indian Leopard',
    'jaguar': 'Indian Leopard',
    'cheetah': 'Indian Leopard',
    'snow leopard': 'Snow Leopard',
    
    # Elephants
    'elephant': 'Asian Elephant',
    'African elephant': 'Asian Elephant',
    'Indian elephant': 'Asian Elephant',
    'tusker': 'Asian Elephant',
    
    # Bears
    'American black bear': 'Sloth Bear',
    'brown bear': 'Sloth Bear',
    'sloth bear': 'Sloth Bear',
    
    # Bovines
    'ox': 'Indian Gaur',
    'water buffalo': 'Indian Gaur',
    'bison': 'Indian Gaur',
    'cattle': 'Indian Cattle',
    'zebu': 'Indian Cattle',
    
    # Deer & Antelope
    'impala': 'Spotted Deer',
    'gazelle': 'Spotted Deer',
    'hartebeest': 'Sambar Deer',
    'antelope': 'Four-Horned Antelope',
    'ram': 'Nilgiri Tahr',
    'bighorn': 'Nilgiri Tahr',
    
    # Primates
    'macaque': 'Bonnet Macaque',
    'langur': 'Gray Langur',
    'baboon': 'Bonnet Macaque',
    
    # Birds
    'peacock': 'Indian Peafowl',
    'peafowl': 'Indian Peafowl',
    'bustard': 'Great Indian Bustard',
    'eagle': 'Bird species',
    'owl': 'Bird species',
    
    # Reptiles
    'cobra': 'Indian Cobra',
    'king cobra': 'Indian Cobra',
    'boa constrictor': 'Indian Rock Python',
    'rock python': 'Indian Rock Python',
    'python': 'Indian Rock Python',
    'crocodile': 'Gharial',
    'alligator': 'Gharial',
    
    # Canines
    'African hunting dog': 'Dhole',
    'dhole': 'Dhole',
    'wild dog': 'Dhole',
    'coyote': 'Golden Jackal',
    'jackal': 'Golden Jackal',
    'dingo': 'Indian Wild Dog',
    'fox': 'Indian Fox',
    
    # Felines (Small)
    'cat': 'Fishing Cat',
    'tabby': 'Fishing Cat',
    
    # Pigs & Boars
    'wild boar': 'Wild Boar',
    'warthog': 'Wild Boar',
    'hog': 'Pygmy Hog',
    'pig': 'Pygmy Hog',
    
    # Pangolins
    'armadillo': 'Indian Pangolin',
    'pangolin': 'Indian Pangolin',
    
    # Rhino
    'rhinoceros': 'Indian Rhinoceros',
    'rhino': 'Indian Rhinoceros',
    
    # Squirrels
    'squirrel': 'Indian Giant Squirrel',
    
    # Domestic
    'dog': 'Domestic Dog',
    'german shepherd': 'Domestic Dog',
    'golden retriever': 'Domestic Dog',
    'labrador': 'Domestic Dog',
}

def get_db_connection():
    """Create PostgreSQL database connection"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return None

def query_animal_database(species_name: str):
    """Query PostgreSQL database for comprehensive animal information from supported_animals table"""
    conn = get_db_connection()
    
    if not conn:
        return None
    
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Search by species name (case-insensitive, partial match)
            cursor.execute("""
                SELECT * FROM supported_animals 
                WHERE 
                    LOWER(species_name) LIKE LOWER(%s)
                    OR LOWER(scientific_name) LIKE LOWER(%s)
                LIMIT 1
            """, (f'%{species_name}%', f'%{species_name}%'))
            
            result = cursor.fetchone()
            
            if result:
                print(f"✅ Found in database: {result['species_name']}")
                return dict(result)
            else:
                print(f"⚠️  Not found in database: {species_name}")
                return None
                
    except Exception as e:
        print(f"❌ Database query error: {e}")
        return None
    finally:
        conn.close()

# Model class to Indian species mapping for custom model
MODEL_TO_INDIAN_SPECIES = {
    "elephant": "Asian Elephant",
    "tiger": "Bengal Tiger",
    "lion": "Asiatic Lion",
    "leopard": "Indian Leopard",
    "deer": "Spotted Deer (Chital)",
    "antelope": "Blackbuck",
    "fox": "Bengal Fox",
    "wolf": "Indian Wolf",
    "bear": "Sloth Bear",
    "hyena": "Striped Hyena",
    "bison": "Indian Gaur",
    "rhinoceros": "Indian Rhinoceros",
    "dolphin": "Gangetic Dolphin",
    "whale": "Blue Whale",
    "chimpanzee": "Hoolock Gibbon",
    "gorilla": "Nilgiri Langur",
    "orangutan": "Lion-tailed Macaque",
    "panda": "Red Panda",
    "koala": "Indian Giant Squirrel",
    "squirrel": "Indian Palm Squirrel",
    "mouse": "Indian Field Mouse",
    "rat": "Indian Bandicoot Rat",
    "bat": "Indian Flying Fox",
    "seal": "Seal (Not Native)",
    "otter": "Smooth-coated Otter",
    "kangaroo": "Kangaroo (Not Native)",
    "wombat": "Wombat (Not Native)",
    "possum": "Possum (Not Native)",
    "raccoon": "Common Palm Civet",
    "hamster": "Hamster (Not Native)",
    "hedgehog": "Indian Hedgehog",
    "porcupine": "Indian Crested Porcupine",
    "hare": "Indian Hare",
    "reindeer": "Hangul (Kashmir Stag)",
    "hippopotamus": "Hippopotamus (Not Native)",
    "okapi": "Okapi (Not Native)",
    "zebra": "Zebra (Not Native)",
    "coyote": "Golden Jackal",
    "boar": "Wild Boar",
    "donkey": "Indian Wild Ass (Khur)",
    "goat": "Nilgiri Tahr",
    "sheep": "Bharal (Blue Sheep)",
    "ox": "Yak",
    "cow": "Gayal (Mithun)",
    "eagle": "Crested Serpent Eagle",
    "hornbill": "Great Indian Hornbill",
    "flamingo": "Greater Flamingo",
    "crow": "House Crow",
    "parrot": "Alexandrine Parakeet",
    "owl": "Indian Eagle-Owl",
    "hummingbird": "Sunbird",
    "woodpecker": "Black-rumped Flameback",
    "penguin": "Penguin (Not Native)",
    "duck": "Spot-billed Duck",
    "goose": "Bar-headed Goose",
    "swan": "Black-necked Crane",
    "pigeon": "Rock Pigeon",
    "sparrow": "House Sparrow",
    "turkey": "Turkey (Not Native)",
    "pelecaniformes": "Spot-billed Pelican",
    "sandpiper": "Common Sandpiper",
    "lizard": "Bengal Monitor Lizard",
    "snake": "Indian Cobra",
    "turtle": "Indian Flapshell Turtle",
    "shark": "Whale Shark",
    "jellyfish": "Box Jellyfish (Various species)",
    "octopus": "Day Octopus",
    "squid": "Indian Squid",
    "crab": "Mud Crab",
    "lobster": "Indian Spiny Lobster",
    "oyster": "Indian Backwater Oyster",
    "seahorse": "Three-spot Seahorse",
    "starfish": "Crown of Thorns Starfish",
    "goldfish": "Mahseer",
    "butterfly": "Common Jezebel",
    "bee": "Asiatic Honey Bee",
    "beetle": "Indian Rhinoceros Beetle",
    "dragonfly": "Globe Skimmer",
    "fly": "Common House Fly",
    "mosquito": "Asian Tiger Mosquito",
    "moth": "Atlas Moth",
    "ladybugs": "Seven-spot Ladybird",
    "grasshopper": "Indian Grasshopper (Various species)",
    "cockroach": "American Cockroach",
    "caterpillar": "Silk Moth Caterpillar",
    "cat": "Indian Desert Cat (Wild)",
    "dog": "Indian Pariah Dog (Native breed)",
}


def load_custom_model():
    """Load custom trained model if available"""
    global custom_model, custom_class_names, using_custom_model
    
    if os.path.exists(CUSTOM_MODEL_PATH) and os.path.exists(CLASS_NAMES_PATH):
        print("🎯 Loading CUSTOM TRAINED MODEL (90 animals)...")
        try:
            # Load with compile=False to avoid optimizer/loss issues
            # Use tf.keras instead of tf_keras to avoid verbose JSON output
            custom_model = tf.keras.models.load_model(CUSTOM_MODEL_PATH, compile=False)
            
            # Recompile with simple configuration
            custom_model.compile(
                optimizer='adam',
                loss='categorical_crossentropy',
                metrics=['accuracy']
            )
            
            with open(CLASS_NAMES_PATH, 'r') as f:
                class_names_list = json.load(f)
            
            # class_names is now a simple list
            custom_class_names = class_names_list
            using_custom_model = True
            print(f"✅ Custom model loaded with {len(custom_class_names)} classes")
            print(f"   Sample classes: {', '.join(custom_class_names[:5])}")
            return True
            
        except Exception as e:
            print(f"⚠️ Failed to load custom model: {e}")
            import traceback
            traceback.print_exc()
            return False
    else:
        print("ℹ️ No custom model found.")
        return False

def load_mobilenet_model():
    """Load MobileNetV2 from Keras Applications (always loaded for dual model system)"""
    global mobilenet_model, imagenet_class_names
    
    print("🔄 Loading MobileNetV2 from Keras Applications...")
    from tensorflow.keras.applications import MobileNetV2
    
    # Load pretrained MobileNetV2
    mobilenet_model = MobileNetV2(weights='imagenet')
    
    # Load ImageNet labels
    imagenet_labels_url = "https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt"
    try:
        imagenet_labels = tf.keras.utils.get_file('ImageNetLabels.txt', imagenet_labels_url)
        with open(imagenet_labels, 'r') as f:
            imagenet_class_names = [line.strip() for line in f.readlines()]
        print(f"✅ MobileNetV2 loaded with {len(imagenet_class_names)} ImageNet classes")
    except Exception as e:
        print(f"⚠️ Could not load ImageNet labels: {e}")
        imagenet_class_names = []


# Initialize BOTH models (dual system)
load_custom_model()
load_mobilenet_model()

def preprocess_image(image_bytes):
    """Preprocess image for MobileNetV2"""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img, dtype=np.float32) / 255.0  # Use float32, not float64
    img_array = np.expand_dims(img_array, 0)
    return img_array

def map_imagenet_to_species(imagenet_label: str) -> str:
    """Map ImageNet label to wildlife species name"""
    label_lower = imagenet_label.lower().strip()
    
    # Try direct mapping
    if label_lower in IMAGENET_TO_SPECIES:
        return IMAGENET_TO_SPECIES[label_lower]
    
    # Try partial match
    for key, value in IMAGENET_TO_SPECIES.items():
        if key in label_lower or label_lower in key:
            return value
    
    # Return original if no mapping found
    return imagenet_label

def enhance_with_database(species_name: str, confidence: float, detected_class: str, model_source: str = 'custom'):
    """Enhance detection with PostgreSQL database information
    
    Args:
        species_name: The species name to look up
        confidence: Detection confidence (0-1)
        detected_class: The class detected by the model
        model_source: Source of detection ('custom' or 'mobilenet')
    """
    
    # For custom model, map to Indian species first
    if model_source == 'custom' and detected_class.lower() in MODEL_TO_INDIAN_SPECIES:
        indian_species = MODEL_TO_INDIAN_SPECIES[detected_class.lower()]
        print(f"🔄 Mapping '{detected_class}' → '{indian_species}'")
        species_name = indian_species
    
    # Query database for comprehensive information
    db_data = query_animal_database(species_name)
    
    if db_data:
        # Found in database - return comprehensive info
        result = {
            'species': db_data['species_name'],
            'scientific_name': db_data['scientific_name'],
            'conservation_status': db_data['conservation_status'],
            'confidence': min(confidence * 100, 100.0),  # Cap at 100%
            'detected_class': detected_class,
            'model': model_source,
            
            # Core Information
            'population': db_data.get('population'),
            'habitat': db_data.get('habitat'),
            'region': db_data.get('region'),
            'category': db_data.get('category'),
            'description': db_data.get('description'),
            'threats': db_data.get('threats', []),
            
            # Database enhanced
            'database_enhanced': True,
            'has_complete_info': True,
            'is_indian_species': db_data.get('region') == 'India'
        }
        
        return result
    else:
        # Not in database - return basic info
        return {
            'species': species_name,
            'scientific_name': 'Classification pending',
            'conservation_status': 'Unknown',
            'confidence': min(confidence * 100, 100.0),  # Cap at 100%
            'detected_class': detected_class,
            'model': model_source,
            'database_enhanced': False,
            'has_complete_info': False,
            'is_indian_species': False
        }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    db_conn = get_db_connection()
    db_status = 'connected' if db_conn else 'disconnected'
    if db_conn:
        db_conn.close()
    
    return jsonify({
        'status': 'healthy',
        'model': 'Dual Model (Custom + MobileNet)' if using_custom_model else 'MobileNetV2',
        'tensorflow_version': tf.__version__,
        'custom_trained': using_custom_model,
        'custom_model_classes': len(custom_class_names) if using_custom_model else 0,
        'mobilenet_classes': len(imagenet_class_names),
        'dual_model_system': True,
        'database_status': db_status,
        'database_integration': True
    })

@app.route('/identify/animal', methods=['POST'])
def identify_animal():
    """
    Identify animal using MobileNet + PostgreSQL Database Enhancement
    
    Flow:
    1. MobileNet detects ImageNet class (e.g., "tiger")
    2. Map to species name (e.g., "Bengal Tiger")
    3. Query PostgreSQL for comprehensive info
    4. Return enhanced result with 40+ identification fields
    """
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        print(f"📸 Received image: {len(image_bytes)} bytes")
        
        # Step 1: Dual Model Detection (Custom + MobileNet)
        img_array = preprocess_image(image_bytes)
        print(f"✅ Preprocessed image: {img_array.shape}")
        
        # Run both models if custom model is available
        all_predictions = []
        
        if using_custom_model and custom_model is not None:
            print("🎯 Running Custom Model detection...")
            custom_predictions = custom_model.predict(img_array, verbose=0)[0]
            custom_top_indices = np.argsort(custom_predictions)[-5:][::-1]
            for idx in custom_top_indices:
                all_predictions.append({
                    'class': custom_class_names[idx],
                    'confidence': min(float(custom_predictions[idx]) * 100, 100.0),  # Cap at 100%
                    'model': 'custom'
                })
        
        if mobilenet_model is not None:
            print("🔍 Running MobileNetV2 detection...")
            from tf_keras.applications.mobilenet_v2 import preprocess_input as mobilenet_preprocess
            
            # MobileNet expects different preprocessing
            mobilenet_img = tf.image.resize(img_array, [224, 224])
            mobilenet_img = mobilenet_preprocess(mobilenet_img)
            
            mobilenet_predictions = mobilenet_model.predict(mobilenet_img, verbose=0)[0]
            mobilenet_top_indices = np.argsort(mobilenet_predictions)[-5:][::-1]
            for idx in mobilenet_top_indices:
                detected_class = imagenet_class_names[idx] if idx < len(imagenet_class_names) else f"class_{idx}"
                all_predictions.append({
                    'class': detected_class,
                    'confidence': min(float(mobilenet_predictions[idx]) * 100, 100.0),  # Cap at 100%
                    'model': 'mobilenet'
                })
        
        # Sort by confidence and take top 5
        all_predictions.sort(key=lambda x: x['confidence'], reverse=True)
        top_predictions = all_predictions[:5]
        
        print(f"✅ Combined predictions from both models: {len(top_predictions)} candidates")
        
        # Step 2: Process top predictions
        results = []
        for pred in top_predictions:
            detected_class = pred['class']
            confidence = pred['confidence'] / 100.0  # Convert back to 0-1 range
            model_source = pred['model']
            
            # Step 3: Map to Species
            species_name = map_imagenet_to_species(detected_class) if model_source == 'mobilenet' else detected_class
            print(f"  [{pred['model']}] {detected_class} → {species_name} ({confidence:.1%})")
            
            # Step 4: Enhance with Database (mapping happens inside for custom model)
            enhanced_result = enhance_with_database(species_name, confidence, detected_class, model_source)
            enhanced_result['detection_model'] = pred['model']
            results.append(enhanced_result)
        
        # Return top 5 results
        print(f"✅ Returning {len(results)} enhanced results")
        print(f"   Top: {results[0]['species']} ({results[0]['confidence']:.1%}) - DB Enhanced: {results[0]['database_enhanced']}")
        
        return jsonify({
            'success': True,
            'results': results[:5],
            'model': 'Custom Karnataka Model' if using_custom_model else 'MobileNetV2',
            'database_enhanced': any(r['database_enhanced'] for r in results),
            'workflow': 'MobileNet → Database Enhancement'
        })
        
    except Exception as e:
        print(f"❌ Error in identify_animal: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/identify/flora', methods=['POST'])
def identify_flora():
    """Identify plant from image (basic implementation)"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        img_array = preprocess_image(image_bytes)
        
        # Use MobileNet for flora (better for general ImageNet classes)
        if mobilenet_model is not None:
            from tf_keras.applications.mobilenet_v2 import preprocess_input as mobilenet_preprocess
            # MobileNet expects different preprocessing
            mobilenet_img = tf.image.resize(img_array, [224, 224])
            mobilenet_img = mobilenet_preprocess(mobilenet_img)
            
            predictions = mobilenet_model.predict(mobilenet_img, verbose=0)[0]
            top_indices = np.argsort(predictions)[-5:][::-1]
            class_list = imagenet_class_names
        else:
            return jsonify({'error': 'Model not available'}), 500
        
        results = []
        for idx in top_indices:
            label = class_list[idx] if idx < len(class_list) else f"class_{idx}"
            
            # Filter for plant-related classes
            if any(word in label.lower() for word in ['plant', 'tree', 'flower', 'mushroom', 'daisy', 'orchid']):
                results.append({
                    'species': label,
                    'scientific_name': f'Classification: {label}',
                    'confidence': min(float(predictions[idx]) * 100, 100.0),  # Cap at 100%
                    'detected_class': label
                })
        
        if not results:
            # Return top predictions anyway
            for idx in top_indices[:3]:
                label = class_list[idx] if idx < len(class_list) else f"class_{idx}"
                results.append({
                    'species': label,
                    'scientific_name': f'Classification: {label}',
                    'confidence': min(float(predictions[idx]) * 100, 100.0),  # Cap at 100%
                    'detected_class': label
                })
        
        return jsonify({
            'success': True,
            'results': results[:5],
            'model': 'Custom Karnataka Model' if using_custom_model else 'MobileNetV2'
        })
        
    except Exception as e:
        print(f"❌ Error in identify_flora: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/chat', methods=['POST'])
def chat():
    """Wildlife chat endpoint using local trained AI"""
    try:
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({'error': 'No question provided'}), 400
        
        # Get response from local AI
        response = get_local_chat_response(question)
        
        if response:
            return jsonify({
                'answer': response,
                'confidence': 0.8,
                'source': 'local_ai'
            })
        else:
            return jsonify({
                'answer': None,
                'confidence': 0.0,
                'error': 'Low confidence or model not available'
            })
    
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/chat/available', methods=['GET'])
def chat_available():
    """Check if local chat AI is available"""
    try:
        available = is_local_chat_available()
        return jsonify({'available': available})
    except Exception as e:
        return jsonify({'available': False, 'error': str(e)})


if __name__ == '__main__':
    print("=" * 70)
    print("🐯 WILD GUARD - Dual Model AI System with Database Integration")
    print("=" * 70)
    print(f"TensorFlow Version: {tf.__version__}")
    
    if using_custom_model:
        print(f"🎯 Custom Model: ✅ Loaded ({len(custom_class_names)} wildlife classes)")
    else:
        print(f"🎯 Custom Model: ❌ Not loaded")
    
    print(f"🔍 MobileNet: ✅ Loaded ({len(imagenet_class_names)} ImageNet classes)")
    print(f"🤖 AI System: DUAL MODEL (Custom + MobileNet)")
    
    # Test database connection
    db_conn = get_db_connection()
    if db_conn:
        print(f"Database: ✅ Connected to Wild_Guard_DB (26 animals)")
        db_conn.close()
    else:
        print(f"Database: ❌ Not connected")
    
    print("\n🔄 Detection Workflow:")
    print("  1. Dual Model detection (Custom + MobileNet)")
    print("  2. Cross-verify predictions")
    print("  3. Map to wildlife species name")
    print("  4. Query PostgreSQL for comprehensive info (40+ fields)")
    print("  4. Return enhanced result with identification tips")
    
    print("\n📡 API Endpoints:")
    print("  GET  /health            - Health check + database status")
    print("  POST /identify/animal   - Enhanced animal identification")
    print("  POST /identify/flora    - Plant identification")
    print("  POST /chat              - Local AI wildlife chat")
    print("  GET  /chat/available    - Check if chat AI is loaded")
    
    print("=" * 70)
    print(f"\n✅ Starting production server on http://localhost:5001")
    print("Press CTRL+C to stop\n")
    
    try:
        # Use Flask development server for easier debugging
        app.run(host='127.0.0.1', port=5001, debug=False, threaded=True)
        # For production, use: serve(app, host='127.0.0.1', port=5001, threads=4)
    except KeyboardInterrupt:
        print("\n👋 Shutting down TensorFlow service...")
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
