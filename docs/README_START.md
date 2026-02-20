# 🦁 Wild Guard - Wildlife Protection Platform

## 🚀 HOW TO RUN - 3 Simple Steps

### 1️⃣ Open PowerShell
Press `Windows Key + X` → Click "PowerShell"

### 2️⃣ Copy & Paste This Command
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"; Get-Process node,python -ErrorAction SilentlyContinue | Stop-Process -Force; Start-Sleep -Seconds 3; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide\ai_models'; python tensorflow_service_simple.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection'; python yolo_poaching_service.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide'; python injury-detection-service.py"; Start-Sleep -Seconds 8; Start-Process powershell -ArgumentList "-NoExit","-Command","cd 'd:\Wild-Guard 5.0\WildRescueGuide'; npm run dev"; Start-Sleep -Seconds 15; Write-Host "`n✅ ALL SERVICES STARTED!" -ForegroundColor Green
```

### 3️⃣ Open Browser
Wait 60 seconds, then go to: **http://localhost:5001**

---

## 🎯 EVEN EASIER - Double-Click!

Just double-click: **`START.bat`**

---

## 🛑 How to Stop

```powershell
Get-Process node,python | Stop-Process -Force
```

---

## 📚 Need More Help?

Read **`HOW_TO_RUN.md`** for:
- Step-by-step instructions
- Troubleshooting guide
- Service details
- Manual startup commands

---

## 🌟 Features

- 🐾 **Animal Identification** - Identify 90+ Indian wildlife species
- 🔫 **Poaching Detection** - Detect 24+ weapon types
- 🏥 **Health Assessment** - Check animal injuries
- 📍 **Report Sightings** - Track wildlife locations
- 📊 **Admin Dashboard** - Manage alerts and reports

---

## ⚙️ Services

| Service | Port | Purpose |
|---------|------|---------|
| Backend | 5001 | Main application |
| Poaching | 5003 | Weapon detection |
| TensorFlow | 5004 | Animal AI |
| Health | 5005 | Injury detection |

All services must be running to use the application.

---

**Current Status:** ✅ ALL SERVICES RUNNING!
**Access:** http://localhost:5001
