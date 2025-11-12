# 🌟 WildGuard - Everything You Need to Know

**Complete Guide: Database Schema, AI Features, Credentials, and How Everything Works**

---

## 📋 Table of Contents

1. [Default Credentials](#default-credentials)
2. [Complete Database Schema (All 17 Tables)](#complete-database-schema)
3. [How Flora Identification Works](#how-flora-identification-works)
4. [How Fauna (Animal) Identification Works](#how-fauna-animal-identification-works)
5. [All 9 AI Features - How They Work](#all-9-ai-features)
6. [API Endpoints Reference](#api-endpoints-reference)
7. [Environment Variables](#environment-variables)

---

## 🔐 Default Credentials

### Admin Dashboard Access
```
URL: http://localhost:5000/admin
Username: admineo75
Password: wildguard1234

⚠️ CHANGE THESE IN PRODUCTION!
```

### Database Credentials (Default)
```
Database Name: wildguard
Host: localhost
Port: 5432
User: postgres
Password: postgres (or your PostgreSQL password)

Connection String:
postgresql://postgres:postgres@localhost:5432/wildguard
```

### API Keys (You Need to Get Your Own)
```
OPENAI_API_KEY=sk-your-key-here
GEMINI_API_KEY=your-key-here
LOCATIONIQ_API_KEY=your-key-here
FIRMS_API_KEY=your-key-here (optional)
SESSION_SECRET=generate-random-string
```

**Get API Keys From:**
- OpenAI: https://platform.openai.com/api-keys
- Gemini: https://aistudio.google.com/app/apikey
- LocationIQ: https://locationiq.com/
- NASA FIRMS: https://firms.modaps.eosdis.nasa.gov/api/area/

---

## 🗄️ Complete Database Schema

### All 17 Tables Explained

---

### 1. **users** - Basic User Accounts

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

**Purpose:** Store user login accounts  
**Used For:** Linking identifications and sightings to users  
**Example Data:**
```json
{
  "id": "abc-123-def",
  "username": "wildlifefan",
  "password": "$2a$10$hashed_password"
}
```

---

### 2. **admin_users** - Government Officials/Admins

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

**Purpose:** Admin dashboard access for government officials  
**Features:** Verify sightings, issue certificates, manage reports  
**Default Admin:**
- Username: `admineo75`
- Password: `wildguard1234` (bcrypt hashed in database)
- Role: `government_official`

**Example Data:**
```json
{
  "id": "admin-uuid",
  "username": "admineo75",
  "password": "$2a$10$hashed_wildguard1234",
  "role": "government_official",
  "department": "Karnataka Forest Department",
  "email": "admin@wildguard.gov.in",
  "created_at": "2024-11-01T10:00:00Z"
}
```

---

### 3. **animal_identifications** - AI Animal Identification Results

```sql
CREATE TABLE animal_identifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  species_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  conservation_status TEXT NOT NULL,
  population TEXT,
  habitat TEXT NOT NULL,
  threats TEXT[] NOT NULL,
  image_url TEXT NOT NULL,
  confidence REAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Store every animal identification made by AI  
**AI Used:** OpenAI GPT-5 or Google Gemini 2.0 Flash  
**Populated By:** When user uploads animal photo → AI identifies → saves here

**Fields Explained:**
- `species_name`: Common name (e.g., "Bengal Tiger")
- `scientific_name`: Latin name (e.g., "Panthera tigris")
- `conservation_status`: "Endangered", "Vulnerable", "Least Concern", etc.
- `population`: Current population estimate
- `habitat`: Natural habitat description
- `threats`: Array of conservation threats
- `image_url`: Base64 encoded image
- `confidence`: AI confidence score (0.0 to 1.0)

**Example Data:**
```json
{
  "id": "animal-123",
  "user_id": "user-456",
  "species_name": "Bengal Tiger",
  "scientific_name": "Panthera tigris tigris",
  "conservation_status": "Endangered",
  "population": "2,500-3,000 individuals in India",
  "habitat": "Dense forests, grasslands across Karnataka's Bandipur and Nagarahole National Parks",
  "threats": ["Poaching", "Habitat Loss", "Human-Wildlife Conflict"],
  "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "confidence": 0.95,
  "created_at": "2024-11-12T14:30:00Z"
}
```

**Indexes:**
- `user_id + created_at` (for user history queries)
- `created_at` (for recent identifications)

---

### 4. **flora_identifications** - AI Plant Identification Results

```sql
CREATE TABLE flora_identifications (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  species_name TEXT NOT NULL,
  scientific_name TEXT NOT NULL,
  conservation_status TEXT NOT NULL,
  is_endangered BOOLEAN NOT NULL DEFAULT FALSE,
  endangered_alert TEXT,
  habitat TEXT NOT NULL,
  uses TEXT NOT NULL,
  threats TEXT[] NOT NULL,
  image_url TEXT NOT NULL,
  confidence REAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Store every plant/tree identification made by AI  
**AI Used:** Google Gemini 2.0 Flash  
**Special Feature:** Detects endangered plants and shows conservation alerts

**Fields Explained:**
- `species_name`: Common plant name (e.g., "Red Sanders")
- `scientific_name`: Botanical name (e.g., "Pterocarpus santalinus")
- `is_endangered`: TRUE if Vulnerable/Endangered/Critically Endangered
- `endangered_alert`: Special warning message for endangered species
- `uses`: Traditional, medicinal, cultural uses
- `threats`: Conservation threats

**Example Data:**
```json
{
  "id": "flora-789",
  "user_id": "user-456",
  "species_name": "Red Sanders",
  "scientific_name": "Pterocarpus santalinus",
  "conservation_status": "Endangered",
  "is_endangered": true,
  "endangered_alert": "⚠️ ENDANGERED: This species is illegally harvested for timber trade. Protected under Wildlife Protection Act. Do not disturb wild specimens.",
  "habitat": "Dry deciduous forests of Eastern Ghats, endemic to Andhra Pradesh and Karnataka",
  "uses": "Traditional: Furniture, dye production. Medicinal: Ayurvedic treatments for skin conditions. Cultural: Sacred wood in Hindu rituals.",
  "threats": ["Illegal Logging", "Timber Trade", "Habitat Loss"],
  "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "confidence": 0.92,
  "created_at": "2024-11-12T15:00:00Z"
}
```

**Indexes:**
- `user_id + created_at`
- `created_at`

---

### 5. **animal_sightings** - User Wildlife Sighting Reports

```sql
CREATE TABLE animal_sightings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id VARCHAR REFERENCES animal_identifications(id) ON DELETE CASCADE,
  reporter_name TEXT,
  reporter_email TEXT,
  reporter_phone TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  location TEXT NOT NULL,
  habitat_type TEXT NOT NULL,
  animal_status TEXT NOT NULL,
  emergency_status TEXT NOT NULL DEFAULT 'none',
  description TEXT,
  image_url TEXT,
  certificate_issued TEXT DEFAULT 'no',
  verified_by VARCHAR REFERENCES admin_users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP,
  sighted_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** User-submitted wildlife sighting reports  
**Features:** 
- Photo upload with animal identification
- GPS location capture (automatic or manual)
- Interactive map display
- Admin verification system
- Certificate issuance for verified reports

**Fields Explained:**
- `animal_id`: Links to identified animal
- `habitat_type`: "forest", "grassland", "wetland", "urban", "agricultural"
- `animal_status`: "healthy", "injured", "sick", "dead", "in_danger"
- `emergency_status`: "none", "urgent", "critical"
- `certificate_issued`: "yes" or "no"
- `verified_by`: Admin who verified this sighting
- `verified_at`: When admin verified

**Example Data:**
```json
{
  "id": "sighting-001",
  "animal_id": "animal-123",
  "reporter_name": "Rajesh Kumar",
  "reporter_email": "rajesh@example.com",
  "reporter_phone": "+91-9876543210",
  "latitude": 11.6668,
  "longitude": 76.5317,
  "location": "Bandipur National Park, Karnataka",
  "habitat_type": "forest",
  "animal_status": "healthy",
  "emergency_status": "none",
  "description": "Spotted a Bengal Tiger crossing the forest path during morning safari",
  "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "certificate_issued": "yes",
  "verified_by": "admin-uuid",
  "verified_at": "2024-11-12T16:00:00Z",
  "sighted_at": "2024-11-12T07:30:00Z"
}
```

**Indexes:**
- `animal_id`
- `location`
- `emergency_status`
- `verified_by`

---

### 6. **certificates** - Achievement Certificates

```sql
CREATE TABLE certificates (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  sighting_id VARCHAR REFERENCES animal_sightings(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMP DEFAULT NOW(),
  contribution TEXT NOT NULL,
  species_helped TEXT NOT NULL,
  location TEXT NOT NULL
);
```

**Purpose:** Issue certificates to recognize wildlife conservation contributors  
**Issued By:** Government admin after verifying sighting  
**Certificate Format:** "WG-YYYY-NNNNNN" (e.g., WG-2024-000123)

**Example Data:**
```json
{
  "id": "cert-001",
  "sighting_id": "sighting-001",
  "recipient_name": "Rajesh Kumar",
  "recipient_email": "rajesh@example.com",
  "certificate_number": "WG-2024-000123",
  "issue_date": "2024-11-12T16:00:00Z",
  "contribution": "Reported sighting of endangered Bengal Tiger in Bandipur National Park, contributing valuable data for wildlife conservation",
  "species_helped": "Bengal Tiger (Panthera tigris tigris)",
  "location": "Bandipur National Park, Karnataka"
}
```

**Indexes:**
- `sighting_id`
- `certificate_number` (unique)

---

### 7. **wildlife_centers** - Rescue Centers Directory

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
  services TEXT[] NOT NULL,
  rating REAL NOT NULL,
  address TEXT NOT NULL,
  type TEXT NOT NULL
);
```

**Purpose:** Directory of wildlife rescue centers and sanctuaries  
**Features:** Map integration, contact info, services offered  
**Types:** "rescue", "sanctuary", "hospital", "research"

**Example Data:**
```json
{
  "id": "center-001",
  "name": "Bannerghatta Biological Park Rescue Center",
  "description": "Premier wildlife rescue and rehabilitation facility in Karnataka",
  "latitude": 12.8005,
  "longitude": 77.5773,
  "phone": "+91-80-22456789",
  "email": "rescue@bbp.gov.in",
  "website": "https://bangalorezoo.karnataka.gov.in",
  "hours": "24/7 Emergency Response",
  "services": ["Emergency Rescue", "Veterinary Treatment", "Rehabilitation", "Release Program"],
  "rating": 4.8,
  "address": "Bannerghatta Road, Bangalore, Karnataka 560083",
  "type": "rescue"
}
```

---

### 8. **botanical_gardens** - Gardens Directory

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
  specializations TEXT[] NOT NULL,
  rating REAL NOT NULL,
  address TEXT NOT NULL
);
```

**Purpose:** Directory of botanical gardens and plant conservation centers

**Example Data:**
```json
{
  "id": "garden-001",
  "name": "Lalbagh Botanical Garden",
  "description": "Historic 240-acre botanical garden with 1,000+ plant species",
  "latitude": 12.9507,
  "longitude": 77.5848,
  "phone": "+91-80-26567760",
  "email": "info@lalbagh.gov.in",
  "website": "https://lalbagh.karnataka.gov.in",
  "hours": "6:00 AM - 7:00 PM",
  "specializations": ["Rare Plants", "Medicinal Plants", "Orchids", "Bonsai"],
  "rating": 4.7,
  "address": "Mavalli, Bangalore, Karnataka 560004"
}
```

---

### 9. **ngos** - Conservation NGO Directory

```sql
CREATE TABLE ngos (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  focus TEXT[] NOT NULL,
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

**Purpose:** Directory of conservation NGOs  
**Focus Areas:** "Wildlife", "Flora", "Habitat", "Research", "Education"

**Example Data:**
```json
{
  "id": "ngo-001",
  "name": "Wildlife Conservation Society - India",
  "description": "Leading conservation organization working to protect India's wildlife and wild places",
  "focus": ["Wildlife", "Habitat", "Research"],
  "latitude": 12.9716,
  "longitude": 77.5946,
  "phone": "+91-80-23636666",
  "email": "info@wcsindia.org",
  "website": "https://india.wcs.org",
  "address": "1669, 31st Cross, 16th Main, Banashankari 2nd Stage, Bangalore 560070",
  "volunteer_opportunities": ["Field Research", "Wildlife Surveys", "Community Outreach"],
  "established": "1996",
  "rating": 4.9
}
```

---

### 10. **volunteer_activities** - Volunteer Opportunities

```sql
CREATE TABLE volunteer_activities (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  ngo_id VARCHAR REFERENCES ngos(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  volunteers_needed REAL NOT NULL,
  volunteers_joined REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Track volunteer opportunities  
**Types:** "Rescue", "Survey", "Plantation", "Awareness", "Research"  
**Status:** "upcoming", "ongoing", "completed"

**Example Data:**
```json
{
  "id": "vol-001",
  "ngo_id": "ngo-001",
  "title": "Tiger Census Survey - Bandipur",
  "description": "Join our team for annual tiger population survey using camera traps",
  "type": "Survey",
  "location": "Bandipur Tiger Reserve",
  "date": "December 15-20, 2024",
  "volunteers_needed": 20,
  "volunteers_joined": 12,
  "status": "upcoming",
  "created_at": "2024-11-01T10:00:00Z"
}
```

---

### 11. **deforestation_alerts** - Habitat Loss Tracking

```sql
CREATE TABLE deforestation_alerts (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  area_lost REAL NOT NULL,
  severity TEXT NOT NULL,
  detected_at TIMESTAMP DEFAULT NOW(),
  protected_area TEXT,
  affected_species TEXT[],
  before_image_url TEXT,
  after_image_url TEXT,
  description TEXT,
  reported_by TEXT,
  verified_by VARCHAR REFERENCES admin_users(id) ON DELETE SET NULL
);
```

**Purpose:** Track deforestation and habitat degradation  
**Severity Levels:** "low", "medium", "high", "critical"  
**Data Sources:** Satellite monitoring, user reports

**Example Data:**
```json
{
  "id": "defor-001",
  "location": "Near Nagarhole National Park Buffer Zone",
  "latitude": 12.0250,
  "longitude": 76.1372,
  "area_lost": 5.2,
  "severity": "high",
  "detected_at": "2024-11-10T08:00:00Z",
  "protected_area": "Nagarhole National Park",
  "affected_species": ["Asian Elephant", "Bengal Tiger", "Gaur"],
  "before_image_url": "satellite_before.jpg",
  "after_image_url": "satellite_after.jpg",
  "description": "Illegal logging detected in buffer zone, approximately 5.2 hectares of forest cleared",
  "reported_by": "Satellite Monitoring System",
  "verified_by": "admin-uuid"
}
```

---

### 12. **sound_detections** - Wildlife Sound AI Analysis

```sql
CREATE TABLE sound_detections (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  species_identified TEXT NOT NULL,
  scientific_name TEXT,
  sound_type TEXT NOT NULL,
  confidence REAL NOT NULL,
  location TEXT,
  latitude REAL,
  longitude REAL,
  audio_url TEXT NOT NULL,
  duration REAL,
  frequency TEXT,
  timestamp TIMESTAMP DEFAULT NOW(),
  conservation_status TEXT,
  additional_notes TEXT
);
```

**Purpose:** Identify wildlife from audio recordings (bioacoustic analysis)  
**AI Used:** Google Gemini 2.0 Flash (supports audio analysis)  
**Sound Types:** "call", "song", "alarm", "territorial", "distress"

**How It Works:**
1. User uploads audio file (MP3, WAV, M4A)
2. Audio converted to Base64
3. Sent to Gemini API with bioacoustic analysis prompt
4. Gemini identifies species from sound patterns
5. Results saved to database

**Example Data:**
```json
{
  "id": "sound-001",
  "user_id": "user-456",
  "species_identified": "Indian Peafowl",
  "scientific_name": "Pavo cristatus",
  "sound_type": "call",
  "confidence": 0.91,
  "location": "Bandipur National Park",
  "latitude": 11.6668,
  "longitude": 76.5317,
  "audio_url": "data:audio/mp3;base64,/9j/4AAQSkZJRg...",
  "duration": 3.5,
  "frequency": "1.5-2.5 kHz",
  "timestamp": "2024-11-12T07:00:00Z",
  "conservation_status": "Least Concern",
  "additional_notes": "Dawn territorial call, typical peacock vocalizations heard near forest edge"
}
```

---

### 13. **footprint_analyses** - Track Recognition AI

```sql
CREATE TABLE footprint_analyses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  species_identified TEXT NOT NULL,
  scientific_name TEXT,
  confidence REAL NOT NULL,
  footprint_size REAL,
  track_pattern TEXT,
  location TEXT,
  latitude REAL,
  longitude REAL,
  image_url TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  conservation_status TEXT,
  additional_details TEXT
);
```

**Purpose:** Identify animals from footprints and tracks  
**AI Used:** Google Gemini 2.0 Flash (vision analysis)  
**Track Patterns:** "walking", "running", "stalking", "galloping"

**How It Works:**
1. User uploads photo of animal track/footprint
2. Image converted to Base64
3. Sent to Gemini with footprint analysis prompt
4. Gemini analyzes size, shape, claw marks, gait
5. Identifies species and behavioral context
6. Results saved to database

**Example Data:**
```json
{
  "id": "foot-001",
  "user_id": "user-456",
  "species_identified": "Bengal Tiger",
  "scientific_name": "Panthera tigris tigris",
  "confidence": 0.88,
  "footprint_size": 12.5,
  "track_pattern": "walking",
  "location": "Bandipur Tiger Reserve",
  "latitude": 11.6668,
  "longitude": 76.5317,
  "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "timestamp": "2024-11-12T08:30:00Z",
  "conservation_status": "Endangered",
  "additional_details": "Large adult tiger, pug mark shows 4 toe pads with no claw marks (retracted claws), walking gait indicates normal movement pattern"
}
```

---

### 14. **habitat_monitoring** - Satellite Monitoring Data

```sql
CREATE TABLE habitat_monitoring (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  protected_area TEXT,
  ndvi_value REAL NOT NULL,
  forest_cover_percentage REAL NOT NULL,
  change_detected BOOLEAN NOT NULL DEFAULT FALSE,
  change_percentage REAL,
  fire_severity TEXT,
  fire_count REAL DEFAULT 0,
  vegetation_health TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  alerts TEXT[],
  recommendations TEXT[]
);
```

**Purpose:** Monitor habitat health using satellite data  
**Data Sources:**
- NDVI calculations (Normalized Difference Vegetation Index)
- NASA FIRMS API (Fire Information for Resource Management System)

**Fields Explained:**
- `ndvi_value`: Vegetation health indicator (-1.0 to 1.0, higher = healthier)
- `forest_cover_percentage`: Percentage of area with forest
- `fire_severity`: "none", "low", "moderate", "high", "extreme"
- `vegetation_health`: "excellent", "good", "moderate", "poor", "critical"

**Example Data:**
```json
{
  "id": "habitat-001",
  "location": "Bandipur National Park - Zone A",
  "latitude": 11.6668,
  "longitude": 76.5317,
  "protected_area": "Bandipur Tiger Reserve",
  "ndvi_value": 0.75,
  "forest_cover_percentage": 92.5,
  "change_detected": false,
  "change_percentage": 0,
  "fire_severity": "none",
  "fire_count": 0,
  "vegetation_health": "excellent",
  "timestamp": "2024-11-12T12:00:00Z",
  "alerts": [],
  "recommendations": ["Continue regular monitoring", "Maintain current protection measures"]
}
```

---

### 15. **partial_image_enhancements** - Blurry/Incomplete Image AI

```sql
CREATE TABLE partial_image_enhancements (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  original_image_url TEXT NOT NULL,
  enhanced_image_url TEXT,
  species_identified TEXT NOT NULL,
  alternative_species TEXT[],
  primary_confidence REAL NOT NULL,
  alternative_confidences TEXT,
  image_quality TEXT NOT NULL,
  visibility_percentage REAL,
  timestamp TIMESTAMP DEFAULT NOW(),
  conservation_status TEXT,
  detection_details TEXT
);
```

**Purpose:** Identify species from poor quality camera trap images  
**AI Used:** Google Gemini 2.0 Flash (handles blurry/partial images)  
**Image Quality:** "very_poor", "poor", "fair", "good", "excellent"

**How It Works:**
1. User uploads blurry/partial camera trap image
2. AI analyzes despite poor quality
3. Identifies species based on visible features
4. Provides alternative species possibilities
5. Assesses image quality and visibility

**Example Data:**
```json
{
  "id": "partial-001",
  "user_id": "user-456",
  "original_image_url": "data:image/jpeg;base64,blurry_image...",
  "enhanced_image_url": null,
  "species_identified": "Leopard",
  "alternative_species": ["Tiger", "Large Wild Cat"],
  "primary_confidence": 0.72,
  "alternative_confidences": "{\"Tiger\": 0.25, \"Large Wild Cat\": 0.18}",
  "image_quality": "poor",
  "visibility_percentage": 45,
  "timestamp": "2024-11-12T22:30:00Z",
  "conservation_status": "Vulnerable",
  "detection_details": "Spotted coat pattern visible on 45% of body, distinctive rosette markings suggest leopard despite motion blur and low light conditions"
}
```

---

### 16. **chat_messages** - Wildlife Chatbot History

```sql
CREATE TABLE chat_messages (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR REFERENCES users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  intent TEXT,
  data_source TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Store chatbot conversation history  
**AI Used:** Google Gemini with real-time data integration  
**Intents:** "sighting_query", "weather_query", "species_info", "conservation_data", "general"  
**Data Sources:** "live_api", "database", "static", "multiple"

**Example Data:**
```json
{
  "id": "chat-001",
  "user_id": "user-456",
  "session_id": "session-abc-123",
  "user_message": "How many tiger sightings in Bandipur this month?",
  "bot_response": "Based on our database, there have been 12 verified tiger sightings in Bandipur National Park this month. The sightings show healthy adult tigers, with 3 sightings including cubs, indicating successful breeding. Latest sighting was 2 days ago near Zone C.",
  "intent": "sighting_query",
  "data_source": "database",
  "timestamp": "2024-11-12T14:00:00Z"
}
```

---

### 17. **user_activity** - Activity Logs

```sql
CREATE TABLE user_activity (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type TEXT NOT NULL,
  user_id TEXT,
  user_name TEXT,
  user_email TEXT,
  details JSONB,
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

**Purpose:** Track all user activities for analytics and security  
**Activity Types:** "sighting_report", "identification", "volunteer_signup", "adoption"

**Example Data:**
```json
{
  "id": "activity-001",
  "activity_type": "sighting_report",
  "user_id": "user-456",
  "user_name": "Rajesh Kumar",
  "user_email": "rajesh@example.com",
  "details": {
    "sighting_id": "sighting-001",
    "species": "Bengal Tiger",
    "location": "Bandipur National Park"
  },
  "ip_address": "103.10.20.30",
  "timestamp": "2024-11-12T07:30:00Z"
}
```

---

## 🌺 How Flora Identification Works

### Complete Flora (Plant) Identification Pipeline

#### Step 1: User Uploads Plant Photo
```
User → Identify Page → Upload plant photo → Frontend
```

#### Step 2: Frontend Processing
```javascript
// File: client/src/pages/identify.tsx
const handleFloraSubmit = async (file: File) => {
  // Convert image to Base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  
  reader.onload = async () => {
    const base64Image = reader.result.split(',')[1];
    
    // Send to backend
    const response = await fetch('/api/identify/flora', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });
    
    const result = await response.json();
    // Display: Species name, conservation status, uses, etc.
  };
};
```

#### Step 3: Backend Receives Request
```typescript
// File: server/routes.ts
app.post('/api/identify/flora', async (req, res) => {
  const { image } = req.body; // Base64 image string
  
  // Call Gemini AI service
  const aiResult = await analyzeFloraWithGemini(image);
  
  // Save to database
  const dbRecord = await storage.createFloraIdentification({
    userId: req.user?.id || null,
    speciesName: aiResult.speciesName,
    scientificName: aiResult.scientificName,
    conservationStatus: aiResult.conservationStatus,
    isEndangered: aiResult.isEndangered,
    endangeredAlert: aiResult.endangeredAlert,
    habitat: aiResult.habitat,
    uses: aiResult.uses,
    threats: aiResult.threats,
    confidence: aiResult.confidence,
    imageUrl: image
  });
  
  res.json(dbRecord);
});
```

#### Step 4: Gemini AI Analysis
```typescript
// File: server/services/gemini.ts
export async function analyzeFloraWithGemini(imageBase64: string) {
  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  // Create detailed prompt
  const prompt = `You are a botanical identification expert specializing in Indian flora.
  
  Analyze this plant image and return JSON:
  {
    "speciesName": "Red Sanders",
    "scientificName": "Pterocarpus santalinus",
    "conservationStatus": "Endangered",
    "isEndangered": true,
    "endangeredAlert": "⚠️ ENDANGERED: Protected under Wildlife Act",
    "habitat": "Dry deciduous forests of Eastern Ghats",
    "uses": "Medicinal: Ayurvedic treatments. Cultural: Sacred wood",
    "threats": ["Illegal Logging", "Timber Trade"],
    "confidence": 0.92
  }`;
  
  // Send image to Gemini API
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    }
  ]);
  
  // Parse AI response
  const responseText = result.response.text();
  const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
  const parsed = JSON.parse(cleaned);
  
  return parsed;
}
```

#### Step 5: Database Storage
```sql
INSERT INTO flora_identifications (
  id, user_id, species_name, scientific_name,
  conservation_status, is_endangered, endangered_alert,
  habitat, uses, threats, confidence, image_url, created_at
) VALUES (
  'flora-789',
  'user-456',
  'Red Sanders',
  'Pterocarpus santalinus',
  'Endangered',
  true,
  '⚠️ ENDANGERED: Protected under Wildlife Act',
  'Dry deciduous forests of Eastern Ghats',
  'Medicinal: Ayurvedic treatments. Cultural: Sacred wood',
  ARRAY['Illegal Logging', 'Timber Trade'],
  0.92,
  'data:image/jpeg;base64,...',
  NOW()
);
```

#### Step 6: Frontend Display
```typescript
// Display results to user
<Card>
  <h2>{result.speciesName}</h2>
  <p>Scientific: {result.scientificName}</p>
  <p>Status: {result.conservationStatus}</p>
  
  {result.isEndangered && (
    <Alert variant="destructive">
      {result.endangeredAlert}
    </Alert>
  )}
  
  <p>Habitat: {result.habitat}</p>
  <p>Uses: {result.uses}</p>
  <p>Confidence: {(result.confidence * 100).toFixed(0)}%</p>
</Card>
```

### Flora AI Features:
✅ **No Training Required** - Uses pre-trained Gemini AI  
✅ **Endangered Detection** - Automatically flags protected species  
✅ **Traditional Uses** - Includes Ayurvedic and cultural information  
✅ **Western Ghats Specialist** - Optimized for Karnataka endemic species

---

## 🦁 How Fauna (Animal) Identification Works

### Complete Fauna (Animal) Identification Pipeline

#### Step 1: User Uploads Animal Photo
```
User → Identify Page → Upload animal photo → Frontend
```

#### Step 2: Frontend Processing
```javascript
// File: client/src/pages/identify.tsx
const handleAnimalSubmit = async (file: File) => {
  // Convert to Base64
  const reader = new FileReader();
  reader.readAsDataURL(file);
  
  reader.onload = async () => {
    const base64Image = reader.result.split(',')[1];
    
    // API call
    const response = await fetch('/api/identify/animal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });
    
    const result = await response.json();
  };
};
```

#### Step 3: Backend Route Handler
```typescript
// File: server/routes.ts
app.post('/api/identify/animal', async (req, res) => {
  const { image } = req.body;
  
  // Call OpenAI or Gemini
  const aiResult = await analyzeAnimalImage(image);
  
  // Save to database
  const dbRecord = await storage.createAnimalIdentification({
    userId: req.user?.id || null,
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

#### Step 4: AI Service (Multi-Provider)

**Option A: OpenAI GPT-5 (Primary)**
```typescript
// File: server/services/openai.ts
export async function analyzeAnimalImage(base64Image: string) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  const response = await openai.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content: "You are a wildlife expert. Identify this animal and return JSON."
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

**Option B: Google Gemini (Fallback or Primary if PREFER_GEMINI=true)**
```typescript
// File: server/services/gemini.ts
export async function analyzeAnimalWithGemini(imageBase64: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const prompt = `Identify this animal. Return JSON:
  {
    "speciesName": "Bengal Tiger",
    "scientificName": "Panthera tigris",
    "conservationStatus": "Endangered",
    "population": "2,500-3,000 in India",
    "habitat": "Dense forests of Karnataka",
    "threats": ["Poaching", "Habitat Loss"],
    "confidence": 0.95
  }`;
  
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
  const parsed = JSON.parse(responseText.replace(/```json\n?|\n?```/g, '').trim());
  
  return parsed;
}
```

#### Step 5: Database Insert
```sql
INSERT INTO animal_identifications (
  id, user_id, species_name, scientific_name,
  conservation_status, population, habitat,
  threats, confidence, image_url, created_at
) VALUES (
  'animal-123',
  'user-456',
  'Bengal Tiger',
  'Panthera tigris tigris',
  'Endangered',
  '2,500-3,000 individuals in India',
  'Dense forests, grasslands across Karnataka',
  ARRAY['Poaching', 'Habitat Loss', 'Human-Wildlife Conflict'],
  0.95,
  'data:image/jpeg;base64,...',
  NOW()
);
```

#### Step 6: Frontend Display
```typescript
<Card>
  <h2>{result.speciesName}</h2>
  <p>Scientific: {result.scientificName}</p>
  
  <Badge variant={getStatusColor(result.conservationStatus)}>
    {result.conservationStatus}
  </Badge>
  
  <p>Population: {result.population}</p>
  <p>Habitat: {result.habitat}</p>
  <p>Threats: {result.threats.join(', ')}</p>
  <p>AI Confidence: {(result.confidence * 100).toFixed(0)}%</p>
</Card>
```

### Animal AI Features:
✅ **Dual AI Support** - OpenAI GPT-5 or Google Gemini  
✅ **High Accuracy** - Typically 85-95% confidence  
✅ **Karnataka Wildlife** - Optimized for Indian species  
✅ **Conservation Data** - Real population estimates

---

## 🤖 All 9 AI Features - How They Work

### 1. **Poaching Detection**

**What It Does:** Detects weapons, traps, illegal activities from camera trap images

**AI Model:** Google Gemini 2.0 Flash  
**Input:** Camera trap image (JPEG/PNG)  
**Output:** Threat level, detected activities, recommendations

**How It Works:**
```typescript
// File: server/services/poaching-detection.ts
export async function analyzePoachingEvidence(imageBase64: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const prompt = `Analyze this camera trap image for poaching threats:
  - Human presence in protected areas
  - Weapons (guns, traps, snares)
  - Hunting equipment
  - Dead/injured animals
  
  Return JSON:
  {
    "threatDetected": true,
    "threatLevel": "critical",
    "confidence": 0.88,
    "detectedActivities": ["Armed persons in protected zone"],
    "suspiciousObjects": ["Rifle", "Hunting knife"],
    "evidenceDescription": "Two individuals with firearms...",
    "recommendations": ["Alert forest rangers immediately"]
  }`;
  
  const result = await model.generateContent([prompt, {
    inlineData: { data: imageBase64, mimeType: "image/jpeg" }
  }]);
  
  return JSON.parse(result.response.text());
}
```

**Database:** Not stored (sensitive law enforcement data)  
**Threat Levels:** none → low → medium → high → critical

---

### 2. **Population Trend Prediction**

**What It Does:** Forecasts wildlife population trends using historical census data

**Technology:** Linear regression on real Karnataka data (2006-2024)  
**Species:** 11 species (Tiger, Elephant, Leopard, etc.)  
**Input:** Historical census data  
**Output:** Population forecast, trend analysis, conservation recommendations

**How It Works:**
```typescript
// File: server/services/population-prediction.ts
const historicalData = {
  tiger: [
    { year: 2006, count: 300 },
    { year: 2010, count: 406 },
    { year: 2014, count: 408 },
    { year: 2018, count: 524 },
    { year: 2022, count: 563 }
  ]
};

function predictPopulation(species, years) {
  const data = historicalData[species];
  
  // Linear regression
  const { slope, intercept } = calculateLinearRegression(data);
  
  // Forecast
  const forecast = years.map(year => ({
    year,
    predicted: slope * year + intercept
  }));
  
  // Trend analysis
  const trend = slope > 0 ? "increasing" : 
                slope < 0 ? "declining" : "stable";
  
  return { forecast, trend, confidence: 0.85 };
}
```

**Database:** Uses real census data (not stored in DB)  
**Trend Types:** "increasing", "stable", "declining"

---

### 3. **Automatic Health Assessment**

**What It Does:** Analyzes animal health from photos

**AI Model:** Google Gemini 2.0 Flash  
**Input:** Animal photo  
**Output:** Health status, detected conditions, severity, recommendations

**How It Works:**
```typescript
// File: server/services/health-assessment.ts
export async function analyzeAnimalHealth(imageBase64: string) {
  const prompt = `Veterinary analysis of this animal:
  
  Detect:
  - Injuries (wounds, fractures)
  - Diseases (skin conditions, infections)
  - Malnutrition (visible ribs, poor coat)
  - Parasites
  - Overall condition
  
  Return JSON:
  {
    "healthStatus": "poor",
    "conditions": [
      {
        "type": "injury",
        "description": "Open wound on left hind leg",
        "severity": "high"
      }
    ],
    "physicalSigns": ["Limping", "Weight loss"],
    "recommendations": ["Immediate veterinary intervention required"],
    "emergencyLevel": "urgent"
  }`;
  
  const result = await model.generateContent([prompt, {
    inlineData: { data: imageBase64, mimeType: "image/jpeg" }
  }]);
  
  return JSON.parse(result.response.text());
}
```

**Health Status:** healthy → good → fair → poor → emergency  
**Severity Levels:** low → moderate → high → critical

---

### 4. **Satellite Habitat Monitoring**

**What It Does:** Tracks vegetation health and deforestation

**Technology:** NDVI calculations (Normalized Difference Vegetation Index)  
**Input:** Geographic coordinates  
**Output:** Vegetation health, deforestation detection, forest cover percentage

**How It Works:**
```typescript
// File: server/services/satellite-monitoring.ts
function calculateNDVI(location) {
  // NDVI = (NIR - Red) / (NIR + Red)
  // NIR = Near-Infrared reflectance
  // Red = Red light reflectance
  
  const satellite Data = getSatelliteImagery(location);
  const ndvi = (satelliteData.nir - satelliteData.red) / 
               (satelliteData.nir + satelliteData.red);
  
  const vegetationHealth = ndvi > 0.6 ? "excellent" :
                          ndvi > 0.4 ? "good" :
                          ndvi > 0.2 ? "moderate" :
                          ndvi > 0.0 ? "poor" : "critical";
  
  return {
    ndviValue: ndvi,
    vegetationHealth,
    forestCoverPercentage: calculateForestCover(location),
    changeDetected: detectChange(location)
  };
}
```

**Stored In:** `habitat_monitoring` table  
**NDVI Range:** -1.0 to 1.0 (higher = healthier vegetation)

---

### 5. **Wildlife Sightings Heatmap**

**What It Does:** Creates interactive biodiversity hotspot map

**Technology:** Geospatial clustering from database sightings  
**Input:** Database of user-reported sightings  
**Output:** Interactive map with species clusters, statistics

**How It Works:**
```typescript
// File: client/src/pages/features/sightings-heatmap.tsx
function calculateHotspots(sightings) {
  // Group by location
  const clusters = groupByLocation(sightings);
  
  // Calculate biodiversity score
  const hotspots = clusters.map(cluster => ({
    latitude: cluster.avgLat,
    longitude: cluster.avgLon,
    sightingCount: cluster.count,
    uniqueSpecies: cluster.species.length,
    biodiversityScore: calculateScore(cluster)
  }));
  
  return hotspots;
}
```

**Features:**
- Species filtering (dropdown + sidebar buttons)
- Dynamic hotspot calculation
- Real-time statistics
- Sighting timeline

**Data Source:** `animal_sightings` table (20 sample sightings across 11 species)

---

### 6. **Live Habitat Health Monitor**

**What It Does:** Real-time forest fire detection using NASA satellites

**API:** NASA FIRMS (Fire Information for Resource Management System)  
**Input:** Geographic area  
**Output:** Active fires, vegetation loss, conservation alerts

**How It Works:**
```typescript
// File: server/services/habitat-monitoring.ts
export async function getLiveHabitatData(area) {
  // Call NASA FIRMS API
  const firms Response = await fetch(
    `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${FIRMS_API_KEY}/VIIRS_SNPP_NRT/${area}/1`
  );
  
  const fires = parseFIRMSData(firmsResponse);
  
  // Calculate fire severity
  const fireSeverity = fires.length === 0 ? "none" :
                      fires.length < 5 ? "low" :
                      fires.length < 15 ? "moderate" :
                      fires.length < 30 ? "high" : "extreme";
  
  // Generate alerts
  const alerts = fires.length > 0 ? 
    [`${fires.length} active fires detected in protected area`] : [];
  
  return {
    fireCount: fires.length,
    fireSeverity,
    fires: fires.map(f => ({
      latitude: f.latitude,
      longitude: f.longitude,
      brightness: f.brightness,
      confidence: f.confidence
    })),
    alerts,
    recommendations: generateRecommendations(fires)
  };
}
```

**Stored In:** `habitat_monitoring` table  
**Fire Severity:** none → low → moderate → high → extreme

---

### 7. **Wildlife Sound Detection (Bioacoustic AI)**

**What It Does:** Identifies species from audio recordings

**AI Model:** Google Gemini 2.0 Flash (audio support)  
**Input:** Audio file (MP3, WAV, M4A) - max 5MB  
**Output:** Species ID, sound type, frequency, conservation status

**How It Works:**
```typescript
// File: server/services/sound-detection.ts
export async function analyzeBioacousticSound(audioBase64: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  
  const prompt = `Wildlife bioacoustics expert. Identify species from this sound:
  
  Return JSON:
  {
    "speciesIdentified": "Indian Peafowl",
    "scientificName": "Pavo cristatus",
    "soundType": "call",
    "confidence": 0.91,
    "frequency": "1.5-2.5 kHz",
    "duration": 3.5,
    "conservationStatus": "Least Concern",
    "additionalNotes": "Dawn territorial call",
    "habitatInfo": "Common in forests and agricultural areas"
  }`;
  
  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: audioBase64,
        mimeType: "audio/mp3"
      }
    }
  ]);
  
  return JSON.parse(result.response.text());
}
```

**Stored In:** `sound_detections` table  
**Sound Types:** call, song, alarm, territorial, distress

---

### 8. **AI Footprint Recognition**

**What It Does:** Identifies animals from tracks/footprints

**AI Model:** Google Gemini 2.0 Flash  
**Input:** Photo of animal track  
**Output:** Species ID, footprint size, gait pattern, behavior insights

**How It Works:**
```typescript
// File: server/services/footprint-recognition.ts
export async function analyzeFootprint(imageBase64: string) {
  const prompt = `Wildlife tracker expert. Analyze this animal footprint:
  
  Return JSON:
  {
    "speciesIdentified": "Bengal Tiger",
    "scientificName": "Panthera tigris",
    "confidence": 0.88,
    "footprintSize": 12.5,
    "trackPattern": "walking",
    "physicalCharacteristics": "4 toe pads, no claw marks (retracted)",
    "ageEstimate": "Adult",
    "behaviorInsights": "Normal walking gait, hunting patrol",
    "conservationStatus": "Endangered"
  }`;
  
  const result = await model.generateContent([
    prompt,
    {
      inlineData: { data: imageBase64, mimeType: "image/jpeg" }
    }
  ]);
  
  return JSON.parse(result.response.text());
}
```

**Stored In:** `footprint_analyses` table  
**Track Patterns:** walking, running, stalking, galloping

---

### 9. **Partial Image Enhancement**

**What It Does:** Identifies species from blurry/incomplete camera trap images

**AI Model:** Google Gemini 2.0 Flash  
**Input:** Poor quality camera trap image  
**Output:** Species ID despite blur, quality assessment, alternative possibilities

**How It Works:**
```typescript
// File: server/services/partial-image-enhancement.ts
export async function analyzePartialImage(imageBase64: string) {
  const prompt = `Camera trap expert. Identify species from this blurry/partial image:
  
  Return JSON:
  {
    "speciesIdentified": "Leopard",
    "alternativeSpecies": ["Tiger", "Large Wild Cat"],
    "primaryConfidence": 0.72,
    "alternativeConfidences": {"Tiger": 0.25, "Large Wild Cat": 0.18},
    "imageQuality": "poor",
    "visibilityPercentage": 45,
    "visibleFeatures": ["Spotted coat pattern", "Rosette markings"],
    "detectionDetails": "Spotted pattern visible on 45% of body, distinctive rosettes suggest leopard despite blur",
    "conservationStatus": "Vulnerable"
  }`;
  
  const result = await model.generateContent([
    prompt,
    {
      inlineData: { data: imageBase64, mimeType: "image/jpeg" }
    }
  ]);
  
  return JSON.parse(result.response.text());
}
```

**Stored In:** `partial_image_enhancements` table  
**Image Quality:** very_poor → poor → fair → good → excellent

---

## 📡 API Endpoints Reference

### Animal Identification
```http
POST /api/identify/animal
Content-Type: application/json

{
  "image": "base64_encoded_image_string"
}

Response:
{
  "id": "animal-123",
  "speciesName": "Bengal Tiger",
  "scientificName": "Panthera tigris",
  "conservationStatus": "Endangered",
  "population": "2,500-3,000 in India",
  "habitat": "Dense forests...",
  "threats": ["Poaching", "Habitat Loss"],
  "confidence": 0.95,
  "imageUrl": "base64...",
  "createdAt": "2024-11-12T14:30:00Z"
}
```

### Flora Identification
```http
POST /api/identify/flora
Content-Type: application/json

{
  "image": "base64_encoded_image_string"
}

Response:
{
  "id": "flora-789",
  "speciesName": "Red Sanders",
  "scientificName": "Pterocarpus santalinus",
  "conservationStatus": "Endangered",
  "isEndangered": true,
  "endangeredAlert": "⚠️ ENDANGERED: Protected...",
  "habitat": "Dry deciduous forests...",
  "uses": "Medicinal, Cultural uses...",
  "threats": ["Illegal Logging"],
  "confidence": 0.92,
  "createdAt": "2024-11-12T15:00:00Z"
}
```

### Animal Sighting Report
```http
POST /api/sightings
Content-Type: application/json

{
  "reporterName": "Rajesh Kumar",
  "reporterEmail": "rajesh@example.com",
  "reporterPhone": "+91-9876543210",
  "latitude": 11.6668,
  "longitude": 76.5317,
  "location": "Bandipur National Park",
  "habitatType": "forest",
  "animalStatus": "healthy",
  "emergencyStatus": "none",
  "description": "Tiger sighting",
  "image": "base64_encoded_image"
}

Response:
{
  "id": "sighting-001",
  "sightedAt": "2024-11-12T07:30:00Z",
  "certificateIssued": "no",
  "verified": false
}
```

### Admin - Verify Sighting
```http
PATCH /api/admin/sightings/:id/verify
Content-Type: application/json
Authorization: Required (admin session)

{
  "verified": true,
  "certificateIssued": "yes",
  "recipientName": "Rajesh Kumar",
  "recipientEmail": "rajesh@example.com"
}

Response:
{
  "id": "sighting-001",
  "verifiedBy": "admin-uuid",
  "verifiedAt": "2024-11-12T16:00:00Z",
  "certificateIssued": "yes"
}
```

### Poaching Detection
```http
POST /api/features/poaching-detection
Content-Type: application/json

{
  "image": "base64_camera_trap_image",
  "location": {
    "latitude": 11.6668,
    "longitude": 76.5317
  }
}

Response:
{
  "threatDetected": true,
  "threatLevel": "high",
  "confidence": 0.88,
  "detectedActivities": ["Armed persons"],
  "suspiciousObjects": ["Rifle"],
  "recommendations": ["Alert rangers immediately"],
  "timestamp": "2024-11-12T22:00:00Z"
}
```

### Sound Detection
```http
POST /api/features/sound-detection
Content-Type: application/json

{
  "audio": "base64_audio_file",
  "location": {
    "latitude": 11.6668,
    "longitude": 76.5317
  }
}

Response:
{
  "speciesIdentified": "Indian Peafowl",
  "scientificName": "Pavo cristatus",
  "soundType": "call",
  "confidence": 0.91,
  "frequency": "1.5-2.5 kHz",
  "duration": 3.5
}
```

### Footprint Recognition
```http
POST /api/features/footprint-recognition
Content-Type: application/json

{
  "image": "base64_track_photo"
}

Response:
{
  "speciesIdentified": "Bengal Tiger",
  "scientificName": "Panthera tigris",
  "confidence": 0.88,
  "footprintSize": 12.5,
  "trackPattern": "walking"
}
```

---

## 🔐 Environment Variables

### Required .env Configuration

```bash
# ============================================
# API Keys (REQUIRED)
# ============================================

# OpenAI - Animal Identification
OPENAI_API_KEY=sk-your-openai-key-here

# Google Gemini - Flora + 6 AI Features
GEMINI_API_KEY=your-gemini-key-here

# LocationIQ - Maps and Geocoding
LOCATIONIQ_API_KEY=your-locationiq-key-here

# ============================================
# Optional API Keys
# ============================================

# NASA FIRMS - Forest Fire Detection
FIRMS_API_KEY=your-firms-key-here

# Prefer Gemini for animals too
PREFER_GEMINI=true

# ============================================
# Database Configuration
# ============================================

# PostgreSQL Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wildguard
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=wildguard
PGPORT=5432

# ============================================
# Session Configuration
# ============================================

# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=your-random-64-char-hex-string

# ============================================
# Application Settings
# ============================================

NODE_ENV=development
PORT=5000
```

---

## ✅ Summary

### What You Now Know:

1. **Default Credentials:**
   - Admin: admineo75 / wildguard1234
   - Database: wildguard (localhost:5432)

2. **Complete Database:** 17 tables fully documented with schemas, purposes, and examples

3. **Flora Identification:** Gemini AI → JSON response → Database storage

4. **Fauna Identification:** OpenAI GPT-5 or Gemini → JSON response → Database storage

5. **All 9 AI Features:** Complete technical implementation explained

6. **API Endpoints:** All routes with request/response examples

7. **No Training Required:** All AI uses pre-trained APIs (OpenAI, Gemini)

### How It All Connects:

```
User Action
    ↓
Frontend (React)
    ↓
API Call (POST /api/...)
    ↓
Backend (Express)
    ↓
AI Service (OpenAI/Gemini API)
    ↓
Database (PostgreSQL)
    ↓
Response to Frontend
    ↓
Display to User
```

**Everything is connected through REST APIs and PostgreSQL database!**

---

**🎉 You now have complete technical knowledge of WildGuard!**
**Ready to run on your system with your own API keys!**
