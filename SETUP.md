# WildGuard - Local Setup Guide

Complete guide to run WildGuard on your local machine.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download: https://www.postgresql.org/download/
   - Verify: `psql --version`

3. **Git** (optional, for cloning)
   - Download: https://git-scm.com/

## 🚀 Quick Start

### Step 1: Download/Clone the Project

Download the project files or clone from your repository:
```bash
git clone <your-repo-url>
cd wildguard
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE wildguard;

# Create user (optional)
CREATE USER wildguard_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE wildguard TO wildguard_user;

# Exit
\q
```

### Step 4: Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your actual values (see API Keys section below).

### Step 5: Initialize Database Schema

```bash
npm run db:push
```

This will create all necessary tables in your PostgreSQL database.

### Step 6: Start the Application

```bash
npm run dev
```

The application will be available at: **http://localhost:5000**

## 🔑 API Keys Setup

WildGuard requires several API keys. Get them from these sources:

### 1. OpenAI API Key (Required)
**What it's for:** Animal identification using GPT-5

**How to get:**
1. Go to https://platform.openai.com/
2. Sign up or login
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

**Add to .env:**
```
OPENAI_API_KEY=sk-your-actual-key-here
```

### 2. Google Gemini API Key (Required)
**What it's for:** Flora identification, poaching detection, health assessment, sound detection, footprint recognition, partial image enhancement, chatbot

**How to get:**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**Add to .env:**
```
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. LocationIQ API Key (Required)
**What it's for:** Geocoding and reverse geocoding for maps

**How to get:**
1. Go to https://locationiq.com/
2. Sign up for free account
3. Go to Dashboard → Access Tokens
4. Copy your access token

**Add to .env:**
```
LOCATIONIQ_API_KEY=your-locationiq-key-here
```

### 4. NASA FIRMS API Key (Optional)
**What it's for:** Real-time forest fire detection in Live Habitat Monitor

**How to get:**
1. Go to https://firms.modaps.eosdis.nasa.gov/api/area/
2. Request API key via email
3. You'll receive the key via email

**Add to .env:**
```
FIRMS_API_KEY=your-firms-key-here
```

## 📝 Complete .env Configuration

Your `.env` file should look like this:

```bash
# ============================================
# API Keys
# ============================================

# OpenAI (Required for Animal Identification)
OPENAI_API_KEY=sk-your-openai-key-here

# Google Gemini (Required for Flora & AI Features)
GEMINI_API_KEY=your-gemini-key-here

# LocationIQ (Required for Maps)
LOCATIONIQ_API_KEY=your-locationiq-key-here

# NASA FIRMS (Optional for Live Habitat Monitor)
FIRMS_API_KEY=your-firms-key-here

# Prefer Gemini for certain features (optional)
PREFER_GEMINI=true

# ============================================
# Database Configuration
# ============================================

# PostgreSQL Connection
DATABASE_URL=postgresql://wildguard_user:your_password@localhost:5432/wildguard
PGHOST=localhost
PGUSER=wildguard_user
PGPASSWORD=your_password
PGDATABASE=wildguard
PGPORT=5432

# ============================================
# Session Configuration
# ============================================

# Session Secret (Generate a random string)
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=generate-a-random-string-here

# ============================================
# Node Environment
# ============================================
NODE_ENV=development
```

## 🎯 Generate Session Secret

To generate a secure session secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `SESSION_SECRET` value.

## 🗄️ Database Schema

The database will automatically create these tables:

- `users` - Admin users
- `wildlife_centers` - Wildlife centers and rescue facilities
- `animal_identifications` - AI animal identification results
- `flora_identifications` - AI flora identification results
- `botanical_gardens` - Botanical garden directory
- `animal_sightings` - User-reported animal sightings
- `deforestation_alerts` - Deforestation tracking
- `ngos` - NGO directory
- `volunteer_activities` - Volunteer opportunities
- `sound_detections` - Wildlife sound detection results
- `footprint_analyses` - Footprint recognition results
- `habitat_monitoring` - Satellite habitat monitoring data
- `partial_image_enhancements` - Partial image enhancement results
- `chat_messages` - Chatbot conversation history
- `sessions` - User session storage

## 🔐 Admin Access

Default admin credentials:
- **Username:** `admineo75`
- **Password:** `wildguard1234`

**⚠️ Important:** Change these credentials in production!

To access admin dashboard:
1. Navigate to http://localhost:5000/admin
2. Login with above credentials
3. Manage animal sighting reports, verify submissions, issue certificates

## 🛠️ Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npm run db:push          # Push schema changes to database
npm run db:push --force  # Force push (if migrations fail)
npm run db:studio        # Open Drizzle Studio (database GUI)
```

## 🧪 Testing the Setup

After starting the server, test these features:

1. **Home Page:** http://localhost:5000
2. **Animal Identification:** http://localhost:5000/identify
3. **Flora Identification:** http://localhost:5000/identify (switch to Flora tab)
4. **Report Sighting:** http://localhost:5000/report-sighting
5. **Admin Dashboard:** http://localhost:5000/admin
6. **AI Features:** Click "Features" in navigation

## 🐛 Troubleshooting

### Issue: Database Connection Failed

**Solution:**
1. Verify PostgreSQL is running: `pg_isready`
2. Check database exists: `psql -U postgres -l | grep wildguard`
3. Verify credentials in `.env` match your PostgreSQL setup
4. Check `DATABASE_URL` format is correct

### Issue: API Key Errors

**Solution:**
1. Verify all required API keys are set in `.env`
2. Check for extra spaces or quotes around keys
3. Restart the server after adding keys: `npm run dev`

### Issue: Port 5000 Already in Use

**Solution:**
1. Find process using port: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
2. Kill the process or change port in `server/index.ts`

### Issue: npm install fails

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure you're using Node.js v18 or higher

### Issue: Database migration errors

**Solution:**
```bash
# Force push the schema
npm run db:push --force

# If that fails, reset the database
psql -U postgres
DROP DATABASE wildguard;
CREATE DATABASE wildguard;
\q

# Then push schema again
npm run db:push
```

### Issue: Leaflet map not showing

**Solution:**
1. Clear browser cache
2. Check browser console for errors
3. Ensure geolocation permission is granted

## 🌐 Frontend Environment Variables

If you need to expose environment variables to the frontend, prefix them with `VITE_`:

```bash
VITE_MAP_API_KEY=your-key-here
```

Access in frontend:
```javascript
const apiKey = import.meta.env.VITE_MAP_API_KEY;
```

## 📦 Project Structure

```
wildguard/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── lib/           # Utilities
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   ├── services/          # AI and external services
│   └── index.ts           # Server entry point
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema
├── .env                   # Environment variables (create this)
├── .env.example           # Environment template
├── package.json           # Dependencies
└── drizzle.config.ts      # Database configuration
```

## 🚀 Production Deployment

For production deployment:

1. Set `NODE_ENV=production` in `.env`
2. Use a production PostgreSQL database (not localhost)
3. Generate a strong `SESSION_SECRET`
4. Build the application: `npm run build`
5. Start production server: `npm start`
6. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name wildguard -- start
   ```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - Already in `.gitignore`
2. **Use different API keys** for development and production
3. **Rotate API keys** regularly
4. **Change default admin credentials** immediately
5. **Use HTTPS** in production
6. **Enable database backups**

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed correctly
3. Ensure all API keys are valid and active
4. Check console logs for specific error messages

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Node.js v18+ installed
- [ ] PostgreSQL running
- [ ] Database created
- [ ] `.env` file created and configured
- [ ] All required API keys added
- [ ] Dependencies installed (`npm install`)
- [ ] Database schema pushed (`npm run db:push`)
- [ ] Server started successfully (`npm run dev`)
- [ ] Port 5000 accessible
- [ ] Browser can access http://localhost:5000

## 🎉 You're All Set!

Your WildGuard platform should now be running at **http://localhost:5000**

Explore the features:
- **Identify Wildlife:** Upload animal/plant photos for AI identification
- **Report Sightings:** Submit wildlife observations with photos and location
- **AI Conservation Tools:** 9 powerful AI features for conservation
- **Wildlife Centers:** Find rescue centers and sanctuaries
- **Volunteer:** Discover conservation opportunities
- **Admin Dashboard:** Manage and verify sighting reports

Happy Conservation! 🌿🦁
