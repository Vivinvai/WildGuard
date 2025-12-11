# 🦁 WildGuard 4.0 - Wildlife Conservation Platform

> **AI-Powered Wildlife Identification, GPS Tracking, Poaching Detection & Injury Assessment System**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/YOUR_USERNAME/WildGuard)
[![Python](https://img.shields.io/badge/Python-3.9+-blue)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🌟 Features

✨ **Wildlife Identification** - TensorFlow AI (1000+ species, ImageNet)  
📍 **GPS Tracking** - Real-time location capture with visual status  
🚨 **Poaching Detection** - YOLOv11 (72 classes: weapons, vehicles, humans)  
🏥 **Injury Assessment** - YOLO COCO (80 classes for health monitoring)  
👨‍💼 **Admin Dashboard** - Complete management system  
💬 **AI Chat** - Wildlife assistant powered by Gemini & DeepSeek  
🌱 **Flora Database** - Plant identification & uses  
👥 **Community Forum** - User engagement & reporting  

---

## 🚀 Quick Deploy

### **Option 1: One-Click Deployment (Recommended)**
```powershell
.\deploy.ps1
```
Choose your deployment method and follow the prompts!

### **Option 2: Start Locally**
```powershell
.\START_ALL_SERVICES.ps1
```

### **Access Application**
- **Frontend**: http://localhost:5000
- **TensorFlow AI**: http://localhost:5001
- **Poaching Detection**: http://localhost:5002
- **Injury Detection**: http://localhost:5004

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| [🚀 Quick Deploy](QUICK_DEPLOY.md) | 3-minute setup guide |
| [📖 Full Deployment Guide](DEPLOYMENT_GUIDE.md) | Complete deployment documentation |
| [🐙 GitHub Setup](GITHUB_SETUP.md) | Push to GitHub repository |
| [🏗️ System Architecture](SYSTEM_ARCHITECTURE.md) | Technical documentation |
| [🧪 Test Results](TEST_RESULTS_SUMMARY.md) | Performance evaluation |

---

## ✅ System Status

**All Services**: 🟢 **OPERATIONAL**  
**Database**: 🟢 **CONNECTED** (PostgreSQL 13)  
**AI Models**: 🟢 **LOADED** (TensorFlow + YOLOv11)  
**GPS Tracking**: 🟢 **ENABLED**

---

## 📋 What's Working

### ✅ Animal Identification
- **60-100% confidence** enforced
- **Accurate species** detection
- **Database integration** - auto-save
- **26 supported animals**
- **Fixed TensorFlow crashes**

### ✅ Poaching Detection
- **YOLOv11 model** - 72 classes
- **Weapon detection** - guns, knives, crossbows
- **Vehicle tracking** - 6 vehicle types
- **Human detection** - hunter class
- **Threat assessment** - 5 levels

### ✅ Database
- **PostgreSQL** connected
- **26 animals** in database
- **12 identifications** saved
- **22 tables** operational
- **Password**: pokemon1234

---

## 📚 Documentation

All documentation is in the **`docs/`** folder:

- **[SYSTEM_STATUS.md](docs/SYSTEM_STATUS.md)** - Current status & fixes ⭐
- **[COMPLETE_SETUP_GUIDE.md](docs/COMPLETE_SETUP_GUIDE.md)** - Full setup guide
- **[POACHING_DETECTION_INTEGRATION.md](docs/POACHING_DETECTION_INTEGRATION.md)** - YOLOv11 details
- **[TECHNICAL_DOCUMENTATION.md](docs/TECHNICAL_DOCUMENTATION.md)** - Architecture

---

## 🔧 Services

| Service | Port | Status | Purpose |
|---------|------|--------|---------|
| **Node.js Backend** | 5000 | ✅ Running | Application server |
| **TensorFlow AI** | 5001 | ✅ Running | Animal identification |
| **YOLOv11 Poaching** | 5002 | ✅ Running | Threat detection |
| **PostgreSQL DB** | 5432 | ✅ Connected | Data storage |

---

## 🎯 Key Features

### Animal Identification
- Upload animal photos
- AI-powered species recognition
- Conservation status tracking
- Automatic database saving

### Poaching Detection
- Weapon detection (guns, knives, crossbows)
- Human & vehicle tracking
- Threat level assessment
- Real-time recommendations

### Wildlife Discovery
- 26 supported species
- Educational content
- Interactive maps
- Community engagement

---

## 🛠️ Troubleshooting

### Service Not Starting?
```powershell
# Restart all services
.\START.ps1
```

### Database Issues?
```powershell
# Verify connection
psql -U postgres -d wild_guard_db
# Password: pokemon1234
```

### Need Help?
See **[docs/COMPLETE_SETUP_GUIDE.md](docs/COMPLETE_SETUP_GUIDE.md)** for detailed troubleshooting.

---

## 📞 Admin Access

**URL**: http://localhost:5000/admin  
**Username**: admineo75  
**Password**: wildguard1234

---

## 🎉 What Was Fixed

1. ✅ **TensorFlow service crashes** - Added error handling
2. ✅ **Wrong animal identifications** - Keyword filtering
3. ✅ **Confidence range issues** - 60-100% enforced
4. ✅ **Database connection** - Verified & tested
5. ✅ **Documentation** - Organized in docs folder

---

**🐘 Ready to protect wildlife with AI! 🐅**

Last Updated: November 21, 2025  
Version: 4.0  
Status: Production Ready
