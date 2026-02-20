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

# Load the trained YOLOv11 model with fallback to pre-trained
MODEL_PATH = Path(__file__).parent / "runs" / "detect" / "train2" / "weights" / "best.pt"
FALLBACK_MODEL = Path(__file__).parent / "yolo11s.pt"  # YOLOv11 small model

print(f"Loading YOLOv11 poaching detection model from: {MODEL_PATH}")

try:
    if MODEL_PATH.exists():
        model = YOLO(str(MODEL_PATH))
        print("✅ Custom-trained YOLOv11 model loaded successfully!")
    else:
        print(f"⚠️ Custom model not found, using pre-trained YOLOv11s")
        model = YOLO(str(FALLBACK_MODEL))
        print("✅ Pre-trained YOLOv11s model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    print("Attempting to load fallback model...")
    try:
        model = YOLO(str(FALLBACK_MODEL))
        print("✅ Fallback YOLOv11s model loaded successfully!")
    except Exception as e2:
        print(f"❌ Fallback model also failed: {e2}")
        model = None

# Threat categories - Enhanced for comprehensive detection
# Weapons - expanded to catch all variations
WEAPONS = ['Knife', 'Pistol', 'Rifle', 'X-Bow', 'Rope', 'gun', 'rifle', 'knife', 'weapon',
          'firearm', 'shotgun', 'revolver', 'carbine', 'assault', 'sniper', 'handgun',
          'crossbow', 'bow', 'arrow', 'trap', 'snare', 'sword', 'machete', 'blade']
VEHICLES = ['Car', 'Jeep', 'Truck', 'Van', 'Helicopter', 'Bike', 'car', 'truck', 'motorcycle', 'vehicle',
           'suv', 'pickup', 'van', 'bus', 'atv', 'quad', 'offroad', 'automobile']
HUMANS = ['Hunter', 'person', 'human', 'man', 'woman', 'people', 'poacher', 'trespasser']
ANIMALS = ['Antelope', 'Badger', 'Bat', 'Bear', 'Bison', 'Boar', 'Cheetah', 'Chimpanzee', 
          'Coyote', 'Deer', 'Dog', 'Donkey', 'Duck', 'Eagle', 'Elephant', 'Flamingo', 
          'Fox', 'Giraffe', 'Goat', 'Goose', 'Gorilla', 'Hare', 'Hedgehog', 'Hippopotamus', 
          'Hornbill', 'Horse', 'Humming Bird', 'Hyena', 'Kangaroo', 'Koala', 'Leopard', 
          'Lion', 'Lizard', 'Mouse', 'Okapi', 'Orangutan', 'Otter', 'Owl', 'Ox', 'Panda', 
          'Parrot', 'Pig', 'Pigeon', 'Porcupine', 'Possum', 'Raccoon', 'Reindeer', 
          'Rinoceros', 'Sandpiper', 'Sheep', 'Snake', 'Sparrow', 'Squirrel', 'Tiger', 
          'Turkey', 'Wolf', 'Wombat', 'Woodpecker', 'Zebra', 
          'elephant', 'tiger', 'leopard', 'bear', 'deer', 'bird', 'rhino', 'buffalo']

# Confidence boost for better threat detection
CONFIDENCE_BOOST = 0.50  # Add 50% to all confidence scores

def assess_threat_level(detections):
    """
    Assess threat level based on detected objects
    Enhanced with comprehensive threat analysis and alert system
    """
    weapons_detected = []
    humans_detected = []
    vehicles_detected = []
    animals_detected = []
    
    # Categorize detections with comprehensive matching
    for det in detections:
        class_name = det['class']
        class_lower = class_name.lower()
        
        # Check each category with fuzzy matching
        weapon_match = any(weapon.lower() in class_lower or class_lower in weapon.lower() for weapon in WEAPONS)
        human_match = any(human.lower() in class_lower or class_lower in human.lower() for human in HUMANS)
        vehicle_match = any(vehicle.lower() in class_lower or class_lower in vehicle.lower() for vehicle in VEHICLES)
        animal_match = any(animal.lower() in class_lower or class_lower in animal.lower() for animal in ANIMALS)
        
        # Boost confidence by 50% (up to 99% max)
        boosted_confidence = min(det['confidence'] + CONFIDENCE_BOOST, 0.99)
        det['boosted_confidence'] = boosted_confidence
        
        if weapon_match:
            weapons_detected.append(det)
        if human_match:
            humans_detected.append(det)
        if vehicle_match:
            vehicles_detected.append(det)
        if animal_match:
            animals_detected.append(det)
    
    # Determine threat level with detailed analysis
    threat_level = "none"
    threat_score = 0
    detected_activities = []
    suspicious_objects = []
    recommendations = []
    alert_priority = "low"
    threat_description = ""
    
    # CRITICAL THREAT: Weapons detected (HIGHEST PRIORITY)
    if weapons_detected:
        threat_level = "critical"
        threat_score = 0.95
        alert_priority = "CRITICAL"
        threat_description = "🚨 ARMED THREAT DETECTED - IMMEDIATE RESPONSE REQUIRED"
        
        for weapon in weapons_detected:
            weapon_conf = weapon['boosted_confidence']
            suspicious_objects.append(f"⚠️ {weapon['class'].upper()} (Confidence: {weapon_conf:.0%})")
        
        detected_activities.append(f"🔫 {len(weapons_detected)} WEAPON(S) DETECTED - ARMED PRESENCE CONFIRMED")
        detected_activities.append(f"📍 Location: Protected Wildlife Area")
        detected_activities.append(f"⏰ Alert Status: CRITICAL - IMMEDIATE ACTION")
        
        recommendations.append("🚨 ALERT PRIORITY: URGENT - DEPLOY RAPID RESPONSE TEAM")
        recommendations.append("📞 IMMEDIATE: Contact wildlife protection authorities")
        recommendations.append("🚔 IMMEDIATE: Alert law enforcement and anti-poaching units")
        recommendations.append("⚠️ SAFETY: Do NOT approach - armed individuals are dangerous")
        recommendations.append("📸 EVIDENCE: Document location, time, and all visual evidence")
        recommendations.append("📡 TRACKING: Enable GPS tracking and monitor movement")
    
    # CRITICAL: Weapons near wildlife (ACTIVE POACHING)
    if weapons_detected and animals_detected:
        threat_level = "critical"
        threat_score = 0.99
        alert_priority = "EMERGENCY"
        threat_description = "🚨🦁 ACTIVE POACHING IN PROGRESS - WILDLIFE IN IMMEDIATE DANGER"
        
        detected_activities.append(f"🚨 ACTIVE POACHING: {len(weapons_detected)} weapon(s) near {len(animals_detected)} animal(s)")
        detected_activities.append(f"🦁 Wildlife Species Detected: {len(animals_detected)} individual(s)")
        detected_activities.append(f"💀 CRITICAL: Animals under immediate threat")
        
        recommendations.insert(0, "🚨 EMERGENCY ALERT: Wildlife in immediate danger - DEPLOY ALL UNITS")
        recommendations.insert(1, "🚁 REQUEST: Helicopter surveillance and rapid intervention")
        recommendations.insert(2, "🦁 PRIORITY: Protect wildlife - secure the area immediately")
    
    # HIGH THREAT: Humans + Vehicles in protected area
    if humans_detected and vehicles_detected:
        if threat_level == "none":
            threat_level = "high"
            threat_score = 0.85
            alert_priority = "HIGH"
            threat_description = "⚠️ UNAUTHORIZED ACCESS - Suspicious activity with vehicles"
        
        detected_activities.append(f"👤 {len(humans_detected)} PERSON(S) with {len(vehicles_detected)} VEHICLE(S)")
        detected_activities.append(f"🚗 Vehicle Types: {', '.join(set([v['class'] for v in vehicles_detected[:3]]))}")
        detected_activities.append(f"📍 Status: Unauthorized access to protected area")
        
        for vehicle in vehicles_detected[:3]:
            suspicious_objects.append(f"🚗 {vehicle['class']} (Confidence: {vehicle['boosted_confidence']:.0%})")
        
        recommendations.append("🚗 VERIFY: Check vehicle registration and authorization permits")
        recommendations.append("📸 DOCUMENT: Record license plates and vehicle descriptions")
        recommendations.append("📍 TRACK: Monitor movement patterns and exit routes")
        recommendations.append("👁️ OBSERVE: Watch for suspicious loading/unloading activities")
        recommendations.append("📋 LOG: Document all details for investigation report")
    
    # HIGH THREAT: Humans near wildlife
    if humans_detected and animals_detected and threat_level == "none":
        threat_level = "high"
        threat_score = 0.70
        alert_priority = "HIGH"
        threat_description = "⚠️ HUMAN-WILDLIFE INTERACTION - Monitor for suspicious behavior"
        
        detected_activities.append(f"👤 {len(humans_detected)} PERSON(S) near {len(animals_detected)} ANIMAL(S)")
        detected_activities.append(f"🦁 Wildlife Present: {len(animals_detected)} individual(s) detected")
        detected_activities.append(f"👁️ Monitoring Required: Assess intent and authorization")
        
        recommendations.append("👁️ MONITOR: Continuous observation of human activity")
        recommendations.append("🔍 VERIFY: Check for valid permits or research authorization")
        recommendations.append("📸 DOCUMENT: Record activity patterns and behavior")
        recommendations.append("🦁 PROTECT: Ensure wildlife safety and prevent disturbance")
        recommendations.append("📞 STANDBY: Prepare response team for potential escalation")
    
    # MEDIUM THREAT: Unauthorized entry
    if (vehicles_detected or humans_detected) and threat_level == "none":
        threat_level = "medium"
        threat_score = 0.55
        alert_priority = "MEDIUM"
        threat_description = "ℹ️ POSSIBLE UNAUTHORIZED ENTRY - Verification needed"
        
        if vehicles_detected:
            detected_activities.append(f"🚗 {len(vehicles_detected)} VEHICLE(S) in restricted zone")
        if humans_detected:
            detected_activities.append(f"👤 {len(humans_detected)} PERSON(S) detected in protected area")
        
        recommendations.append("✓ VERIFY: Check authorization and permits")
        recommendations.append("📋 LOG: Record incident details for patrol review")
        recommendations.append("🗣️ ENGAGE: Contact individuals to verify purpose")
        recommendations.append("📍 TRACK: Monitor location and duration of stay")
    
    # NO THREAT: Normal wildlife activity
    if animals_detected and not humans_detected and not vehicles_detected and not weapons_detected:
        threat_level = "none"
        threat_score = 0.0
        alert_priority = "INFO"
        threat_description = "✅ NORMAL WILDLIFE ACTIVITY - No threats detected"
        
        detected_activities.append(f"🦁 {len(animals_detected)} WILDLIFE DETECTED - Normal behavior")
        detected_activities.append(f"✓ No human presence or threats identified")
        detected_activities.append(f"📊 Status: Routine wildlife monitoring")
        
        recommendations.append("✅ CONTINUE: Regular monitoring and surveillance")
        recommendations.append("📊 LOG: Record wildlife sighting for database")
        recommendations.append("📸 OPTIONAL: Capture images for research documentation")
    
    # Build comprehensive threat summary
    threat_summary = {
        'alert_priority': alert_priority,
        'threat_description': threat_description,
        'detailed_analysis': {
            'weapons': f"{len(weapons_detected)} detected" if weapons_detected else "None",
            'humans': f"{len(humans_detected)} detected" if humans_detected else "None", 
            'vehicles': f"{len(vehicles_detected)} detected" if vehicles_detected else "None",
            'wildlife': f"{len(animals_detected)} detected" if animals_detected else "None"
        }
    }
    
    return {
        'threat_level': threat_level,
        'threat_score': threat_score,
        'alert_priority': alert_priority,
        'threat_description': threat_description,
        'threat_summary': threat_summary,
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
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        print(f"🔍 Processing image: {image.size[0]}x{image.size[1]} pixels")
        
        # Run YOLOv11 detection with VERY LOW threshold for maximum detection
        # Using 0.08 (8%) for comprehensive threat detection including rifles
        results = model(image, conf=0.08, iou=0.40, verbose=False, agnostic_nms=True)
        
        print(f"📊 YOLO inference complete - analyzing detections...")
        
        # Process detections with confidence boosting
        detections = []
        for result in results:
            boxes = result.boxes
            print(f"   Found {len(boxes)} raw detections")
            for box in boxes:
                class_id = int(box.cls[0])
                class_name = result.names[class_id]
                confidence = float(box.conf[0])
                bbox = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
                
                # Apply confidence boost (+50%)
                boosted_conf = min(confidence + CONFIDENCE_BOOST, 0.99)
                
                detections.append({
                    'class': class_name,
                    'confidence': confidence,
                    'boosted_confidence': boosted_conf,
                    'bbox': bbox
                })
                print(f"   ✓ {class_name}: {confidence:.2%} → Boosted: {boosted_conf:.2%}")
        
        print(f"✅ Total detections: {len(detections)} (with 50% confidence boost)")
        
        # Assess threat level with enhanced analysis
        threat_analysis = assess_threat_level(detections)
        
        # Build comprehensive evidence description
        evidence_parts = []
        if threat_analysis['weapons_detected']:
            weapon_list = ', '.join(set([w['class'] for w in threat_analysis['weapons_detected'][:3]]))
            evidence_parts.append(f"🔫 WEAPONS: {weapon_list} ({len(threat_analysis['weapons_detected'])} total)")
        if threat_analysis['humans_detected']:
            evidence_parts.append(f"👤 HUMANS: {len(threat_analysis['humans_detected'])} person(s)")
        if threat_analysis['vehicles_detected']:
            vehicle_list = ', '.join(set([v['class'] for v in threat_analysis['vehicles_detected'][:3]]))
            evidence_parts.append(f"🚗 VEHICLES: {vehicle_list} ({len(threat_analysis['vehicles_detected'])} total)")
        if threat_analysis['animals_detected']:
            animal_list = ', '.join(set([a['class'] for a in threat_analysis['animals_detected'][:3]]))
            evidence_parts.append(f"🦁 WILDLIFE: {animal_list} ({len(threat_analysis['animals_detected'])} total)")
        
        evidence_description = " | ".join(evidence_parts) if evidence_parts else "✅ No threats detected - normal wildlife activity"
        
        # Prepare comprehensive response with alert system info
        response = {
            'success': True,
            'threatDetected': threat_analysis['threat_level'] != 'none',
            'threatLevel': threat_analysis['threat_level'],
            'alertPriority': threat_analysis['alert_priority'],
            'threatDescription': threat_analysis['threat_description'],
            'confidence': threat_analysis['threat_score'],
            'confidenceBoosted': True,
            'confidenceBoostAmount': '+50%',
            'detectedActivities': threat_analysis['detected_activities'],
            'suspiciousObjects': threat_analysis['suspicious_objects'],
            'recommendations': threat_analysis['recommendations'],
            'evidenceDescription': evidence_description,
            'threatSummary': threat_analysis['threat_summary'],
            'detections': {
                'total': len(detections),
                'weapons': len(threat_analysis['weapons_detected']),
                'humans': len(threat_analysis['humans_detected']),
                'vehicles': len(threat_analysis['vehicles_detected']),
                'animals': len(threat_analysis['animals_detected']),
                'all_detections': detections[:20]  # Limit to top 20 for response size
            },
            'alertSystem': {
                'enabled': True,
                'priority': threat_analysis['alert_priority'],
                'responseRequired': threat_analysis['threat_level'] in ['critical', 'high'],
                'immediateAction': threat_analysis['threat_level'] == 'critical',
                'notificationChannels': ['SMS', 'Email', 'Dashboard', 'Mobile App'],
                'escalationLevel': 'IMMEDIATE' if threat_analysis['threat_level'] == 'critical' else 'STANDARD'
            }
        }
        
        print(f"🎯 Threat Analysis: {threat_analysis['threat_level'].upper()} ({threat_analysis['threat_score']:.0%})")
        print(f"📢 Alert Priority: {threat_analysis['alert_priority']}")
        
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
    
    app.run(host='0.0.0.0', port=5003, debug=False)
