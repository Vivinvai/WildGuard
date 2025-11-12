# 🔬 WildGuard - Complete Technical Documentation

This document explains **exactly how WildGuard works** - how AI identifies species, what's in the database, and how everything connects together.

---

## ⚠️ IMPORTANT: Understanding AI - We DON'T Train Models

### **WE DO NOT TRAIN AI MODELS!**

**Common Misconception:** "You trained Gemini to identify animals"
**Reality:** We use Google's **pre-trained** Gemini AI via API calls

### How It Actually Works:

1. **Google Gemini** and **OpenAI GPT** are already trained on billions of images
2. We simply **send images to their API** with specific instructions
3. They **analyze and return results** in JSON format
4. We **save those results** to our database

**Analogy:** It's like using Google Search. We don't "train Google" - we just ask it questions and get answers.

---

## 🧠 AI Identification Pipeline

### Step-by-Step: How Animal/Flora Identification Works

```
User uploads image
      ↓
Frontend converts image to Base64
      ↓
POST request to backend (/api/identify/animal)
      ↓
Backend receives Base64 image
      ↓
Calls AI API (OpenAI GPT-5 or Google Gemini)
      ↓
AI analyzes image and returns JSON
      ↓
Backend validates and saves to database
      ↓
Returns result to frontend
      ↓
Frontend displays species info
```

### Code Example - Animal Identification Flow:

**1. Frontend sends image (client/src/pages/identify.tsx):**
```typescript
// User uploads photo
const handleSubmit = async (file: File) => {
  // Convert image to Base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    const base64Image = reader.result.split(',')[1]; // Get Base64 string
    
    // Send to backend
    const response = await fetch('/api/identify/animal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image: base64Image // Base64 encoded image
      })
    });
    
    const result = await response.json();
    // Display result: species name, conservation status, etc.
  };
};
```

**2. Backend receives and calls AI (server/routes.ts):**
```typescript
app.post('/api/identify/animal', async (req, res) => {
  const { image } = req.body; // Base64 image string
  
  // Call AI service
  const result = await analyzeAnimalImage(image);
  
  // Save to database
  const identification = await storage.createAnimalIdentification({
    speciesName: result.speciesName,
    scientificName: result.scientificName,
    conservationStatus: result.conservationStatus,
    habitat: result.habitat,
    threats: result.threats,
    confidence: result.confidence,
    imageUrl: image // Store Base64 image
  });
  
  res.json(identification);
});
```

**3. AI Service calls OpenAI/Gemini API (server/services/openai.ts):**
```typescript
export async function analyzeAnimalImage(base64Image: string) {
  // Call OpenAI GPT-5 API
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a wildlife expert. Identify this animal."
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Identify this animal" },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${base64Image}` }
          }
        ]
      }
    ],
    response_format: { type: "json_object" } // Request JSON response
  });
  
  // Parse AI response
  const result = JSON.parse(response.choices[0].message.content);
  
  return {
    speciesName: result.speciesName,
    scientificName: result.scientificName,
    conservationStatus: result.conservationStatus,
    population: result.population,
    habitat: result.habitat,
    threats: result.threats,
    confidence: result.confidence
  };
}
```

**4. Alternative: Gemini AI (server/services/gemini.ts):**
```typescript
export async function analyzeAnimalWithGemini(imageBase64: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const prompt = `Identify this animal. Return JSON with:
  {
    "speciesName": "Bengal Tiger",
    "scientificName": "Panthera tigris",
    "conservationStatus": "Endangered",
    "habitat": "Forests of India",
    "threats": ["Poaching", "Habitat Loss"],
    "confidence": 0.95
  }`;
  
  // Send image to Gemini
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    }
  ]);
  
  const responseText = result.response.text();
  const parsed = JSON.parse(responseText);
  
  return parsed; // Returns species data
}
```

---

## 🗄️ Complete Database Schema

WildGuard uses **PostgreSQL** with **Drizzle ORM**. Here's every table:

### Database Tables Overview

```
📊 DATABASE: wildguard
├── 👤 User & Admin Tables
│   ├── users (basic users)
│   └── admin_users (government officials)
│
├── 🦁 Wildlife Identification
│   ├── animal_identifications (AI animal IDs)
│   ├── supported_animals (pre-loaded species data)
│   └── animal_sightings (user-reported sightings)
│
├── 🌸 Flora Identification
│   ├── flora_identifications (AI plant IDs)
│   └── botanical_gardens (garden directory)
│
├── 🏥 Conservation Resources
│   ├── wildlife_centers (rescue centers)
│   ├── ngos (NGO directory)
│   └── volunteer_activities (opportunities)
│
├── 🎖️ Certification & Tracking
│   ├── certificates (achievement certificates)
│   ├── user_activity (activity logs)
│   ├── volunteer_applications (applications)
│   └── animal_adoptions (adoption programs)
│
├── 🌍 Habitat Monitoring
│   ├── deforestation_alerts (habitat loss)
│   └── habitat_monitoring (satellite data)
│
└── 🤖 AI Features
    ├── sound_detections (bioacoustic AI)
    ├── footprint_analyses (track recognition)
    ├── partial_image_enhancements (blurry images)
    └── chat_messages (chatbot history)
```

---

### Detailed Table Schemas

#### 1. **users** - Basic Users
```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```
**Purpose:** Store user accounts for login
**Used for:** Linking identifications to users

---

#### 2. **admin_users** - Government Officials
```sql
CREATE TABLE admin_users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'government_official',
  department TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```
**Purpose:** Admin dashboard access
**Credentials:** username: `admineo75`, password: `wildguard1234`
**Features:** Verify sightings, issue certificates, view reports

---

#### 3. **animal_identifications** - AI Animal Identification Results
```sql
CREATE TABLE animal_identifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  species_name TEXT NOT NULL,           -- "Bengal Tiger"
  scientific_name TEXT NOT NULL,        -- "Panthera tigris"
  conservation_status TEXT NOT NULL,    -- "Endangered"
  population TEXT,                      -- "2,500-3,000 in India"
  habitat TEXT NOT NULL,                -- "Dense forests..."
  threats TEXT[] NOT NULL,              -- ["Poaching", "Habitat Loss"]
  image_url TEXT NOT NULL,              -- Base64 image
  confidence REAL NOT NULL,             -- 0.95 (95% confident)
  created_at TIMESTAMP DEFAULT NOW()
);
```
**Purpose:** Store every AI animal identification
**Data Source:** OpenAI GPT-5 or Google Gemini API
**How it's populated:** When user uploads animal photo, AI identifies it, result saved here

---

#### 4. **flora_identifications** - AI Plant Identification Results
```sql
CREATE TABLE flora_identifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  species_name TEXT NOT NULL,           -- "Red Sanders"
  scientific_name TEXT NOT NULL,        -- "Pterocarpus santalinus"
  conservation_status TEXT NOT NULL,    -- "Endangered"
  is_endangered BOOLEAN DEFAULT FALSE,
  endangered_alert TEXT,                -- "⚠️ ENDANGERED: Protected by law"
  habitat TEXT NOT NULL,
  uses TEXT NOT NULL,                   -- "Medicinal, furniture, dye"
  threats TEXT[] NOT NULL,
  image_url TEXT NOT NULL,
  confidence REAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```
**Purpose:** Store every AI plant identification
**Data Source:** Google Gemini 2.0 Flash API
**Special feature:** Detects endangered plants and shows conservation alerts

---

#### 5. **animal_sightings** - User-Reported Wildlife Sightings
```sql
CREATE TABLE animal_sightings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id VARCHAR REFERENCES animal_identifications(id),
  reporter_name TEXT,
  reporter_email TEXT,
  reporter_phone TEXT,
  latitude REAL NOT NULL,               -- GPS coordinates
  longitude REAL NOT NULL,
  location TEXT NOT NULL,               -- "Bandipur National Park"
  habitat_type TEXT NOT NULL,           -- "forest", "grassland", etc.
  animal_status TEXT NOT NULL,          -- "healthy", "injured", etc.
  emergency_status TEXT DEFAULT 'none', -- "urgent", "critical"
  description TEXT,
  image_url TEXT,
  certificate_issued TEXT DEFAULT 'no', -- 'yes' or 'no'
  verified_by VARCHAR REFERENCES admin_users(id),
  verified_at TIMESTAMP,
  sighted_at TIMESTAMP DEFAULT NOW()
);
```
**Purpose:** Wildlife sighting reports with photos and location
**Features:** 
- Geolocation capture
- Interactive map display
- Admin verification
- Certificate issuance for verified reports

---

#### 6. **certificates** - Achievement Certificates
```sql
CREATE TABLE certificates (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  sighting_id VARCHAR REFERENCES animal_sightings(id),
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,  -- "WG-2024-001234"
  issue_date TIMESTAMP DEFAULT NOW(),
  contribution TEXT NOT NULL,
  species_helped TEXT NOT NULL,
  location TEXT NOT NULL
);
```
**Purpose:** Issue certificates to contributors who report sightings
**Issued by:** Government admin after verifying sighting
**Use case:** Recognize and reward conservation contributors

---

#### 7. **wildlife_centers** - Rescue Centers & Sanctuaries
```sql
CREATE TABLE wildlife_centers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  hours TEXT NOT NULL,
  services TEXT[] NOT NULL,     -- ["Rescue", "Rehabilitation", "Treatment"]
  rating REAL NOT NULL,
  address TEXT NOT NULL,
  type TEXT NOT NULL            -- "rescue", "sanctuary", "hospital"
);
```
**Purpose:** Directory of wildlife rescue centers
**Features:** Map integration, contact info, services offered

---

#### 8. **botanical_gardens** - Gardens Directory
```sql
CREATE TABLE botanical_gardens (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  hours TEXT NOT NULL,
  specializations TEXT[] NOT NULL,  -- ["Medicinal Plants", "Orchids"]
  rating REAL NOT NULL,
  address TEXT NOT NULL
);
```
**Purpose:** Directory of botanical gardens
**Data:** Pre-seeded with Karnataka gardens

---

#### 9. **ngos** - NGO Directory
```sql
CREATE TABLE ngos (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  focus TEXT[] NOT NULL,        -- ["Wildlife", "Flora", "Habitat"]
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  address TEXT NOT NULL,
  volunteer_opportunities TEXT[] NOT NULL,
  established TEXT,
  rating REAL NOT NULL
);
```
**Purpose:** Conservation NGO directory
**Features:** Find organizations to support or volunteer with

---

#### 10. **volunteer_activities** - Volunteer Opportunities
```sql
CREATE TABLE volunteer_activities (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id VARCHAR REFERENCES ngos(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,           -- "Rescue", "Survey", "Plantation"
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  volunteers_needed REAL NOT NULL,
  volunteers_joined REAL DEFAULT 0,
  status TEXT NOT NULL,         -- "upcoming", "ongoing", "completed"
  created_at TIMESTAMP DEFAULT NOW()
);
```
**Purpose:** Track volunteer opportunities
**Features:** Users can see and join activities

---

#### 11. **deforestation_alerts** - Habitat Loss Tracking
```sql
CREATE TABLE deforestation_alerts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  area_lost REAL NOT NULL,      -- hectares
  severity TEXT NOT NULL,       -- "low", "medium", "high", "critical"
  detected_at TIMESTAMP DEFAULT NOW(),
  protected_area TEXT,
  affected_species TEXT[],
  before_image_url TEXT,
  after_image_url TEXT,
  description TEXT,
  reported_by TEXT,
  verified_by VARCHAR REFERENCES admin_users(id)
);
```
**Purpose:** Track deforestation and habitat loss
**Data source:** Satellite monitoring, user reports

---

#### 12. **sound_detections** - Wildlife Sound AI
```sql
CREATE TABLE sound_detections (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  species_identified TEXT NOT NULL,     -- "Bengal Tiger"
  scientific_name TEXT,
  sound_type TEXT NOT NULL,             -- "call", "song", "alarm"
  confidence REAL NOT NULL,
  location TEXT,
  latitude REAL,
  longitude REAL,
  audio_url TEXT NOT NULL,              -- Base64 audio
  duration REAL,                        -- seconds
  frequency TEXT,                       -- "2-4 kHz"
  timestamp TIMESTAMP DEFAULT NOW(),
  conservation_status TEXT,
  additional_notes TEXT
);
```
**Purpose:** Identify animals from audio recordings
**AI:** Google Gemini 2.0 Flash (supports audio analysis)
**How it works:** Upload MP3/WAV → Gemini analyzes → Returns species

---

#### 13. **footprint_analyses** - Track Recognition AI
```sql
CREATE TABLE footprint_analyses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  species_identified TEXT NOT NULL,
  scientific_name TEXT,
  confidence REAL NOT NULL,
  footprint_size REAL,                  -- cm
  track_pattern TEXT,                   -- "walking", "running"
  location TEXT,
  latitude REAL,
  longitude REAL,
  image_url TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  conservation_status TEXT,
  additional_details TEXT
);
```
**Purpose:** Identify animals from footprints/tracks
**AI:** Google Gemini 2.0 Flash (vision analysis)
**How it works:** Upload track photo → Gemini analyzes → Identifies species

---

#### 14. **habitat_monitoring** - Satellite Habitat Monitoring
```sql
CREATE TABLE habitat_monitoring (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  protected_area TEXT,
  ndvi_value REAL NOT NULL,             -- Vegetation health index
  forest_cover_percentage REAL NOT NULL,
  change_detected BOOLEAN DEFAULT FALSE,
  change_percentage REAL,
  fire_severity TEXT,                   -- "none", "low", "high", "extreme"
  fire_count REAL DEFAULT 0,
  vegetation_health TEXT NOT NULL,      -- "excellent", "poor", "critical"
  timestamp TIMESTAMP DEFAULT NOW(),
  alerts TEXT[],
  recommendations TEXT[]
);
```
**Purpose:** Monitor habitat health via satellite
**Data sources:** 
- NDVI calculations (vegetation index)
- NASA FIRMS API (forest fires)
**Features:** Real-time fire detection, vegetation health trends

---

#### 15. **partial_image_enhancements** - Blurry Image AI
```sql
CREATE TABLE partial_image_enhancements (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  original_image_url TEXT NOT NULL,
  enhanced_image_url TEXT,
  species_identified TEXT NOT NULL,
  alternative_species TEXT[],           -- ["Tiger", "Leopard"]
  primary_confidence REAL NOT NULL,
  alternative_confidences TEXT,         -- JSON: {"Tiger": 0.8, "Leopard": 0.6}
  image_quality TEXT NOT NULL,          -- "very_poor", "poor", "fair", "good"
  visibility_percentage REAL,           -- 45% of animal visible
  timestamp TIMESTAMP DEFAULT NOW(),
  conservation_status TEXT,
  detection_details TEXT
);
```
**Purpose:** Identify species from blurry/partial camera trap images
**AI:** Google Gemini 2.0 Flash (handles poor quality images)
**Use case:** Camera trap images often blurry - AI still identifies species

---

#### 16. **chat_messages** - Wildlife Chatbot History
```sql
CREATE TABLE chat_messages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id),
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  intent TEXT,                          -- "sighting_query", "species_info"
  data_source TEXT,                     -- "live_api", "database", "static"
  timestamp TIMESTAMP DEFAULT NOW()
);
```
**Purpose:** Store chatbot conversations
**AI:** Google Gemini with real-time data integration
**Features:** 
- Answers conservation questions
- Provides sighting statistics
- Weather data
- Population trends

---

#### 17. **user_activity** - Activity Logs
```sql
CREATE TABLE user_activity (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type TEXT NOT NULL,          -- "sighting_report", "identification"
  user_id TEXT,
  user_name TEXT,
  user_email TEXT,
  details JSONB,                        -- Additional data
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```
**Purpose:** Track all user activities for analytics
**Privacy:** IP addresses logged for security, not shared

---

## 🔗 How Database Connects to Backend

### Database Connection Setup:

**File:** `server/storage.ts`

```typescript
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import { neonConfig } from "@neondatabase/serverless";

// Configure WebSocket for Neon database
neonConfig.webSocketConstructor = ws;

// Create database connection
const db = drizzle(process.env.DATABASE_URL!);

export class Storage {
  // Save animal identification
  async createAnimalIdentification(data: InsertAnimalIdentification) {
    const [result] = await db
      .insert(animalIdentifications)
      .values(data)
      .returning();
    return result;
  }
  
  // Get all sightings
  async getAllAnimalSightings() {
    return await db
      .select()
      .from(animalSightings)
      .orderBy(desc(animalSightings.sightedAt));
  }
  
  // Update sighting (admin verification)
  async updateAnimalSighting(id: string, data: Partial<AnimalSighting>) {
    const [updated] = await db
      .update(animalSightings)
      .set(data)
      .where(eq(animalSightings.id, id))
      .returning();
    return updated;
  }
}
```

---

## 🎯 Complete Identification Flow - Animal Example

### 1. **User Action:** Upload animal photo on `/identify` page

### 2. **Frontend Processing:**
```typescript
// Convert image to Base64
const reader = new FileReader();
reader.readAsDataURL(file);
const base64Image = reader.result.split(',')[1];
```

### 3. **API Call:**
```typescript
POST /api/identify/animal
Body: { image: "base64imagestring..." }
```

### 4. **Backend Route Handler:**
```typescript
app.post('/api/identify/animal', async (req, res) => {
  const { image } = req.body;
  
  // Call AI service
  const aiResult = await analyzeAnimalImage(image);
  
  // Save to database
  const dbRecord = await storage.createAnimalIdentification({
    speciesName: aiResult.speciesName,
    scientificName: aiResult.scientificName,
    conservationStatus: aiResult.conservationStatus,
    population: aiResult.population,
    habitat: aiResult.habitat,
    threats: aiResult.threats,
    confidence: aiResult.confidence,
    imageUrl: image
  });
  
  res.json(dbRecord);
});
```

### 5. **AI Service (OpenAI):**
```typescript
async function analyzeAnimalImage(base64Image: string) {
  // Call OpenAI API
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a wildlife expert. Identify this animal and return JSON with species info."
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Identify this animal" },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ]
      }
    ],
    response_format: { type: "json_object" }
  });
  
  // OpenAI returns JSON like:
  // {
  //   "speciesName": "Bengal Tiger",
  //   "scientificName": "Panthera tigris",
  //   "conservationStatus": "Endangered",
  //   "confidence": 0.95
  // }
  
  return JSON.parse(response.choices[0].message.content);
}
```

### 6. **Database Storage:**
```sql
INSERT INTO animal_identifications (
  id, species_name, scientific_name, conservation_status,
  habitat, threats, confidence, image_url, created_at
) VALUES (
  'generated-uuid',
  'Bengal Tiger',
  'Panthera tigris',
  'Endangered',
  'Dense forests of India',
  ARRAY['Poaching', 'Habitat Loss'],
  0.95,
  'base64imagedata...',
  NOW()
);
```

### 7. **Frontend Display:**
```typescript
// Receive response from backend
const result = await response.json();

// Display to user:
// Species: Bengal Tiger
// Scientific Name: Panthera tigris
// Conservation Status: Endangered
// Confidence: 95%
```

---

## 🌟 All 9 AI Features - How They Work

### 1. **Poaching Detection**
- **Input:** Camera trap image (JPEG/PNG)
- **AI:** Google Gemini 2.0 Flash
- **Process:** Analyzes image for weapons, traps, suspicious activities
- **Output:** Threat level, detected objects, recommendations
- **Code:** `server/services/poaching-detection.ts`

### 2. **Population Trend Prediction**
- **Input:** Historical census data (2006-2024)
- **Processing:** Linear regression on 11 species
- **Output:** Population forecasts, trends (increasing/declining)
- **Code:** `server/services/population-prediction.ts`

### 3. **Automatic Health Assessment**
- **Input:** Animal photo
- **AI:** Google Gemini 2.0 Flash
- **Process:** Analyzes for injuries, diseases, malnutrition
- **Output:** Health status, severity, recommendations
- **Code:** `server/services/health-assessment.ts`

### 4. **Satellite Habitat Monitoring**
- **Input:** Geographic coordinates
- **Processing:** NDVI calculations (vegetation index)
- **Output:** Vegetation health, deforestation detection
- **Code:** `server/services/satellite-monitoring.ts`

### 5. **Wildlife Sightings Heatmap**
- **Input:** Database of user sightings
- **Processing:** Geospatial clustering
- **Output:** Interactive map with biodiversity hotspots
- **Code:** `client/src/pages/features/sightings-heatmap.tsx`

### 6. **Live Habitat Health Monitor**
- **Input:** NASA FIRMS API (forest fires)
- **Processing:** Real-time satellite data analysis
- **Output:** Fire alerts, vegetation loss detection
- **Code:** `server/services/habitat-monitoring.ts`

### 7. **Wildlife Sound Detection**
- **Input:** Audio file (MP3, WAV, M4A)
- **AI:** Google Gemini 2.0 Flash (audio support)
- **Process:** Bioacoustic analysis
- **Output:** Species identification, sound type, frequency
- **Code:** `server/services/sound-detection.ts`

### 8. **AI Footprint Recognition**
- **Input:** Photo of animal tracks
- **AI:** Google Gemini 2.0 Flash
- **Process:** Visual pattern recognition
- **Output:** Species prediction, size, gait pattern
- **Code:** `server/services/footprint-recognition.ts`

### 9. **Partial Image Enhancement**
- **Input:** Blurry/incomplete camera trap image
- **AI:** Google Gemini 2.0 Flash
- **Process:** Analyzes despite poor quality
- **Output:** Species ID, confidence, quality assessment
- **Code:** `server/services/partial-image-enhancement.ts`

---

## 📡 API Endpoints Reference

### Animal Identification
```
POST /api/identify/animal
Body: { image: "base64string" }
Response: { speciesName, scientificName, conservationStatus, ... }
```

### Flora Identification
```
POST /api/identify/flora
Body: { image: "base64string" }
Response: { speciesName, scientificName, isEndangered, ... }
```

### Animal Sighting Report
```
POST /api/sightings
Body: {
  reporterName, reporterEmail, reporterPhone,
  latitude, longitude, location,
  habitatType, animalStatus, emergencyStatus,
  description, image
}
Response: { id, sightedAt, ... }
```

### Admin - Verify Sighting
```
PATCH /api/admin/sightings/:id/verify
Body: { verified: true, certificateIssued: 'yes' }
Response: { updated sighting }
```

### Poaching Detection
```
POST /api/features/poaching-detection
Body: { image: "base64string", location: { lat, lon } }
Response: { threatLevel, detectedActivities, recommendations }
```

### Sound Detection
```
POST /api/features/sound-detection
Body: { audio: "base64audiostring", location: { lat, lon } }
Response: { speciesIdentified, soundType, confidence }
```

### Footprint Recognition
```
POST /api/features/footprint-recognition
Body: { image: "base64string" }
Response: { speciesIdentified, footprintSize, trackPattern }
```

---

## 🔐 Environment Variables Required

```bash
# AI APIs (REQUIRED)
OPENAI_API_KEY=sk-your-openai-key      # Animal identification
GEMINI_API_KEY=your-gemini-key         # Flora + 6 AI features
LOCATIONIQ_API_KEY=your-locationiq-key # Maps

# Optional
FIRMS_API_KEY=your-nasa-key            # Forest fire detection
PREFER_GEMINI=true                     # Use Gemini for animals too

# Database (Auto-configured in Replit)
DATABASE_URL=postgresql://...
PGHOST=...
PGUSER=...
PGPASSWORD=...
PGDATABASE=...
PGPORT=5432

# Session
SESSION_SECRET=random-64-char-hex-string
NODE_ENV=development
```

---

## ✅ Summary: How To Make It Work On Your Device

### What You Need:

1. **Node.js v18+** - JavaScript runtime
2. **PostgreSQL v14+** - Database
3. **API Keys** (your own, not ours):
   - OpenAI API key
   - Google Gemini API key
   - LocationIQ API key

### Setup Steps:

```bash
# 1. Install dependencies
npm install

# 2. Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE wildguard;"

# 3. Configure .env file with YOUR API keys
OPENAI_API_KEY=your-key-here
GEMINI_API_KEY=your-key-here
LOCATIONIQ_API_KEY=your-key-here
DATABASE_URL=postgresql://user:pass@localhost:5432/wildguard
SESSION_SECRET=generate-random-string

# 4. Initialize database (creates all tables)
npm run db:push

# 5. Start application
npm run dev

# 6. Access at http://localhost:5000
```

### What Happens When You Start:

1. **Database:** All 17 tables created automatically
2. **Backend:** Express server starts on port 5000
3. **Frontend:** Vite dev server serves React app
4. **AI Services:** Ready to call OpenAI/Gemini APIs when you upload images

### Testing AI Features:

1. **Animal ID:** Upload animal photo → AI identifies it
2. **Flora ID:** Upload plant photo → AI identifies it
3. **Poaching:** Upload camera trap → AI detects threats
4. **Sound:** Upload wildlife audio → AI identifies species
5. **Footprint:** Upload track photo → AI identifies animal

---

## 🎓 Key Takeaways

1. **We don't train AI** - We use pre-trained APIs (OpenAI & Gemini)
2. **Database stores results** - Not training data, just identification results
3. **Everything is connected** - Frontend → Backend → AI APIs → Database
4. **You need your own API keys** - Get them from OpenAI, Google, LocationIQ
5. **Database auto-creates** - Just run `npm run db:push`

---

## 📞 Questions?

- **"How does Gemini know animals?"** - Google trained it on billions of images
- **"Can I use without API keys?"** - No, you need OpenAI/Gemini accounts
- **"Is data stored locally?"** - Yes, in your PostgreSQL database
- **"Can I add more species?"** - AI automatically knows thousands of species
- **"How accurate is identification?"** - Depends on image quality, typically 85-95%

---

**Made with ❤️ for Wildlife Conservation**
**All AI services are API-based, no custom training required!**
