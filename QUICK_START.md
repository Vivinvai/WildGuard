# 🚀 WildGuard - Quick Start Guide

Get WildGuard running on your system in 5 minutes!

## ⚡ Super Quick Setup

### 1. Install Prerequisites
```bash
# Install Node.js from https://nodejs.org/ (v18+)
# Install PostgreSQL from https://www.postgresql.org/
```

### 2. Setup Database
```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE wildguard;"
```

### 3. Clone & Install
```bash
cd wildguard
npm install
```

### 4. Configure API Keys
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys (see below)
```

### 5. Initialize & Run
```bash
# Push database schema
npm run db:push

# Start the application
npm run dev
```

### 6. Access Application
Open browser: **http://localhost:5000**

---

## 🔑 Get Your API Keys

### Required Keys (Must Have):

1. **OpenAI** → https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy key (starts with `sk-`)
   
2. **Google Gemini** → https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy key

3. **LocationIQ** → https://locationiq.com/
   - Sign up free
   - Copy access token from dashboard

### Optional Keys:

4. **NASA FIRMS** → https://firms.modaps.eosdis.nasa.gov/api/area/
   - Request via email
   - For forest fire detection feature

---

## 📝 Edit Your .env File

Open `.env` and paste your keys:

```bash
# Paste your actual keys here:
OPENAI_API_KEY=sk-your-actual-openai-key
GEMINI_API_KEY=your-actual-gemini-key
LOCATIONIQ_API_KEY=your-actual-locationiq-key

# Database (adjust if needed):
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wildguard
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=wildguard
PGPORT=5432

# Generate session secret:
# Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=paste-generated-secret-here

NODE_ENV=development
```

---

## ✅ Verify Everything Works

1. **Home Page**: http://localhost:5000 ✓
2. **Animal ID**: Upload animal photo → Get AI identification ✓
3. **Flora ID**: Upload plant photo → Get AI identification ✓
4. **Report Sighting**: Submit wildlife observation ✓
5. **Admin Login**: http://localhost:5000/admin (admineo75/wildguard1234) ✓

---

## 🆘 Quick Troubleshooting

**Database error?**
```bash
# Check PostgreSQL is running
pg_isready

# Recreate database
psql -U postgres -c "DROP DATABASE wildguard; CREATE DATABASE wildguard;"
npm run db:push
```

**Port 5000 in use?**
```bash
# Kill process on port 5000 (Mac/Linux)
lsof -ti:5000 | xargs kill -9

# Or change port in server/index.ts
```

**API errors?**
- Check `.env` has all keys
- No extra spaces around keys
- Restart server: `npm run dev`

**Can't install packages?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 What's Included

✅ **9 AI-Powered Conservation Tools**
- Poaching Detection
- Population Trend Prediction  
- Automatic Health Assessment
- Satellite Habitat Monitoring
- Wildlife Sightings Heatmap
- Live Habitat Health Monitor
- Wildlife Sound Detection
- AI Footprint Recognition
- Partial Image Enhancement

✅ **Core Features**
- Animal & Flora Identification (AI)
- Wildlife Sighting Reports (with certificates)
- Admin Dashboard (verification system)
- Wildlife Centers Directory
- Botanical Gardens Directory
- NGO Directory
- Volunteer Opportunities
- Deforestation Alerts
- Wildlife Chatbot

---

## 🔐 Default Login

**Admin Dashboard**: http://localhost:5000/admin

- Username: `admineo75`
- Password: `wildguard1234`

**⚠️ Change this in production!**

---

## 📚 Need More Details?

See **SETUP.md** for:
- Detailed installation guide
- Complete API setup instructions
- Production deployment
- Advanced troubleshooting
- Security best practices

---

## 🎉 You're Ready!

Your WildGuard conservation platform is now running!

**Next Steps:**
1. Upload animal/plant photos to test AI identification
2. Report a wildlife sighting with photo + location
3. Login to admin dashboard to verify reports
4. Explore all 9 AI conservation features
5. Add your own conservation data

**Happy Conservation! 🌿🦁🐘🦜**
