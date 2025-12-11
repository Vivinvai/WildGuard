# 🆓 Free API Alternatives for Local Deployment

This document provides free, open-source alternatives to paid APIs (OpenAI, Google Gemini) that you can download and run locally on your own system without ongoing costs.

---

## 🎯 **Best Option: MegaDetector (PyTorch Wildlife)**

### **Overview**
**MegaDetector** is a free, open-source AI model developed by Microsoft for wildlife camera trap image analysis. Perfect for local deployment!

### ✅ **Why MegaDetector is Perfect**
- **100% Free** - No API costs ever
- **MIT License** - Commercial use allowed
- **Local Deployment** - Runs on your own hardware
- **High Accuracy** - 89-99% for animal detection
- **Active Development** - Latest version: MegaDetectorV6 (2024/2025)
- **No Internet Required** - Once installed, works offline

### **What It Does**
- Detects **animals**, **humans**, and **vehicles** in images
- Works with camera trap images, wildlife photos
- Returns bounding boxes, confidence scores, classifications
- Can process single images, folders, or videos

---

## 📦 **Quick Installation**

### **System Requirements**
- Python 3.9+ (3.10+ recommended)
- CUDA-compatible GPU (optional but recommended for speed)
- 2-4 GB disk space for models

### **Install PyTorch Wildlife**
```bash
# Create conda environment (recommended)
conda create -n pytorch_wildlife python=3.9 -y
conda activate pytorch_wildlife

# Install PyTorch Wildlife
pip install PytorchWildlife
```

---

## 🚀 **Usage Examples**

### **1. Single Image Detection**
```python
import numpy as np
from PIL import Image
from PytorchWildlife.models import detection as pw_detection

# Load MegaDetectorV6 (weights auto-download on first run)
detection_model = pw_detection.MegaDetectorV6()

# Detect animals in image
img = Image.open("path/to/wildlife_photo.jpg")
results = detection_model.single_image_detection(img)

# Results contain:
# - Bounding boxes
# - Confidence scores (0-1)
# - Class labels (animal/human/vehicle)
print(results)
```

### **2. Batch Processing (Folder of Images)**
```python
# Process entire folder
results = detection_model.batch_image_detection(
    "./wildlife_photos", 
    batch_size=16  # Adjust based on GPU memory
)
# Results automatically saved to JSON
```

### **3. Video Processing**
```python
# Process video files
video_results = detection_model.video_detection("camera_trap_video.mp4")
```

---

## 🎨 **Integrating MegaDetector with WildGuard**

### **Option 1: Python Backend Service**
Create a new Flask/FastAPI service that runs MegaDetector locally:

```python
from flask import Flask, request, jsonify
from PytorchWildlife.models import detection as pw_detection
from PIL import Image
import io
import base64

app = Flask(__name__)
detector = pw_detection.MegaDetectorV6()

@app.route('/api/detect-animal', methods=['POST'])
def detect_animal():
    # Get base64 image from request
    img_data = base64.b64decode(request.json['image'])
    img = Image.open(io.BytesIO(img_data))
    
    # Run detection
    results = detector.single_image_detection(img)
    
    # Return results
    return jsonify({
        'detections': results['detections'],
        'confidence': results['max_confidence'],
        'detected': len(results['detections']) > 0
    })

if __name__ == '__main__':
    app.run(port=5001)  # Run on separate port
```

### **Option 2: Direct Python Integration**
If your server supports Python execution:
1. Install PyTorch Wildlife in your Node.js project's Python environment
2. Call Python scripts from Node.js using `child_process`

```javascript
// server/services/megadetector.ts
import { spawn } from 'child_process';

export async function detectWithMegaDetector(imageBase64: string) {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['./scripts/detect.py']);
    
    python.stdin.write(imageBase64);
    python.stdin.end();
    
    python.stdout.on('data', (data) => {
      resolve(JSON.parse(data.toString()));
    });
    
    python.stderr.on('data', (error) => {
      reject(error.toString());
    });
  });
}
```

---

## 🌍 **Alternative: iNaturalist API**

### **Overview**
Free API for accessing 60M+ wildlife observations and species data.

### ✅ **What's Free**
- **No API key required** for reading public data
- **60 requests/minute** rate limit
- **~10,000 requests/day** recommended
- Species information, observations, photos, GPS data

### **What It Does**
- Search observations by species, location, date
- Get species counts and statistics
- Access taxonomy database
- Query wildlife sighting data

### **Limitations**
- Does NOT provide direct image-to-species AI identification
- Must create observations to get AI suggestions
- Best used for species information, not identification

### **Installation**
```bash
# Python client
pip install pyinaturalist

# JavaScript client
npm install inaturalistjs
```

### **Example Usage**
```python
from pyinaturalist import get_observations

# Search for Tiger observations in Karnataka
observations = get_observations(
    taxon_name='Panthera tigris',
    place_id=6681,  # Karnataka
    year=2024,
    per_page=50
)

for obs in observations['results']:
    print(f"{obs['species_guess']} - {obs['place_guess']}")
    print(f"Photo: {obs['photos'][0]['url']}")
```

---

## 🧬 **Option 3: iNaturalist Small Models (GitHub)**

### **Overview**
Small pre-trained models available from iNaturalist for local deployment.

### **Repository**
https://github.com/inaturalist/inatVisionAPI

### **What's Included**
- TensorFlow-based models
- Trained on ~500 taxa
- Taxonomy files
- Geographic models

### **Installation**
```bash
# Clone repository
git clone https://github.com/inaturalist/inatVisionAPI.git
cd inatVisionAPI/

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### **Limitations**
- Smaller model (500 species vs 100,000+ in full model)
- Full models kept private by iNaturalist
- Best for learning/testing

---

## 📊 **Comparison Table**

| Feature | MegaDetector | iNaturalist API | iNat Small Models |
|---------|-------------|----------------|-------------------|
| **Cost** | 100% Free | Free | Free |
| **Local Deployment** | ✅ Yes | ❌ No (API) | ✅ Yes |
| **Offline Use** | ✅ Yes | ❌ No | ✅ Yes |
| **Detection Accuracy** | 89-99% | N/A | ~70-80% |
| **Species Count** | Detects animals | 100,000+ (data) | ~500 |
| **Image Identification** | ✅ Yes | ❌ Limited | ✅ Yes |
| **Best For** | Wildlife detection | Species data | Learning/Testing |

---

## 🎯 **Recommended Setup for WildGuard**

### **Hybrid Approach**
Combine multiple solutions for best results:

1. **MegaDetector** - Primary animal detection (free, local)
2. **iNaturalist API** - Species information & education (free)
3. **OpenAI/Gemini** - Backup for detailed species ID (paid, but optional)

### **Benefits**
- ✅ Works offline with MegaDetector
- ✅ Rich species data from iNaturalist
- ✅ Fallback to paid APIs only when needed
- ✅ Significant cost savings

---

## 📚 **Resources**

### **MegaDetector / PyTorch Wildlife**
- **GitHub**: https://github.com/microsoft/CameraTraps
- **Docs**: https://microsoft.github.io/CameraTraps/
- **PyPI**: https://pypi.org/project/PytorchWildlife/
- **Paper**: arXiv:2405.12930

### **iNaturalist**
- **API Docs**: https://api.inaturalist.org/v1/docs/
- **Python Client**: https://pyinaturalist.readthedocs.io/
- **JS Client**: https://github.com/inaturalist/inaturalistjs
- **Vision Models**: https://github.com/inaturalist/inatVisionAPI

---

## 🚀 **Next Steps**

1. **Try MegaDetector**: Install PyTorch Wildlife and test with sample images
2. **Test iNaturalist API**: Query species data for your region
3. **Integrate with WildGuard**: Add local detection alongside existing AI
4. **Benchmark Performance**: Compare accuracy vs paid APIs
5. **Deploy Locally**: Set up on your own server/hardware

---

## ⚡ **Performance Tips**

### **GPU Acceleration**
- Use CUDA GPU for 5-10x faster processing
- CPU-only mode works but slower
- Batch processing is more efficient

### **Model Selection**
- **MDV6-Compact**: Faster, lightweight
- **MDV6-Extra**: Higher accuracy, slower

### **Optimization**
- Adjust batch size based on available memory
- Cache results to avoid re-processing
- Use video sampling for long recordings

---

**Bottom Line**: MegaDetector is your best bet for free, local animal identification. It's production-ready, actively maintained, and used by conservation organizations worldwide. Combined with iNaturalist's species database, you can build a fully functional wildlife identification system without ongoing API costs!
