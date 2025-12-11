# 🚀 WildGuard 4.0 - Complete Deployment Guide

## 📋 **Table of Contents**
1. [Prerequisites](#prerequisites)
2. [Deployment Options](#deployment-options)
3. [Cloud Deployment (Recommended)](#cloud-deployment)
4. [Local Server Deployment](#local-server-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Service Setup](#service-setup)
8. [Database Setup](#database-setup)
9. [Post-Deployment Testing](#post-deployment-testing)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 **Prerequisites**

### **System Requirements**
- **CPU**: 4+ cores (8+ recommended for AI models)
- **RAM**: 16GB minimum (32GB recommended)
- **Storage**: 50GB+ free space
- **GPU**: NVIDIA GPU with CUDA support (optional but recommended for AI)
- **OS**: Windows 10/11, Ubuntu 20.04+, or macOS 12+

### **Software Requirements**
```bash
✅ Node.js 18+ (npm 9+)
✅ Python 3.9-3.11
✅ PostgreSQL 13+
✅ Git
✅ Docker (optional)
```

---

## 🌐 **Deployment Options**

### **Option 1: Cloud Deployment (Production) ⭐ RECOMMENDED**
**Best for**: Public access, scalability, production use
- **Platforms**: AWS, Google Cloud, Azure, Vercel, Railway
- **Cost**: $20-100/month
- **Pros**: Auto-scaling, high availability, professional
- **Cons**: Monthly cost, requires cloud knowledge

### **Option 2: VPS/Dedicated Server**
**Best for**: Full control, custom configurations
- **Platforms**: DigitalOcean, Linode, Vultr, Hetzner
- **Cost**: $10-50/month
- **Pros**: Root access, predictable pricing
- **Cons**: Manual setup, maintenance required

### **Option 3: Local Server (Development/Testing)**
**Best for**: Development, testing, demos
- **Cost**: Free (electricity + internet)
- **Pros**: No monthly fees, full control
- **Cons**: Not publicly accessible, requires static IP + domain

---

## ☁️ **Cloud Deployment (Recommended)**

### **Step 1: Deploy Backend to Railway.app (FREE Tier Available)**

#### **1.1 Prepare Your Repository**
```bash
# Make sure everything is committed
cd "d:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"
git status
git add .
git commit -m "Prepare for deployment"
```

#### **1.2 Create Railway Account**
1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `WildGuard` repository

#### **1.3 Configure Railway Services**

**Create 4 separate services:**

**Service 1: PostgreSQL Database**
```yaml
Service Name: wildguard-db
Type: PostgreSQL
Plan: Starter ($5/month or free trial)
```

**Service 2: Main Backend (Node.js)**
```yaml
Service Name: wildguard-backend
Root Directory: /
Start Command: npm run build && npm run start
Environment Variables:
  - DATABASE_URL: ${{Postgres.DATABASE_URL}}
  - NODE_ENV: production
  - PORT: 5000
```

**Service 3: TensorFlow AI Service**
```yaml
Service Name: wildguard-tensorflow
Root Directory: /ai_models
Start Command: python tensorflow_service.py
Environment Variables:
  - FLASK_ENV: production
  - PORT: 5001
```

**Service 4: Poaching Detection Service**
```yaml
Service Name: wildguard-poaching
Root Directory: /Poaching_Detection
Start Command: python yolo_poaching_service.py
Environment Variables:
  - FLASK_ENV: production
  - PORT: 5002
```

**Service 5: Injury Detection Service**
```yaml
Service Name: wildguard-injury
Root Directory: /
Start Command: python injury-detection-service.py
Environment Variables:
  - FLASK_ENV: production
  - PORT: 5004
```

#### **1.4 Set Environment Variables**
In Railway dashboard, add these variables to Main Backend:

```env
# Database
DATABASE_URL=<provided by Railway PostgreSQL>

# AI Services (Railway internal URLs)
TENSORFLOW_SERVICE_URL=http://wildguard-tensorflow.railway.internal:5001
POACHING_SERVICE_URL=http://wildguard-poaching.railway.internal:5002
INJURY_SERVICE_URL=http://wildguard-injury.railway.internal:5004

# API Keys (Get Free Keys)
GEMINI_API_KEY=your_gemini_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here
INATURALIST_API_KEY=optional

# Session Secret
SESSION_SECRET=generate_random_64_char_string_here

# Client URL (will get from Vercel)
CLIENT_URL=https://your-app.vercel.app
```

---

### **Step 2: Deploy Frontend to Vercel (FREE)**

#### **2.1 Create Vercel Account**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Add New Project"** → Select your repository

#### **2.2 Configure Vercel**
```yaml
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Environment Variables:
  - VITE_API_URL: <your Railway backend URL>
```

#### **2.3 Deploy**
Click **"Deploy"** and wait 2-3 minutes.

Your frontend will be live at: `https://your-app.vercel.app`

---

### **Step 3: Configure Domain (Optional)**

#### **3.1 Get Domain**
- Buy from: Namecheap, GoDaddy, or Cloudflare ($10-15/year)
- Or use free subdomain: `.railway.app`, `.vercel.app`

#### **3.2 Point Domain to Services**
```
Frontend: CNAME → vercel-dns.com
Backend: CNAME → up.railway.app
```

---

## 🖥️ **Local Server Deployment**

### **Step 1: Install Dependencies**

```bash
# Navigate to project
cd "d:\Wild-Guard 4.0\WildRescueGuide\WildRescueGuide"

# Install Node.js dependencies
npm install

# Create Python virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\Activate.ps1
# Linux/Mac:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
pip install tensorflow==2.20.0
pip install ultralytics
pip install flask flask-cors pillow numpy
```

### **Step 2: Setup PostgreSQL Database**

```bash
# Start PostgreSQL service
# Windows:
net start postgresql-x64-13

# Linux:
sudo systemctl start postgresql

# Create database
psql -U postgres
CREATE DATABASE wild_guard_db;
\q

# Run migrations
npm run db:push
```

### **Step 3: Configure Environment**

Create `.env` file:
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/wild_guard_db

# AI Services
TENSORFLOW_SERVICE_URL=http://localhost:5001
POACHING_SERVICE_URL=http://localhost:5002
INJURY_SERVICE_URL=http://localhost:5004

# API Keys
GEMINI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here

# Session
SESSION_SECRET=your_random_secret_here

# Client
CLIENT_URL=http://localhost:5000
```

### **Step 4: Start All Services**

**Option A: Using PowerShell Script (Recommended)**
```powershell
.\START_ALL_SERVICES.ps1
```

**Option B: Manual Start (4 separate terminals)**

**Terminal 1 - Main Backend:**
```bash
npm run dev
```

**Terminal 2 - TensorFlow Service:**
```bash
cd ai_models
python tensorflow_service.py
```

**Terminal 3 - Poaching Detection:**
```bash
cd Poaching_Detection
python yolo_poaching_service.py
```

**Terminal 4 - Injury Detection:**
```bash
python injury-detection-service.py
```

### **Step 5: Access Application**
Open browser: http://localhost:5000

---

## 🐳 **Docker Deployment**

### **Step 1: Create Docker Files**

**Create `Dockerfile`:**
```dockerfile
# Multi-stage build
FROM node:18-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM python:3.10-slim AS backend
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY --from=frontend /app/dist ./dist
COPY . .

EXPOSE 5000 5001 5002 5004

CMD ["sh", "-c", "npm start & python ai_models/tensorflow_service.py & python Poaching_Detection/yolo_poaching_service.py & python injury-detection-service.py"]
```

**Create `docker-compose.yml`:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: wild_guard_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: .
    ports:
      - "5000:5000"
      - "5001:5001"
      - "5002:5002"
      - "5004:5004"
    environment:
      DATABASE_URL: postgresql://postgres:your_password@postgres:5432/wild_guard_db
      GEMINI_API_KEY: ${GEMINI_API_KEY}
      DEEPSEEK_API_KEY: ${DEEPSEEK_API_KEY}
    depends_on:
      - postgres
    volumes:
      - ./ai_models:/app/ai_models
      - ./Poaching_Detection:/app/Poaching_Detection

volumes:
  postgres_data:
```

### **Step 2: Deploy with Docker**

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔑 **Environment Configuration**

### **Required API Keys (All FREE)**

#### **1. Gemini API Key (FREE)**
1. Go to https://makersuite.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy key → Add to `.env`: `GEMINI_API_KEY=your_key`

#### **2. DeepSeek API Key (FREE)**
1. Go to https://platform.deepseek.com/api_keys
2. Sign up (free $10 credit)
3. Create API key
4. Add to `.env`: `DEEPSEEK_API_KEY=your_key`

#### **3. iNaturalist (Optional, FREE)**
1. Go to https://www.inaturalist.org/oauth/applications/new
2. Create application
3. Copy key → Add to `.env`: `INATURALIST_API_KEY=your_key`

---

## 🗄️ **Database Setup**

### **Option 1: Managed Database (Recommended for Production)**

**Railway PostgreSQL:**
- Free tier: 512MB (good for testing)
- Paid: $5/month (5GB)
- Auto-backups, high availability

**Supabase PostgreSQL:**
- Free tier: 500MB
- Paid: $25/month (8GB)
- Built-in auth, realtime

**Neon PostgreSQL:**
- Free tier: 3GB
- Paid: $19/month (unlimited)
- Serverless, auto-scaling

### **Option 2: Self-Hosted**

```bash
# Install PostgreSQL
# Windows: Download from postgresql.org
# Linux:
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE wild_guard_db;
CREATE USER wildguard WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE wild_guard_db TO wildguard;
\q

# Initialize schema
npm run db:push

# Populate with data
node scripts/init-database.ts
```

---

## 🧪 **Post-Deployment Testing**

### **Test Checklist**

```bash
# 1. Health Check - All Services
curl http://your-domain.com/api/health
curl http://your-domain.com:5001/health
curl http://your-domain.com:5002/health
curl http://your-domain.com:5004/health

# 2. Test Animal Identification
# Upload image through UI: http://your-domain.com/identify

# 3. Test GPS Tracking
# Allow location permissions → Upload photo → Check coordinates

# 4. Test Poaching Detection
# Upload image with weapons/vehicles → Check alerts

# 5. Test Admin Dashboard
# Login at: http://your-domain.com/admin
# Credentials: Check database `users` table

# 6. Test Database Connection
# Check animal identifications are being saved

# 7. Test Chat Feature
# Go to /chat → Ask about wildlife → Verify AI response
```

---

## 🚨 **Troubleshooting**

### **Issue 1: Services Not Starting**

**Symptoms:** Port already in use errors
**Solution:**
```bash
# Windows - Kill processes
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Linux - Kill processes
sudo lsof -t -i:5000 | xargs kill -9
```

### **Issue 2: Database Connection Failed**

**Solution:**
```bash
# Check PostgreSQL is running
# Windows:
sc query postgresql-x64-13
# Linux:
sudo systemctl status postgresql

# Test connection
psql -U postgres -d wild_guard_db

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/wild_guard_db
```

### **Issue 3: AI Models Not Loading**

**Solution:**
```bash
# Check model files exist
dir Poaching_Detection\runs\detect\train2\weights\best.pt
dir ai_models\mobilenet_v2

# Re-download if missing
cd ai_models
python download_mobilenet.py

# Check Python packages
pip list | grep tensorflow
pip list | grep ultralytics
```

### **Issue 4: GPS Not Working**

**Solution:**
- Must use HTTPS (browsers require secure context for geolocation)
- For local testing: http://localhost is allowed
- For production: Get SSL certificate (free with Let's Encrypt)

### **Issue 5: Out of Memory**

**Solution:**
```bash
# Reduce batch size in AI services
# Edit yolo_poaching_service.py:
conf=0.40  # Increase confidence threshold (less processing)

# Or upgrade server RAM
# Or use GPU acceleration
```

---

## 📊 **Monitoring & Maintenance**

### **Setup Monitoring**

**Use Uptime Monitoring (FREE):**
- UptimeRobot: https://uptimerobot.com
- Pingdom: https://pingdom.com
- BetterStack: https://betterstack.com

**Monitor these endpoints:**
```
✅ Frontend: https://your-app.vercel.app
✅ Backend API: https://api.your-domain.com/health
✅ TensorFlow AI: https://api.your-domain.com:5001/health
✅ Poaching Detection: https://api.your-domain.com:5002/health
✅ Injury Detection: https://api.your-domain.com:5004/health
```

### **Regular Maintenance**

```bash
# Weekly: Update dependencies
npm update
pip install --upgrade -r requirements.txt

# Monthly: Database backup
pg_dump wild_guard_db > backup_$(date +%Y%m%d).sql

# Quarterly: Review logs
tail -f /var/log/wildguard/*.log
```

---

## 💰 **Cost Estimates**

### **Recommended Production Setup**

| Service | Provider | Monthly Cost |
|---------|----------|--------------|
| Frontend Hosting | Vercel | FREE |
| Backend API | Railway Hobby | $5 |
| PostgreSQL DB | Railway | $5 |
| AI Services | Railway | $10 |
| Domain | Namecheap | $1 |
| SSL Certificate | Let's Encrypt | FREE |
| **TOTAL** | | **$21/month** |

### **Enterprise Setup**

| Service | Provider | Monthly Cost |
|---------|----------|--------------|
| Frontend CDN | Vercel Pro | $20 |
| Backend Servers | AWS EC2 (t3.large) | $60 |
| PostgreSQL | AWS RDS | $30 |
| AI GPU Server | AWS g4dn.xlarge | $120 |
| Domain + SSL | AWS Route53 | $5 |
| Monitoring | DataDog | $15 |
| **TOTAL** | | **$250/month** |

---

## 🎯 **Quick Deployment Commands**

### **Cloud Deployment (Railway + Vercel)**
```bash
# 1. Commit code
git add .
git commit -m "Deploy WildGuard 4.0"
git push origin main

# 2. Deploy to Railway
# Go to railway.app → New Project → Deploy from GitHub

# 3. Deploy to Vercel
# Go to vercel.com → New Project → Import from GitHub

# Done! 🎉
```

### **Local Deployment**
```bash
# 1. Setup
npm install
pip install -r requirements.txt

# 2. Configure
cp .env.example .env
# Edit .env with your settings

# 3. Start database
npm run db:push

# 4. Start all services
.\START_ALL_SERVICES.ps1

# Done! Open http://localhost:5000
```

---

## 📞 **Need Help?**

- **Documentation**: Check `/docs` folder
- **Logs**: `tail -f server/logs/*.log`
- **GitHub Issues**: Create issue with error details
- **Community**: Discord/Telegram support group

---

## ✅ **Deployment Checklist**

```markdown
### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] API keys obtained (Gemini, DeepSeek)
- [ ] Database migrations ready
- [ ] .gitignore updated (no secrets committed)
- [ ] README.md updated with deployment URL

### Deployment
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] Database created and migrated
- [ ] AI services running
- [ ] Domain configured (optional)
- [ ] SSL certificate active

### Post-Deployment
- [ ] Health checks passing (all 4 services)
- [ ] Animal identification working
- [ ] GPS tracking functional
- [ ] Poaching detection active
- [ ] Admin dashboard accessible
- [ ] Monitoring setup complete
- [ ] Backup strategy configured

### Final Steps
- [ ] Share deployment URL with team
- [ ] Document any issues encountered
- [ ] Setup automated backups
- [ ] Configure alerting
- [ ] Performance baseline recorded
```

---

## 🚀 **You're Ready to Deploy!**

Choose your deployment method and follow the steps above. For the **fastest deployment**, use Railway + Vercel (takes ~15 minutes).

**Good luck with your deployment! 🎉**
