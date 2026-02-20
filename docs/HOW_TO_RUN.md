# 🚀 WILD GUARD - HOW TO RUN

## ⚡ FASTEST WAY - Copy & Paste This Command

Open PowerShell and run:

```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"; Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep -Seconds 3; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide\ai_models'; python tensorflow_service_simple.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection'; python yolo_poaching_service.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide'; python injury-detection-service.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide'; npm run dev"; Start-Sleep -Seconds 15; Write-Host "`n✅ ALL SERVICES STARTED! Open: http://localhost:5001" -ForegroundColor Green
```

Wait 60 seconds, then open: **http://localhost:5001**

---

## 📝 STEP-BY-STEP GUIDE

### Step 1: Open PowerShell
- Press `Windows Key + X`
- Click "Windows PowerShell" or "Terminal"

### Step 2: Navigate to Project
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
```

### Step 3: Stop Old Services (if any)
```powershell
Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Step 4: Start Service 1 - TensorFlow AI
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\ai_models"
python tensorflow_service_simple.py
```
✅ You should see: "TensorFlow service running on port 5004"

**Open a NEW PowerShell window for next step** (don't close this one)

### Step 5: Start Service 2 - Poaching Detection
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection"
python yolo_poaching_service.py
```
✅ You should see: "YOLO Poaching service running on port 5003"

**Open a NEW PowerShell window for next step**

### Step 6: Start Service 3 - Health Assessment
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
python injury-detection-service.py
```
✅ You should see: "Health Assessment service running on port 5005"

**Open a NEW PowerShell window for next step**

### Step 7: Start Service 4 - Backend + Frontend
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run dev
```
✅ You should see: "serving on port 5001"

### Step 8: Open Browser
Go to: **http://localhost:5001**

---

## 🎯 AUTOMATIC STARTUP (Recommended)

### Option A: Use START.bat
1. Navigate to: `d:\Wild-Guard 5.0\WildRescueGuide\`
2. **Double-click `START.bat`**
3. Wait 60 seconds
4. Open: http://localhost:5001

### Option B: Use PowerShell Script
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
.\START_SERVICES.ps1
```

---

## ✅ HOW TO CHECK IF EVERYTHING IS RUNNING

Run this command:
```powershell
Write-Host "`nService Status:" -ForegroundColor Cyan; @{5001='Backend';5003='Poaching';5004='TensorFlow';5005='Health'}.GetEnumerator() | Sort-Object Key | ForEach-Object { try { Invoke-RestMethod "http://localhost:$($_.Key)/health" -TimeoutSec 3 | Out-Null; Write-Host "  ✅ $($_.Value)" -ForegroundColor Green } catch { Write-Host "  ❌ $($_.Value)" -ForegroundColor Red } }
```

You should see:
```
✅ Backend
✅ Poaching
✅ TensorFlow  
✅ Health
```

---

## 🛑 HOW TO STOP EVERYTHING

```powershell
Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## 🔧 TROUBLESHOOTING

### Problem: "Port already in use"
**Solution:**
```powershell
Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Problem: "Module not found"
**Solution - Install Python packages:**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
pip install -r requirements.txt
```

**Solution - Install Node packages:**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm install
```

### Problem: Backend can't connect to TensorFlow
**Solution - Check .env file:**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
notepad .env
```
Make sure it says:
```
TENSORFLOW_SERVICE_URL=http://localhost:5004
```

### Problem: Database error
**Solution:**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run db:push
```

---

## 📋 WHAT EACH SERVICE DOES

| Service | Port | What It Does |
|---------|------|--------------|
| **Backend** | 5001 | Main website & API |
| **Poaching** | 5003 | Detects weapons using YOLO AI |
| **TensorFlow** | 5004 | Identifies animals using MobileNetV2 |
| **Health** | 5005 | Checks animal health/injuries |

---

## 🎯 QUICK REFERENCE

### Daily Usage

**Start Everything:**
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
.\START_SERVICES.ps1
```

**Stop Everything:**
```powershell
Get-Process node,python | Stop-Process -Force
```

**Check Status:**
```powershell
netstat -ano | findstr "5001 5003 5004 5005"
```

### Access Application
**Main App:** http://localhost:5001

---

## 📞 NEED HELP?

1. Make sure Python is installed: `python --version`
2. Make sure Node.js is installed: `node --version`
3. Make sure PostgreSQL is running
4. Check all 4 services are running on ports: 5001, 5003, 5004, 5005

---

## ✨ SUMMARY

**To start everything:**
1. Double-click `START.bat` 
   OR
2. Run `.\START_SERVICES.ps1` in PowerShell
3. Wait 60 seconds
4. Open http://localhost:5001

**To stop everything:**
```powershell
Get-Process node,python | Stop-Process -Force
```

That's it! 🎉
