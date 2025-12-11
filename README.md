# 🦁 WildGuard 4.0 - Wildlife Conservation Platform

<div align="center">

![WildGuard](https://img.shields.io/badge/WildGuard-4.0-success?style=for-the-badge)

**AI-Powered Wildlife Identification, GPS Tracking, Poaching Detection & Injury Assessment**

[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Vivinvai/WildGuard)
[![Python](https://img.shields.io/badge/Python-3.9+-blue?logo=python)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

[🚀 Quick Start](#-quick-start) • [📚 Documentation](#-documentation) • [✨ Features](#-features) • [🎯 Demo](#-demo)

</div>

---

## 🌟 Overview

**WildGuard** is a comprehensive wildlife conservation platform leveraging AI technology to protect endangered species through real-time identification, GPS tracking, and automated threat detection.

### **Key Capabilities**

- 🤖 **4 AI Services** - TensorFlow + YOLOv11 (1000+ species identification)
- 📍 **Real-time GPS** - Precise location tracking with visual indicators
- 🚨 **Threat Detection** - Automated poaching detection (72 classes)
- 🏥 **Health Monitoring** - Animal injury detection and assessment
- 👨‍💼 **Admin System** - Complete management dashboard
- 💬 **AI Assistant** - Wildlife chatbot (Gemini + DeepSeek)
- 🌱 **Flora Database** - Plant identification system
- 👥 **Community** - User engagement platform

---

## 🚀 Quick Start

### **Option 1: One-Click Deploy**
```powershell
.\deploy.ps1
```

### **Option 2: Local Development**
```powershell
.\START_ALL_SERVICES.ps1
```
Access at http://localhost:5000

### **Option 3: Docker**
```bash
docker-compose up -d
```

---

## ✨ Features

### 🐾 **Wildlife Identification**
- TensorFlow AI with 1000+ species (ImageNet)
- 60-100% accuracy enforced
- Multi-AI verification (Gemini + DeepSeek)
- Auto-save to database
- 26+ custom trained animals

### 📍 **GPS Tracking**
- Real-time location capture
- Visual status indicators
- Permission checking
- High accuracy mode (< 10m)
- Toast notifications

### 🚨 **Poaching Detection**
- YOLOv11 custom model (72 classes)
- 5 weapon types (guns, knives, bows)
- 6 vehicle types (cars, trucks, helicopters)
- Human detection (hunters)
- 5 threat levels (none → critical)
- Automated alerts

### 🏥 **Injury Assessment**
- YOLO COCO model (80 classes)
- Health monitoring
- Injury detection & classification
- Severity assessment
- Veterinary recommendations

### 👨‍💼 **Admin Dashboard**
- Complete analytics
- User management
- Detection history
- Poaching alerts
- Database admin
- Export reports (PDF/CSV)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│            WildGuard 4.0 System                 │
└─────────────────────────────────────────────────┘

Frontend (5000)  ←→  Backend API  ←→  PostgreSQL (5432)
  React/Vite         Node.js/Express    23 Tables
                           ↓
        ┌──────────────────┼──────────────────┐
        ↓                  ↓                  ↓
  TensorFlow (5001)  Poaching (5002)   Injury (5004)
   MobileNetV2        YOLOv11           YOLO COCO
```

**Detailed Architecture**: [📖 View Full Architecture](docs/SYSTEM_ARCHITECTURE.md)

---

## 📚 Documentation

### 🚀 **Deployment**
- [Quick Deploy (3 min)](docs/deployment/QUICK_DEPLOY.md) - Fastest setup
- [Complete Guide](docs/deployment/DEPLOYMENT_GUIDE.md) - Full instructions
- [Vercel Deployment](docs/deployment/VERCEL_DEPLOYMENT.md) - Frontend deploy
- [GitHub Setup](docs/deployment/GITHUB_SETUP.md) - Repository setup
- [Deployment Summary](docs/deployment/DEPLOYMENT_SUMMARY.md) - Overview

### 📖 **Technical**
- [System Architecture](docs/SYSTEM_ARCHITECTURE.md) - Complete overview
- [Test Results](docs/TEST_RESULTS_SUMMARY.md) - Performance data
- [API Documentation](docs/api/) - API endpoints

### 📝 **Setup**
- [API Keys Setup](docs/setup/API_KEYS_SETUP_GUIDE.md) - Free API keys
- [Database Setup](docs/setup/DATABASE_SETUP_COMPLETE.md) - PostgreSQL
- [TensorFlow Setup](docs/setup/TENSORFLOW_SETUP_COMPLETE.md) - AI models

### 🛠️ **Development**
- [Model Training](docs/guides/TRAIN_CUSTOM_MODEL.md) - Train custom models
- [Wound Detection](docs/guides/WOUND_DETECTION_GUIDE.md) - Injury setup
- [Design Guidelines](docs/guides/design_guidelines.md) - UI/UX standards

---

## 🎯 Demo

**Live Site**: Coming Soon  
**GitHub**: https://github.com/Vivinvai/WildGuard

---

## 🛠️ Tech Stack

**Frontend**: React 18.3, TypeScript, Vite, TailwindCSS, Framer Motion  
**Backend**: Node.js 18, Express, PostgreSQL 13, Drizzle ORM  
**AI/ML**: Python 3.9+, TensorFlow 2.20, YOLOv11, Gemini AI, DeepSeek  
**Deployment**: Docker, Vercel, Railway

---

## 📊 System Status

| Service | Status | Port | Technology |
|---------|--------|------|------------|
| Frontend | 🟢 | 5000 | React + Vite |
| Backend API | 🟢 | 5000 | Node.js |
| TensorFlow AI | 🟢 | 5001 | Python + TF |
| Poaching | 🟢 | 5002 | YOLOv11 |
| Injury | 🟢 | 5004 | YOLO COCO |
| PostgreSQL | 🟢 | 5432 | PostgreSQL 13 |

---

## 🔧 Installation

### **Prerequisites**
- Node.js 18+, Python 3.9+, PostgreSQL 13+
- 16GB RAM, 50GB disk space

### **Setup**
```bash
git clone https://github.com/Vivinvai/WildGuard.git
cd WildGuard
npm install
pip install -r requirements.txt
npm run db:push
.\START_ALL_SERVICES.ps1
```

**Full Guide**: [📖 Installation Guide](docs/deployment/DEPLOYMENT_GUIDE.md)

---

## 🔑 Configuration

Create `.env`:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/wild_guard_db
GEMINI_API_KEY=your_key
DEEPSEEK_API_KEY=your_key
SESSION_SECRET=your_secret
```

**Get API Keys**: [🔑 API Setup Guide](docs/setup/API_KEYS_SETUP_GUIDE.md)

---

## 📈 Performance

| Feature | Success Rate | Avg Time |
|---------|--------------|----------|
| Animal ID | 95% | 3.2s |
| GPS Tracking | 98% | 1.5s |
| Poaching | 88% | 2.8s |
| Injury | 82% | 3.5s |

**Full Report**: [📊 Test Results](docs/TEST_RESULTS_SUMMARY.md)

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE)

---

## 👥 Team

**Project Lead**: Vivinvai  
**GitHub**: [@Vivinvai](https://github.com/Vivinvai)

---

## 🙏 Acknowledgments

- TensorFlow Team - MobileNetV2 model
- Ultralytics - YOLOv11 framework
- Google - Gemini AI API
- DeepSeek - DeepSeek AI API

---

## 📞 Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/Vivinvai/WildGuard/issues)

---

## 🗺️ Roadmap

**v4.1** (Coming Soon)
- [ ] Mobile app (React Native)
- [ ] Real-time satellite monitoring
- [ ] Drone integration
- [ ] Advanced analytics
- [ ] Multi-language support

**v5.0** (Future)
- [ ] Blockchain tracking
- [ ] AR identification
- [ ] Predictive analytics
- [ ] Global network
- [ ] Habitat monitoring

---

## 💰 Deployment Cost

**Vercel (Frontend)**: FREE  
**Railway (Backend + AI)**: $20/month  
**Total**: $20/month

**Deploy in 15 min**: [🚀 Quick Deploy](docs/deployment/QUICK_DEPLOY.md)

---

## ⭐ Star This Repository

If you find WildGuard useful, please star it! ⭐

---

<div align="center">

**Built with ❤️ for Wildlife Conservation**

🦁 🐘 🐯 🦒 🦏

[⬆ Back to Top](#-wildguard-40---wildlife-conservation-platform)

</div>
