# 📁 Wild Guard 5.0 - Project Structure

**Last Updated:** February 8, 2026

---

## 🗂️ Root Directory Structure

```
WildRescueGuide/
├── 📁 Root Level
│   ├── START.ps1                    # Main startup script (calls startup_scripts/)
│   ├── README.md                    # Project overview and documentation
│   ├── package.json                 # Node.js dependencies
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment variables
│   ├── docker-compose.yml           # Docker configuration
│   └── injury-detection-service.py  # Health assessment service (Port 5005)
│
├── 📁 startup_scripts/              # All startup and service scripts
│   ├── START_ALL_SERVICES.ps1       # Complete service startup
│   ├── START_WILDGUARD.ps1          # Alternative startup
│   ├── start-tensorflow.ps1         # TensorFlow only
│   ├── start-injury-detection.ps1   # Health service only
│   └── ...more startup scripts
│
├── 📁 test_files/                   # All test scripts and files
│   ├── test-complete-system.py      # Full system test
│   ├── test_apis.py                 # API tests
│   ├── test_gemini_direct.py        # Gemini AI tests
│   ├── test-deepseek.js             # DeepSeek tests
│   └── ...more test files
│
├── 📁 database_scripts/             # Database population and migration
│   ├── populate_all_90_animals.py   # Indian wildlife database
│   ├── add_wildlife_db.py           # Add new species
│   ├── apply_migration.py           # Database migrations
│   └── list_gemini_models.py        # Gemini model info
│
├── 📁 assets/                       # Image assets and screenshots
│   ├── after-load.png
│   ├── slideshow-element.png
│   └── ...UI screenshots
│
├── 📁 docs/                         # All documentation
│   ├── Full Guide.md                # Complete technical guide
│   ├── HOW_TO_RUN.md                # Setup instructions
│   ├── QUICK_START.md               # Quick reference
│   ├── INDIAN_WILDLIFE_DATABASE.md  # Database documentation
│   └── ...more documentation
│
├── 📁 client/                       # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── pages/                   # All page components
│   │   ├── components/              # Reusable components
│   │   └── hooks/                   # Custom React hooks
│   ├── public/                      # Static assets
│   └── index.html
│
├── 📁 server/                       # Backend (Node.js + Express)
│   ├── routes.ts                    # API routes
│   ├── services/                    # Business logic
│   │   ├── ai-orchestrator.ts
│   │   ├── health-assessment.ts
│   │   └── injury-detection.ts
│   └── db/                          # Database configuration
│
├── 📁 ai_models/                    # TensorFlow AI Service (Port 5004)
│   ├── tensorflow_service_simple.py # Main TensorFlow service
│   ├── download_mobilenet.py        # Model downloader
│   └── trained_models/              # Custom models
│
├── 📁 Poaching_Detection/           # YOLO Service (Port 5003)
│   ├── yolo_poaching_service.py     # Weapon/threat detection
│   ├── yolo11n.pt                   # YOLO model
│   └── dataset/                     # Training data
│
├── 📁 migrations/                   # Database migrations
│   ├── 0000_exotic_cloak.sql
│   └── init.sql
│
├── 📁 scripts/                      # Utility scripts
│   └── ...deployment scripts
│
├── 📁 datasets/                     # Training datasets
│   └── animal_dataset_90/
│
├── 📁 Injured Animals/              # Health assessment data
│   └── Animal Injury/
│
└── 📁 attached_assets/              # Project assets
    └── stock_images/
```

---

## 🚀 Service Ports

| Service | Port | Location |
|---------|------|----------|
| **Backend + Frontend** | 5001 | `server/` + `client/` |
| **YOLO Poaching** | 5003 | `Poaching_Detection/` |
| **TensorFlow AI** | 5004 | `ai_models/` |
| **Health Assessment** | 5005 | `injury-detection-service.py` (root) |

---

## 📝 Key Files and Their Purpose

### Root Level
- `START.ps1` - Main entry point to start all services
- `injury-detection-service.py` - Gemini AI + YOLO health assessment
- `.env` - Environment variables (API keys, database URLs)
- `package.json` - Node.js dependencies and scripts
- `requirements.txt` - Python dependencies

### Configuration Files
- `drizzle.config.ts` - Database ORM configuration
- `vite.config.ts` - Frontend build configuration
- `tailwind.config.ts` - UI styling configuration
- `tsconfig.json` - TypeScript configuration

### Docker Files
- `docker-compose.yml` - Multi-container orchestration
- `Dockerfile` - Production container
- `Dockerfile.simple` - Development container

---

## 🔄 Workflow

### Starting the Application
1. Run `START.ps1` in root
2. Script calls `startup_scripts/START_ALL_SERVICES.ps1`
3. Services start in order:
   - TensorFlow AI (5004)
   - YOLO Poaching (5003)
   - Health Assessment (5005)
   - Backend + Frontend (5001)
4. Open http://localhost:5001

### Testing
- All tests located in `test_files/`
- Run individual tests or `test-complete-system.py`

### Database Management
- Scripts in `database_scripts/`
- Migrations in `migrations/`
- Use `populate_all_90_animals.py` for Indian wildlife

### Documentation
- All `.md` files in `docs/`
- Start with `docs/Full Guide.md` for complete overview

---

## 📦 Dependencies

### Python (requirements.txt)
- TensorFlow 2.18+
- Flask
- Pillow
- google-generativeai (Gemini)
- ultralytics (YOLO)

### Node.js (package.json)
- React 18.3
- Express
- Drizzle ORM
- PostgreSQL driver

---

## 🎯 Quick Commands

```powershell
# Start all services
.\START.ps1

# Start specific service
.\startup_scripts\start-tensorflow.ps1

# Run tests
python .\test_files\test-complete-system.py

# Populate database
python .\database_scripts\populate_all_90_animals.py

# Build frontend
npm run build

# Development mode
npm run dev
```

---

## 📖 Documentation Index

- **Full Guide**: `docs/Full Guide.md` - Complete technical documentation
- **Quick Start**: `docs/QUICK_START.md` - Get started quickly
- **How to Run**: `docs/HOW_TO_RUN.md` - Detailed setup instructions
- **Database**: `docs/INDIAN_WILDLIFE_DATABASE.md` - Wildlife database info
- **API**: `docs/api/` - API documentation

---

## 🛠️ Development

### Adding New Features
1. Frontend: `client/src/pages/` or `client/src/components/`
2. Backend: `server/routes.ts` or `server/services/`
3. AI Services: Update respective folders (`ai_models/`, `Poaching_Detection/`)

### Folder Organization Rules
- **Startup scripts** → `startup_scripts/`
- **Test files** → `test_files/`
- **Database scripts** → `database_scripts/`
- **Documentation** → `docs/`
- **Assets/Images** → `assets/`

---

## 📊 Statistics

- **Total Services**: 4 (TensorFlow, YOLO, Health, Backend)
- **Supported Species**: 90+ Indian wildlife
- **Detection Classes**: 72 (YOLO poaching)
- **Health Conditions**: 80+ (YOLO COCO)
- **Frontend Pages**: 25+
- **API Endpoints**: 50+

---

**For detailed information, see:** `docs/Full Guide.md`
