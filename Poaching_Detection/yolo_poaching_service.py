"""
YOLOv11 Poaching Detection Service
Detects weapons (guns, knives, crossbows), humans, and vehicles near wildlife
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import base64
import io
from PIL import Image
import numpy as np
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Load the trained YOLOv11 model
MODEL_PATH = Path(__file__).parent / "runs" / "detect" / "train2" / "weights" / "best.pt"
print(f"Loading YOLOv11 poaching detection model from: {MODEL_PATH}")

try:
    model = YOLO(str(MODEL_PATH))
    print("✅ YOLOv11 model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    model = None

# Threat categories
WEAPONS = ['Knife', 'Pistol', 'Rifle', 'X-Bow', 'Rope']
VEHICLES = ['Car', 'Jeep', 'Truck', 'Van', 'Helicopter', 'Bike']
HUMANS = ['Hunter']
ANIMALS = ['Antelope', 'Badger', 'Bat', 'Bear', 'Bison', 'Boar', 'Cheetah', 'Chimpanzee', 
          'Coyote', 'Deer', 'Dog', 'Donkey', 'Duck', 'Eagle', 'Elephant', 'Flamingo', 
          'Fox', 'Giraffe', 'Goat', 'Goose', 'Gorilla', 'Hare', 'Hedgehog', 'Hippopotamus', 
          'Hornbill', 'Horse', 'Humming Bird', 'Hyena', 'Kangaroo', 'Koala', 'Leopard', 
          'Lion', 'Lizard', 'Mouse', 'Okapi', 'Orangutan', 'Otter', 'Owl', 'Ox', 'Panda', 
          'Parrot', 'Pig', 'Pigeon', 'Porcupine', 'Possum', 'Raccoon', 'Reindeer', 
          'Rinoceros', 'Sandpiper', 'Sheep', 'Snake', 'Sparrow', 'Squirrel', 'Tiger', 
          'Turkey', 'Wolf', 'Wombat', 'Woodpecker', 'Zebra']

def assess_threat_level(detections):
    """
    Assess threat level based on detected objects
    """
    weapons_detected = []
    humans_detected = []
    vehicles_detected = []
    animals_detected = []
    
    for det in detections:
        class_name = det['class']
        if class_name in WEAPONS:
            weapons_detected.append(det)
        elif class_name in HUMANS:
            humans_detected.append(det)
        elif class_name in VEHICLES:
            vehicles_detected.append(det)
        elif class_name in ANIMALS:
            animals_detected.append(det)
    
    # Determine threat level
    threat_level = "none"
    threat_score = 0
    detected_activities = []
    suspicious_objects = []
    recommendations = []
    
    # Critical: Weapons detected
    if weapons_detected:
        threat_level = "critical"
        threat_score = 0.95
        for weapon in weapons_detected:
            suspicious_objects.append(f"{weapon['class']} (confidence: {weapon['confidence']:.0%})")
        detected_activities.append("Armed presence detected")
        recommendations.append("⚠️ IMMEDIATE ACTION: Contact wildlife authorities immediately")
        recommendations.append("🚨 Do not approach - armed individuals may be dangerous")
        recommendations.append("📸 Preserve evidence and GPS coordinates")
    
    # High: Weapons + Animals nearby
    if weapons_detected and animals_detected:
        threat_level = "critical"
        threat_score = 0.98
        detected_activities.append(f"Weapons near wildlife ({len(animals_detected)} animals detected)")
        recommendations.append("🚨 CRITICAL: Active poaching threat - wildlife in immediate danger")
    
    # High: Humans + Vehicles in protected area
    if humans_detected and vehicles_detected:
        if threat_level == "none":
            threat_level = "high"
            threat_score = 0.85
        detected_activities.append("Unauthorized human activity with vehicles")
        suspicious_objects.extend([f"{v['class']}" for v in vehicles_detected])
        recommendations.append("🚗 Check vehicle registration and authorization")
        recommendations.append("📍 Document location and time")
    
    # Medium: Humans near animals
    if humans_detected and animals_detected:
        if threat_level == "none":
            threat_level = "medium"
            threat_score = 0.70
        detected_activities.append(f"Human presence near {len(animals_detected)} animals")
        recommendations.append("👁️ Monitor for suspicious behavior")
        recommendations.append("🔍 Verify if person has valid permits")
    
    # Low: Only vehicles or only humans
    if (vehicles_detected or humans_detected) and threat_level == "none":
        threat_level = "low"
        threat_score = 0.50
        detected_activities.append("Possible unauthorized entry")
        recommendations.append("✓ Verify authorization to be in the area")
        recommendations.append("📋 Log the incident for patrol review")
    
    return {
        'threat_level': threat_level,
        'threat_score': threat_score,
        'weapons_detected': weapons_detected,
        'humans_detected': humans_detected,
        'vehicles_detected': vehicles_detected,
        'animals_detected': animals_detected,
        'detected_activities': detected_activities,
        'suspicious_objects': suspicious_objects,
        'recommendations': recommendations
    }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model': 'YOLOv11 Poaching Detection',
        'model_loaded': model is not None,
        'classes': 72,
        'weapon_classes': len(WEAPONS),
        'vehicle_classes': len(VEHICLES),
        'animal_classes': len(ANIMALS)
    })

@app.route('/detect-poaching', methods=['POST'])
def detect_poaching():
    """
    Detect poaching threats in an image
    Expects: { "image": "base64_encoded_image" }
    Returns: Threat analysis with detected weapons, humans, vehicles near animals
    """
    try:
        if model is None:
            return jsonify({
                'success': False,
                'error': 'YOLOv11 model not loaded'
            }), 500
        
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image provided'
            }), 400
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'])
        image = Image.open(io.BytesIO(image_data))
        
        # Run YOLOv11 detection
        results = model(image, conf=0.25)  # 25% confidence threshold
        
        # Process detections
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                class_id = int(box.cls[0])
                class_name = result.names[class_id]
                confidence = float(box.conf[0])
                bbox = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
                
                detections.append({
                    'class': class_name,
                    'confidence': confidence,
                    'bbox': bbox
                })
        
        # Assess threat level
        threat_analysis = assess_threat_level(detections)
        
        # Build evidence description
        evidence_parts = []
        if threat_analysis['weapons_detected']:
            evidence_parts.append(f"🔫 {len(threat_analysis['weapons_detected'])} weapon(s) detected")
        if threat_analysis['humans_detected']:
            evidence_parts.append(f"👤 {len(threat_analysis['humans_detected'])} human(s) detected")
        if threat_analysis['vehicles_detected']:
            evidence_parts.append(f"🚗 {len(threat_analysis['vehicles_detected'])} vehicle(s) detected")
        if threat_analysis['animals_detected']:
            evidence_parts.append(f"🦁 {len(threat_analysis['animals_detected'])} animal(s) detected")
        
        evidence_description = " | ".join(evidence_parts) if evidence_parts else "No threats detected"
        
        # Prepare response
        response = {
            'success': True,
            'threatDetected': threat_analysis['threat_level'] != 'none',
            'threatLevel': threat_analysis['threat_level'],
            'confidence': threat_analysis['threat_score'],
            'detectedActivities': threat_analysis['detected_activities'],
            'suspiciousObjects': threat_analysis['suspicious_objects'],
            'recommendations': threat_analysis['recommendations'],
            'evidenceDescription': evidence_description,
            'detections': {
                'total': len(detections),
                'weapons': len(threat_analysis['weapons_detected']),
                'humans': len(threat_analysis['humans_detected']),
                'vehicles': len(threat_analysis['vehicles_detected']),
                'animals': len(threat_analysis['animals_detected']),
                'all_detections': detections
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Error in poaching detection: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🔍 YOLOv11 POACHING DETECTION SERVICE")
    print("="*70)
    print(f"📊 Model: YOLOv11 (72 classes)")
    print(f"🔫 Weapon Detection: {WEAPONS}")
    print(f"🚗 Vehicle Detection: {len(VEHICLES)} types")
    print(f"👤 Human Detection: Active")
    print(f"🦁 Animal Detection: {len(ANIMALS)} species")
    print("="*70)
    print("\n✅ Starting service on http://localhost:5002")
    print("Press CTRL+C to stop\n")
    
    app.run(host='0.0.0.0', port=5002, debug=False)
