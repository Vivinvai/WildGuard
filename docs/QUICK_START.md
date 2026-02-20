# 🚀 Wild Guard - Quick Start Guide

## How to Start All Services at Once

### Option 1: Double-Click START.bat (EASIEST!)
1. Navigate to `d:\Wild-Guard 5.0\WildRescueGuide\`
2. **Double-click `START.bat`**
3. Wait 30 seconds for all services to start
4. Open browser: **http://localhost:5001**

### Option 2: PowerShell Script
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
.\START_SERVICES.ps1
```

### Option 3: Manual Start (For Development)
Open 4 PowerShell terminals:

**Terminal 1 - TensorFlow AI (Port 5004):**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\ai_models"
python tensorflow_service_simple.py
```

**Terminal 2 - Poaching Detection (Port 5003):**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection"
python yolo_poaching_service.py
```

**Terminal 3 - Health Assessment (Port 5005):**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
python injury-detection-service.py
```

**Terminal 4 - Backend + Frontend (Port 5001):**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run dev
```

---

## Services Overview

| Service | Port | URL |
|---------|------|-----|
| **Backend + Frontend** | 5001 | http://localhost:5001 |
| **Poaching Detection** | 5003 | http://localhost:5003/health |
| **TensorFlow AI** | 5004 | http://localhost:5004/health |
| **Health Assessment** | 5005 | http://localhost:5005/health |

---

## How to Stop All Services

### Option 1: PowerShell Command
```powershell
Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Option 2: Task Manager
1. Press `Ctrl + Shift + Esc`
2. Find all `node.exe` and `python.exe` processes
3. Right-click → End Task

---

## Troubleshooting

### Services won't start?
**Check if ports are already in use:**
```powershell
netstat -ano | findstr "5001 5003 5004 5005"
```

**Kill processes on specific ports:**
```powershell
# Kill port 5001
Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Get-Process | Stop-Process -Force

# Kill port 5004
Get-NetTCPConnection -LocalPort 5004 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Get-Process | Stop-Process -Force
```

### Backend can't connect to TensorFlow?
Check `.env` file has correct configuration:
```bash
TENSORFLOW_SERVICE_URL=http://localhost:5004
```

### Python services crash?
Make sure dependencies are installed:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
pip install -r requirements.txt
```

---

## First Time Setup

### 1. Install Dependencies
```powershell
# Install Node packages
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm install

# Install Python packages
pip install -r requirements.txt
```

### 2. Setup Database
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run db:push
```

### 3. Start Services
```powershell
.\START_SERVICES.ps1
```

---

## Daily Usage

### Start Everything:
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
.\START_SERVICES.ps1
```

### Or just double-click:
```
START.bat
```

### Stop Everything:
```powershell
Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## What Each Service Does

### 🖥️ Backend + Frontend (Port 5001)
- Main web application
- User interface
- Database connections
- API endpoints

### 🤖 TensorFlow AI (Port 5004)
- Animal identification using MobileNetV2
- Indian wildlife species mapping
- Image analysis with 1000+ ImageNet classes

### 🔫 Poaching Detection (Port 5003)
- YOLOv11 weapon detection
- 24+ weapon types recognition
- Real-time threat analysis

### 🏥 Health Assessment (Port 5005)
- YOLOv11 injury detection
- Gemini AI health analysis
- Wildlife condition assessment

---

## Access the Application

Once all services are running:

**Main Application:** http://localhost:5001

**Features Available:**
- 🐾 Identify Animal
- 🌿 Identify Plants
- 🔫 Detect Poaching Threats
- 🏥 Animal Health Assessment
- 📊 Admin Dashboard
- 📍 Report Sightings

---

## Environment Variables (.env)

Key configuration in `.env` file:
```bash
DATABASE_URL=postgresql://postgres:pokemon1234@localhost:5432/wild_guard_db
TENSORFLOW_SERVICE_URL=http://localhost:5004
SESSION_SECRET=your_secret_here

# AI API Keys (optional - for enhanced features)
GEMINI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

---

## Support

If you encounter issues:
1. Check all 4 services are running (ports 5001, 5003, 5004, 5005)
2. Verify `.env` has correct `TENSORFLOW_SERVICE_URL=http://localhost:5004`
3. Restart all services using `START_SERVICES.ps1`
4. Check logs in each PowerShell terminal window

---

**Quick Start Summary:**
1. Double-click `START.bat` OR run `.\START_SERVICES.ps1`
2. Wait 30 seconds
3. Open http://localhost:5001
4. Start using Wild Guard! 🎉
