# Wild Guard 4.0 - System Architecture

## Overview
Wild Guard is a comprehensive wildlife conservation platform that combines AI-powered animal identification, injury detection, poaching prevention, and real-time tracking with GPS integration and administrative monitoring capabilities.

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (React/TypeScript)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Frontend   │  │    Pages     │  │  Components  │  │   Hooks     │ │
│  │   (Vite)     │  │   (Routes)   │  │   (UI/UX)    │  │ (Business)  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
│         │                 │                  │                  │        │
│         └─────────────────┴──────────────────┴──────────────────┘        │
│                                   │                                      │
│                          Browser Geolocation API                         │
│                                   │                                      │
└───────────────────────────────────┼──────────────────────────────────────┘
                                    │
                          HTTP/REST API (Port 5000)
                                    │
┌───────────────────────────────────┼──────────────────────────────────────┐
│                         SERVER LAYER (Express.js)                        │
├───────────────────────────────────┴──────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      API Routes (routes.ts)                       │   │
│  │  • /api/identify - Animal identification                         │   │
│  │  • /api/analyze-injury - Health assessment                       │   │
│  │  • /api/detect-poaching - Poaching detection                     │   │
│  │  • /api/admin/* - Admin endpoints                                │   │
│  │  • /api/chat - AI chatbot                                        │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                   │                                      │
│  ┌────────────────────┐  ┌────────────────────┐  ┌──────────────────┐  │
│  │  AI Orchestrator   │  │  Storage Manager   │  │  Session Store   │  │
│  │  (ai-orchestrator) │  │    (storage.ts)    │  │  (MemoryStore)   │  │
│  └────────┬───────────┘  └─────────┬──────────┘  └──────────────────┘  │
│           │                        │                                    │
└───────────┼────────────────────────┼────────────────────────────────────┘
            │                        │
            │                        │ Drizzle ORM
            │                        │
┌───────────┼────────────────────────┼────────────────────────────────────┐
│           │         AI SERVICES LAYER (Python/Flask)                    │
├───────────┼────────────────────────┼────────────────────────────────────┤
│           │                        │                                    │
│  ┌────────▼────────┐  ┌────────────▼──────┐  ┌────────────────────┐   │
│  │  TensorFlow AI  │  │  YOLOv11 Poaching │  │  YOLOv11 Injury    │   │
│  │   Port: 5001    │  │   Port: 5002      │  │   Port: 5004       │   │
│  │                 │  │                   │  │                    │   │
│  │  MobileNetV2    │  │  Custom Model     │  │  COCO Model        │   │
│  │  ImageNet 1000+ │  │  72 Classes:      │  │  80 Classes        │   │
│  │  classes        │  │  - 5 Weapons      │  │  Animal Health     │   │
│  │                 │  │  - 6 Vehicles     │  │  Detection         │   │
│  │  Wildlife ID    │  │  - 1 Human        │  │                    │   │
│  │  Primary Engine │  │  - 59 Animals     │  │  Wound/Injury      │   │
│  └─────────────────┘  └───────────────────┘  └────────────────────┘   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              Fallback: Gemini AI (Cloud API)                     │  │
│  │              Used when local AI confidence < 70%                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ SQL Queries
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                      DATABASE LAYER (PostgreSQL)                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Database: wild_guard_db (Port 5432)                                     │
│                                                                           │
│  ┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ animal_identifications│  │ animal_sightings │  │ poaching_alerts  │   │
│  ├─────────────────────┤  ├──────────────────┤  ├──────────────────┤   │
│  │ • id               │  │ • id             │  │ • id             │   │
│  │ • species_name     │  │ • animal_id (FK) │  │ • alert_type     │   │
│  │ • confidence       │  │ • latitude       │  │ • severity       │   │
│  │ • latitude         │  │ • longitude      │  │ • detected_items │   │
│  │ • longitude        │  │ • location       │  │ • image_url      │   │
│  │ • location_name    │  │ • animal_status  │  │ • location       │   │
│  │ • image_url        │  │ • emergency      │  │ • created_at     │   │
│  │ • created_at       │  │ • reporter_name  │  │                  │   │
│  └─────────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                           │
│  ┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │     admin_users     │  │      users       │  │  health_records  │   │
│  │  + 17 other tables  │  │                  │  │                  │   │
│  └─────────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                           │
│  Total: 23 Tables                                                        │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend (Port 5000 - Client)
- **Framework**: React 18.3 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **UI Components**: shadcn/ui
- **Maps**: Google Maps API
- **Animations**: Framer Motion
- **Location**: Browser Geolocation API

### Backend (Port 5000 - Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Session Management**: express-session + MemoryStore
- **File Upload**: Multer
- **CORS**: cors middleware
- **Database ORM**: Drizzle ORM

### AI/ML Services (Python/Flask)

#### 1. TensorFlow Service (Port 5001)
- **Framework**: TensorFlow 2.20.0
- **Model**: MobileNetV2 (ImageNet)
- **Classes**: 1000+ animal species
- **Purpose**: Primary wildlife identification
- **Dependencies**: Flask, Flask-CORS, Pillow, NumPy

#### 2. Poaching Detection Service (Port 5002)
- **Framework**: Ultralytics YOLOv11
- **Model**: Custom trained model
- **Classes**: 72 (5 weapons, 6 vehicles, 1 human, 59 animals)
- **Purpose**: Real-time poaching threat detection
- **Dependencies**: Flask, Flask-CORS, Ultralytics, Pillow

#### 3. Injury Detection Service (Port 5004)
- **Framework**: Ultralytics YOLOv11
- **Model**: COCO pretrained
- **Classes**: 80 (animal health indicators)
- **Purpose**: Wildlife health assessment
- **Dependencies**: Flask, Flask-CORS, Ultralytics, Pillow

#### 4. Fallback AI
- **Provider**: Google Gemini AI
- **API Key**: AIzaSyBmS5RKpsyiyocb75h2uogCUldOvNdAk-0
- **Usage**: When local AI confidence < 70%

### Database (Port 5432)
- **Database**: PostgreSQL 13
- **Name**: wild_guard_db
- **Tables**: 23 tables
- **ORM**: Drizzle
- **Migration Tool**: Drizzle Kit

### Python Environment
- **Version**: Python 3.x
- **Virtual Environment**: .venv
- **Key Dependencies**:
  - tensorflow==2.20.0
  - ultralytics (YOLOv11)
  - flask
  - flask-cors
  - pillow
  - pyparsing==3.1.4

---

## Data Flow

### Animal Identification Flow
```
1. User uploads image → Frontend (React)
2. Browser captures GPS location → Geolocation API
3. POST /api/identify → Express Server
4. Image + GPS sent to AI Orchestrator
5. TensorFlow Service (5001) analyzes image
6. If confidence < 70% → Gemini AI fallback
7. Result + GPS saved to PostgreSQL:
   - animal_identifications table
   - animal_sightings table (with GPS coords)
8. Response sent to frontend
9. Admin dashboard auto-updates
```

### Health Assessment Flow
```
1. User uploads animal image → Frontend
2. POST /api/analyze-injury → Express Server
3. Image forwarded to Injury Detection (5004)
4. YOLOv11 COCO model detects injuries/wounds
5. Health status generated (healthy/injured/critical)
6. Saved to health_records table
7. Alert created if critical
8. Admin notified
```

### Poaching Detection Flow
```
1. User uploads suspicious image → Frontend
2. POST /api/detect-poaching → Express Server
3. Image sent to Poaching Detection (5002)
4. YOLOv11 detects: weapons, vehicles, humans, animals
5. Threat level calculated (low/medium/high/critical)
6. Saved to poaching_alerts table
7. Emergency alert if weapons detected
8. Authorities notified via admin
```

---

## Core Features

### 1. Wildlife Identification
- **Primary AI**: TensorFlow MobileNetV2 (1000+ species)
- **Fallback AI**: Google Gemini
- **Accuracy**: 70%+ confidence threshold
- **GPS Tracking**: Automatic location capture
- **Database Storage**: All identifications logged

### 2. Injury Detection
- **AI Model**: YOLOv11 COCO
- **Detection**: Wounds, injuries, abnormalities
- **Health Status**: Healthy/Injured/Critical
- **Emergency Response**: Auto-alert for critical cases

### 3. Poaching Prevention
- **AI Model**: YOLOv11 Custom (72 classes)
- **Detects**: 
  - Weapons (guns, knives, traps, etc.)
  - Vehicles (trucks, motorcycles, etc.)
  - Human presence in restricted areas
  - 59 protected animal species
- **Threat Levels**: Low/Medium/High/Critical
- **Automatic Alerts**: Authority notification

### 4. GPS Location Tracking
- **Technology**: Browser Geolocation API
- **Accuracy**: ~10-50 meters
- **Storage**: Latitude, longitude, location name
- **Fallback**: Defaults to 0,0 if unavailable
- **Integration**: All identifications include GPS

### 5. Admin Dashboard
- **Authentication**: Secure admin login
- **Features**:
  - View all animal detections
  - Filter by species, date, location
  - Interactive maps (Google Maps)
  - Statistics and analytics
  - Report generation
  - Download JSON reports
  - Copy to clipboard
  - "Report to Authorities" button

### 6. Database Persistence
- **System**: PostgreSQL
- **Storage**: All identifications, sightings, alerts
- **Backup**: Dual storage (memory + PostgreSQL)
- **Logging**: Comprehensive console logging

---

## API Endpoints

### Animal Identification
```
POST /api/identify
Body: { image: File, latitude?: number, longitude?: number, locationName?: string }
Response: { species, confidence, healthStatus, gpsLocation, imageUrl }
```

### Health Assessment
```
POST /api/analyze-injury
Body: { image: File }
Response: { healthStatus, injuries[], confidence, recommendations }
```

### Poaching Detection
```
POST /api/detect-poaching
Body: { image: File, location?: string }
Response: { threatLevel, detectedItems[], alertCreated, recommendations }
```

### Admin Endpoints
```
GET /api/admin/animal-detections
Response: { detections[], totalCount, statistics }

GET /api/admin/detection-stats
Response: { totalDetections, species[], locations[], timeline[] }

POST /api/admin/login
Body: { username, password }
Response: { success, adminData }
```

### Health Checks
```
GET http://localhost:5000/health → Main Server
GET http://localhost:5001/health → TensorFlow AI
GET http://localhost:5002/health → Poaching Detection
GET http://localhost:5004/health → Injury Detection
```

---

## Security Features

1. **Admin Authentication**: Session-based with MemoryStore
2. **CORS Protection**: Configured for localhost only
3. **File Upload Limits**: Max 10MB images
4. **SQL Injection Prevention**: Drizzle ORM parameterized queries
5. **API Key Protection**: Environment variables (.env)
6. **Session Timeout**: 24-hour admin sessions

---

## Deployment Architecture

### Development Environment
```
Start Services:
1. npm run dev                    → Main Server (5000)
2. python tensorflow_service.py   → TensorFlow AI (5001)
3. python yolo_poaching_service.py → Poaching (5002)
4. python injury-detection-service.py → Injury (5004)

Database:
5. PostgreSQL service running on 5432
```

### Port Allocation
- **5000**: Main Express Server + React Frontend
- **5001**: TensorFlow Wildlife Identification
- **5002**: YOLOv11 Poaching Detection
- **5004**: YOLOv11 Injury Detection
- **5432**: PostgreSQL Database

---

## File Structure

```
WildRescueGuide/
├── client/                      # Frontend React app
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── pages/              # Route pages
│   │   ├── hooks/              # Custom React hooks
│   │   └── lib/                # Utilities
│   └── index.html
│
├── server/                      # Backend Express app
│   ├── routes.ts               # API endpoints
│   ├── storage.ts              # Database operations
│   ├── db.ts                   # PostgreSQL connection
│   ├── services/               # Business logic
│   │   ├── ai-orchestrator.ts  # AI coordination
│   │   ├── gemini.ts           # Gemini AI integration
│   │   ├── health-assessment.ts
│   │   └── ...
│   └── data/                   # Static data
│
├── ai_models/                   # TensorFlow service
│   ├── tensorflow_service.py
│   └── mobilenet_v2/
│
├── Poaching_Detection/          # YOLOv11 poaching
│   ├── yolo_poaching_service.py
│   └── best.pt (custom model)
│
├── injury-detection-service.py  # YOLOv11 injury
│
├── shared/                      # Shared types
│   └── schema.ts               # Database schema
│
└── .venv/                       # Python virtual env
```

---

## Database Schema (PostgreSQL)

### Key Tables

#### animal_identifications
- Primary storage for all animal detections
- Links to sightings for GPS tracking
- Stores AI confidence scores

#### animal_sightings
- GPS location data (latitude, longitude)
- Links to identified animal (FK)
- Emergency status flags
- Reporter information

#### poaching_alerts
- Threat detection records
- Severity levels
- Detected items/weapons
- Location and timestamp

#### admin_users
- Admin authentication
- Role-based access control

---

## Monitoring & Logging

### Console Logging
- ✅ Service startup confirmations
- 📊 Database save operations
- 🔍 API request tracking
- ⚠️ Error messages with stack traces
- 📍 GPS data capture logs

### Health Monitoring
- All services expose `/health` endpoints
- Port availability checks
- Database connection verification

---

## Future Enhancements

1. **Real-time Notifications**: WebSocket integration
2. **Mobile App**: React Native version
3. **Offline Mode**: Local storage + sync
4. **Advanced Analytics**: ML-powered insights
5. **Multi-language Support**: i18n integration
6. **Cloud Deployment**: AWS/Azure hosting
7. **API Rate Limiting**: Express rate limiter
8. **Advanced Admin**: Role hierarchy, permissions

---

## Dependencies

### Frontend (package.json)
```json
{
  "react": "^18.3.1",
  "react-router-dom": "^6.x",
  "@tanstack/react-query": "^5.x",
  "tailwindcss": "^3.x",
  "framer-motion": "^11.x"
}
```

### Backend (package.json)
```json
{
  "express": "^4.x",
  "drizzle-orm": "^0.x",
  "pg": "^8.x",
  "express-session": "^1.x",
  "multer": "^1.x"
}
```

### Python (requirements.txt)
```
tensorflow==2.20.0
ultralytics
flask
flask-cors
pillow
numpy
pyparsing==3.1.4
```

---

## Performance Metrics

- **TensorFlow Inference**: ~2-5 seconds per image
- **YOLOv11 Detection**: ~1-3 seconds per image
- **Database Query**: <100ms average
- **API Response Time**: <5 seconds (with AI)
- **Concurrent Users**: 50+ (development)

---

## System Requirements

### Development Machine
- **OS**: Windows 10/11, macOS, Linux
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 5GB free space
- **GPU**: Optional (speeds up AI inference)
- **Node.js**: v18+
- **Python**: 3.8+
- **PostgreSQL**: 13+

---

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Solution: Stop processes on ports 5000-5004

2. **TensorFlow Not Loading**
   - Solution: Check pyparsing version (3.1.4 required)

3. **Database Connection Failed**
   - Solution: Verify PostgreSQL running on 5432

4. **GPS Not Working**
   - Solution: Enable location permissions in browser

5. **Admin Login Failed**
   - Solution: Check database for admin_users table

---

## Contact & Support

- **Project**: Wild Guard 4.0
- **Version**: 4.0.0
- **Last Updated**: December 2025
- **License**: MIT

---

**End of System Architecture Document**
