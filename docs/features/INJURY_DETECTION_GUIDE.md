# Injury Detection Integration Guide

## Overview

The WildRescueGuide app now includes **YOLOv11-based injured animal detection** integrated with the existing health assessment feature.

## Architecture

```
Health Assessment Flow:
User uploads image
       ↓
/api/features/health-assessment
       ↓
    ┌──────────────────────┐
    │  Parallel Processing  │
    └────────┬─────────────┘
         ┌───┴───┐
         ↓       ↓
    YOLOv11   AI Analysis
   (5004)    (Gemini/OpenAI)
         ↓       ↓
    ┌──────┴──────┐
    │ Merge Results│
    └──────────────┘
         ↓
  Enhanced Response
```

## Services Running

| Port | Service | Purpose | Status |
|------|---------|---------|--------|
| 5000 | Main Server | Express/TypeScript API | ✅ Required |
| 5001 | TensorFlow | Local AI (MobileNet) | Optional |
| 5002 | Poaching Detection | YOLOv11 Poaching | Optional |
| **5004** | **Injury Detection** | **YOLOv11 Animals** | **✅ Integrated** |

## Starting the Services

### 1. Start Main Server
```powershell
npm run dev
```
Server runs on `http://localhost:5000`

### 2. Start Injury Detection Service
```powershell
.\start-injury-detection.ps1
```

Or manually:
```powershell
.\.venv\Scripts\activate
python injury-detection-service.py
```

Service runs on `http://localhost:5004`

### 3. Verify Health
```powershell
# Test main server
curl http://localhost:5000/api/health

# Test injury detection
curl http://localhost:5004/health
```

Expected response from injury service:
```json
{
  "status": "healthy",
  "service": "Animal Injury Detection",
  "model_loaded": true,
  "port": 5004,
  "note": "Using generic COCO YOLOv11 - custom injury model needs restoration"
}
```

## Usage

### Frontend (Health Assessment Page)

1. Navigate to `/health-assessment` in the app
2. Upload an image of an animal
3. The system automatically:
   - Runs YOLOv11 for animal detection
   - Runs AI analysis (Gemini/OpenAI) for injury assessment
   - Combines results for comprehensive health report

### API Endpoint

```typescript
POST /api/features/health-assessment
Content-Type: multipart/form-data

Form data:
  image: <file>
```

Response:
```json
{
  "animalIdentified": "dog",
  "overallHealthStatus": "minor_issues",
  "confidence": 0.87,
  
  // YOLOv11 injury detection results
  "injuryDetection": {
    "model": "YOLOv11 Specialized Injury Detector",
    "detected": true,
    "healthStatus": "minor_issues",
    "confidence": 0.75,
    "injuryDetails": {
      "animals": ["dog"],
      "injuries": ["Requires custom injury model for detailed analysis"],
      "recommendations": [
        "Animal detected - visual inspection recommended",
        "Upload image for AI health assessment for detailed analysis"
      ]
    }
  },
  
  // AI analysis results
  "visualSymptoms": {
    "injuries": ["Minor abrasion on left paw"],
    "malnutrition": false,
    "skinConditions": [],
    "abnormalBehavior": []
  },
  "detectedConditions": ["Minor wound"],
  "severity": "Low severity - superficial injury",
  "treatmentRecommendations": [
    "Clean wound with antiseptic",
    "Apply antibiotic ointment",
    "Monitor for signs of infection",
    "Seek vet if condition worsens"
  ],
  "veterinaryAlertRequired": false,
  "followUpRequired": true
}
```

## Model Status

### Current: Generic COCO YOLOv11 ⚠️

The custom injury-specific model was overwritten during setup. Currently using:
- **Model**: YOLOv11n (COCO dataset - 80 classes)
- **Capabilities**: Animal detection (bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe)
- **Limitations**: Cannot detect specific injuries (no "injured" class)

### Target: Custom Injury Model ✨

The app is designed for a custom-trained YOLOv11 with:
- **Classes**: buffalo, cat, cow, dog, **injured**, person (6 classes)
- **Purpose**: Detect visible animal injuries
- **Training**: Custom dataset (needs restoration or retraining)

See `INJURY_MODEL_STATUS.md` for details on model restoration.

## Fallback Behavior

When YOLOv11 injury service is unavailable:
- Health assessment still works via AI Orchestrator
- Uses Gemini/OpenAI/Anthropic vision AI for injury detection
- Slower but still accurate
- No specialized YOLO benefits (speed, offline capability)

## Testing

### Test Animal Detection
```powershell
# Prepare test image (base64 encode a dog/cat photo)
$imageBytes = [System.IO.File]::ReadAllBytes("test_dog.jpg")
$imageBase64 = [Convert]::ToBase64String($imageBytes)

# Send to detection endpoint
$body = @{ image = $imageBase64 } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5004/detect" -Method POST -Body $body -ContentType "application/json"
```

### Test Health Assessment Integration
1. Open app at `http://localhost:5000`
2. Login as admin (admineo75 / wildguard1234)
3. Navigate to Admin Suite → Health Assessment
4. Upload a wildlife photo
5. View combined YOLOv11 + AI results

## Troubleshooting

### Service Won't Start

**Error**: `ModuleNotFoundError: No module named 'flask_cors'`

**Solution**:
```powershell
.\.venv\Scripts\python -m pip install flask flask-cors ultralytics pillow
```

### Port Already in Use

**Error**: `Address already in use: 5004`

**Solution**:
```powershell
# Find process using port 5004
netstat -ano | findstr :5004

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Model Download Issues

**Error**: `Unable to download yolo11n.pt`

**Solution**: Model downloads automatically from Ultralytics GitHub. Ensure internet connection.

### Service Offline in App

**Error**: Health assessment returns "YOLOv11 injury service unavailable"

**Checklist**:
1. Is injury-detection-service.py running? → `.\start-injury-detection.ps1`
2. Is port 5004 accessible? → `curl http://localhost:5004/health`
3. Check TypeScript service URL → `server/services/injury-detection.ts` (should be `localhost:5004`)

## Development

### File Locations

- **Flask Service**: `injury-detection-service.py` (port 5004)
- **TypeScript Interface**: `server/services/injury-detection.ts`
- **Route Integration**: `server/routes.ts` (line ~1816, `/api/features/health-assessment`)
- **Startup Script**: `start-injury-detection.ps1`
- **Model File**: `../Injured Animals/Animal Injury/yolo11n.pt`
- **Documentation**: `INJURY_MODEL_STATUS.md`

### Adding New Features

To extend injury detection:

1. **Update Python service** (`injury-detection-service.py`):
   ```python
   @app.route('/your-endpoint', methods=['POST'])
   def your_function():
       # Add functionality
       pass
   ```

2. **Update TypeScript interface** (`server/services/injury-detection.ts`):
   ```typescript
   export async function yourNewFunction(params) {
       const response = await fetch(`${INJURY_YOLO_SERVICE_URL}/your-endpoint`, {
           method: 'POST',
           body: JSON.stringify(params)
       });
       return response.json();
   }
   ```

3. **Update route** (`server/routes.ts`):
   ```typescript
   app.post('/api/features/your-feature', async (req, res) => {
       const result = await yourNewFunction(req.body);
       res.json(result);
   });
   ```

## Next Steps

1. ✅ **Completed**: Basic integration with health assessment
2. ⏳ **Pending**: Restore/retrain custom injury detection model
3. ⏳ **Future**: Add injury severity classification UI
4. ⏳ **Future**: Integrate with wildlife rescue center alerts
5. ⏳ **Future**: Save injury detections to database

## Support

For questions about:
- **Model training**: See `INJURY_MODEL_STATUS.md`
- **API usage**: See this README
- **General setup**: See `QUICK_START.md`
- **Technical details**: See `TECHNICAL_DOCUMENTATION.md`
