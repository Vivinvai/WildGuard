# 🌿 WildGuard - AI-Powered Wildlife Conservation Platform

![WildGuard](https://img.shields.io/badge/AI-Conservation-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

**WildGuard** is a comprehensive AI-powered platform dedicated to wildlife and flora conservation across Karnataka and India. It leverages cutting-edge artificial intelligence to identify species, detect threats, monitor habitats, and empower conservation efforts.

---

## 🌟 Key Features

### 🤖 AI-Powered Tools (9 Features)

1. **Poaching Detection** - Detect weapons, traps, and illegal activities from camera trap images
2. **Population Trend Prediction** - Forecast wildlife populations using historical census data
3. **Automatic Health Assessment** - Analyze animal health from photos
4. **Satellite Habitat Monitoring** - Track deforestation and habitat loss
5. **Wildlife Sightings Heatmap** - Interactive biodiversity mapping
6. **Live Habitat Health Monitor** - Real-time forest fire detection via NASA satellites
7. **Wildlife Sound Detection** - Identify species from audio recordings
8. **AI Footprint Recognition** - Analyze animal tracks and footprints
9. **Partial Image Enhancement** - Identify species from blurry/incomplete images

### 📱 Core Features

- **🦁 Animal Identification** - Upload photos for instant AI-powered species identification
- **🌺 Flora Identification** - Identify plants and trees using advanced vision AI
- **📍 Report Wildlife Sightings** - Submit observations with photos, location, and details
- **🏆 Certificate System** - Earn certificates for verified sighting reports
- **🗺️ Interactive Maps** - Leaflet-powered location mapping with geolocation
- **🏥 Wildlife Centers Directory** - Find rescue centers and sanctuaries
- **🌳 Botanical Gardens** - Discover gardens and conservation centers
- **🤝 NGO Directory** - Connect with conservation organizations
- **👥 Volunteer Portal** - Find conservation opportunities
- **💬 AI Chatbot** - Get real-time conservation insights
- **👨‍💼 Admin Dashboard** - Manage reports, verify sightings, issue certificates

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **PostgreSQL** v14+ ([Download](https://www.postgresql.org/))

### Installation

```bash
# 1. Clone or download the project
cd wildguard

# 2. Install dependencies
npm install

# 3. Set up PostgreSQL database
psql -U postgres -c "CREATE DATABASE wildguard;"

# 4. Configure environment variables
cp .env.example .env
# Edit .env with your API keys (see API_KEYS_CHECKLIST.md)

# 5. Initialize database
npm run db:push

# 6. Start the application
npm run dev
```

**Access at:** http://localhost:5000

---

## 📚 Documentation

| File | Description |
|------|-------------|
| **[QUICK_START.md](QUICK_START.md)** | ⚡ Get running in 5 minutes |
| **[SETUP.md](SETUP.md)** | 📖 Complete setup guide with troubleshooting |
| **[API_KEYS_CHECKLIST.md](API_KEYS_CHECKLIST.md)** | 🔑 Detailed API key setup instructions |

---

## 🔑 Required API Keys

WildGuard requires these API services to function:

1. **OpenAI** - Animal identification ([Get Key](https://platform.openai.com/api-keys))
2. **Google Gemini** - Flora identification & AI features ([Get Key](https://aistudio.google.com/app/apikey))
3. **LocationIQ** - Maps & geocoding ([Get Key](https://locationiq.com/))

**Optional:**
- **NASA FIRMS** - Forest fire detection ([Request Key](https://firms.modaps.eosdis.nasa.gov/api/area/))

See **[API_KEYS_CHECKLIST.md](API_KEYS_CHECKLIST.md)** for detailed instructions on obtaining each key.

---

## 🗄️ Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Leaflet** - Interactive maps
- **TanStack Query** - Data fetching
- **Wouter** - Routing

### Backend
- **Express.js** - Server framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database toolkit
- **Multer** - File uploads
- **Passport.js** - Authentication

### AI Services
- **OpenAI GPT-5** - Animal identification
- **Google Gemini 2.0 Flash** - Flora ID + conservation features
- **NASA FIRMS API** - Satellite fire data

---

## 📁 Project Structure

```
wildguard/
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # UI components
│   │   └── lib/            # Utilities
├── server/                 # Backend Express app
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Data layer
│   ├── services/           # AI & external services
│   └── index.ts            # Server entry
├── shared/                 # Shared types
│   └── schema.ts           # Database schema
├── .env.example            # Environment template
├── package.json            # Dependencies
├── README.md              # This file
├── QUICK_START.md         # Quick setup
├── SETUP.md               # Detailed setup
└── API_KEYS_CHECKLIST.md  # API keys guide
```

---

## 🎮 Usage

### Identify Wildlife
1. Navigate to **Identify** page
2. Upload animal or plant photo
3. Get instant AI-powered identification
4. View species details, conservation status, habitat info

### Report Sightings
1. Go to **Actions → Report Sighting**
2. Upload photo of animal
3. Click "Capture Current Location" or enter manually
4. See your location on interactive map
5. Fill in sighting details
6. Submit report
7. Get verified and earn certificates!

### Admin Dashboard
1. Navigate to **Admin** login
2. Username: `admineo75`
3. Password: `wildguard1234`
4. View all sighting reports
5. Verify/reject submissions
6. Issue certificates to contributors

### AI Features
- Click **Features** in navigation
- Explore 9 AI-powered conservation tools
- Upload images/audio for analysis
- Get detailed AI-generated insights

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Database
npm run db:push          # Sync database schema
npm run db:push --force  # Force sync (if migration fails)
npm run db:studio        # Open Drizzle Studio (DB GUI)

# Production
npm run build            # Build for production
npm start                # Start production server
```

---

## 🔐 Security

- All API keys stored in `.env` (not committed to Git)
- Session management with PostgreSQL store
- Bcrypt password hashing for admin
- File type validation for uploads
- Rate limiting on API endpoints
- CORS configured for security

**Default Admin Credentials:**
- Username: `admineo75`
- Password: `wildguard1234`
- **⚠️ Change these in production!**

---

## 🐛 Troubleshooting

**Common Issues:**

1. **Database connection error**
   ```bash
   # Verify PostgreSQL is running
   pg_isready
   
   # Recreate database if needed
   psql -U postgres -c "DROP DATABASE wildguard; CREATE DATABASE wildguard;"
   npm run db:push
   ```

2. **API key errors**
   - Verify all keys in `.env`
   - Check for extra spaces
   - Restart server after adding keys

3. **Port 5000 in use**
   ```bash
   # Kill process (Mac/Linux)
   lsof -ti:5000 | xargs kill -9
   ```

4. **npm install fails**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

See **[SETUP.md](SETUP.md)** for comprehensive troubleshooting.

---

## 🌍 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
# Set environment
NODE_ENV=production

# Build application
npm run build

# Start with PM2 (process manager)
npm install -g pm2
pm2 start npm --name wildguard -- start
```

### Cloud Hosting Options
- **Replit** - Easiest deployment
- **Vercel** - Serverless frontend + backend
- **Railway** - Full-stack hosting
- **Heroku** - Traditional hosting
- **DigitalOcean** - VPS hosting

---

## 📊 Database Schema

Tables created automatically on first run:

- `users` - Admin accounts
- `wildlife_centers` - Centers directory
- `animal_identifications` - AI identification results
- `flora_identifications` - Plant identification results
- `animal_sightings` - User-submitted sightings
- `botanical_gardens` - Gardens directory
- `ngos` - NGO directory
- `volunteer_activities` - Volunteer opportunities
- `deforestation_alerts` - Habitat loss tracking
- `sound_detections` - Audio analysis results
- `footprint_analyses` - Track recognition results
- `habitat_monitoring` - Satellite monitoring data
- `partial_image_enhancements` - Image enhancement results
- `chat_messages` - Chatbot conversations
- `sessions` - Session storage

---

## 🎯 Features in Detail

### Animal Identification
- **Powered by:** OpenAI GPT-5
- **Accuracy:** High precision species identification
- **Output:** Species name, scientific name, conservation status, habitat, behavior, similar species

### Flora Identification  
- **Powered by:** Google Gemini 2.0 Flash
- **Capability:** Identifies plants, trees, flowers, fungi
- **Output:** Species name, family, habitat, uses, conservation status

### Poaching Detection
- **Technology:** Computer vision AI
- **Detects:** Weapons, traps, illegal activities, suspicious persons
- **Output:** Threat level, detected items, GPS coordinates, ranger recommendations

### Health Assessment
- **Analysis:** Injuries, diseases, malnutrition, parasites
- **Classification:** Health status (healthy → emergency)
- **Recommendations:** Veterinary actions, intervention urgency

### Wildlife Sightings
- **Map Integration:** Leaflet with OpenStreetMap
- **Geolocation:** Automatic location capture
- **Features:** Photo upload, habitat selection, condition reporting
- **Rewards:** Certificates for verified contributions

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **OpenAI** - Animal identification AI
- **Google Gemini** - Flora identification & conservation AI
- **NASA FIRMS** - Satellite fire data
- **LocationIQ** - Mapping services
- **OpenStreetMap** - Map tiles
- **Karnataka Forest Department** - Census data
- **Conservation Community** - Support and feedback

---

## 📞 Support

For issues or questions:

1. Check **[SETUP.md](SETUP.md)** troubleshooting section
2. Review **[API_KEYS_CHECKLIST.md](API_KEYS_CHECKLIST.md)**
3. Verify prerequisites are installed
4. Check console logs for errors

---

## 🎉 Get Started Now!

```bash
# Clone the project
cd wildguard

# Follow QUICK_START.md for 5-minute setup
# Or read SETUP.md for detailed instructions

npm install
npm run dev

# Access at: http://localhost:5000
```

**Happy Conservation! 🌿🦁🐘🦜**

---

## 📸 Screenshots

*Upload animal/plant photos for instant AI identification*
*Interactive maps with geolocation for sighting reports*
*Admin dashboard for verification and certificate issuance*
*9 powerful AI conservation tools for wildlife protection*

---

**Made with ❤️ for Wildlife Conservation**
