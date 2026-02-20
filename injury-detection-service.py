"""
Animal Injury Detection Service using YOLOv11 + Gemini AI
Runs on port 5004 (separate from poaching detection on 5002)
Uses Gemini Vision API for advanced injury detection and health assessment
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import os
from PIL import Image
import numpy as np
from ultralytics import YOLO
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
gemini_model = None

try:
    import google.generativeai as genai
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
        # Try different models - quota may be exhausted on some
        models_to_try = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-pro-latest', 'gemini-flash-latest']
        gemini_model = None
        
        for model_name in models_to_try:
            try:
                gemini_model = genai.GenerativeModel(model_name)
                print(f"✅ Gemini AI configured: {model_name}")
                break
            except Exception as e:
                print(f"⚠️ {model_name} failed: {str(e)[:80]}")
                continue
        
        if not gemini_model:
            print("❌ All Gemini models failed to initialize")
    else:
        print("⚠️ Gemini API key not found")
except ImportError as e:
    print(f"⚠️ Gemini AI not available: {e}")

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

def analyze_with_gemini(image):
    """
    Use Gemini Vision AI to analyze animal health and detect injuries
    Returns detailed injury assessment with accurate confidence scoring
    """
    if not gemini_model:
        print("❌ Gemini model not initialized")
        return None
    
    if not GEMINI_API_KEY:
        print("❌ No Gemini API key found")
        return None
    
    try:
        print("🤖 Starting Gemini AI analysis...")
        
        prompt = """🩺 WILDLIFE VETERINARIAN - HEALTH ASSESSMENT

You are an expert wildlife veterinarian. Analyze this animal image carefully and provide an accurate health assessment.

STEP 1 - IDENTIFY THE ANIMAL:
- Look at body size, shape, fur/skin patterns (stripes, spots, solid colors)
- Key features: tusks, trunk, mane, horns, antlers, tail
- Common animals: Tiger, Lion, Elephant, Deer, Leopard, Bear, Dog, Cat, etc.

STEP 2 - EXAMINE FOR INJURIES:

✅ HEALTHY ANIMAL SIGNS:
• Clean, well-groomed fur/coat
• Normal body posture (standing, sitting, lying naturally)
• All limbs in normal position
• Bright eyes, no discharge
• No visible blood or open wounds
• Complete fur coverage

🚨 INJURY INDICATORS (Mark as injured ONLY if you clearly see):
• BLOOD: Visible red/dark red liquid on fur or skin
• OPEN WOUNDS: Cuts, gashes with exposed flesh
• MISSING FUR: Large bald patches with raw/damaged skin
• SWELLING: Abnormal enlarged areas
• BROKEN LIMBS: Limbs at unnatural angles
• SEVERE LIMPING: Leg held up or not touching ground

⚠️ NOT INJURIES:
• Natural fur patterns, color variations, markings
• Shadows or lighting effects
• Bent/folded legs in resting position
• Natural body contours

STEP 3 - MAKE YOUR ASSESSMENT:

IF YOU SEE CLEAR INJURIES:
→ healthStatus = "injured" or "critical"
→ injuryDetails.detected = true
→ severity = "mild", "moderate", "severe", or "critical"
→ confidence = 0.80-0.95
→ description = Describe the specific injury and location

IF NO VISIBLE INJURIES:
→ healthStatus = "healthy"
→ injuryDetails.detected = false
→ severity = "none"
→ confidence = 0.80-0.92
→ description = "No visible injuries detected. Animal appears healthy."

RESPONSE FORMAT (JSON ONLY - NO MARKDOWN):
{
    "animalDetected": "Species name (Tiger/Lion/Elephant/Deer/Dog/Cat/etc.)",
    "healthStatus": "healthy OR injured OR critical",
    "confidence": 0.85,
    "injuryStatus": {
        "status": "If injured: 'Confirmed Injury' OR 'Suspected Injury' | If healthy: 'No Injury Detected'",
        "confidence": 0.88
    },
    "injuryDetails": {
        "detected": true or false,
        "description": "Detailed description of findings",
        "severity": "none OR mild OR moderate OR severe OR critical",
        "location": "Specific body parts OR none",
        "detectionConditions": [
            "Condition 1: What you observed (e.g., 'Visible blood on leg')",
            "Condition 2: What you observed (e.g., 'Open wound detected')"
        ]
    },
    "recommendations": [
        "Action recommendations"
    ]
}

RULES:
1. Always identify the animal species
2. Mark injured ONLY if you see obvious injuries
3. When uncertain, default to healthy
4. Ensure healthStatus matches detected status
5. Overall confidence reflects assessment certainty (0.75-0.95)
6. injuryStatus.confidence reflects certainty about the injury determination (0.75-0.98)
7. detectionConditions should list specific observations that led to your conclusion

INJURY STATUS GUIDELINES:
- "Confirmed Injury" + confidence 0.90-0.98: Clear visible injuries (blood, wounds, fractures)
- "Suspected Injury" + confidence 0.75-0.89: Possible injuries but not completely certain
- "No Injury Detected" + confidence 0.85-0.95: Animal appears healthy

DETECTION CONDITIONS EXAMPLES:
If injured: ["Visible blood on left front leg", "Open wound approximately 3cm", "Limping behavior observed"]
If healthy: ["No visible wounds or blood", "Normal posture and movement", "Clean, intact fur coat"]

RETURN ONLY JSON - NO EXTRA TEXT"""

        print("📤 Sending request to Gemini...")
        
        # Try with retry logic for quota errors
        max_retries = 2
        retry_delay = 2  # seconds
        
        for attempt in range(max_retries):
            try:
                response = gemini_model.generate_content([prompt, image])
                print("✅ Received response from Gemini")
                break
            except Exception as api_error:
                error_str = str(api_error)
                if '429' in error_str or 'quota' in error_str.lower():
                    if attempt < max_retries - 1:
                        print(f"⚠️ Quota error, retrying in {retry_delay}s... (attempt {attempt+1}/{max_retries})")
                        import time
                        time.sleep(retry_delay)
                        retry_delay *= 2  # Exponential backoff
                        continue
                    else:
                        print(f"❌ Quota exhausted after {max_retries} attempts")
                        return None
                else:
                    # Other error, don't retry
                    print(f"❌ API error (non-quota): {error_str[:100]}")
                    raise
        
        print("✅ Received response from Gemini")
        
        # Parse JSON from response
        import json
        import re
        
        response_text = response.text.strip()
        print(f"🤖 Gemini raw response (first 500 chars): {response_text[:500]}...")
        
        # Remove markdown code blocks if present
        response_text = re.sub(r'```json\s*', '', response_text)
        response_text = re.sub(r'```\s*', '', response_text)
        response_text = response_text.strip()
        
        # Try to parse JSON
        try:
            analysis = json.loads(response_text)
            
            # Validate response structure
            if not isinstance(analysis, dict):
                raise ValueError("Response is not a dictionary")
            
            # Extract and validate fields
            animal = analysis.get('animalDetected', 'Unknown Animal')
            health_status = str(analysis.get('healthStatus', 'unknown')).lower()
            confidence = float(analysis.get('confidence', 0.75))
            
            # Extract injury status with confidence
            injury_status_data = analysis.get('injuryStatus', {
                'status': 'No Injury Detected' if health_status == 'healthy' else 'Suspected Injury',
                'confidence': confidence
            })
            
            # Get injury details
            injury_details = analysis.get('injuryDetails', {})
            if not isinstance(injury_details, dict):
                injury_details = {
                    'detected': False,
                    'description': 'Unable to parse injury details',
                    'severity': 'none',
                    'location': 'none',
                    'detectionConditions': []
                }
            
            detected = bool(injury_details.get('detected', False))
            description = str(injury_details.get('description', 'No analysis available'))
            severity = str(injury_details.get('severity', 'none')).lower()
            location = str(injury_details.get('location', 'none'))
            detection_conditions = injury_details.get('detectionConditions', [])
            
            # Validate severity values
            if severity not in ['none', 'mild', 'moderate', 'severe', 'critical']:
                severity = 'moderate' if detected else 'none'
            
            # CRITICAL: If injury is detected, health status MUST be injured or critical
            if detected and health_status == 'healthy':
                print("⚠️ WARNING: Injury detected but marked as healthy - correcting to 'injured'")
                health_status = 'injured'
            
            # If health status is injured/critical but not marked as detected, fix it
            if health_status in ['injured', 'critical'] and not detected:
                detected = True
                if severity == 'none':
                    severity = 'moderate'
            
            # Check for injury keywords in description
            injury_keywords = ['wound', 'injur', 'blood', 'cut', 'fracture', 'broken', 
                              'laceration', 'trauma', 'limp', 'swell', 'bruise']
            has_injury_keywords = any(keyword in description.lower() for keyword in injury_keywords)
            
            # If description mentions injury but status is healthy, correct it
            if has_injury_keywords and health_status == 'healthy':
                print("⚠️ WARNING: Injury mentioned in description but marked as healthy - correcting")
                health_status = 'injured'
                detected = True
                severity = 'moderate'
            
            recommendations = analysis.get('recommendations', [])
            if not isinstance(recommendations, list) or len(recommendations) == 0:
                recommendations = [
                    'Consult wildlife veterinarian for proper examination',
                    'Monitor animal closely for any changes',
                    'Document with additional photos if possible'
                ]
            
            result = {
                'animalDetected': animal,
                'healthStatus': health_status,
                'confidence': min(max(confidence, 0.0), 1.0),
                'injuryStatus': injury_status_data,
                'injuryDetails': {
                    'detected': detected,
                    'description': description,
                    'severity': severity,
                    'location': location,
                    'detectionConditions': detection_conditions if detection_conditions else []
                },
                'recommendations': recommendations
            }
            
            print(f"✅ Gemini analysis: Animal={animal} | Status={health_status} | Injury={detected} | Severity={severity}")
            return result
            
        except (json.JSONDecodeError, ValueError) as e:
            print(f"⚠️ JSON parse error: {e}, attempting text analysis")
            
            # Fallback: analyze text directly
            text_lower = response_text.lower()
            
            # Species detection
            species_keywords = {
                'tiger': ['tiger', 'panthera tigris'],
                'lion': ['lion', 'panthera leo'],
                'elephant': ['elephant', 'elephas', 'loxodonta'],
                'leopard': ['leopard', 'panthera pardus'],
                'dog': ['dog', 'canine', 'canis'],
                'cat': ['cat', 'feline', 'felis'],
                'bear': ['bear', 'ursus'],
                'deer': ['deer', 'cervus'],
                'wolf': ['wolf', 'canis lupus']
            }
            
            detected_species = 'Unknown Animal'
            for species, keywords in species_keywords.items():
                if any(kw in text_lower for kw in keywords):
                    detected_species = species.title()
                    break
            
            # Injury detection
            injury_keywords = ['wound', 'injur', 'blood', 'cut', 'fracture', 'broken', 
                              'laceration', 'trauma', 'damage', 'hurt', 'pain', 'swell', 
                              'bruise', 'limp']
            health_keywords = ['healthy', 'normal', 'good condition', 'no visible', 'appears well']
            
            has_injury = any(keyword in text_lower for keyword in injury_keywords)
            appears_healthy = any(keyword in text_lower for keyword in health_keywords) and not has_injury
            
            return {
                'animalDetected': detected_species,
                'healthStatus': 'injured' if has_injury else ('healthy' if appears_healthy else 'unknown'),
                'confidence': 0.65,
                'injuryDetails': {
                    'detected': has_injury,
                    'description': response_text[:600] if response_text else 'Unable to analyze image properly. Please try again with a clearer image.',
                    'severity': 'moderate' if has_injury else 'none',
                    'location': 'See description above for details'
                },
                'recommendations': [
                    '⚠️ Analysis unclear - manual review recommended',
                    'Consult wildlife veterinarian for proper diagnosis',
                    'Re-upload with clearer, well-lit image if possible'
                ]
            }
    
    except Exception as e:
        print(f"❌ CRITICAL ERROR in Gemini analysis: {e}")
        print(f"❌ Error type: {type(e).__name__}")
        import traceback
        print("❌ Full traceback:")
        traceback.print_exc()
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
    
    # Since we're using COCO model (no "injured" class), provide CONSERVATIVE health assessment
    if animal_count > 0:
        # Enhanced species mapping for better identification
        species_map = {
            'cat': 'Wild Cat / Feline (May be Tiger, Leopard, or Domestic Cat)',
            'dog': 'Canine (May be Wolf, Fox, or Dog)',
            'horse': 'Equine / Horse',
            'sheep': 'Wild Sheep / Goat (May be Mountain Goat, Ibex)',
            'cow': 'Wild Cattle / Buffalo / Gaur / Bison',
            'elephant': 'Elephant',
            'bear': 'Bear',
            'zebra': 'Zebra',
            'giraffe': 'Giraffe',
            'bird': 'Bird Species'
        }
        
        display_name = species_map.get(detected_animal_name, 
                                      ANIMAL_DISPLAY_NAMES.get(detected_animal_name, 
                                                               detected_animal_name.title() if detected_animal_name else 'Animal'))
        
        # CONSERVATIVE: Mark as "unknown" not "healthy" since we can't truly assess health
        health_status = 'unknown'
        confidence = max_animal_conf
        injury_details = {
            'detected': False,
            'description': f'⚠️ {display_name} detected. Cannot assess health/injuries without Gemini AI. Basic YOLO model only identifies species, not injuries or health conditions. Manual veterinary inspection strongly recommended.',
            'severity': 'none'
        }
        recommendations = [
            f'🔍 {display_name} identified (Confidence: {int(max_animal_conf*100)}%)',
            '⚠️ Gemini AI unavailable - Cannot assess injuries or health',
            '👨‍⚕️ STRONGLY RECOMMEND: Manual veterinary examination',
            '⏰ Wait 1-2 minutes and retry for AI-powered analysis',
            '📸 Or use a Gemini-enabled service for accurate health assessment'
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
        'service': 'Animal Injury Detection with Gemini AI',
        'model_loaded': model is not None,
        'gemini_enabled': gemini_model is not None,
        'port': 5005,
        'capabilities': ['YOLO detection', 'Gemini AI analysis', 'Health assessment']
    })

@app.route('/detect', methods=['POST'])
def detect_injury():
    """
    Detect injured animals in an image using YOLO + Gemini AI
    Request body: { "image": "base64_encoded_image" }
    """
    try:
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
        
        print(f"🖼️ Processing image: {image.size}")
        print(f"🤖 Gemini model available: {gemini_model is not None}")
        
        # Primary: Use Gemini AI for advanced analysis
        gemini_analysis = analyze_with_gemini(image)
        
        if gemini_analysis:
            print(f"✅ GEMINI SUCCESS!")
            print(f"   Animal: {gemini_analysis.get('animalDetected')}")
            print(f"   Status: {gemini_analysis.get('healthStatus')}")
            print(f"   Injury Detected: {gemini_analysis.get('injuryDetails', {}).get('detected')}")
            print(f"   Confidence: {gemini_analysis.get('confidence')}")
            
            response_data = {
                'success': True,
                'source': 'gemini-ai-pro',
                'healthStatus': gemini_analysis.get('healthStatus', 'unknown'),
                'confidence': gemini_analysis.get('confidence', 0.8),
                'animalDetected': gemini_analysis.get('animalDetected'),
                'injuryStatus': gemini_analysis.get('injuryStatus', {}),
                'injuryDetails': gemini_analysis.get('injuryDetails', {}),
                'recommendations': gemini_analysis.get('recommendations', []),
                'detections': {
                    'injured': 1 if gemini_analysis.get('injuryDetails', {}).get('detected') else 0,
                    'animals': 1 if gemini_analysis.get('animalDetected') else 0,
                    'total': 1
                }
            }
            
            print(f"📤 Sending response: {response_data}")
            return jsonify(response_data)
        
        # Fallback: Use YOLO detection if Gemini fails
        print("⚠️ Gemini analysis returned None, trying YOLO fallback")
        if model:
            print("⚠️ Gemini unavailable, using YOLO fallback")
            results = model(image, conf=0.25, iou=0.45)
            analysis = analyze_detections(results)
            
            return jsonify({
                'success': True,
                'source': 'yolo-fallback',
                **analysis
            })
        
        # No detection available
        return jsonify({
            'success': False,
            'error': 'No detection models available'
        }), 503
    
    except Exception as e:
        print(f"❌ Error during detection: {e}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print(f"🏥 Starting Animal Injury Detection Service on port 5005...")
    print(f"YOLO Model path: {MODEL_PATH}")
    print(f"YOLO Model loaded: {model is not None}")
    print(f"Gemini AI enabled: {gemini_model is not None}")
    if gemini_model:
        print(f"✅ Using Gemini AI for advanced injury detection")
    else:
        print(f"⚠️ Gemini AI unavailable - using YOLO only")
    app.run(host='0.0.0.0', port=5005, debug=False)
