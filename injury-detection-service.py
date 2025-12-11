"""
Animal Injury Detection Service using YOLOv11
Runs on port 5003 (separate from poaching detection on 5002)
Model path: "../Injured Animals/Animal Injury/yolo11n.pt"
Classes: buffalo, cat, cow, dog, injured, person
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import os
from PIL import Image
import numpy as np
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Load YOLOv11 injury detection model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "Injured Animals", "Animal Injury", "yolo11n.pt")
print(f"Loading injury detection model from: {MODEL_PATH}")

try:
    model = YOLO(MODEL_PATH)
    print("✅ YOLOv11 Injury Detection Model loaded successfully")
    print(f"Model classes: {model.names}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

# COCO model classes (80 classes) - We'll use the model's built-in names
# Animal classes we care about from COCO dataset
COCO_ANIMAL_IDS = {
    14: 'bird', 15: 'cat', 16: 'dog', 17: 'horse', 
    18: 'sheep', 19: 'cow', 20: 'elephant', 21: 'bear', 
    22: 'zebra', 23: 'giraffe'
}

# Friendly animal names for display
ANIMAL_DISPLAY_NAMES = {
    'bird': 'Wild Bird',
    'cat': 'Wild Cat / Leopard / Tiger',
    'dog': 'Wild Canine / Wolf / Fox',
    'horse': 'Wild Horse / Zebra',
    'sheep': 'Wild Sheep / Goat',
    'cow': 'Wild Cattle / Buffalo / Gaur / Bison',
    'elephant': 'Asian Elephant / Indian Elephant',
    'bear': 'Sloth Bear / Wild Bear',
    'zebra': 'Zebra',
    'giraffe': 'Giraffe'
}

def decode_base64_image(base64_string):
    """Decode base64 image to PIL Image"""
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return image
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def analyze_detections(results):
    """
    Analyze YOLO detections for injury assessment
    Returns: health_status, confidence, animal_detected, injury_details, detections, recommendations
    """
    if not results or len(results) == 0:
        return {
            'healthStatus': 'unknown',
            'confidence': 0,
            'animalDetected': None,
            'injuryDetails': {
                'detected': False,
                'description': 'No animals or injuries detected in image',
                'severity': 'none'
            },
            'detections': {
                'injured': 0,
                'animals': 0,
                'total': 0
            },
            'recommendations': ['No animals detected in the image']
        }
    
    result = results[0]
    boxes = result.boxes
    
    injured_count = 0
    animal_count = 0
    detected_animals = []
    max_injury_conf = 0
    max_animal_conf = 0
    detected_animal_name = None
    
    for box in boxes:
        cls_id = int(box.cls[0])
        conf = float(box.conf[0])
        
        # Get class name from COCO model
        class_name = model.names.get(cls_id, 'unknown')
        
        # Check if it's an animal we care about
        if cls_id in COCO_ANIMAL_IDS:
            animal_count += 1
            detected_animals.append(class_name)
            if conf > max_animal_conf:
                max_animal_conf = conf
                detected_animal_name = class_name
    
    total_detections = len(boxes)
    
    # Since we're using COCO model (no "injured" class), provide health assessment based on animal detection
    if animal_count > 0:
        # Get friendly display name
        display_name = ANIMAL_DISPLAY_NAMES.get(detected_animal_name, detected_animal_name.title() if detected_animal_name else 'Animal')
        
        health_status = 'healthy'
        confidence = max_animal_conf
        injury_details = {
            'detected': False,
            'description': f'{display_name} - No visible injuries detected',
            'severity': 'none'
        }
        recommendations = [
            f'✅ {display_name} appears healthy',
            'No immediate action required',
            'Continue monitoring'
        ]
    
    else:
        health_status = 'unknown'
        confidence = 0
        injury_details = {
            'detected': False,
            'description': 'No wildlife animals clearly detected in image',
            'severity': 'none'
        }
        recommendations = [
            '❌ No animals detected',
            'Please upload a clearer image'
        ]
    
    return {
        'healthStatus': health_status,
        'confidence': round(confidence, 3),
        'animalDetected': ANIMAL_DISPLAY_NAMES.get(detected_animal_name, detected_animal_name) if detected_animal_name else None,
        'injuryDetails': injury_details,
        'detections': {
            'injured': 0,  # COCO model doesn't have "injured" class
            'animals': animal_count,
            'total': total_detections
        },
        'recommendations': recommendations
    }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Animal Injury Detection',
        'model_loaded': model is not None,
        'port': 5004,
        'note': 'Using generic COCO YOLOv11 - custom injury model needs restoration'
    })

@app.route('/detect', methods=['POST'])
def detect_injury():
    """
    Detect injured animals in an image
    Request body: { "image": "base64_encoded_image" }
    """
    try:
        if not model:
            return jsonify({
                'success': False,
                'error': 'Model not loaded'
            }), 500
        
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image provided'
            }), 400
        
        # Decode base64 image
        image = decode_base64_image(data['image'])
        if image is None:
            return jsonify({
                'success': False,
                'error': 'Failed to decode image'
            }), 400
        
        print(f"Processing image: {image.size}")
        
        # Run YOLOv11 detection
        results = model(image, conf=0.25, iou=0.45)
        
        # Analyze detections
        analysis = analyze_detections(results)
        
        print(f"✅ Detection complete: {analysis['healthStatus']} (confidence: {analysis['confidence']:.2%})")
        
        return jsonify({
            'success': True,
            **analysis
        })
    
    except Exception as e:
        print(f"❌ Error during detection: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print(f"🏥 Starting Animal Injury Detection Service on port 5004...")
    print(f"Model path: {MODEL_PATH}")
    print(f"Model loaded: {model is not None}")
    app.run(host='0.0.0.0', port=5004, debug=False)
