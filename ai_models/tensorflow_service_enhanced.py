"""
Enhanced TensorFlow AI Service with Custom Trained Model Support
Automatically uses custom model if available, falls back to MobileNetV2
"""

import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from PIL import Image
import io
import json
from flask import Flask, request, jsonify
import os
from pathlib import Path

app = Flask(__name__)

# Check for custom trained model
CUSTOM_MODEL_PATH = 'models/karnataka_wildlife_model.h5'
CLASS_NAMES_PATH = 'models/class_names.json'

model = None
class_names = []
using_custom_model = False

# Karnataka Wildlife Database
KARNATAKA_WILDLIFE_DB = {
    'tiger': {'name': 'Bengal Tiger', 'scientific': 'Panthera tigris tigris', 'status': 'Endangered'},
    'elephant': {'name': 'Indian Elephant', 'scientific': 'Elephas maximus indicus', 'status': 'Endangered'},
    'leopard': {'name': 'Indian Leopard', 'scientific': 'Panthera pardus fusca', 'status': 'Vulnerable'},
    'sloth_bear': {'name': 'Sloth Bear', 'scientific': 'Melursus ursinus', 'status': 'Vulnerable'},
    'gaur': {'name': 'Indian Gaur', 'scientific': 'Bos gaurus', 'status': 'Vulnerable'},
    'wild_boar': {'name': 'Wild Boar', 'scientific': 'Sus scrofa', 'status': 'Least Concern'},
    'spotted_deer': {'name': 'Spotted Deer (Chital)', 'scientific': 'Axis axis', 'status': 'Least Concern'},
    'sambar_deer': {'name': 'Sambar Deer', 'scientific': 'Rusa unicolor', 'status': 'Vulnerable'},
    'bonnet_macaque': {'name': 'Bonnet Macaque', 'scientific': 'Macaca radiata', 'status': 'Least Concern'},
    'gray_langur': {'name': 'Gray Langur', 'scientific': 'Semnopithecus', 'status': 'Least Concern'},
    'indian_peafowl': {'name': 'Indian Peafowl', 'scientific': 'Pavo cristatus', 'status': 'Least Concern'},
    'king_cobra': {'name': 'King Cobra', 'scientific': 'Ophiophagus hannah', 'status': 'Vulnerable'},
    'indian_python': {'name': 'Indian Python', 'scientific': 'Python molurus', 'status': 'Least Concern'},
    'wild_dog': {'name': 'Dhole (Wild Dog)', 'scientific': 'Cuon alpinus', 'status': 'Endangered'},
    'jackal': {'name': 'Golden Jackal', 'scientific': 'Canis aureus', 'status': 'Least Concern'},
}

def load_custom_model():
    """Load custom trained model if available"""
    global model, class_names, using_custom_model
    
    if os.path.exists(CUSTOM_MODEL_PATH) and os.path.exists(CLASS_NAMES_PATH):
        print("🎯 Loading CUSTOM TRAINED MODEL for Karnataka Wildlife...")
        try:
            model = tf.keras.models.load_model(CUSTOM_MODEL_PATH)
            
            with open(CLASS_NAMES_PATH, 'r') as f:
                class_indices = json.load(f)
            
            # Reverse mapping
            class_names = {v: k for k, v in class_indices.items()}
            
            using_custom_model = True
            print(f"✅ Custom model loaded with {len(class_names)} classes")
            print(f"   Classes: {list(class_names.values())}")
            return True
            
        except Exception as e:
            print(f"⚠️  Failed to load custom model: {e}")
            print("   Falling back to MobileNetV2...")
            return False
    else:
        print("ℹ️  No custom model found. Using MobileNetV2 (ImageNet)")
        return False

def load_default_model():
    """Load default MobileNetV2 from TensorFlow Hub"""
    global model
    
    print("Loading MobileNetV2 from TensorFlow Hub...")
    model = hub.load("https://tfhub.dev/google/imagenet/mobilenet_v2_100_224/classification/5")
    
    # Load ImageNet labels
    imagenet_labels_url = "https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt"
    try:
        imagenet_labels = tf.keras.utils.get_file('ImageNetLabels.txt', imagenet_labels_url)
        with open(imagenet_labels, 'r') as f:
            global class_names
            class_names = [line.strip() for line in f.readlines()]
    except Exception as e:
        print(f"Warning: Could not load ImageNet labels: {e}")

# Try to load custom model first, fall back to default
if not load_custom_model():
    load_default_model()

def preprocess_image(image_bytes):
    """Preprocess image for model"""
    img = Image.open(io.BytesIO(image_bytes))
    img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, 0)
    return img_array

def get_species_info(class_key):
    """Get detailed species information"""
    # Normalize key
    key = class_key.lower().replace(' ', '_')
    
    if key in KARNATAKA_WILDLIFE_DB:
        return KARNATAKA_WILDLIFE_DB[key]
    
    # Try partial match
    for db_key, data in KARNATAKA_WILDLIFE_DB.items():
        if db_key in key or key in db_key:
            return data
    
    # Default
    return {
        'name': class_key,
        'scientific': 'Classification pending',
        'status': 'Unknown'
    }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model': 'Custom Karnataka Model' if using_custom_model else 'MobileNetV2',
        'tensorflow_version': tf.__version__,
        'custom_trained': using_custom_model,
        'num_classes': len(class_names) if using_custom_model else 1001
    })

@app.route('/identify/animal', methods=['POST'])
def identify_animal():
    """Identify animal from image"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        # Preprocess
        img_array = preprocess_image(image_bytes)
        
        if using_custom_model:
            # Custom model prediction
            predictions = model.predict(img_array, verbose=0)[0]
            top_indices = np.argsort(predictions)[-5:][::-1]
            
            results = []
            for idx in top_indices:
                class_key = class_names[idx]
                info = get_species_info(class_key)
                
                results.append({
                    'species': info['name'],
                    'scientific_name': info['scientific'],
                    'conservation_status': info['status'],
                    'confidence': float(predictions[idx]),
                    'detected_class': class_key,
                    'model': 'custom_karnataka'
                })
        else:
            # Default MobileNetV2 prediction
            predictions = model(img_array).numpy()[0]
            top_indices = np.argsort(predictions)[-5:][::-1]
            
            results = []
            for idx in top_indices:
                label = class_names[idx] if idx < len(class_names) else f"class_{idx}"
                info = get_species_info(label)
                
                results.append({
                    'species': info['name'],
                    'scientific_name': info['scientific'],
                    'conservation_status': info['status'],
                    'confidence': float(predictions[idx]),
                    'detected_class': label,
                    'model': 'mobilenetv2'
                })
        
        return jsonify({
            'success': True,
            'results': results[:5],
            'model': 'Custom Karnataka Model' if using_custom_model else 'MobileNetV2'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/identify/flora', methods=['POST'])
def identify_flora():
    """Identify plant from image"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        image_bytes = image_file.read()
        
        # Preprocess
        img_array = preprocess_image(image_bytes)
        
        if using_custom_model:
            predictions = model.predict(img_array, verbose=0)[0]
            top_indices = np.argsort(predictions)[-5:][::-1]
        else:
            predictions = model(img_array).numpy()[0]
            top_indices = np.argsort(predictions)[-5:][::-1]
        
        results = []
        for idx in top_indices:
            if using_custom_model:
                label = class_names[idx]
            else:
                label = class_names[idx] if idx < len(class_names) else f"class_{idx}"
            
            # Filter for plant-related classes
            if any(word in label.lower() for word in ['plant', 'tree', 'flower', 'mushroom', 'coral']):
                results.append({
                    'species': label,
                    'scientific_name': f'Classification: {label}',
                    'confidence': float(predictions[idx]),
                    'detected_class': label
                })
        
        if not results:
            # Return top predictions anyway
            for idx in top_indices:
                label = class_names[idx] if idx < len(class_names) else f"class_{idx}"
                results.append({
                    'species': label,
                    'scientific_name': f'Classification: {label}',
                    'confidence': float(predictions[idx]),
                    'detected_class': label
                })
        
        return jsonify({
            'success': True,
            'results': results[:5],
            'model': 'Custom Karnataka Model' if using_custom_model else 'MobileNetV2'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("TensorFlow AI Service for Wild Guard")
    print(f"TensorFlow Version: {tf.__version__}")
    print(f"Model: {'Custom Karnataka Wildlife' if using_custom_model else 'MobileNetV2 (ImageNet)'}")
    if using_custom_model:
        print(f"Classes: {len(class_names)} Karnataka species")
    print("=" * 60)
    print("\nStarting Flask server on http://localhost:5001")
    print("Endpoints:")
    print("  - GET  /health              - Health check")
    print("  - POST /identify/animal     - Identify animal from image")
    print("  - POST /identify/flora      - Identify plant from image")
    
    if not using_custom_model:
        print("\n⚠️  Using default MobileNetV2 model")
        print("To use custom trained model:")
        print("  1. Prepare training data")
        print("  2. Run: python train_model.py")
        print("  3. Restart this service")
    
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5001, debug=False)
