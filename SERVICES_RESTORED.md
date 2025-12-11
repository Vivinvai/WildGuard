# 🦁 Wild Rescue Guide - Services Restored

## ✅ All Services Running Successfully

### Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WILD RESCUE GUIDE                        │
│                  Main Server (Port 5000)                    │
│              Express/Node + React Frontend                  │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  TensorFlow AI  │ │ YOLOv11 Poaching│ │ YOLOv11 Injury  │
│   Port 5001     │ │   Port 5002     │ │   Port 5004     │
│  MobileNetV2    │ │  Custom Model   │ │   COCO Model    │
│  (1000+ species)│ │  (72 classes)   │ │ (Animal Health) │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 🔍 Fauna Detection (Animal Identification)

**Status:** ✅ **WORKING**

### Endpoint
- **Frontend:** `/identify`
- **API:** `POST /api/identify-animal`

### Technology Stack
1. **Primary:** TensorFlow MobileNetV2 (Port 5001)
   - 1000+ ImageNet classes
   - Wildlife mapping (Tiger, Elephant, Leopard, etc.)
   - Confidence: 60-99.9%
   
2. **Fallback:** Gemini AI (Cloud)
   - Google's vision model
   - High accuracy for wildlife
   - API key: Configured

### How It Works
```
User uploads image
    ↓
AI Orchestrator tries:
    1. TensorFlow MobileNetV2 (port 5001) - FIRST
    2. Gemini AI (cloud) - FALLBACK
    ↓
Returns: Species, Scientific Name, Conservation Status, 
         Habitat, Threats, Population
    ↓
Saves to database with GPS location
```

### Files Involved
- **Frontend:** `client/src/pages/identify.tsx`
- **Component:** `client/src/components/photo-upload.tsx`
- **Backend:** `server/routes.ts` (line 727-780)
- **AI Service:** `server/services/tensorflow-bridge.ts`
- **Python Service:** `ai_models/tensorflow_service.py`

---

## 🚨 Poaching Detection

**Status:** ✅ **WORKING**

### Endpoint
- **Frontend:** `/features/poaching-detection`
- **API:** `POST /api/features/poaching-detection`

### Technology Stack
1. **Primary:** YOLOv11 Custom Model (Port 5002)
   - Trained on 72 classes
   - **Weapons:** Knife, Pistol, Rifle, X-Bow, Rope (5 types)
   - **Vehicles:** Car, Jeep, Truck, Van, Helicopter, Bike (6 types)
   - **Humans:** Hunter (1 type)
   - **Animals:** 59 wildlife species
   
2. **Fallback:** Gemini AI (Cloud)

### Threat Levels
- **CRITICAL:** Weapons detected or weapons + animals
- **HIGH:** Humans + vehicles in protected area
- **MEDIUM:** Humans near animals
- **LOW:** Only vehicles or only humans
- **NONE:** No threats detected

### How It Works
```
User uploads camera trap/drone image
    ↓
YOLOv11 analyzes (port 5002)
    ↓
Detects: Weapons, Humans, Vehicles, Animals
    ↓
Calculates threat level + recommendations
    ↓
Saves to database (poachingAlerts table)
    ↓
Admin can view alerts at /admin/poaching-alerts
```

### Files Involved
- **Frontend:** `client/src/pages/features/poaching-detection.tsx`
- **Backend:** `server/routes.ts` (line 1730-1815)
- **Service:** `server/services/poaching-detection.ts`
- **Python Model:** `Poaching_Detection/yolo_poaching_service.py`
- **Model File:** `Poaching_Detection/runs/detect/train2/weights/best.pt`

### Database Storage
All threats (including LOW) are saved with:
- Image URL
- GPS coordinates
- Threat level
- Detected objects (weapons, humans, vehicles, animals)
- Counts for each category
- Alert message

---

## 🏥 Health Assessment (Animal Injury Detection)

**Status:** ✅ **WORKING**

### Endpoint
- **Frontend:** `/features/health-assessment`
- **API:** `POST /api/features/health-assessment`

### Technology Stack
- **YOLOv11 COCO Model** (Port 5004)
- Detects: Bird, Cat, Dog, Horse, Sheep, Cow, Elephant, Bear, Zebra, Giraffe
- Analyzes: Injured vs Healthy
- GPS tracking enabled

### How It Works
```
User uploads animal image + GPS location
    ↓
YOLOv11 detects animal (port 5004)
    ↓
Determines: Injured or Healthy
    ↓
Returns: Animal name, status, needs attention
    ↓
Saves to database (animalIdentifications + animalSightings)
    ↓
Admin can view at /admin/animal-detections
```

### Files Involved
- **Frontend:** `client/src/pages/features/health-assessment.tsx`
- **Backend:** `server/routes.ts` (line 1818-1925)
- **Service:** `server/services/injury-detection.ts`
- **Python Model:** `injury-detection-service.py`

---

## 📊 Admin Dashboard Features

### Animal Detections Tracking
- **URL:** `/admin/animal-detections`
- **Shows:** All fauna identifications + health assessments
- **Features:**
  - GPS locations with "View on Map" buttons
  - Detection type filtering
  - Statistics (total, injured, critical cases)
  - Species breakdown

### Poaching Alerts
- **URL:** `/admin/poaching-alerts`
- **Shows:** All threat detections
- **Features:**
  - Threat level filtering
  - Unreviewed alerts
  - Critical/high alerts
  - Report to authorities
  - Mark as reviewed

---

## 🚀 Starting All Services

### Automatic Startup (Recommended)
```powershell
.\START_ALL_SERVICES.ps1
```

### Manual Startup

#### 1. Main Server (Port 5000)
```powershell
npm run dev
```

#### 2. TensorFlow AI (Port 5001)
```powershell
.\.venv\Scripts\python.exe ai_models\tensorflow_service.py
```

#### 3. Poaching Detection (Port 5002)
```powershell
.\.venv\Scripts\python.exe Poaching_Detection\yolo_poaching_service.py
```

#### 4. Injury Detection (Port 5004)
```powershell
.\.venv\Scripts\python.exe injury-detection-service.py
```

---

## 🔧 Technical Details

### Dependencies Fixed
- **pyparsing:** Downgraded from 3.2.5 → 3.1.4 (fixes TensorFlow import)
- **TensorFlow:** 2.20.0
- **Ultralytics:** YOLOv11 models
- **Flask/Flask-CORS:** Python services

### API Keys Configured
- **Gemini API:** `AIzaSyBmS5RKpsyiyocb75h2uogCUldOvNdAk-0`
- Used as fallback for all AI features

### Database Schema
1. **animalIdentifications** - Fauna detection results
2. **animalSightings** - GPS tracking for all detections
3. **poachingAlerts** - Threat detection results

---

## ✅ Testing Checklist

- [x] Main server running (port 5000)
- [x] TensorFlow service running (port 5001)
- [x] Poaching detection running (port 5002)
- [x] Injury detection running (port 5004)
- [x] All health checks passing
- [x] Fauna detection endpoint ready
- [x] Poaching detection endpoint ready
- [x] Health assessment endpoint ready
- [x] Database storage configured
- [x] Admin dashboard accessible

---

## 🎯 What's Working "Like Before"

### Fauna Detection
✅ TensorFlow MobileNetV2 identifies animals locally
✅ Falls back to Gemini AI when needed
✅ Saves results to database with GPS
✅ Admin can track all identifications

### Poaching Detection  
✅ YOLOv11 custom model detects threats
✅ Analyzes weapons, humans, vehicles, animals
✅ Calculates threat levels (CRITICAL → NONE)
✅ Saves ALL alerts to database
✅ Admin can view and manage alerts

---

## 📝 Notes

1. **All services must be running** for full functionality
2. **TensorFlow runs first** for fauna detection (faster, free)
3. **Gemini AI is fallback** when TensorFlow fails
4. **YOLOv11 models are local** - no cloud dependency for detection
5. **GPS tracking works** for all animal-related features
6. **Admin can monitor everything** via dashboard

---

**System Status:** 🟢 **FULLY OPERATIONAL**

**Last Updated:** December 5, 2025
