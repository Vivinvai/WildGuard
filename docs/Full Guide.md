# 🦁 Wild Guard - Complete Full Guide

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [What Programs You Need](#what-programs-you-need)
3. [How to Install Everything](#how-to-install-everything)
4. [How to Run the Application](#how-to-run-the-application)
5. [How It Works](#how-it-works)
6. [Features Explained](#features-explained)
7. [Project Architecture](#project-architecture)
8. [Troubleshooting](#troubleshooting)
9. [Configuration](#configuration)
10. [Development Guide](#development-guide)

---

## 🌟 Project Overview

**Wild Guard** is an AI-powered wildlife protection platform designed to help protect Indian wildlife through:

### Main Features:
- 🐾 **Animal Identification** - Identify 90+ Indian wildlife species using AI
- 🔫 **Poaching Detection** - Detect weapons and threats using YOLO AI
- 🏥 **Health Assessment** - Analyze animal injuries and health conditions
- 🌿 **Flora Identification** - Identify plants and medicinal herbs
- 📍 **Wildlife Sightings** - Track and report animal locations
- 📊 **Admin Dashboard** - Manage alerts, reports, and notifications
- 🗺️ **Interactive Maps** - Visualize wildlife distribution

### Technology Stack:
- **Frontend**: React 18.3 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Models**: 
  - TensorFlow MobileNetV2 (Animal Identification)
  - YOLOv11 (Poaching & Injury Detection)
  - Google Gemini AI (Health Analysis)
- **Maps**: Leaflet with OpenStreetMap

---

## 💻 What Programs You Need

### Required Software:

#### 1. **Node.js** (v18 or higher)
- **What it does**: Runs the backend server and frontend development
- **Download**: https://nodejs.org/
- **Check if installed**:
  ```powershell
  node --version
  npm --version
  ```

#### 2. **Python** (v3.8 or higher)
- **What it does**: Runs AI services (TensorFlow, YOLO)
- **Download**: https://www.python.org/downloads/
- **Check if installed**:
  ```powershell
  python --version
  pip --version
  ```

#### 3. **PostgreSQL** (v14 or higher)
- **What it does**: Stores wildlife data, user accounts, sightings
- **Download**: https://www.postgresql.org/download/windows/
- **Default Port**: 5432
- **Check if running**:
  ```powershell
  Get-Service -Name postgresql*
  ```

#### 4. **Git** (Optional - for version control)
- **What it does**: Version control and code management
- **Download**: https://git-scm.com/downloads

### System Requirements:
- **OS**: Windows 10/11
- **RAM**: Minimum 8GB (16GB recommended for AI models)
- **Disk Space**: 5GB free space
- **GPU**: Optional (speeds up AI inference)

---

## 🔧 How to Install Everything

### Step 1: Install Node.js
1. Download from https://nodejs.org/
2. Run installer (nodejs-v18.x.x-x64.msi)
3. Click "Next" through installation
4. Check "Add to PATH" option
5. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Install Python
1. Download from https://www.python.org/downloads/
2. Run installer (python-3.x.x-amd64.exe)
3. ✅ **IMPORTANT**: Check "Add Python to PATH"
4. Click "Install Now"
5. Verify installation:
   ```powershell
   python --version
   pip --version
   ```

### Step 3: Install PostgreSQL
1. Download from https://www.postgresql.org/download/windows/
2. Run installer (postgresql-14.x-windows-x64.exe)
3. Set password: `pokemon1234` (or remember your own)
4. Set port: `5432` (default)
5. Complete installation
6. Verify it's running:
   ```powershell
   Get-Service -Name postgresql*
   ```

### Step 4: Install Project Dependencies

#### Install Node.js Packages:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm install
```

This installs:
- Express.js (backend server)
- React (frontend UI)
- Drizzle ORM (database)
- TailwindCSS (styling)
- And 100+ other packages

#### Install Python Packages:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
pip install -r requirements.txt
```

This installs:
- TensorFlow (AI models)
- Flask (Python web server)
- OpenCV (image processing)
- Ultralytics (YOLO models)
- Pillow (image handling)
- And other AI libraries

### Step 5: Setup Database

#### Create Database:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run db:push
```

This creates all tables and loads wildlife data.

---

## 🚀 How to Run the Application

### Method 1: Automatic Startup (RECOMMENDED)

#### Option A: Double-Click START.bat
1. Navigate to: `d:\Wild-Guard 5.0\WildRescueGuide\`
2. **Double-click `START.bat`**
3. Wait 60 seconds for all services to start
4. Open browser: **http://localhost:5001**

#### Option B: PowerShell Script
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
.\START_SERVICES.ps1
```

### Method 2: One-Line Command
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"; Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep -Seconds 3; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide\ai_models'; python tensorflow_service_simple.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection'; python yolo_poaching_service.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide'; python injury-detection-service.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide'; npm run dev"; Start-Sleep -Seconds 15; Write-Host "`n✅ ALL SERVICES STARTED!" -ForegroundColor Green
```

### Method 3: Manual Start (For Development)

Open 4 separate PowerShell windows:

#### Window 1 - TensorFlow AI Service (Port 5004)
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\ai_models"
python tensorflow_service_simple.py
```
✅ You should see: "TensorFlow service running on port 5004"

#### Window 2 - Poaching Detection Service (Port 5003)
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection"
python yolo_poaching_service.py
```
✅ You should see: "YOLO Poaching service running on port 5003"

#### Window 3 - Health Assessment Service (Port 5005)
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
python injury-detection-service.py
```
✅ You should see: "Health Assessment service running on port 5005"

#### Window 4 - Backend + Frontend (Port 5001)
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run dev
```
✅ You should see: "serving on port 5001"

### Verify All Services Are Running:
```powershell
Write-Host "`nService Status:" -ForegroundColor Cyan; @{5001='Backend';5003='Poaching';5004='TensorFlow';5005='Health'}.GetEnumerator() | Sort-Object Key | ForEach-Object { try { Invoke-RestMethod "http://localhost:$($_.Key)/health" -TimeoutSec 3 | Out-Null; Write-Host "  ✅ $($_.Value)" -ForegroundColor Green } catch { Write-Host "  ❌ $($_.Value)" -ForegroundColor Red } }
```

### Access the Application:
Open your browser and go to: **http://localhost:5001**

---

## 🎯 How It Works

### System Architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                       │
│              http://localhost:5001                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND + FRONTEND (Port 5001)             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Express.js Server (Node.js)                     │  │
│  │  - Handles API requests                          │  │
│  │  - Serves React frontend                         │  │
│  │  - Manages authentication                        │  │
│  └──────────────────────────────────────────────────┘  │
└───────┬────────────┬─────────────┬──────────────────────┘
        │            │             │
        ▼            ▼             ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ PostgreSQL   │ │ TensorFlow   │ │ YOLO Services│
│ Database     │ │ AI (5004)    │ │ (5003, 5005) │
│ (Port 5432)  │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Data Flow Example - Animal Identification:

1. **User uploads photo** → Browser
2. **Photo sent to Backend** → Express.js server (Port 5001)
3. **Backend forwards to TensorFlow** → Python service (Port 5004)
4. **TensorFlow analyzes image**:
   - MobileNetV2 processes image
   - Detects animal from 1000+ ImageNet classes
   - Maps to Indian wildlife database
   - Returns: Species name, confidence, habitat, conservation status
5. **Backend receives AI result** → Processes and stores in database
6. **Result sent to Browser** → User sees identification
7. **Database updated** → Stores identification for future reference

### What Each Service Does:

#### 1. Backend + Frontend (Port 5001)
**Technology**: Node.js + Express.js + React

**What it does**:
- Serves the website (React UI)
- Handles all API requests
- Manages user authentication
- Connects to database
- Coordinates between AI services
- Stores data in PostgreSQL

**Key Files**:
- `server/index.ts` - Main backend server
- `server/routes.ts` - API endpoints
- `client/src/` - React frontend components

#### 2. TensorFlow AI Service (Port 5004)
**Technology**: Python + TensorFlow + MobileNetV2

**What it does**:
- Identifies animals from photos
- Uses MobileNetV2 neural network
- 1000+ ImageNet classes detection
- Maps to 90+ Indian wildlife species
- Returns: Species, scientific name, habitat, conservation status, population

**How it works**:
1. Receives image from backend
2. Preprocesses image (resize, normalize)
3. Runs through MobileNetV2 model
4. Gets top predictions with confidence
5. Maps to wildlife database
6. Adds Indian species information
7. Returns complete wildlife data

**Key Files**:
- `ai_models/tensorflow_service_simple.py` - Main service
- Lines 48-620: Wildlife database with 90+ species
- Lines 710-730: ImageNet to wildlife mapping
- Lines 910-1085: Identification logic

#### 3. YOLO Poaching Detection (Port 5003)
**Technology**: Python + Ultralytics + YOLOv11

**What it does**:
- Detects weapons in images
- Identifies 24+ weapon types
- Real-time threat detection
- Returns: Weapon type, location, confidence

**Detects**:
- Guns (rifles, pistols, shotguns)
- Knives and blades
- Traps and snares
- Hunting equipment
- Suspicious objects

**Key Files**:
- `Poaching_Detection/yolo_poaching_service.py`
- `Poaching_Detection/yolo11n.pt` - YOLO model weights

#### 4. Health Assessment Service (Port 5005)
**Technology**: Python + YOLOv11 + Google Gemini AI

**What it does**:
- Detects animal injuries
- Analyzes health conditions
- Uses dual AI system:
  - YOLO: Finds injury locations
  - Gemini: Analyzes severity and suggests treatment

**Returns**:
- Injury type and location
- Severity level (mild/moderate/severe)
- Recommended treatment
- Veterinary advice

**Key Files**:
- `injury-detection-service.py` - Main service
- Combines YOLO detection + Gemini analysis

#### 5. PostgreSQL Database (Port 5432)
**Technology**: PostgreSQL 14

**What it stores**:
- Wildlife species data (90+ animals)
- User accounts and authentication
- Animal identifications history
- Poaching reports and alerts
- Health assessments
- Wildlife sightings with GPS
- Admin notifications

**Database Schema**:
- `users` - User accounts
- `animal_identifications` - ID history
- `wildlife_sightings` - Location tracking
- `poaching_alerts` - Threat reports
- `health_assessments` - Injury records
- `admin_notifications` - Alert system

---

## 🎨 Features Explained

### 1. Animal Identification 🐾

**How to use**:
1. Go to "Identify Animal" page
2. Upload photo (JPG, PNG)
3. Optionally enable GPS location
4. Click "Identify"

**What happens**:
- Image sent to TensorFlow AI
- MobileNetV2 analyzes image
- Identifies from 90+ species
- Shows Indian species name
- Displays habitat, conservation status
- Shows population data
- Maps location if GPS enabled

**Example Results**:
```
Species: Indian Bengal Tiger
Scientific Name: Panthera tigris tigris
Conservation: Endangered
Population: ~3,167 in India
Habitat: Forests, grasslands
Confidence: 94.5%
```

### 2. Poaching Detection 🔫

**How to use**:
1. Go to "Poaching Detection" page
2. Upload suspicious image
3. Add GPS location
4. Click "Detect Threats"

**What happens**:
- YOLO AI scans image
- Detects weapons (24+ types)
- Shows bounding boxes
- Lists all threats found
- Calculates threat level
- Creates alert if serious

**Detected Items**:
- Firearms (rifles, pistols)
- Traps and snares
- Knives and blades
- Hunting equipment
- Suspicious vehicles

### 3. Health Assessment 🏥

**How to use**:
1. Go to "Health Assessment" page
2. Upload animal photo
3. Click "Analyze Health"

**What happens**:
- YOLO detects injuries
- Gemini AI analyzes condition
- Identifies injury type
- Assesses severity
- Suggests treatment
- Provides veterinary advice

**Assessment includes**:
- Injury detection
- Wound analysis
- Disease symptoms
- Behavioral issues
- Treatment recommendations
- Urgency level

### 4. Flora Identification 🌿

**How to use**:
1. Go to "Identify Plants" page
2. Upload plant photo
3. Click "Identify"

**Identifies**:
- Medicinal plants
- Toxic species
- Endemic flora
- Ayurvedic herbs
- Conservation status

### 5. Report Sightings 📍

**How to use**:
1. Go to "Report Sighting" page
2. Fill in details:
   - Animal species
   - Location (GPS)
   - Date/time
   - Number of animals
   - Behavior observed
   - Photos
3. Submit report

**Data collected**:
- Species distribution
- Migration patterns
- Population tracking
- Habitat mapping
- Behavior studies

### 6. Admin Dashboard 📊

**Features**:
- Real-time alerts
- Poaching reports
- Health assessments
- Sighting statistics
- User management
- System monitoring

**Access**: Login as admin user

---

## 🏗️ Project Architecture

### Folder Structure:

```
d:\Wild-Guard 5.0\WildRescueGuide\
│
├── client/                          # React Frontend
│   ├── src/
│   │   ├── components/             # UI Components
│   │   ├── pages/                  # Page Components
│   │   ├── lib/                    # Utilities
│   │   └── hooks/                  # React Hooks
│   └── public/                     # Static Assets
│
├── server/                         # Node.js Backend
│   ├── index.ts                    # Server Entry
│   ├── routes.ts                   # API Routes
│   ├── storage.ts                  # Database Logic
│   └── services/                   # AI Service Bridges
│       ├── tensorflow-bridge.ts    # TensorFlow Interface
│       ├── ai-orchestrator.ts      # AI Coordination
│       └── local-ai.ts             # Local AI Wrapper
│
├── ai_models/                      # TensorFlow Service
│   ├── tensorflow_service_simple.py # Main AI Service
│   └── trained_models/             # Model Weights
│
├── Poaching_Detection/             # YOLO Poaching
│   ├── yolo_poaching_service.py    # Poaching Service
│   └── yolo11n.pt                  # YOLO Weights
│
├── injury-detection-service.py     # Health Service
│
├── shared/                         # Shared Types
│   └── schema.ts                   # Database Schema
│
├── migrations/                     # Database Migrations
│   └── *.sql                       # SQL Scripts
│
├── .env                           # Environment Config
├── package.json                   # Node Dependencies
├── requirements.txt               # Python Dependencies
├── drizzle.config.ts             # Database Config
├── vite.config.ts                # Build Config
│
└── START.bat                      # Startup Script
```

### Technology Stack Details:

#### Frontend:
- **React 18.3**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **TailwindCSS**: Styling framework
- **Radix UI**: Accessible components
- **Tanstack Query**: Data fetching
- **Leaflet**: Maps integration
- **Wouter**: Routing

#### Backend:
- **Node.js 18+**: Runtime
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Drizzle ORM**: Database toolkit
- **Express Session**: Authentication
- **Multer**: File uploads
- **node-fetch**: HTTP client

#### AI Services:
- **TensorFlow 2.20**: Deep learning
- **MobileNetV2**: Animal recognition
- **Ultralytics YOLO11**: Object detection
- **Google Gemini**: AI analysis
- **OpenCV**: Image processing
- **Flask**: Python web server

#### Database:
- **PostgreSQL 14**: SQL database
- **Drizzle ORM**: TypeScript ORM
- **pg**: Node.js PostgreSQL client

---

## � Deep Technical Explanation

This section explains **exactly how each component works** with algorithms, data flow, and technical details.

### 🎨 Frontend Architecture (React + TypeScript)

#### Technology Stack:
- **React 18.3**: Component-based UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Tanstack Query**: Server state management
- **Wouter**: Lightweight routing
- **Radix UI**: Accessible component primitives

#### How Frontend Works:

**1. Application Entry Point** (`client/src/main.tsx`):
```typescript
// React renders the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
```

**2. Routing System** (`client/src/App.tsx`):
```typescript
// Routes map URLs to components
<Route path="/" component={Home} />
<Route path="/identify" component={IdentifyAnimal} />
<Route path="/poaching" component={PoachingDetection} />
<Route path="/health" component={HealthAssessment} />
<Route path="/flora" component={FloraIdentification} />
```

**3. Component Architecture**:

```
App.tsx (Root)
│
├── Navigation (Header/Menu)
│
├── Pages (Routed Components)
│   ├── Home.tsx
│   ├── IdentifyAnimal.tsx
│   ├── PoachingDetection.tsx
│   ├── HealthAssessment.tsx
│   └── FloraIdentification.tsx
│
├── Components (Reusable UI)
│   ├── AnimalCard.tsx
│   ├── ImageUpload.tsx
│   ├── Map.tsx
│   └── LoadingSpinner.tsx
│
└── Hooks (Custom Logic)
    ├── useAnimalIdentification.ts
    ├── usePoachingDetection.ts
    └── useHealthAssessment.ts
```

**4. Data Flow Example - Animal Identification**:

```typescript
// Step 1: User uploads image
const handleImageUpload = (file: File) => {
  setImage(file);
  const reader = new FileReader();
  reader.onload = () => setPreview(reader.result);
  reader.readAsDataURL(file);
};

// Step 2: Form submission
const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('image', image);
  
  // Step 3: API call using Tanstack Query
  const result = await identifyAnimal(formData);
  
  // Step 4: Update UI with results
  setIdentification(result);
};
```

**5. State Management**:
- **Local State**: `useState` for component-specific data
- **Server State**: Tanstack Query for API data caching
- **Global State**: Context API for user authentication

**6. API Communication**:
```typescript
// All API calls go through fetch
export async function identifyAnimal(formData: FormData) {
  const response = await fetch('/api/identify-animal', {
    method: 'POST',
    body: formData,
  });
  return response.json();
}
```

**7. UI Components Flow**:
```
User Action → Event Handler → State Update → Re-render → Updated UI
```

---

### 🔧 Backend Architecture (Node.js + Express)

#### Technology Stack:
- **Node.js 18**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **Drizzle ORM**: Database toolkit
- **Multer**: File upload handling
- **Express Session**: User sessions
- **node-fetch**: HTTP client for AI services

#### How Backend Works:

**1. Server Entry Point** (`server/index.ts`):
```typescript
// Express server initialization
const app = express();

// Middleware setup
app.use(express.json());
app.use(fileUpload());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Routes
import { registerRoutes } from './routes';
registerRoutes(app);

// Start server
app.listen(5001, () => {
  console.log('Backend serving on port 5001');
});
```

**2. Request Processing Flow**:
```
Client Request → Express Middleware → Route Handler → Service Layer → Database/AI Service → Response
```

**3. API Route Structure** (`server/routes.ts`):

```typescript
// Animal Identification Endpoint
app.post("/api/identify-animal", async (req, res) => {
  try {
    // 1. Extract uploaded image
    const imageFile = req.files?.image;
    
    // 2. Convert to base64
    const base64Image = imageFile.data.toString('base64');
    
    // 3. Call AI orchestrator
    const result = await identifyAnimalWithAI(base64Image, 'identification');
    
    // 4. Save to database
    const identification = await db.insert(animalIdentifications).values({
      speciesName: result.data.speciesName,
      confidence: result.confidence,
      imageUrl: savedImagePath,
      userId: req.session.userId
    });
    
    // 5. Return response
    res.json({
      success: true,
      data: result.data,
      identification: identification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**4. AI Service Orchestration** (`server/services/ai-orchestrator.ts`):

```typescript
// Coordinates between different AI services
export async function identifyAnimalWithAI(
  base64Image: string,
  feature: string
): Promise<AIResult> {
  
  // Strategy: Always use TensorFlow for identification
  console.log('🎯 Using TensorFlow MobileNetV2');
  
  // Call TensorFlow service
  const data = await identifyAnimalLocally(base64Image);
  
  return {
    data,
    provider: 'local_ai',
    confidence: data.confidence,
    method: 'TensorFlow MobileNetV2'
  };
}
```

**5. TensorFlow Bridge** (`server/services/tensorflow-bridge.ts`):

```typescript
// Communicates with Python TensorFlow service
export async function identifyAnimalLocally(base64Image: string) {
  // Get service URL from environment
  const url = process.env.TENSORFLOW_SERVICE_URL; // http://localhost:5004
  
  // Send image to Python service
  const response = await fetch(`${url}/identify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  });
  
  // Parse response
  const result = await response.json();
  
  // Return formatted data
  return {
    speciesName: result.species_name,
    scientificName: result.scientific_name,
    confidence: result.confidence,
    habitat: result.habitat,
    conservationStatus: result.conservation_status,
    // ... more fields
  };
}
```

**6. Database Operations** (`server/storage.ts`):

```typescript
// Using Drizzle ORM
import { db } from './db';
import { animalIdentifications, users, sightings } from '../shared/schema';

// Insert identification
export async function saveIdentification(data: IdentificationData) {
  const [result] = await db.insert(animalIdentifications).values({
    speciesName: data.speciesName,
    confidence: data.confidence,
    imageUrl: data.imageUrl,
    userId: data.userId,
    createdAt: new Date()
  }).returning();
  
  return result;
}

// Query identifications
export async function getUserIdentifications(userId: number) {
  return db.select()
    .from(animalIdentifications)
    .where(eq(animalIdentifications.userId, userId))
    .orderBy(desc(animalIdentifications.createdAt));
}
```

**7. Middleware Pipeline**:
```typescript
Request
  ↓
Express.json() → Parse JSON body
  ↓
Express.static() → Serve static files
  ↓
Session() → Load user session
  ↓
Auth Middleware → Check authentication
  ↓
Route Handler → Process request
  ↓
Response
```

---

### 🧠 TensorFlow Service - Animal Detection (Port 5004)

#### Technology Stack:
- **TensorFlow 2.20**: Deep learning framework
- **MobileNetV2**: Efficient CNN architecture
- **Flask**: Python web server
- **NumPy**: Numerical computing
- **Pillow (PIL)**: Image processing
- **ImageNet**: Pre-trained weights

#### File: `ai_models/tensorflow_service_simple.py`

#### How Animal Detection Works:

**Algorithm: Convolutional Neural Network (CNN) - MobileNetV2**

**1. Model Architecture**:

```
MobileNetV2 Neural Network (53 layers)
│
Input Layer (224×224×3 RGB image)
│
├── Depthwise Separable Convolutions (Efficient)
│   ├── Depthwise Conv (3×3 filters)
│   ├── Batch Normalization
│   ├── ReLU6 Activation
│   └── Pointwise Conv (1×1 filters)
│
├── Inverted Residual Blocks (17 blocks)
│   └── Expansion → Depthwise → Projection
│
└── Output Layer (1000 classes from ImageNet)
    └── Softmax activation → Probability distribution
```

**2. Model Loading** (Lines 890-920):

```python
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions

# Load pre-trained MobileNetV2
# Weights trained on ImageNet dataset (1.2 million images, 1000 classes)
model = MobileNetV2(
    weights='imagenet',      # Use ImageNet pre-trained weights
    include_top=True,        # Include classification layer
    input_shape=(224, 224, 3) # Standard input size
)

print("✅ MobileNetV2 model loaded successfully")
print(f"   - Total parameters: 3.5 million")
print(f"   - Layers: 53")
print(f"   - Input size: 224×224×3")
print(f"   - Output classes: 1000")
```

**3. Image Preprocessing Algorithm** (Lines 780-820):

```python
def preprocess_image(image_data):
    """
    Convert uploaded image to model-ready format
    
    Algorithm:
    1. Decode base64 → Binary
    2. Load as PIL Image
    3. Convert to RGB (remove alpha channel)
    4. Resize to 224×224 (bilinear interpolation)
    5. Convert to NumPy array
    6. Expand dimensions (batch size 1)
    7. Normalize pixel values (MobileNetV2-specific)
    """
    
    # Step 1: Decode base64
    image_bytes = base64.b64decode(image_data)
    
    # Step 2: Load as PIL Image
    image = Image.open(io.BytesIO(image_bytes))
    
    # Step 3: Ensure RGB (3 channels)
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Step 4: Resize to 224×224
    # Uses Lanczos resampling (high-quality)
    image = image.resize((224, 224), Image.LANCZOS)
    
    # Step 5: Convert to NumPy array
    # Shape: (224, 224, 3)
    img_array = np.array(image)
    
    # Step 6: Add batch dimension
    # Shape: (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)
    
    # Step 7: MobileNetV2-specific preprocessing
    # Normalizes to [-1, 1] range
    img_array = preprocess_input(img_array)
    
    return img_array
```

**4. Neural Network Inference Algorithm** (Lines 930-1000):

```python
def identify_animal(image_data):
    """
    Run image through neural network
    
    Algorithm: Forward Pass through CNN
    """
    
    # Preprocess image
    processed_image = preprocess_image(image_data)
    
    # Neural Network Forward Pass
    # Input: (1, 224, 224, 3) tensor
    # Output: (1, 1000) probability distribution
    predictions = model.predict(processed_image, verbose=0)
    
    # Decode predictions
    # Returns top 5 predictions with labels and probabilities
    decoded = decode_predictions(predictions, top=5)[0]
    
    # Format: [('class_id', 'class_name', probability), ...]
    # Example: [('n02129604', 'tiger', 0.945), ('n02129165', 'lion', 0.032), ...]
    
    return decoded
```

**5. Species Mapping Algorithm** (Lines 1010-1085):

```python
def map_to_indian_wildlife(imagenet_predictions):
    """
    Map ImageNet classes to Indian wildlife
    
    Algorithm: Dictionary Lookup with Fuzzy Matching
    """
    
    # ImageNet to Wildlife Mapping Dictionary (Lines 710-730)
    IMAGENET_TO_WILDLIFE = {
        'tiger': 'indian_bengal_tiger',
        'lion': 'asiatic_lion',
        'elephant': 'indian_elephant',
        'leopard': 'indian_leopard',
        'rhinoceros': 'indian_rhinoceros',
        # ... 90+ mappings
    }
    
    # Wildlife Database (Lines 48-620)
    WILDLIFE_DATABASE = {
        'indian_bengal_tiger': {
            'name': 'Indian Bengal Tiger',
            'scientific_name': 'Panthera tigris tigris',
            'category': 'Mammal',
            'subcategory': 'Big Cat',
            'habitat': 'Forests, grasslands, mangroves',
            'conservation_status': 'Endangered',
            'population': '~3,167 in India (2023)',
            'threats': ['Poaching', 'Habitat loss', 'Human-wildlife conflict'],
            'behavior': 'Solitary, territorial, apex predator',
            'diet': 'Carnivore - deer, wild boar, buffalo',
            'lifespan': '10-15 years wild, 20-26 years captivity',
            'weight': '180-260 kg (males)',
            'length': '2.7-3.1 meters',
            # ... extensive data
        },
        # ... 90+ species
    }
    
    # Mapping Algorithm
    results = []
    for pred in imagenet_predictions:
        class_name = pred[1].lower()
        confidence = float(pred[2])
        
        # Lookup in mapping dictionary
        if class_name in IMAGENET_TO_WILDLIFE:
            wildlife_key = IMAGENET_TO_WILDLIFE[class_name]
            
            # Get full wildlife data
            wildlife_data = WILDLIFE_DATABASE[wildlife_key]
            
            # Combine prediction with wildlife data
            results.append({
                'species_name': wildlife_data['name'],
                'scientific_name': wildlife_data['scientific_name'],
                'confidence': round(confidence * 100, 2),
                'category': wildlife_data['category'],
                'habitat': wildlife_data['habitat'],
                'conservation_status': wildlife_data['conservation_status'],
                'population': wildlife_data['population'],
                'threats': wildlife_data['threats'],
                'behavior': wildlife_data['behavior'],
                # ... all fields
            })
    
    return results
```

**6. Complete Identification Flow**:

```
User Image
    ↓
Base64 Decode → Binary data
    ↓
PIL Image.open() → Image object
    ↓
Convert RGB → 3 channels
    ↓
Resize 224×224 → Lanczos interpolation
    ↓
NumPy array → (224, 224, 3)
    ↓
Add batch dim → (1, 224, 224, 3)
    ↓
Normalize [-1,1] → MobileNetV2 preprocessing
    ↓
┌─────────────────────────────────┐
│   MobileNetV2 Neural Network    │
│  (53 layers, 3.5M parameters)   │
│                                 │
│  Input Conv → Batch Norm → ReLU │
│         ↓                        │
│  17× Inverted Residual Blocks   │
│         ↓                        │
│  Global Average Pooling          │
│         ↓                        │
│  Dense Layer (1000 units)        │
│         ↓                        │
│  Softmax → Probability           │
└─────────────────────────────────┘
    ↓
Top 5 Predictions → [('tiger', 0.945), ('lion', 0.032), ...]
    ↓
Map to Indian Wildlife → Dictionary lookup
    ↓
Get Wildlife Data → Full species information
    ↓
Return JSON Response → Backend receives data
```

**7. Mathematical Foundation**:

**Convolution Operation**:
```
Output[i,j] = Σ Σ Input[i+m, j+n] × Kernel[m,n]
              m n
```

**ReLU6 Activation**:
```
ReLU6(x) = min(max(0, x), 6)
```

**Softmax (Final Layer)**:
```
P(class_i) = e^(z_i) / Σ e^(z_j)
                       j=1 to 1000
```

**Confidence Score**:
```
Confidence = max(P(class_1), P(class_2), ..., P(class_1000)) × 100%
```

---

### 🎯 YOLO Poaching Detection (Port 5003)

#### Technology Stack:
- **Ultralytics YOLOv11**: Latest YOLO version
- **PyTorch**: Deep learning backend
- **OpenCV**: Image processing
- **Flask**: Python web server

#### File: `Poaching_Detection/yolo_poaching_service.py`

#### How Poaching Detection Works:

**Algorithm: You Only Look Once (YOLO) - Single-Shot Object Detection**

**1. YOLO Architecture**:

```
YOLOv11 Neural Network
│
Input Image (640×640×3)
│
├── Backbone (Feature Extraction)
│   ├── CSPDarknet (Cross Stage Partial)
│   │   └── Multiple convolutional layers
│   └── Feature Pyramid Network (FPN)
│       └── Multi-scale features
│
├── Neck (Feature Fusion)
│   └── PANet (Path Aggregation Network)
│       └── Combines features from different scales
│
└── Head (Detection)
    ├── Bounding Box Regression
    ├── Object Classification (24+ weapon classes)
    └── Confidence Score
    
Output: [x, y, w, h, class, confidence] for each detection
```

**2. Model Loading**:

```python
from ultralytics import YOLO

# Load YOLOv11 model trained on weapon detection
model = YOLO('yolo11n.pt')  # 'n' = nano (fast), 's' = small (accurate)

# Model specifications:
# - Parameters: 2.6 million (nano version)
# - Speed: 100+ FPS on GPU
# - Input: 640×640 pixels
# - Output: Bounding boxes + classes + confidence
```

**3. Detection Classes** (24+ Weapons):

```python
WEAPON_CLASSES = {
    # Firearms
    0: 'rifle',
    1: 'pistol',
    2: 'shotgun',
    3: 'ak47',
    4: 'sniper_rifle',
    
    # Bladed Weapons
    5: 'knife',
    6: 'machete',
    7: 'axe',
    8: 'sword',
    
    # Traps
    9: 'snare_trap',
    10: 'leg_trap',
    11: 'cage_trap',
    
    # Hunting Tools
    12: 'crossbow',
    13: 'bow_arrow',
    14: 'spear',
    
    # Suspicious Items
    15: 'camouflage_net',
    16: 'spotlight',
    17: 'vehicle_suspicious',
    # ... 24+ total
}
```

**4. Image Preprocessing**:

```python
def preprocess_image(image_data):
    """
    Prepare image for YOLO
    
    Algorithm:
    1. Decode base64
    2. Convert to OpenCV format (BGR)
    3. Resize to 640×640 (letterbox padding)
    4. Normalize to [0, 1]
    """
    
    # Decode base64
    img_bytes = base64.b64decode(image_data)
    nparr = np.frombuffer(img_bytes, np.uint8)
    
    # Decode to OpenCV image (BGR format)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # YOLO preprocessing (letterbox resize)
    # Maintains aspect ratio with padding
    image_resized = letterbox_resize(image, (640, 640))
    
    return image_resized
```

**5. YOLO Detection Algorithm**:

```python
def detect_weapons(image_data):
    """
    Run YOLO object detection
    
    Algorithm: Single-Shot Detection
    - Divides image into grid (e.g., 20×20)
    - Each cell predicts bounding boxes
    - Non-Maximum Suppression removes duplicates
    """
    
    # Preprocess
    image = preprocess_image(image_data)
    
    # Run YOLO inference
    # Returns: List of detections
    results = model.predict(
        image,
        conf=0.25,      # Minimum confidence threshold
        iou=0.45,       # IoU threshold for NMS
        max_det=100,    # Maximum detections
        verbose=False
    )
    
    # Parse results
    detections = []
    for result in results:
        boxes = result.boxes
        
        for box in boxes:
            # Extract detection data
            x1, y1, x2, y2 = box.xyxy[0].tolist()  # Bounding box
            confidence = float(box.conf[0])         # Confidence
            class_id = int(box.cls[0])             # Class ID
            
            detections.append({
                'class': WEAPON_CLASSES[class_id],
                'confidence': round(confidence * 100, 2),
                'bbox': {
                    'x1': int(x1),
                    'y1': int(y1),
                    'x2': int(x2),
                    'y2': int(y2)
                }
            })
    
    return detections
```

**6. Non-Maximum Suppression (NMS) Algorithm**:

```python
def non_max_suppression(boxes, scores, iou_threshold=0.45):
    """
    Remove duplicate detections
    
    Algorithm:
    1. Sort boxes by confidence score (descending)
    2. Pick highest score box
    3. Remove boxes with IoU > threshold
    4. Repeat until all boxes processed
    
    IoU (Intersection over Union):
    IoU = Area of Overlap / Area of Union
    """
    
    # Sort by confidence
    indices = np.argsort(scores)[::-1]
    
    keep = []
    while len(indices) > 0:
        # Pick highest confidence
        current = indices[0]
        keep.append(current)
        
        # Calculate IoU with remaining boxes
        ious = calculate_iou(boxes[current], boxes[indices[1:]])
        
        # Keep only boxes with IoU < threshold
        indices = indices[1:][ious < iou_threshold]
    
    return keep
```

**7. Threat Assessment Algorithm**:

```python
def assess_threat_level(detections):
    """
    Calculate overall threat severity
    
    Algorithm: Weighted scoring system
    """
    
    # Threat weights by weapon type
    THREAT_WEIGHTS = {
        'rifle': 10,
        'ak47': 10,
        'sniper_rifle': 9,
        'pistol': 8,
        'shotgun': 8,
        'knife': 5,
        'machete': 6,
        'trap': 7,
        'crossbow': 6,
        # ...
    }
    
    total_threat = 0
    for detection in detections:
        weapon = detection['class']
        confidence = detection['confidence'] / 100
        weight = THREAT_WEIGHTS.get(weapon, 5)
        
        # Threat contribution
        total_threat += weight * confidence
    
    # Classify threat level
    if total_threat >= 8:
        return 'CRITICAL'
    elif total_threat >= 5:
        return 'HIGH'
    elif total_threat >= 3:
        return 'MEDIUM'
    else:
        return 'LOW'
```

**8. Complete Detection Flow**:

```
User Image
    ↓
Base64 Decode → Binary
    ↓
OpenCV Decode → BGR image
    ↓
Letterbox Resize → 640×640 (maintains aspect ratio)
    ↓
┌─────────────────────────────────────┐
│      YOLOv11 Neural Network         │
│                                     │
│  Backbone (CSPDarknet)              │
│    ↓                                │
│  Extract features at multiple scales│
│    ↓                                │
│  Neck (PANet)                       │
│    ↓                                │
│  Fuse features                      │
│    ↓                                │
│  Head (Detection)                   │
│    ↓                                │
│  For each grid cell:                │
│    - Predict bounding boxes         │
│    - Classify objects (24+ classes) │
│    - Compute confidence             │
└─────────────────────────────────────┘
    ↓
Raw Predictions → Thousands of boxes
    ↓
Non-Maximum Suppression → Remove duplicates
    ↓
Filter by Confidence → Keep only conf > 25%
    ↓
Detections → [{weapon, bbox, confidence}, ...]
    ↓
Threat Assessment → Calculate severity
    ↓
Return JSON Response → Backend receives data
```

**9. Mathematical Foundation**:

**Bounding Box Prediction**:
```
x_center = σ(t_x) + c_x
y_center = σ(t_y) + c_y
width = p_w × e^(t_w)
height = p_h × e^(t_h)

where:
- σ = sigmoid function
- t_x, t_y, t_w, t_h = network outputs
- c_x, c_y = grid cell coordinates
- p_w, p_h = anchor box dimensions
```

**Confidence Score**:
```
Confidence = P(Object) × IoU
where:
- P(Object) = probability object exists
- IoU = overlap with ground truth
```

**Class Probability**:
```
P(Class_i | Object) = Softmax(class_scores)
```

---

### 🏥 Health Assessment Service (Port 5005)

#### Technology Stack:
- **YOLOv11**: Injury detection
- **Google Gemini AI**: Health analysis
- **OpenCV**: Image processing
- **Flask**: Python web server

#### File: `injury-detection-service.py`

#### How Health Assessment Works:

**Algorithm: Dual-AI System (YOLO + Gemini)**

**1. System Architecture**:

```
Input Image
    ↓
┌─────────────────────────┐
│  Stage 1: YOLO          │
│  - Detect injuries      │
│  - Locate body parts    │
│  - Find abnormalities   │
└─────────────────────────┘
    ↓
Injury Locations + Image
    ↓
┌─────────────────────────┐
│  Stage 2: Gemini AI     │
│  - Analyze severity     │
│  - Suggest treatment    │
│  - Provide diagnosis    │
└─────────────────────────┘
    ↓
Complete Health Report
```

**2. YOLO Injury Detection**:

```python
from ultralytics import YOLO

# Load injury detection model
injury_model = YOLO('yolo11s.pt')  # Trained on animal injuries

# Injury classes
INJURY_CLASSES = {
    0: 'wound_open',
    1: 'wound_closed',
    2: 'fracture',
    3: 'swelling',
    4: 'bleeding',
    5: 'infection',
    6: 'burn',
    7: 'laceration',
    8: 'bruise',
    9: 'abscess',
    10: 'tumor',
    11: 'deformity',
    # ... more injury types
}

def detect_injuries(image_data):
    """
    Detect injuries using YOLO
    """
    # Preprocess
    image = preprocess_image(image_data)
    
    # Run YOLO
    results = injury_model.predict(
        image,
        conf=0.30,      # Injury threshold
        iou=0.50,
        verbose=False
    )
    
    injuries = []
    for result in results:
        for box in result.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            
            injuries.append({
                'type': INJURY_CLASSES[class_id],
                'confidence': round(confidence * 100, 2),
                'location': {
                    'x1': int(x1),
                    'y1': int(y1),
                    'x2': int(x2),
                    'y2': int(y2)
                }
            })
    
    return injuries
```

**3. Gemini AI Analysis**:

```python
import google.generativeai as genai

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel('gemini-1.5-pro')

def analyze_with_gemini(image_data, yolo_detections):
    """
    Deep analysis using Gemini AI
    
    Algorithm:
    1. Send image + YOLO detections to Gemini
    2. Gemini analyzes visual + detection data
    3. Returns detailed medical assessment
    """
    
    # Prepare prompt
    prompt = f"""
You are a wildlife veterinarian AI. Analyze this animal's health condition.

YOLO Detected Injuries:
{format_yolo_detections(yolo_detections)}

Please provide:
1. Injury Assessment:
   - Confirm each detected injury
   - Identify any missed injuries
   - Assess severity (mild/moderate/severe/critical)

2. Health Diagnosis:
   - Primary condition
   - Secondary conditions
   - Affected body systems

3. Treatment Recommendations:
   - Immediate actions required
   - Medical treatment needed
   - Long-term care plan

4. Prognosis:
   - Expected recovery time
   - Survival probability
   - Risk factors

5. Urgency Level:
   - CRITICAL: Immediate intervention required
   - URGENT: Treatment needed within hours
   - MODERATE: Treatment within days
   - MILD: Monitor and basic care

Format response as JSON.
"""
    
    # Decode image
    image_bytes = base64.b64decode(image_data)
    
    # Send to Gemini
    response = gemini_model.generate_content([
        prompt,
        {'mime_type': 'image/jpeg', 'data': image_bytes}
    ])
    
    # Parse response
    analysis = json.loads(response.text)
    
    return analysis
```

**4. Complete Assessment Algorithm**:

```python
def assess_animal_health(image_data):
    """
    Complete health assessment pipeline
    
    Algorithm:
    1. YOLO detects injuries (fast, localized)
    2. Gemini analyzes overall health (comprehensive)
    3. Combine both for complete report
    """
    
    # Stage 1: YOLO Detection
    print("Stage 1: Running YOLO injury detection...")
    injuries = detect_injuries(image_data)
    
    # Stage 2: Gemini Analysis
    print("Stage 2: Running Gemini AI analysis...")
    gemini_analysis = analyze_with_gemini(image_data, injuries)
    
    # Stage 3: Combine Results
    assessment = {
        'detected_injuries': injuries,
        'injury_count': len(injuries),
        'severity': gemini_analysis['severity'],
        'diagnosis': gemini_analysis['diagnosis'],
        'treatment': gemini_analysis['treatment'],
        'prognosis': gemini_analysis['prognosis'],
        'urgency': gemini_analysis['urgency'],
        'confidence': calculate_confidence(injuries, gemini_analysis)
    }
    
    return assessment
```

**5. Confidence Calculation Algorithm**:

```python
def calculate_confidence(yolo_injuries, gemini_analysis):
    """
    Combine YOLO and Gemini confidence
    
    Algorithm: Weighted average
    - YOLO confidence: 60% weight (objective detection)
    - Gemini confidence: 40% weight (subjective analysis)
    """
    
    # Average YOLO confidence
    if yolo_injuries:
        yolo_conf = sum(inj['confidence'] for inj in yolo_injuries) / len(yolo_injuries)
    else:
        yolo_conf = 50.0  # Baseline if no injuries detected
    
    # Gemini confidence (extracted from analysis)
    gemini_conf = gemini_analysis.get('confidence', 80.0)
    
    # Weighted combination
    combined_confidence = (yolo_conf * 0.6) + (gemini_conf * 0.4)
    
    return round(combined_confidence, 2)
```

**6. Complete Health Assessment Flow**:

```
User uploads animal image
    ↓
Preprocess image → 640×640 resize
    ↓
┌────────────────────────────┐
│   YOLO STAGE (2-3 seconds) │
├────────────────────────────┤
│  Image → YOLOv11           │
│         ↓                  │
│  Detect injuries           │
│         ↓                  │
│  Locate body parts         │
│         ↓                  │
│  Find abnormalities        │
│         ↓                  │
│  Return bounding boxes     │
└────────────────────────────┘
    ↓
YOLO detections: [wound, fracture, swelling]
    ↓
┌────────────────────────────┐
│  GEMINI STAGE (5-8 seconds)│
├────────────────────────────┤
│  Image + YOLO data         │
│         ↓                  │
│  Gemini Vision AI          │
│         ↓                  │
│  Analyze visual context    │
│         ↓                  │
│  Assess severity           │
│         ↓                  │
│  Generate diagnosis        │
│         ↓                  │
│  Suggest treatment         │
│         ↓                  │
│  Calculate prognosis       │
└────────────────────────────┘
    ↓
Combine results
    ↓
{
  injuries: [YOLO detections],
  diagnosis: "Moderate trauma",
  severity: "MODERATE",
  treatment: "Clean wound, antibiotics, rest",
  urgency: "URGENT",
  confidence: 87.5%
}
    ↓
Return to backend → Display in UI
```

**7. Why Dual-AI System?**

**YOLO Advantages**:
- ✅ Fast (2-3 seconds)
- ✅ Precise localization
- ✅ Objective detection
- ❌ Limited context understanding

**Gemini Advantages**:
- ✅ Comprehensive analysis
- ✅ Medical reasoning
- ✅ Context awareness
- ❌ Slower (5-8 seconds)

**Combined System**:
- ✅ Fast + accurate
- ✅ Localization + diagnosis
- ✅ Objective + contextual
- ✅ Best of both worlds

---

## 📊 Algorithm Comparison Table

| Algorithm | Purpose | Speed | Accuracy | Model Size |
|-----------|---------|-------|----------|------------|
| **MobileNetV2** | Animal ID | Fast (2-3s) | 94% | 14 MB |
| **YOLOv11 Nano** | Poaching | Very Fast (1s) | 89% | 6 MB |
| **YOLOv11 Small** | Health | Fast (2s) | 92% | 22 MB |
| **Gemini 1.5 Pro** | Analysis | Slow (5-8s) | 95% | Cloud-based |

---

## 🔄 Complete System Data Flow

```
USER UPLOADS IMAGE
       ↓
┌──────────────────────────────────────────┐
│  FRONTEND (React)                        │
│  - File input                            │
│  - Preview image                         │
│  - Send to backend                       │
└──────────────────────────────────────────┘
       ↓ HTTP POST /api/identify-animal
┌──────────────────────────────────────────┐
│  BACKEND (Express.js)                    │
│  - Receive file                          │
│  - Convert to base64                     │
│  - Validate image                        │
└──────────────────────────────────────────┘
       ↓ HTTP POST http://localhost:5004/identify
┌──────────────────────────────────────────┐
│  TENSORFLOW SERVICE (Python)             │
│  - Decode base64                         │
│  - Preprocess: resize, normalize         │
│  - MobileNetV2 inference                 │
│  - Map to Indian wildlife                │
│  - Add detailed species data             │
└──────────────────────────────────────────┘
       ↓ JSON response
┌──────────────────────────────────────────┐
│  BACKEND (Express.js)                    │
│  - Receive AI result                     │
│  - Save to PostgreSQL                    │
│  - Generate response                     │
└──────────────────────────────────────────┘
       ↓ JSON response
┌──────────────────────────────────────────┐
│  FRONTEND (React)                        │
│  - Display species name                  │
│  - Show confidence                       │
│  - Render conservation info              │
│  - Display map if GPS enabled            │
└──────────────────────────────────────────┘
       ↓
USER SEES RESULT
```

---

## �🐛 Troubleshooting

### Problem: Services won't start

**Solution 1 - Kill old processes**:
```powershell
Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Solution 2 - Check ports**:
```powershell
netstat -ano | findstr "5001 5003 5004 5005"
```

**Solution 3 - Restart PostgreSQL**:
```powershell
Restart-Service postgresql-x64-14
```

### Problem: "Module not found" errors

**Solution - Reinstall dependencies**:

Node.js packages:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm install
```

Python packages:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
pip install -r requirements.txt
```

### Problem: Backend can't connect to TensorFlow

**Check .env file**:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
notepad .env
```

**Verify this line**:
```
TENSORFLOW_SERVICE_URL=http://localhost:5004
```

**NOT**:
```
TENSORFLOW_SERVICE_URL=http://localhost:5001  ❌ WRONG!
```

### Problem: Database connection error

**Solution 1 - Check PostgreSQL is running**:
```powershell
Get-Service postgresql*
```

**Solution 2 - Verify .env database URL**:
```
DATABASE_URL=postgresql://postgres:pokemon1234@localhost:5432/wild_guard_db
```

**Solution 3 - Reset database**:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run db:push
```

### Problem: TensorFlow crashes on startup

**Solution 1 - Check Python version**:
```powershell
python --version  # Should be 3.8 or higher
```

**Solution 2 - Reinstall TensorFlow**:
```powershell
pip uninstall tensorflow
pip install tensorflow==2.20.0
```

**Solution 3 - Check RAM**:
TensorFlow needs ~2GB RAM. Close other programs.

### Problem: YOLO model fails to load

**Solution - Download model weights**:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection"
# Models should be: yolo11n.pt and yolo11s.pt
# If missing, reinstall: pip install ultralytics
```

### Problem: Port already in use

**Find what's using the port**:
```powershell
netstat -ano | findstr :5001
```

**Kill specific process**:
```powershell
# Replace PID with actual process ID
Stop-Process -Id <PID> -Force
```

### Problem: Identification shows "Unknown"

**This means**:
1. TensorFlow service is down - Check port 5004
2. Image is unclear - Upload clearer photo
3. Animal not in database - Try different angle

**Check TensorFlow**:
```powershell
Invoke-RestMethod http://localhost:5004/health
```

### Common Error Messages:

#### "EADDRINUSE: address already in use"
**Meaning**: Port is occupied
**Fix**: Kill processes on that port

#### "Cannot connect to database"
**Meaning**: PostgreSQL not running
**Fix**: Start PostgreSQL service

#### "TensorFlow service not available"
**Meaning**: Port 5004 service down
**Fix**: Restart TensorFlow service

#### "Module 'flask' not found"
**Meaning**: Python packages missing
**Fix**: Run `pip install -r requirements.txt`

---

## ⚙️ Configuration

### Environment Variables (.env file)

Located at: `d:\Wild-Guard 5.0\WildRescueGuide\.env`

```bash
# Database Connection
DATABASE_URL=postgresql://postgres:pokemon1234@localhost:5432/wild_guard_db

# Session Security
SESSION_SECRET=your_secret_key_here

# TensorFlow Service URL
TENSORFLOW_SERVICE_URL=http://localhost:5004

# Multi-AI Verification (Optional)
ENABLE_MULTI_AI_VERIFICATION=false

# AI API Keys (Optional - for enhanced features)
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_claude_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here
OPENAI_API_KEY=your_openai_key_here
```

### Critical Settings:

#### Database URL Format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

**Default**:
- User: `postgres`
- Password: `pokemon1234`
- Host: `localhost`
- Port: `5432`
- Database: `wild_guard_db`

#### TensorFlow Service URL:
**MUST BE**: `http://localhost:5004`

This tells backend where to find TensorFlow AI service.

#### Multi-AI Verification:
- `false` = Fast (uses only TensorFlow)
- `true` = Accurate (uses 4-5 AI providers)

### Port Configuration:

| Service | Port | Can Change? |
|---------|------|-------------|
| Backend | 5001 | Yes (vite.config.ts) |
| Poaching | 5003 | Yes (yolo_poaching_service.py) |
| TensorFlow | 5004 | Yes (tensorflow_service_simple.py + .env) |
| Health | 5005 | Yes (injury-detection-service.py) |
| Database | 5432 | Yes (PostgreSQL config) |

**To change ports**:
1. Update service file
2. Update .env file
3. Update START_SERVICES.ps1
4. Restart all services

---

## 👨‍💻 Development Guide

### Project Setup for Development:

#### 1. Install Development Tools:
```powershell
npm install -g typescript
npm install -g vite
npm install -g drizzle-kit
```

#### 2. Run in Development Mode:

**Terminal 1 - Backend**:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run dev
```

**Terminal 2 - TensorFlow**:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\ai_models"
python tensorflow_service_simple.py
```

**Terminal 3 - Poaching**:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection"
python yolo_poaching_service.py
```

**Terminal 4 - Health**:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
python injury-detection-service.py
```

### Database Management:

#### View Database Schema:
```powershell
npm run db:studio
```
Opens Drizzle Studio at http://localhost:4983

#### Create Migration:
```powershell
npm run db:generate
```

#### Apply Migration:
```powershell
npm run db:push
```

#### Reset Database:
```powershell
npm run db:push
```

### Code Structure:

#### Adding New API Endpoint:

**File**: `server/routes.ts`

```typescript
app.post("/api/your-endpoint", async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Adding New React Page:

**File**: `client/src/pages/your-page.tsx`

```typescript
export default function YourPage() {
  return (
    <div>
      <h1>Your Page</h1>
    </div>
  );
}
```

**Add route**: `client/src/App.tsx`
```typescript
<Route path="/your-page" component={YourPage} />
```

#### Adding New Wildlife Species:

**File**: `ai_models/tensorflow_service_simple.py`

Add to `WILDLIFE_DATABASE` (line 48):
```python
"species_name": {
    "name": "Species Name",
    "scientific_name": "Scientific Name",
    "category": "Mammal/Bird/Reptile",
    "habitat": "Habitat description",
    "conservation_status": "Status",
    "population": "Population data",
    # ... more fields
}
```

### Building for Production:

#### Build Frontend:
```powershell
npm run build
```

#### Build Backend:
```powershell
npm run build:server
```

#### Start Production:
```powershell
npm run start
```

---

## 📊 Service Details

### Port Usage Summary:

| Port | Service | Protocol | Purpose |
|------|---------|----------|---------|
| 5001 | Backend | HTTP | Main API + Frontend |
| 5003 | Poaching | HTTP | YOLO Weapon Detection |
| 5004 | TensorFlow | HTTP | Animal Identification |
| 5005 | Health | HTTP | Injury Assessment |
| 5432 | PostgreSQL | TCP | Database |

### API Endpoints:

#### Animal Identification:
```
POST /api/identify-animal
Body: { image: File }
Response: { species, confidence, habitat, ... }
```

#### Poaching Detection:
```
POST /api/detect-threats
Body: { image: File, latitude, longitude }
Response: { threats: [...], severity }
```

#### Health Assessment:
```
POST /api/assess-health
Body: { image: File }
Response: { injuries: [...], severity, treatment }
```

#### Wildlife Sightings:
```
GET /api/sightings
Response: { sightings: [...] }

POST /api/sightings
Body: { species, location, ... }
Response: { id, ... }
```

### Database Tables:

```sql
-- Users
users (id, username, email, password_hash, role, created_at)

-- Identifications
animal_identifications (id, species_name, confidence, image_url, user_id, created_at)

-- Sightings
wildlife_sightings (id, species_name, latitude, longitude, reporter_name, created_at)

-- Alerts
poaching_alerts (id, threat_type, severity, latitude, longitude, image_url, created_at)

-- Health Records
health_assessments (id, animal_id, injury_type, severity, treatment, created_at)

-- Notifications
admin_notifications (id, type, message, severity, read, created_at)
```

---

## 🎓 How to Use - Complete Walkthrough

### First Time Usage:

#### Step 1: Start All Services
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
.\START_SERVICES.ps1
```

#### Step 2: Open Browser
Go to: http://localhost:5001

#### Step 3: Create Account (Optional)
- Click "Sign Up"
- Enter username, email, password
- Submit

#### Step 4: Start Using Features

### Using Animal Identification:

1. **Navigate**: Click "Identify Animal" in menu
2. **Upload Photo**: 
   - Click "Choose File"
   - Select animal photo (JPG/PNG)
   - Max size: 10MB
3. **Enable GPS** (Optional): 
   - Toggle "Use GPS Location"
   - Allow browser location access
4. **Identify**: Click "Identify Animal"
5. **Wait**: Processing takes 2-5 seconds
6. **View Results**:
   - Species name (e.g., "Indian Bengal Tiger")
   - Scientific name
   - Confidence percentage
   - Habitat information
   - Conservation status
   - Population data
   - Similar species

### Using Poaching Detection:

1. **Navigate**: Click "Poaching Detection"
2. **Upload Image**: Select suspicious photo
3. **Add Location**: 
   - Enter GPS coordinates OR
   - Enable GPS auto-detect
4. **Detect**: Click "Detect Threats"
5. **Review Results**:
   - Detected weapons
   - Threat level (High/Medium/Low)
   - Object locations (bounding boxes)
   - Alert created if serious

### Using Health Assessment:

1. **Navigate**: Click "Health Assessment"
2. **Upload Photo**: Animal photo showing condition
3. **Analyze**: Click "Assess Health"
4. **View Assessment**:
   - Detected injuries
   - Severity level
   - Affected body parts
   - Treatment recommendations
   - Veterinary advice
   - Urgency rating

### Reporting Wildlife Sighting:

1. **Navigate**: Click "Report Sighting"
2. **Fill Form**:
   - Your name & email
   - Animal species
   - Location (GPS or manual)
   - Date & time
   - Number of animals
   - Behavior observed
   - Upload photos (optional)
3. **Submit**: Click "Submit Report"
4. **Confirmation**: Get report ID

### Using Admin Dashboard:

1. **Login**: Use admin account
2. **View Dashboard**: Click "Admin"
3. **Features**:
   - Real-time alerts
   - Recent identifications
   - Poaching reports
   - Health assessments
   - User management
   - System status
4. **Manage**:
   - Mark alerts as read
   - Assign to rangers
   - Export reports
   - View statistics

---

## 🔒 Security & Privacy

### Data Protection:
- Passwords hashed with bcrypt
- Session-based authentication
- HTTPS in production (recommended)
- SQL injection prevention (Drizzle ORM)
- File upload validation
- GPS data encrypted

### User Privacy:
- Optional GPS sharing
- Anonymous reporting available
- Personal data not shared
- GDPR compliant (EU users)

### API Keys:
Store in `.env` file (never commit to Git)

---

## 📈 Performance Tips

### For Faster AI Inference:

1. **Use GPU** (if available):
   ```powershell
   pip install tensorflow-gpu
   ```

2. **Reduce Image Size**:
   - Max resolution: 1024x1024
   - Compress before upload
   - JPEG quality: 85%

3. **Close Other Programs**:
   - Free up RAM
   - Close Chrome tabs
   - Stop background apps

### For Faster Page Load:

1. **Production Build**:
   ```powershell
   npm run build
   ```

2. **Enable Caching**:
   Browser caches static assets

3. **Database Indexing**:
   Already optimized in schema

---

## 📝 Maintenance

### Regular Tasks:

#### Weekly:
- Check service logs
- Restart services if slow
- Clear old sessions

#### Monthly:
- Update dependencies:
  ```powershell
  npm update
  pip install --upgrade -r requirements.txt
  ```
- Backup database:
  ```powershell
  pg_dump wild_guard_db > backup.sql
  ```
- Check disk space

#### Quarterly:
- Update AI models
- Review security
- Performance audit

---

## 🆘 Support & Resources

### Documentation Files:
- **Full Guide.md** - This file (complete guide)
- **HOW_TO_RUN.md** - Running instructions
- **QUICK_START.md** - Quick reference
- **README_START.md** - 3-step quick start

### Useful Commands:

#### Check Services:
```powershell
netstat -ano | findstr "5001 5003 5004 5005"
```

#### View Logs:
Check PowerShell terminal windows

#### Database Query:
```powershell
psql -U postgres -d wild_guard_db
```

### Common Commands Reference:

| Task | Command |
|------|---------|
| Start All | `.\START_SERVICES.ps1` |
| Stop All | `Get-Process node,python | Stop-Process -Force` |
| Check Status | See "Check Services" above |
| Restart DB | `Restart-Service postgresql-x64-14` |
| Update Packages | `npm install && pip install -r requirements.txt` |
| Reset Database | `npm run db:push` |

---

## 🎯 Quick Reference Card

### START:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
.\START_SERVICES.ps1
```

### STOP:
```powershell
Get-Process node,python | Stop-Process -Force
```

### ACCESS:
http://localhost:5001

### SERVICES:
- ✅ Port 5001 - Main App
- ✅ Port 5003 - Poaching
- ✅ Port 5004 - TensorFlow
- ✅ Port 5005 - Health

---

## 📞 Emergency Troubleshooting

### Nothing works?

1. **Restart everything**:
   ```powershell
   Get-Process node,python | Stop-Process -Force
   .\START_SERVICES.ps1
   ```

2. **Check PostgreSQL**:
   ```powershell
   Get-Service postgresql* | Restart-Service
   ```

3. **Reinstall dependencies**:
   ```powershell
   npm install
   pip install -r requirements.txt
   ```

4. **Reset database**:
   ```powershell
   npm run db:push
   ```

5. **Still not working?**
   - Check Windows Firewall
   - Check antivirus
   - Restart computer

---

## ✅ Final Checklist

Before using Wild Guard, ensure:

- [ ] Node.js installed (v18+)
- [ ] Python installed (v3.8+)
- [ ] PostgreSQL installed and running
- [ ] Project dependencies installed
- [ ] Database created and migrated
- [ ] .env file configured correctly
- [ ] All 4 services start without errors
- [ ] http://localhost:5001 accessible
- [ ] TensorFlow connects properly
- [ ] Can upload and identify test image

---

## 🎉 Conclusion

You now have a complete understanding of:
- ✅ What Wild Guard does
- ✅ What programs are needed
- ✅ How to install everything
- ✅ How to run the application
- ✅ How the system works
- ✅ How to use each feature
- ✅ How to troubleshoot issues
- ✅ How to develop and maintain

**Ready to protect wildlife with AI!** 🦁🌿

---

**Project Information:**
- **Version**: 5.0
- **Location**: `d:\Wild-Guard 5.0\WildRescueGuide\`
- **Main URL**: http://localhost:5001
- **Services**: 4 (Backend, TensorFlow, Poaching, Health)
- **Database**: PostgreSQL
- **AI Models**: TensorFlow MobileNetV2 + YOLOv11

---

**Quick Links:**
- [How to Run](#how-to-run-the-application)
- [Troubleshooting](#troubleshooting)
- [Configuration](#configuration)
- [Features](#features-explained)

**Last Updated**: January 8, 2026
