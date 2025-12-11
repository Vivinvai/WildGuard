# WildGuard 4.0 - Quick Setup Guide

## 🚀 **3 Ways to Deploy WildGuard**

### **Option 1: Cloud (Easiest - 15 minutes) ⭐ RECOMMENDED**
```bash
# Run deployment script
.\deploy.ps1

# Choose option 1 (Railway + Vercel)
# Follow on-screen instructions
```

**Cost**: $0-20/month (free tier available)  
**Access**: Public URL, works from anywhere  
**Best for**: Production, sharing with others

---

### **Option 2: Docker (Medium - 10 minutes)**
```bash
# Run deployment script
.\deploy.ps1

# Choose option 2 (Docker)
# Services start automatically
```

**Cost**: Free (local only)  
**Access**: http://localhost:5000  
**Best for**: Testing, development

---

### **Option 3: Local (Advanced - 20 minutes)**
```bash
# Run deployment script
.\deploy.ps1

# Choose option 3 (Local)
# Start services: .\START_ALL_SERVICES.ps1
```

**Cost**: Free  
**Access**: http://localhost:5000  
**Best for**: Development, customization

---

## 📋 **Before You Deploy**

### **Get FREE API Keys (5 minutes):**

1. **Gemini AI** (required):
   - Go to: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy key

2. **DeepSeek AI** (required):
   - Go to: https://platform.deepseek.com/api_keys
   - Sign up (free $10 credit)
   - Create API key
   - Copy key

3. **iNaturalist** (optional):
   - Go to: https://www.inaturalist.org/oauth/applications/new
   - Create application
   - Copy key

---

## ✅ **After Deployment**

### **Test Your Deployment:**

1. **Check Services** (all should return "healthy"):
   ```bash
   curl http://your-domain.com/api/health
   curl http://your-domain.com:5001/health
   curl http://your-domain.com:5002/health
   curl http://your-domain.com:5004/health
   ```

2. **Test Features**:
   - ✅ Upload animal photo → Should identify species
   - ✅ Allow GPS → Should capture location
   - ✅ Upload photo with weapon → Should detect threat
   - ✅ Login to admin → Should show dashboard

3. **Common Issues**:
   - Services not starting? → Check logs: `docker-compose logs -f`
   - API not working? → Verify API keys in `.env`
   - GPS not working? → Use HTTPS or localhost
   - Database errors? → Run `npm run db:push`

---

## 📊 **Service Ports**

| Service | Port | URL |
|---------|------|-----|
| Main App | 5000 | http://localhost:5000 |
| TensorFlow AI | 5001 | http://localhost:5001 |
| Poaching Detection | 5002 | http://localhost:5002 |
| Injury Detection | 5004 | http://localhost:5004 |
| PostgreSQL | 5432 | localhost:5432 |

---

## 🆘 **Need Help?**

**Full Documentation**: `DEPLOYMENT_GUIDE.md` (comprehensive guide)  
**API Setup**: `docs/setup/API_KEYS_SETUP_GUIDE.md`  
**System Architecture**: `SYSTEM_ARCHITECTURE.md`

**Quick Fixes**:
```bash
# Restart all services
docker-compose restart

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Clean restart
docker-compose down -v
docker-compose up -d --build
```

---

## 🎯 **Quick Start Commands**

**Deploy to Cloud:**
```bash
.\deploy.ps1
# Choose option 1
```

**Deploy with Docker:**
```bash
.\deploy.ps1
# Choose option 2
# Access: http://localhost:5000
```

**Deploy Locally:**
```bash
.\deploy.ps1
# Choose option 3
.\START_ALL_SERVICES.ps1
# Access: http://localhost:5000
```

---

## ✨ **What You Get**

✅ **Wildlife Identification**: TensorFlow AI (1000+ species)  
✅ **GPS Tracking**: Real-time location capture  
✅ **Poaching Detection**: YOLO AI (72 threat classes)  
✅ **Injury Assessment**: Animal health monitoring  
✅ **Admin Dashboard**: Complete management system  
✅ **Chat Support**: AI-powered wildlife assistant  
✅ **Community Forum**: User engagement  
✅ **Flora Database**: Plant identification  

---

**Ready? Run `.\deploy.ps1` to get started! 🚀**
