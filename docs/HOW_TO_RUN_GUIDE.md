# 🦁 Wild Guard 4.0 - Complete Setup & Run Guide

## 📋 Table of Contents
1. [System Requirements](#-system-requirements)
2. [Quick Start](#-quick-start)
3. [First-Time Setup](#-first-time-setup)
4. [Running the Application](#-running-the-application)
5. [Accessing Features](#-accessing-features)
6. [Troubleshooting](#-troubleshooting)
7. [Useful Commands](#-useful-commands)

---

## 💻 System Requirements

### **Software Requirements**

#### **Core Runtime**
- **Python**: 3.9 or higher (3.11 recommended)
- **Node.js**: 18+ (LTS version recommended)
- **npm**: 8.0+ (comes with Node.js)
- **PostgreSQL**: 13+ (for database)

#### **Python Dependencies**
```
tensorflow==2.20.0          # Deep learning framework
ultralytics==8.0.196        # YOLOv11 for poaching detection
torch>=2.0.0                # PyTorch
Pillow==10.1.0              # Image processing
opencv-python==4.8.1.78     # Computer vision
flask==3.0.0                # Web server
numpy==1.24.3               # Array computations
psycopg2-binary==2.9.9      # PostgreSQL adapter
sqlalchemy==2.0.23          # Database ORM
```

#### **Node.js Dependencies**
- **React**: 18.3+ (Frontend)
- **Vite**: Build tool
- **Express**: 4.21+ (Backend server)
- **TypeScript**: Type safety
- **TensorFlow.js Node**: For browser ML
- **Drizzle ORM**: Database operations

#### **Optional Tools**
- **Docker**: For containerized deployment
- **Docker Compose**: Multi-container orchestration
- **PowerShell**: (Windows) for automation scripts

---

### **Hardware Requirements**

#### **Minimum Requirements**
- **CPU**: Intel Core i5 (6th gen) / AMD Ryzen 5 or equivalent
  - 4 cores, 8 threads minimum
- **RAM**: 8 GB DDR4
  - Python TensorFlow: ~2-3 GB
  - Node.js server: ~500 MB - 1 GB
  - PostgreSQL: ~200-500 MB
  - OS + Browser: ~2-3 GB
- **Storage**: 
  - 10 GB free space (SSD recommended)
  - Models: ~500 MB - 2 GB
  - Database: 1-5 GB (grows with data)
- **GPU**: Not required (CPU inference works)
- **Internet**: Required for API calls (Gemini, DeepSeek, TensorFlow Hub)

#### **Recommended Requirements** (Better Performance)
- **CPU**: Intel Core i7 (8th gen+) / AMD Ryzen 7 or better
  - 6-8 cores, 12-16 threads
- **RAM**: 16 GB DDR4
  - Smoother multi-service operation
  - Better for concurrent AI processing
- **Storage**: 
  - 20 GB+ SSD (NVMe preferred)
  - Faster model loading and database operations
- **GPU**: 
  - **NVIDIA GPU** with 4+ GB VRAM (e.g., GTX 1650, RTX 3060)
  - CUDA 11.8+ support
  - 10-50x faster inference than CPU
  - Required for training custom models
- **Internet**: High-speed (10+ Mbps) for API services

#### **Professional/Production Setup**
- **CPU**: Intel Xeon / AMD EPYC / Threadripper
  - 16+ cores for heavy concurrent load
- **RAM**: 32-64 GB
- **GPU**: NVIDIA RTX 4090, A100, or Tesla T4
  - Essential for custom model training
  - Batch processing multiple images
- **Storage**: 100+ GB NVMe SSD + separate data drives
- **Network**: Dedicated server with static IP

---

### **Operating System**

#### **Supported OS**
- ✅ **Windows 10/11** (Recommended for your setup)
  - PowerShell 5.1+ (for automation scripts)
  - Windows Terminal recommended
  
- ✅ **Linux** (Ubuntu 20.04+, Debian, CentOS)
  - Better Docker performance
  - Lower overhead
  
- ✅ **macOS** (10.15+)
  - ARM (M1/M2) requires Rosetta for some packages

---

### **Resource Usage (Typical)**

#### **When All Services Running**
- **CPU**: 15-40% (without GPU)
- **RAM**: 6-10 GB total
- **Disk I/O**: Moderate (model loading, DB operations)
- **Network**: Intermittent (API calls)

#### **During Image Processing**
- **CPU**: 60-90% for 2-5 seconds per image (no GPU)
- **GPU**: 20-40% utilization (if available)
- **RAM**: Spike of +500 MB per concurrent request

---

## ⚡ Quick Start

### **Option 1: One-Click Startup** ⭐ RECOMMENDED

```powershell
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"
.\START_ALL_SERVICES.ps1
```

**This automatically:**
1. ✅ Stops any existing services
2. ✅ Starts Main Server (Node.js + React) on port 5000
3. ✅ Starts Injury Detection Service (Flask/YOLO) on port 5004
4. ✅ Verifies all services are running
5. ✅ Opens browser to http://localhost:5000

---

## 📋 First-Time Setup

### **Step 1: Check Prerequisites**

Verify installed software:

```powershell
# Check Python (need 3.9+)
python --version

# Check Node.js (need 18+)
node --version

# Check PostgreSQL (need 13+)
psql --version

# Check npm
npm --version
```

**If missing, download:**
- **Python**: https://www.python.org/downloads/
- **Node.js**: https://nodejs.org/
- **PostgreSQL**: https://www.postgresql.org/download/

---

### **Step 2: Set Up Python Virtual Environment**

```powershell
# Navigate to project directory
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"

# Create virtual environment (if not exists)
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
pip list
```

---

### **Step 3: Install Node.js Dependencies**

```powershell
# Make sure you're in the project root
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"

# Install all packages
npm install

# Verify installation
npm list --depth=0
```

---

### **Step 4: Set Up PostgreSQL Database**

#### **Option A: Quick Setup (PostgreSQL Running)**

```powershell
# Push database schema
npm run db:push
```

#### **Option B: Manual Database Setup**

```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql, create database
CREATE DATABASE wild_guard_db;

# Grant permissions (if needed)
GRANT ALL PRIVILEGES ON DATABASE wild_guard_db TO postgres;

# Exit psql
\q

# Push schema to database
npm run db:push
```

**Current Database Credentials:**
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `wild_guard_db`
- **User**: `postgres`
- **Password**: `pokemon1234`

---

### **Step 5: Configure Environment Variables**

Create a `.env` file from the example:

```powershell
# Copy the example file
copy .env.example .env

# Edit .env file with your preferred editor
notepad .env
# OR
code .env
```

**Minimum required configuration in `.env`:**

```env
# ============================================
# Database Configuration
# ============================================
DATABASE_URL=postgresql://postgres:pokemon1234@localhost:5432/wild_guard_db

PGHOST=localhost
PGUSER=postgres
PGPASSWORD=pokemon1234
PGDATABASE=wild_guard_db
PGPORT=5432

# ============================================
# API Keys (REQUIRED)
# ============================================

# Google Gemini API - For AI identification
GOOGLE_API_KEY=your-gemini-api-key-here

# DeepSeek API - For additional AI features
DEEPSEEK_API_KEY=your-deepseek-key-here

# ============================================
# Session Configuration
# ============================================
SESSION_SECRET=your-random-secret-key-here-change-this

# ============================================
# Optional API Keys
# ============================================

# OpenAI API (optional)
OPENAI_API_KEY=your-openai-key-here

# LocationIQ API (for maps)
LOCATIONIQ_API_KEY=your-locationiq-key-here

# NASA FIRMS API (for fire detection)
FIRMS_API_KEY=your-firms-api-key-here
```

**Get Free API Keys:**
- **Gemini API**: https://aistudio.google.com/app/apikey (Free tier available)
- **DeepSeek API**: https://platform.deepseek.com/api_keys
- **OpenAI**: https://platform.openai.com/api-keys (Optional)

---

### **Step 6: Populate Database (Optional)**

Populate the database with default wildlife data:

```powershell
# Make sure virtual environment is activated
.\.venv\Scripts\Activate.ps1

# Populate with all animals
python populate_all_animals.py

# Or populate with 90 animals dataset
python populate_all_90_animals.py
```

---

## 🎮 Running the Application

### **Method 1: Automated Startup** ⭐ RECOMMENDED

This is the easiest way to start all services:

```powershell
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"
.\START_ALL_SERVICES.ps1
```

**What this does:**
- Opens 2 terminal windows automatically
- **Window 1**: Main Server (Port 5000) - Frontend + Backend
- **Window 2**: Injury Detection (Port 5004) - YOLO AI Service
- Verifies services are healthy
- Opens browser automatically

---

### **Method 2: Manual Start (More Control)**

Open separate terminal windows for each service:

#### **Terminal 1 - Main Application Server**
```powershell
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"
npm run dev
```

This starts:
- React frontend (Vite dev server)
- Express backend API
- Serves at http://localhost:5000

#### **Terminal 2 - Injury Detection Service**
```powershell
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"
.\.venv\Scripts\Activate.ps1
python injury-detection-service.py
```

This starts:
- Flask server with YOLO model
- Injury detection AI service
- Runs on http://localhost:5004

#### **Terminal 3 - TensorFlow Service** (Optional)
```powershell
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide\ai_models"
.\.venv\Scripts\Activate.ps1
python tensorflow_service.py
```

This starts:
- TensorFlow/MobileNetV2 model
- Animal identification service
- Runs on http://localhost:5001
- **Note**: Currently using cloud AI (Gemini), so this is optional

#### **Terminal 4 - Poaching Detection** (Optional)
```powershell
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide\Poaching_Detection"
.\.venv\Scripts\Activate.ps1
python yolo_poaching_service.py
```

This starts:
- YOLOv11 weapon detection
- Poaching detection service
- Runs on http://localhost:5002

---

## 🌐 Accessing Features

Once all services are running, access these URLs:

### **Main Application Pages**
- 🏠 **Home Page**: http://localhost:5000
- 🏠 **Landing**: http://localhost:5000/home
- 🔍 **Identify Animal**: http://localhost:5000/identify
- 🏥 **Health Assessment**: http://localhost:5000/features/health-assessment
- 🚨 **Poaching Detection**: http://localhost:5000/features/poaching-detection
- 🌱 **Flora Identification**: http://localhost:5000/features/flora-identification
- 👥 **Community**: http://localhost:5000/community
- 📚 **Discover Wildlife**: http://localhost:5000/discover
- 📍 **Wildlife Map**: http://localhost:5000/map
- 🏛️ **Wildlife Centers**: http://localhost:5000/wildlife-centers
- 🤝 **Volunteer**: http://localhost:5000/volunteer

### **Admin Panel**
- 🔐 **Admin Login**: http://localhost:5000/admin/login
- 📊 **Admin Dashboard**: http://localhost:5000/admin/dashboard
- 🐾 **Animal Detections**: http://localhost:5000/admin/animal-detections
- 🚨 **Poaching Alerts**: http://localhost:5000/admin/poaching-alerts
- 👥 **User Management**: http://localhost:5000/admin/users
- 🏢 **NGO Management**: http://localhost:5000/admin/ngos

### **API Health Checks**
- Main Server: http://localhost:5000/api/health
- Injury Detection: http://localhost:5004/health
- TensorFlow Service: http://localhost:5001/health (if running)
- Poaching Detection: http://localhost:5002/health (if running)

---

## 🔍 Verify Services

### **Check Service Health**

```powershell
# Check Main Server
curl http://localhost:5000

# Check Injury Detection Service
curl http://localhost:5004/health

# Check TensorFlow Service (if running)
curl http://localhost:5001/health

# Check Poaching Detection (if running)
curl http://localhost:5002/health
```

### **Check Which Ports Are Active**

```powershell
# Check all services
netstat -ano | findstr ":5000 :5001 :5002 :5004 :5432"

# Individual port checks
netstat -ano | findstr :5000  # Main Server
netstat -ano | findstr :5004  # Injury Detection
netstat -ano | findstr :5001  # TensorFlow (optional)
netstat -ano | findstr :5002  # Poaching (optional)
netstat -ano | findstr :5432  # PostgreSQL
```

### **Test Database Connection**

```powershell
# Connect to database
psql -U postgres -d wild_guard_db

# Check tables
\dt

# Check supported animals
SELECT COUNT(*) FROM supported_animals;

# Exit
\q
```

---

## 🛠️ Useful Commands

### **Database Operations**

```powershell
# Push schema changes to database
npm run db:push

# Connect to database
psql -U postgres -d wild_guard_db

# Backup database
pg_dump -U postgres wild_guard_db > backup.sql

# Restore database
psql -U postgres wild_guard_db < backup.sql

# Populate with wildlife data
python populate_all_animals.py
python populate_all_90_animals.py
python populate_custom_animals_db.py
```

### **Development Commands**

```powershell
# Run in development mode (hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Type checking
npm run check

# Start TensorFlow service
npm run tensorflow
```

### **Python Environment Management**

```powershell
# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Deactivate virtual environment
deactivate

# Install new package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt

# Install all requirements
pip install -r requirements.txt

# Upgrade all packages
pip list --outdated
pip install --upgrade package-name
```

### **Testing Commands**

```powershell
# Test complete system
python test-complete-system.py

# Test specific components
python test_apis.py
python test_mobilenet.py
python test_single_image.py
node test-gemini.js
node test-deepseek.js

# Test database connection
node test-postgres.ts

# Test health assessment
.\test_health_assessment.ps1
```

---

## 🐛 Troubleshooting

### **Problem: Port Already in Use**

```powershell
# Find which process is using port 5000
netstat -ano | findstr :5000

# The last column shows the PID, kill it
taskkill /PID <PID> /F

# Example: taskkill /PID 1234 /F

# Or stop all Node.js processes
Get-Process -Name node | Stop-Process -Force

# Or stop all Python processes
Get-Process -Name python | Stop-Process -Force
```

---

### **Problem: Python Service Won't Start**

```powershell
# Make sure virtual environment is activated
.\.venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check if all packages are installed
pip list

# Check Python version
python --version

# If TensorFlow fails, install specific version
pip install tensorflow==2.20.0
```

---

### **Problem: Database Connection Error**

```powershell
# Check if PostgreSQL service is running
Get-Service postgresql*

# Start PostgreSQL if stopped
net start postgresql-x64-13

# Or start via services
services.msc

# Test connection manually
psql -U postgres -d wild_guard_db

# Check DATABASE_URL in .env file
notepad .env

# Verify credentials
# DATABASE_URL=postgresql://postgres:pokemon1234@localhost:5432/wild_guard_db
```

---

### **Problem: Module Not Found**

**For Node.js:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Clear npm cache
npm cache clean --force
npm install
```

**For Python:**
```powershell
# Activate virtual environment first
.\.venv\Scripts\Activate.ps1

# Reinstall packages
pip install -r requirements.txt

# Or install specific missing module
pip install module-name
```

---

### **Problem: API Key Errors**

```powershell
# Edit .env file
notepad .env

# Make sure these are set:
# GOOGLE_API_KEY=your-actual-key
# DEEPSEEK_API_KEY=your-actual-key

# Test Gemini API
node test-gemini.js

# Test DeepSeek API
node test-deepseek.js
```

---

### **Problem: YOLO Model Not Loading**

```powershell
# Navigate to Poaching_Detection or root
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"

# Check if model files exist
dir yolo*.pt
dir Poaching_Detection\*.pt

# If missing, model will be auto-downloaded on first run
# Or manually download from Ultralytics

# Reinstall ultralytics
pip install ultralytics==8.0.196
```

---

### **Problem: Permission Denied (PowerShell Scripts)**

```powershell
# Run PowerShell as Administrator

# Set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or bypass for single script
powershell -ExecutionPolicy Bypass -File .\START_ALL_SERVICES.ps1
```

---

### **Problem: npm Install Fails**

```powershell
# Clear npm cache
npm cache clean --force

# Delete package-lock.json
Remove-Item package-lock.json

# Reinstall
npm install

# If still fails, use legacy peer deps
npm install --legacy-peer-deps
```

---

### **Problem: Frontend Not Loading**

```powershell
# Check if port 5000 is free
netstat -ano | findstr :5000

# Clear Vite cache
Remove-Item -Recurse -Force node_modules/.vite

# Rebuild
npm run build
npm run dev

# Check browser console for errors (F12)
```

---

### **Problem: High CPU/Memory Usage**

```powershell
# Check running processes
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# Check specific processes
Get-Process python
Get-Process node

# Restart services if needed
.\START_ALL_SERVICES.ps1

# Consider closing unused services (e.g., TensorFlow if using cloud AI)
```

---

## 🔄 Stopping the Application

### **Method 1: Close Terminal Windows**
Simply close the terminal windows that were opened by `START_ALL_SERVICES.ps1`

### **Method 2: Keyboard Interrupt**
Press `Ctrl+C` in each terminal window running a service

### **Method 3: Force Stop All Processes**

```powershell
# Stop all Node.js processes
Get-Process -Name node | Stop-Process -Force

# Stop all Python processes
Get-Process -Name python | Stop-Process -Force

# Stop specific ports
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 📊 Service Ports Reference

| Service | Port | Status | Description |
|---------|------|--------|-------------|
| **Main App** | 5000 | 🟢 Required | React Frontend + Express Backend |
| **Injury Detection** | 5004 | 🟢 Required | YOLO-based injury detection |
| **TensorFlow AI** | 5001 | 🟡 Optional | Animal identification (cloud AI used instead) |
| **Poaching Detection** | 5002 | 🟡 Optional | YOLO weapon/threat detection |
| **PostgreSQL** | 5432 | 🟢 Required | Database server |

---

## ✅ Pre-Flight Checklist

Before starting the application, ensure:

- [x] **Python 3.9+** installed and accessible
- [x] **Node.js 18+** installed and accessible
- [x] **PostgreSQL 13+** installed and running
- [x] **Virtual environment** created (`.venv` folder exists)
- [x] **Python packages** installed (`pip install -r requirements.txt`)
- [x] **Node packages** installed (`npm install`)
- [x] **`.env` file** created and configured with API keys
- [x] **Database** created (`wild_guard_db`)
- [x] **Database schema** pushed (`npm run db:push`)
- [x] **Port 5000** is available (not in use)
- [x] **Port 5004** is available (not in use)
- [x] **Port 5432** is available (PostgreSQL running)

---

## 🎯 Recommended Daily Workflow

### **Starting Work Session**

```powershell
# 1. Navigate to project
cd "D:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"

# 2. Pull latest changes (if using git)
git pull

# 3. Update dependencies (if needed)
npm install
pip install -r requirements.txt

# 4. Start all services
.\START_ALL_SERVICES.ps1

# 5. Open browser to http://localhost:5000
```

### **Ending Work Session**

```powershell
# 1. Stop services (Ctrl+C in terminals or close windows)

# 2. Commit changes (if using git)
git add .
git commit -m "Your commit message"
git push

# 3. Close all terminal windows
```

---

## 📞 Support & Resources

### **Documentation**
- [Complete Setup Guide](docs/COMPLETE_SETUP_GUIDE.md)
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md)
- [API Documentation](docs/api/)
- [Deployment Guide](docs/deployment/DEPLOYMENT_GUIDE.md)

### **Common Issues**
- [Test Results](docs/TEST_RESULTS_SUMMARY.md)
- [System Status](docs/SYSTEM_STATUS.md)

### **External Resources**
- **Python**: https://www.python.org/
- **Node.js**: https://nodejs.org/
- **PostgreSQL**: https://www.postgresql.org/
- **TensorFlow**: https://www.tensorflow.org/
- **YOLOv11**: https://github.com/ultralytics/ultralytics

---

## 🎉 Quick System Health Check

Run this command to check your system compatibility:

```powershell
# Create a quick health check script
@"
Write-Host "=== Wild Guard System Check ===" -ForegroundColor Cyan
Write-Host ""

# Check Python
Write-Host "Checking Python..." -ForegroundColor Yellow
python --version

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
node --version

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
npm --version

# Check PostgreSQL
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
psql --version

# Check RAM
Write-Host "Checking RAM..." -ForegroundColor Yellow
Get-WmiObject Win32_ComputerSystem | Select-Object @{Name="RAM (GB)";Expression={[math]::Round(`$_.TotalPhysicalMemory/1GB,2)}}

# Check CPU
Write-Host "Checking CPU..." -ForegroundColor Yellow
Get-WmiObject Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors

# Check Disk Space
Write-Host "Checking Disk Space..." -ForegroundColor Yellow
Get-PSDrive C | Select-Object @{Name="Free (GB)";Expression={[math]::Round(`$_.Free/1GB,2)}}

Write-Host ""
Write-Host "=== Check Complete ===" -ForegroundColor Green
"@ | Out-File -FilePath .\system-check.ps1

# Run it
.\system-check.ps1
```

---

## 🚀 You're Ready!

Your Wild Guard 4.0 application is now set up and ready to run. Simply execute:

```powershell
.\START_ALL_SERVICES.ps1
```

And access the application at **http://localhost:5000**

Happy Wildlife Conservation! 🦁🐘🐅
