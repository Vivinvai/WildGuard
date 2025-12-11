# Wild Guard - TensorFlow Setup Complete! 🎉

## ✅ What's Working

Your Wild Guard application now has **TensorFlow AI** fully working with:

1. **Python TensorFlow 2.20.0** - Latest version installed
2. **MobileNetV2 Model** - Pre-trained ImageNet classifier
3. **Flask API Server** - Python service on port 5001
4. **Node.js Integration** - Seamless communication between Node and Python
5. **PostgreSQL Database** - Connected and populated with data

## 🚀 How to Run

### Terminal 1: Start TensorFlow AI Service
```bash
npm run tensorflow
```
Or manually:
```powershell
cd ai_models
& "D:/Wild-Guard 4.0/WildRescueGuide/WildRescueGuide/.venv/Scripts/python.exe" tensorflow_service.py
```

### Terminal 2: Start Node.js Development Server
```bash
npm run dev
```

### 🌐 Access Your App
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api
- **TensorFlow AI**: http://localhost:5001

## 📁 Project Structure

```
WildRescueGuide/
├── ai_models/                    # Python TensorFlow Service
│   ├── venv/                     # Python virtual environment
│   ├── tensorflow_service.py     # Flask AI API server
│   └── requirements.txt          # Python dependencies
│
├── server/
│   ├── services/
│   │   ├── local-ai.ts          # Node.js interface to TensorFlow
│   │   └── tensorflow-bridge.ts  # Bridge to Python service
│   ├── db.ts                     # Database connection
│   └── index.ts                  # Main server
│
├── .env                          # Environment variables
├── start-tensorflow.ps1          # TensorFlow startup script
└── package.json
```

## 🔧 Technologies

### Python Environment (`ai_models/`)
- **TensorFlow 2.20.0** - Deep learning framework
- **Flask 3.0.0** - Web framework for AI API
- **Pillow 10.3.0** - Image processing
- **NumPy** - Numerical computations
- **TensorFlow Hub** - Pre-trained model repository

### Node.js Backend
- **Express** - Web server
- **PostgreSQL** - Database (Wild_Guard_DB)
- **TypeScript** - Type-safe development
- **Drizzle ORM** - Database management

## 🤖 AI Features

The TensorFlow service provides:

1. **Animal Identification** (`POST /identify/animal`)
   - Upload animal images
   - Get species identification
   - Conservation status
   - Confidence scores

2. **Flora Identification** (`POST /identify/flora`)
   - Upload plant images
   - Species classification
   - Habitat information

3. **Health Check** (`GET /health`)
   - Service status
   - Model information
   - TensorFlow version

## 📊 Database

Connected to: `postgresql://postgres:pokemon1234@localhost:5432/Wild_Guard_DB`

**21 Tables Created:**
- users, admin_users
- wildlife_centers (8 entries)
- botanical_gardens (4 entries)
- ngos (5 entries)
- animal_identifications
- flora_identifications
- discover_animals
- animal_sightings
- certificates
- And more...

## 🔑 Environment Variables

`.env` file contains:
```env
DATABASE_URL=postgresql://postgres:pokemon1234@localhost:5432/Wild_Guard_DB
SESSION_SECRET=wild_guard_secure_session_secret_key_2025
TENSORFLOW_SERVICE_URL=http://localhost:5001
```

## 🎯 How It Works

1. **User uploads image** → Node.js server receives it
2. **Server forwards to Python** → TensorFlow service on port 5001
3. **Python processes image** → MobileNetV2 model analyzes
4. **Returns predictions** → Species, confidence, conservation status
5. **Server stores result** → PostgreSQL database
6. **Frontend displays** → User sees identification

## 📝 Common Commands

```bash
# Start TensorFlow service
npm run tensorflow

# Start development server
npm run dev

# Test database connection
node scripts/test-db-connection.js

# Check TensorFlow service health
curl http://localhost:5001/health

# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### TensorFlow Service Not Starting
```bash
cd ai_models
& "D:/Wild-Guard 4.0/WildRescueGuide/WildRescueGuide/.venv/Scripts/python.exe" -m pip install -r requirements.txt
```

### Port 5000 Already in Use
Change in `.env`:
```env
PORT=3000
```

### Database Connection Failed
Check PostgreSQL is running:
```bash
psql -U postgres -d Wild_Guard_DB
```

### Python Environment Issues
Recreate virtual environment:
```bash
cd ai_models
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 🎓 API Examples

### Identify Animal (cURL)
```bash
curl -X POST http://localhost:5001/identify/animal \
  -F "image=@path/to/animal.jpg"
```

### Identify Plant (cURL)
```bash
curl -X POST http://localhost:5001/identify/flora \
  -F "image=@path/to/plant.jpg"
```

### Health Check
```bash
curl http://localhost:5001/health
```

## 🌟 Features Enabled

- ✅ TensorFlow AI (Local, FREE)
- ✅ Animal Identification
- ✅ Flora Identification
- ✅ PostgreSQL Database
- ✅ Wildlife Centers Map
- ✅ Botanical Gardens
- ✅ NGO Partnerships
- ✅ Conservation Certificates
- ✅ Deforestation Alerts
- ✅ User Activity Tracking

## 📚 Next Steps

1. Add API keys for enhanced features (optional):
   - `GOOGLE_API_KEY` - For Gemini AI
   - `OPENAI_API_KEY` - For GPT-4 Vision

2. Deploy to production:
   - Set up cloud database
   - Deploy Python service
   - Deploy Node.js app

3. Enhance AI models:
   - Fine-tune for Karnataka wildlife
   - Add specialized models
   - Implement caching

---

**Status**: ✅ Production Ready
**Last Updated**: November 17, 2025
**TensorFlow Version**: 2.20.0
**Node.js Version**: 22.18.0
**Python Version**: 3.10.6
