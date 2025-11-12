# 🔑 WildGuard API Keys Checklist

## ✅ Required API Keys

These keys are **REQUIRED** for WildGuard to function properly:

### 1. ✓ OpenAI API Key
- **Status**: ✅ REQUIRED
- **Used for**: Animal identification using GPT-5
- **Get it from**: https://platform.openai.com/api-keys
- **Environment Variable**: `OPENAI_API_KEY`
- **Format**: `sk-...` (starts with sk-)
- **Cost**: Pay-per-use (check OpenAI pricing)

**How to get:**
1. Create account at https://platform.openai.com/
2. Navigate to API Keys section
3. Click "Create new secret key"
4. Copy and save immediately (shown only once!)

---

### 2. ✓ Google Gemini API Key
- **Status**: ✅ REQUIRED
- **Used for**: 
  - Flora identification
  - Poaching detection
  - Health assessment
  - Sound detection
  - Footprint recognition
  - Partial image enhancement
  - Wildlife chatbot
- **Get it from**: https://aistudio.google.com/app/apikey
- **Environment Variable**: `GEMINI_API_KEY`
- **Cost**: Free tier available + pay-per-use

**How to get:**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

---

### 3. ✓ LocationIQ API Key
- **Status**: ✅ REQUIRED
- **Used for**: Maps, geocoding, reverse geocoding
- **Get it from**: https://locationiq.com/
- **Environment Variable**: `LOCATIONIQ_API_KEY`
- **Cost**: Free tier (60,000 requests/month) + paid plans

**How to get:**
1. Sign up at https://locationiq.com/
2. Verify email
3. Go to Dashboard → Access Tokens
4. Copy your access token

---

## 🔓 Optional API Keys

These keys are **OPTIONAL** but enable additional features:

### 4. ⭕ NASA FIRMS API Key
- **Status**: ⚠️ OPTIONAL
- **Used for**: Live forest fire detection in Habitat Monitor
- **Get it from**: https://firms.modaps.eosdis.nasa.gov/api/area/
- **Environment Variable**: `FIRMS_API_KEY`
- **Cost**: FREE

**How to get:**
1. Go to https://firms.modaps.eosdis.nasa.gov/api/area/
2. Request API key (requires email)
3. Check email for API key
4. Note: May take 24-48 hours to receive

**What happens without it:**
- Habitat monitoring still works with sample data
- Live fire detection feature will be disabled

---

## 🗄️ Database Configuration

### PostgreSQL Database
- **Status**: ✅ REQUIRED
- **Used for**: All data storage
- **Environment Variables**:
  - `DATABASE_URL`
  - `PGHOST`
  - `PGUSER`
  - `PGPASSWORD`
  - `PGDATABASE`
  - `PGPORT`

**Local Setup:**
```bash
# Install PostgreSQL
# Then create database:
psql -U postgres -c "CREATE DATABASE wildguard;"

# Your .env should have:
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/wildguard
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=yourpassword
PGDATABASE=wildguard
PGPORT=5432
```

**Cloud Options (Production):**
- Neon (https://neon.tech) - Serverless PostgreSQL
- Supabase (https://supabase.com) - PostgreSQL + extras
- Railway (https://railway.app) - PostgreSQL hosting
- Heroku Postgres

---

## 🔐 Session Secret

### Session Secret Key
- **Status**: ✅ REQUIRED
- **Used for**: Secure session management
- **Environment Variable**: `SESSION_SECRET`
- **Format**: Random 64-character hex string

**Generate one:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

Copy this and use as your `SESSION_SECRET` in `.env`

---

## 📋 API Keys Summary Table

| API Key | Required | Free Tier | Used For | Get From |
|---------|----------|-----------|----------|----------|
| OpenAI | ✅ Yes | No (pay-per-use) | Animal ID | platform.openai.com |
| Gemini | ✅ Yes | Yes | Flora ID + 6 AI features | aistudio.google.com |
| LocationIQ | ✅ Yes | Yes (60k/month) | Maps & geocoding | locationiq.com |
| NASA FIRMS | ⚠️ Optional | Yes | Fire detection | firms.modaps.eosdis.nasa.gov |

---

## 💰 Cost Estimate

**Minimal Usage (Testing/Development):**
- OpenAI: ~$1-5/month (depends on usage)
- Gemini: FREE (within limits)
- LocationIQ: FREE (within 60k requests/month)
- NASA FIRMS: FREE
- **Total: ~$1-5/month**

**Production Usage:**
- Will vary based on traffic
- Consider setting up billing alerts
- Monitor usage dashboards

---

## 🛡️ Security Best Practices

1. **Never commit API keys to Git**
   - Already protected by `.gitignore`
   - `.env` file is excluded from version control

2. **Use different keys for dev/prod**
   - Create separate API keys for development and production
   - Label them clearly in provider dashboards

3. **Rotate keys regularly**
   - Change keys every 3-6 months
   - Update immediately if compromised

4. **Set usage limits**
   - Configure spending limits in API dashboards
   - Set up billing alerts

5. **Monitor usage**
   - Check API dashboards regularly
   - Look for unusual spikes

---

## ✅ Setup Verification

After getting all keys, verify your `.env` file:

```bash
# Required keys present?
✓ OPENAI_API_KEY=sk-...
✓ GEMINI_API_KEY=...
✓ LOCATIONIQ_API_KEY=...
✓ DATABASE_URL=postgresql://...
✓ SESSION_SECRET=...

# Optional
⚪ FIRMS_API_KEY=... (optional)
```

Test each key:
```bash
# Start the app
npm run dev

# Test features:
# 1. Upload animal photo → Should identify (OpenAI)
# 2. Upload plant photo → Should identify (Gemini)
# 3. Check map on report page → Should load (LocationIQ)
# 4. All AI features should work (Gemini)
```

---

## 🆘 Troubleshooting API Keys

### "Invalid API Key" Error

**OpenAI:**
- Verify key starts with `sk-`
- Check if billing is set up
- Ensure key is active (not revoked)

**Gemini:**
- Verify you copied entire key
- Check if API is enabled in Google Cloud
- Ensure no extra spaces

**LocationIQ:**
- Verify email is confirmed
- Check free tier isn't exceeded
- Try regenerating access token

### "Rate Limit Exceeded"

- You've hit the free tier limit
- Wait for quota reset OR upgrade plan
- For development, consider using sample data

### "Payment Required"

**OpenAI:**
- Set up billing at https://platform.openai.com/account/billing
- Add payment method
- May need to add initial credit

---

## 📞 Support Links

- **OpenAI Support**: https://help.openai.com/
- **Google AI Support**: https://ai.google.dev/support
- **LocationIQ Support**: https://locationiq.com/support
- **NASA FIRMS Contact**: https://firms.modaps.eosdis.nasa.gov/contact/

---

## 🎯 Ready to Start?

Once you have all required API keys:

1. ✅ Copy `.env.example` to `.env`
2. ✅ Paste your actual API keys
3. ✅ Generate and add session secret
4. ✅ Configure database connection
5. ✅ Run `npm install`
6. ✅ Run `npm run db:push`
7. ✅ Run `npm run dev`
8. ✅ Test at http://localhost:5000

**You're all set! 🚀**
