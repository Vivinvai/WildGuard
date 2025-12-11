# 🚀 Deploy WildGuard to Vercel - Step by Step

**Your GitHub Repository**: https://github.com/Vivinvai/WildGuard

---

## ✅ **Step 1: Deploy Frontend to Vercel (5 minutes)**

### **1.1 Go to Vercel**
Open: https://vercel.com/new

### **1.2 Import Your Repository**
1. Click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Find: **Vivinvai/WildGuard**
4. Click **"Import"**

### **1.3 Configure Project**
```yaml
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **1.4 Environment Variables**
Click **"Environment Variables"** and add:

**For Development (optional):**
```
VITE_API_URL=http://localhost:5000
```

**For Production (after deploying backend):**
```
VITE_API_URL=https://your-backend-url.railway.app
```

*(You can add this later after deploying the backend)*

### **1.5 Deploy!**
Click **"Deploy"** button

⏳ Wait 2-3 minutes...

✅ **Done!** Your frontend will be live at:
```
https://wild-guard.vercel.app
```
*(or similar URL)*

---

## 🚂 **Step 2: Deploy Backend to Railway (10 minutes)**

### **2.1 Create Railway Account**
1. Go to: https://railway.app
2. Sign up with GitHub
3. Verify email

### **2.2 Create New Project**
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose: **Vivinvai/WildGuard**
4. Click **"Deploy Now"**

### **2.3 Add PostgreSQL Database**
1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Wait for database to provision

### **2.4 Configure Main Backend Service**

Click on your **WildGuard service** → **Variables** tab:

```env
# Database (auto-filled by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Node Environment
NODE_ENV=production
PORT=5000

# API Keys (get these FREE keys)
GEMINI_API_KEY=your_gemini_key_here
DEEPSEEK_API_KEY=your_deepseek_key_here

# Session Secret (generate random string)
SESSION_SECRET=generate_64_char_random_string

# Frontend URL (from Vercel)
CLIENT_URL=https://your-vercel-url.vercel.app
```

### **2.5 Add AI Services**

**Service 2: TensorFlow AI**
1. Click **"+ New"** → **"Empty Service"**
2. Name: `wildguard-tensorflow`
3. Settings → **Root Directory**: `/ai_models`
4. Settings → **Start Command**: `python tensorflow_service.py`
5. Variables:
   ```env
   PORT=5001
   ```

**Service 3: Poaching Detection**
1. Click **"+ New"** → **"Empty Service"**
2. Name: `wildguard-poaching`
3. Settings → **Root Directory**: `/Poaching_Detection`
4. Settings → **Start Command**: `python yolo_poaching_service.py`
5. Variables:
   ```env
   PORT=5002
   ```

**Service 4: Injury Detection**
1. Click **"+ New"** → **"Empty Service"**
2. Name: `wildguard-injury`
3. Settings → **Root Directory**: `/`
4. Settings → **Start Command**: `python injury-detection-service.py`
5. Variables:
   ```env
   PORT=5004
   ```

### **2.6 Link Services**

In **Main Backend** variables, add:
```env
TENSORFLOW_SERVICE_URL=http://wildguard-tensorflow.railway.internal:5001
POACHING_SERVICE_URL=http://wildguard-poaching.railway.internal:5002
INJURY_SERVICE_URL=http://wildguard-injury.railway.internal:5004
```

### **2.7 Get Backend URL**

1. Click on your main service
2. Go to **Settings** → **Networking**
3. Click **"Generate Domain"**
4. Copy the URL (e.g., `https://wildguard-production.up.railway.app`)

---

## 🔗 **Step 3: Connect Frontend to Backend**

### **3.1 Update Vercel Environment**
1. Go to: https://vercel.com/dashboard
2. Select your **WildGuard** project
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   ```
   VITE_API_URL=https://your-railway-backend.railway.app
   ```
5. Click **"Save"**

### **3.2 Redeploy Frontend**
1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Select **"Redeploy with existing Build Cache"**

---

## 🔑 **Step 4: Get FREE API Keys**

### **Gemini AI (Required)**
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click **"Create API Key"**
4. Copy key
5. Add to Railway → Main Backend → Variables:
   ```
   GEMINI_API_KEY=your_key_here
   ```

### **DeepSeek AI (Required)**
1. Go to: https://platform.deepseek.com/api_keys
2. Sign up (free $10 credit)
3. Create API key
4. Copy key
5. Add to Railway → Main Backend → Variables:
   ```
   DEEPSEEK_API_KEY=your_key_here
   ```

---

## ✅ **Step 5: Test Your Deployment**

### **5.1 Check Service Health**
```bash
# Test main backend
curl https://your-backend.railway.app/api/health

# Should return: {"status":"healthy"}
```

### **5.2 Test Frontend**
1. Open: `https://your-app.vercel.app`
2. Click **"Identify Animal"**
3. Upload a photo
4. Allow GPS permission
5. Should identify the animal!

### **5.3 Test Features**
- ✅ Animal identification works
- ✅ GPS captures location
- ✅ Poaching detection active
- ✅ Admin dashboard accessible at `/admin`

---

## 📊 **Your Deployment URLs**

After deployment, you'll have:

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://wild-guard.vercel.app | ✅ |
| **Backend API** | https://wildguard-production.railway.app | ✅ |
| **TensorFlow AI** | Internal (Railway network) | ✅ |
| **Poaching Detection** | Internal (Railway network) | ✅ |
| **Injury Detection** | Internal (Railway network) | ✅ |
| **PostgreSQL** | Internal (Railway network) | ✅ |

---

## 💰 **Costs**

### **Vercel (Frontend)**
- **FREE** forever
- Unlimited bandwidth
- Automatic SSL
- Global CDN

### **Railway (Backend + AI + Database)**
- **FREE Trial**: $5 credit
- **Hobby Plan**: $5/month
- **Pro Plan**: $20/month (recommended)

**Total**: ~$5-20/month for production deployment

---

## 🐛 **Troubleshooting**

### **Issue: Vercel build fails**
**Solution:**
```bash
# Test build locally first
npm run build

# Check for errors, fix them, then:
git add .
git commit -m "Fix build errors"
git push origin main

# Vercel will auto-redeploy
```

### **Issue: API calls failing**
**Solution:**
1. Check Railway logs: Dashboard → Service → **Logs**
2. Verify `VITE_API_URL` in Vercel matches Railway URL
3. Check CORS settings in `server/index.ts`

### **Issue: Database not connecting**
**Solution:**
1. In Railway, check if PostgreSQL is running
2. Verify `DATABASE_URL` variable exists
3. Run migrations: In Railway service → **Run command**: `npm run db:push`

### **Issue: AI models not loading**
**Solution:**
- AI models are large (excluded from Git)
- Railway will need to download them on first deploy
- Check service logs for download progress
- May take 5-10 minutes on first deployment

---

## 🔄 **Continuous Deployment (Auto-Deploy)**

**Good news!** Both Vercel and Railway are now set up with **automatic deployment**:

1. Make changes to your code locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **Vercel and Railway automatically redeploy!** 🎉

No manual deployment needed!

---

## 📧 **Share Your Deployment**

Your live WildGuard platform:
- **GitHub**: https://github.com/Vivinvai/WildGuard
- **Live App**: https://your-vercel-url.vercel.app
- **API Docs**: https://your-railway-url.railway.app/api/health

Share it on:
- LinkedIn
- Twitter
- Your resume/portfolio
- With your team

---

## 🎉 **Congratulations!**

Your **WildGuard 4.0** is now deployed with:
✅ Frontend on Vercel (FREE)
✅ Backend on Railway
✅ 4 AI services running
✅ PostgreSQL database
✅ Automatic deployments
✅ SSL certificates
✅ Global CDN

**Your wildlife conservation platform is LIVE! 🦁🌍**

---

## 📞 **Need Help?**

- Check Railway logs: Dashboard → Service → Logs
- Check Vercel logs: Dashboard → Deployments → View Function Logs
- Test locally first: `.\START_ALL_SERVICES.ps1`
- Review: `DEPLOYMENT_GUIDE.md` for detailed troubleshooting

**Happy deploying! 🚀**
