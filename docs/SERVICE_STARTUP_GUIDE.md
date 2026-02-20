# WildGuard Service Startup Guide

## ✅ Quick Start (All Services)

### Method 1: Automatic Startup Script
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
.\START_ALL_SERVICES.ps1
```

### Method 2: Manual Service Start

#### 1. Start Main Server (Port 5000)
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run dev
```

#### 2. Start TensorFlow Service (Port 5001)
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\ai_models"
python tensorflow_service_simple.py
```
**Look for**: `✅ Connected to PostgreSQL database`

#### 3. Start Poaching Detection (Port 5002)
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide\Poaching_Detection"
python yolo_poaching_service.py
```

#### 4. Start Injury Detection (Port 5004)
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
python injury-detection-service.py
```

## 🔍 Verify Services are Running

```powershell
# Check all ports
curl http://localhost:5000/health
curl http://localhost:5001/health
curl http://localhost:5002/health
curl http://localhost:5004/health
```

Expected responses:
- **Port 5000**: Express server health check
- **Port 5001**: `{"status":"healthy","model":"MobileNetV2"}`
- **Port 5002**: YOLO service health
- **Port 5004**: Injury detection health

## 🎯 Test the UI Enhancement

### 1. Open the Application
```
http://localhost:5000
```

### 2. Navigate to Identify Page
- Click "Identify" in the navigation menu

### 3. Upload a Tiger Image
- Click the upload area or drag & drop
- Select any tiger image from your files

### 4. Verify UI Shows:
- ✅ Large animal image (224x224px)
- ✅ **Orange "Endangered" badge** (conservation status)
- ✅ **Green population badge**: `~3,167`
- ✅ **Emerald gradient header**
- ✅ **4 Stat cards**:
  - Blue: AI Match (95%+)
  - Orange: Conservation Status (Endangered)
  - Green: Population (~3,167)
  - Red: Threats (count)
- ✅ **About This Species** section with:
  - Detailed description
  - Habitat information
  - Conservation efforts

## 📊 Database Verification

### Check PostgreSQL Data
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
psql -U postgres -d Wild_Guard_DB
```

```sql
-- View all species
SELECT species_name, conservation_status, population 
FROM supported_animals 
ORDER BY conservation_status;

-- Check Tiger specifically
SELECT * FROM supported_animals 
WHERE species_name LIKE '%Tiger%';
```

Expected output:
```
species_name         | conservation_status | population
---------------------+---------------------+-----------
Indian Bengal Tiger  | Endangered          | ~3,167
```

## 🐛 Troubleshooting

### Issue: Services Won't Start

#### Check Python Installation
```powershell
python --version  # Should be Python 3.10+
```

#### Install Missing Dependencies
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
pip install -r requirements.txt
pip install psycopg2-binary  # PostgreSQL adapter
```

### Issue: "PostgreSQL not available - using fallback mode"

#### Fix: Update Database Password
Edit `.env` file:
```
DATABASE_URL=postgresql://postgres:pokemon1234@localhost:5432/Wild_Guard_DB
```

#### Re-apply Migration
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
python apply_migration.py
```

Expected output:
```
✅ Migration applied successfully

📊 Sample Data:
  Indian Bengal Tiger - Endangered - ~3,167
  Asiatic Lion - Endangered - ~670
  ...
```

### Issue: Conservation Status Not Showing

#### Verify Frontend Database
Open `client/src/components/animal-info.tsx` and check `INDIAN_WILDLIFE_INFO` contains:
```typescript
'Indian Bengal Tiger': {
  conservationStatus: 'Endangered',
  population: '~3,167',
  // ...
}
```

#### Check Backend Response
```powershell
# Test TensorFlow directly
cd "d:\Wild-Guard 5.0\WildRescueGuide"
python test_postgres_integration.py
```

Look for:
```
✅ Species: Indian Bengal Tiger
🔴 Conservation Status: Endangered
📊 Population: ~3,167
💾 Database Enhanced: True
```

### Issue: UI Not Updating

#### Clear Browser Cache
- **Chrome/Edge**: `Ctrl + Shift + Delete`
- **Firefox**: `Ctrl + Shift + Delete`
- Clear "Cached images and files"

#### Force Rebuild Frontend
```powershell
cd "d:\Wild-Guard 5.0\WildRescueGuide"
npm run build
npm run dev
```

## 🔄 Complete Reset (If Needed)

```powershell
# 1. Stop all services
Get-Process node,python | Stop-Process -Force

# 2. Re-apply database migration
cd "d:\Wild-Guard 5.0\WildRescueGuide"
python apply_migration.py

# 3. Restart all services
.\START_ALL_SERVICES.ps1

# 4. Manually start TensorFlow
cd ai_models
python tensorflow_service_simple.py

# 5. Manually start Poaching Detection
cd ..\Poaching_Detection
python yolo_poaching_service.py
```

## 📝 Service Logs

### View TensorFlow Service Log
Look for these messages:
```
✅ Connected to PostgreSQL database
INFO: Loading MobileNetV2 model...
INFO: ✅ MobileNetV2 model loaded successfully!
INFO: 🐾 WildGuard Animal Identification Service
INFO: 🚀 Service ready!
```

### View Enrichment in Action
When identifying an animal, TensorFlow logs:
```
INFO: Identified: Tiger (65.3%)
✅ Enriched with PostgreSQL: Indian Bengal Tiger
```

## 🎯 Expected Behavior

### For Tiger:
- **Species**: Indian Bengal Tiger
- **Conservation Status**: Endangered (orange badge)
- **Population**: ~3,167
- **Habitat**: Indian subcontinent forests, grasslands, and mangroves
- **Threats**: Habitat loss, Poaching, Human-wildlife conflict
- **UI**: Large image, emerald header, 4 stat cards, detailed info

### For Elephant:
- **Species**: Indian Elephant
- **Conservation Status**: Vulnerable (yellow badge)
- **Population**: ~27,000
- **Habitat**: Forests and grasslands of India
- **Threats**: Habitat fragmentation, Human-wildlife conflict

### For Peafowl:
- **Species**: Indian Peafowl
- **Conservation Status**: Least Concern (green badge)
- **Population**: Millions
- **Habitat**: Forests, grasslands, and agricultural areas

## ✅ Success Checklist

- [ ] All 4 services running (ports 5000, 5001, 5002, 5004)
- [ ] PostgreSQL connected: "✅ Connected to PostgreSQL database"
- [ ] 15 species in `supported_animals` table
- [ ] Frontend UI shows large animal images
- [ ] Conservation status visible and color-coded
- [ ] Population data displays for all 15 species
- [ ] Stat cards always visible (not conditional)
- [ ] Habitat and threats information showing

## 🚀 You're Ready!

Once all services are running and checkmarks above are complete, navigate to:
```
http://localhost:5000
```

Click **Identify** → Upload animal image → See the enhanced UI with:
- 🖼️ Large animal image
- 🟠 Conservation status badge (Endangered/Vulnerable/Least Concern)
- 👥 Population count
- 📊 4 colorful stat cards
- 📝 Detailed species information
- 🗺️ Habitat details
- 🛡️ Conservation efforts

**Everything works now!** 🎉

---

**Documentation Location**: `d:\Wild-Guard 5.0\WildRescueGuide\docs\`
**Support Files**:
- `UI_ENHANCEMENT_SUMMARY.md` - Complete enhancement overview
- `START_ALL_SERVICES.ps1` - Automatic startup script
- `apply_migration.py` - Database migration helper
- `test_postgres_integration.py` - Test TensorFlow+PostgreSQL
