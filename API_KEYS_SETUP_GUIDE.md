# 🔑 API Keys Setup Guide for WildGuard

## Current Status (Test Results)

Based on the latest test, here's the status of your API keys:

```
❌ Gemini API: Quota exceeded - Need new API key
❌ OpenAI API: Quota exceeded or insufficient credits  
❌ Anthropic API: Low credits or billing issue
```

**Good News:** You can fix this quickly and get everything working! 🎉

---

## Priority Recommendation: Gemini API (FREE!)

### Why Gemini First?

✅ **100% FREE** - No credit card required  
✅ **Generous Limits** - 10 requests/minute, 250 requests/day  
✅ **Powers 90% of Features** - Animal ID, health assessment, all conservation tools  
✅ **5-Minute Setup** - Fastest to get working  
✅ **Hybrid AI Ready** - Works with our new two-stage detection system

---

## Step-by-Step: Get Free Gemini API Key

### 1. Get Your API Key (2 minutes)

1. Open **Google AI Studio**: https://aistudio.google.com/apikey
2. **Sign in** with any Google account (Gmail, Workspace, etc.)
3. **Accept** Terms of Service if prompted
4. Click **"Create API Key"** or **"Get API key"** button
5. **Copy** your new API key immediately

**Important:** Your key looks like: `AIza...` (keep it secret!)

### 2. Update Replit Secrets (1 minute)

1. In your Replit project, click **"Tools"** (left sidebar)
2. Click **"Secrets"** (🔒 lock icon)
3. Find `GEMINI_API_KEY` in the list
4. Click **"Edit"** next to it
5. **Paste** your new API key
6. Click **"Save"**

### 3. Restart Your Application (30 seconds)

1. Click the **"Stop"** button (top of page)
2. Click **"Run"** button to restart
3. Wait 10-15 seconds for TensorFlow.js model to load
4. Done! 🎉

### 4. Verify It Works

Visit **http://localhost:5000/api-setup** or navigate to **"API Setup"** in the app menu to test your keys.

---

## Optional: OpenAI API (Backup)

OpenAI provides high-quality backup when Gemini is unavailable.

### Get OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. Sign in or create account
3. Click "Create new secret key"
4. Name it "WildGuard" and copy the key
5. Go to Billing → Add payment method (required)
6. Set usage limit to $10/month (recommended)

### Update in Replit

1. Go to Replit Secrets
2. Edit `OPENAI_API_KEY`
3. Paste your new key
4. Save

**Cost:** ~$0.50-2.00/month for typical WildGuard usage with GPT-3.5-turbo

---

## Optional: Anthropic API (Enhanced Analysis)

Anthropic (Claude) provides exceptional analysis for complex cases.

### Get Anthropic API Key

1. Visit https://console.anthropic.com/settings/keys
2. Sign in or create account
3. Click "Create Key"
4. Copy your API key
5. Go to Billing → Add credits ($10+ recommended)

### Update in Replit

1. Go to Replit Secrets
2. Edit `ANTHROPIC_API_KEY`
3. Paste your new key
4. Save

**Cost:** ~$1-3/month for typical WildGuard usage with Claude 3.5

---

## Troubleshooting

### "My Gemini key isn't working"

**Possible causes:**
- ✅ Just created key? Wait 1-2 minutes for activation
- ✅ Exceeded daily quota? Quotas reset at midnight Pacific Time
- ✅ Need to restart app? Click Stop → Run

**Solution:**
```bash
# In Replit Console
curl http://localhost:5000/api/test-api-keys
```
This will show detailed error messages.

### "I get 429 errors"

**Cause:** Quota exceeded  
**Solutions:**
1. Wait until midnight PT for quota reset
2. Create a new Google account → new API key
3. Enable billing in Google Cloud (increases limits to 1,000 RPM)

### "None of my keys work"

**Quick Fix:**
1. Get fresh Gemini key (free, 5 minutes)
2. Update in Replit Secrets
3. Restart application
4. Visit `/api-setup` to verify

---

## What Each API Powers

### Gemini API (Primary)
- ✅ Animal Identification (hybrid AI with Local AI features)
- ✅ Health Assessment (wound detection with visual features)
- ✅ Flora Identification (backup for PlantNet)
- ✅ Poaching Detection
- ✅ Sound Detection
- ✅ Footprint Recognition
- ✅ AI Chatbot
- ✅ All 9 Conservation Tools

### OpenAI API (Backup)
- ✅ Fallback for all Gemini features
- ✅ Cross-verification in Smart Mode (30% of IDs)
- ✅ Enhanced accuracy through consensus

### Anthropic API (Backup)
- ✅ Final fallback for all features
- ✅ Cross-verification in Smart Mode
- ✅ Comprehensive analysis for complex cases

### Always Available (No API Keys)
- ✅ PlantNet (free plant identification - 71,000+ species)
- ✅ TensorFlow.js Local AI (offline animal/wound detection)
- ✅ Educational Databases (29 Karnataka animals, 21+ plants)
- ✅ Population Prediction (statistical analysis)
- ✅ NASA FIRMS (satellite monitoring)
- ✅ Wildlife Sightings Map

---

## Testing Your Setup

### Web Interface
1. Navigate to `/api-setup` in your app
2. Click "Test All Keys"
3. View status for each provider
4. Follow on-screen instructions if any fail

### API Endpoint
```bash
curl http://localhost:5000/api/test-api-keys
```

### Expected Success Response
```json
{
  "success": true,
  "workingCount": 3,
  "totalCount": 3,
  "summary": "✅ All API keys working!",
  "results": [
    {
      "provider": "Gemini",
      "status": "success",
      "message": "✅ Gemini API is working!"
    }
  ]
}
```

---

## Cost Comparison (Monthly)

| Provider | Free Tier | Typical Cost | Best For |
|----------|-----------|--------------|----------|
| **Gemini** | ✅ 250 req/day | $0 | Primary use |
| **OpenAI** | $5 trial credits | $0.50-2.00 | Backup |
| **Anthropic** | None | $1-3 | Enhanced analysis |
| **PlantNet** | ✅ Unlimited | $0 | Flora ID |
| **Local AI** | ✅ Unlimited | $0 | Offline backup |

**Recommended:** Just Gemini (free) covers all your needs!

---

## Quick Reference

### Replit Secrets Location
1. Click "Tools" (left sidebar)
2. Click "Secrets" (🔒 icon)
3. Edit these keys:
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`

### API Key Links
- **Gemini:** https://aistudio.google.com/apikey ⭐ FREE
- **OpenAI:** https://platform.openai.com/api-keys
- **Anthropic:** https://console.anthropic.com/settings/keys

### After Updating Keys
1. Click "Save" in Replit Secrets
2. Stop → Run (restart app)
3. Wait for "✅ Local AI warmup complete" in logs
4. Test at `/api-setup`

---

## Need Help?

### Check Logs
```bash
# View recent logs
tail -f logs/*.log
```

### Common Log Messages

✅ **"Gemini API is working!"**  
→ Everything is configured correctly!

❌ **"429 quota exceeded"**  
→ Get new API key or wait for quota reset

❌ **"401 invalid key"**  
→ Check that you copied the full key correctly

⚠️ **"Feature extraction failed"**  
→ Normal! System falls back to Cloud-only mode

---

## Success Checklist

- [ ] Got Gemini API key from https://aistudio.google.com/apikey
- [ ] Updated `GEMINI_API_KEY` in Replit Secrets
- [ ] Restarted application (Stop → Run)
- [ ] Tested at `/api-setup` - shows "✅ Gemini API is working!"
- [ ] (Optional) Added OpenAI/Anthropic keys for backup
- [ ] All WildGuard features working! 🎉

---

**You're all set!** With a free Gemini API key, WildGuard's entire conservation platform is at your fingertips - animal identification, wound detection, all 9 AI-powered tools, and more. No costs, no limits that matter for personal/educational use. 🌿🐾
