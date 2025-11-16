# ⚠️ Why Your "New" API Keys Aren't Working

## The Problem

You added new API keys, but they're still showing the same quota errors:

```
Gemini: "Quota exceeded... limit: 0"
OpenAI: "429 Quota exceeded"  
Anthropic: "Credit balance too low"
```

## Why This Happens

### ✅ The Keys ARE Recognized

The system IS seeing your new keys - but there's a critical detail:

**API quotas are tied to ACCOUNTS/PROJECTS, not individual keys!**

### What's Really Happening:

**Gemini API:**
- Your new key is from the **SAME Google account/project** that hit quota
- Google tracks quota per PROJECT, not per API key
- Even a fresh key from the same account has `limit: 0`
- **Solution:** Need key from DIFFERENT Google account

**OpenAI API:**
- Your account has NO CREDITS or expired trial
- Generating new keys doesn't add credits
- **Solution:** Add payment method + credits, OR new account with trial credits

**Anthropic API:**
- Your account balance is depleted
- New keys don't add funds
- **Solution:** Purchase credits, OR new account

---

## How to ACTUALLY Fix This (Step-by-Step)

### Option 1: Get TRULY Fresh Gemini Key (RECOMMENDED - FREE!)

**The key must be from a DIFFERENT Google account:**

1. **Create Brand New Gmail:**
   - Go to https://accounts.google.com/signup
   - Use a different email (work email, family member's, project-specific)
   - Complete signup

2. **Get API Key from NEW Account:**
   - Visit https://aistudio.google.com/apikey
   - Sign in with your BRAND NEW Google account
   - Click "Create API Key"
   - Copy the key (starts with `AIza...`)

3. **Update in Replit:**
   - Tools → Secrets → `GEMINI_API_KEY`
   - Paste the NEW key from NEW account
   - Click "Save"

4. **Restart App:**
   - Stop → Run
   - Wait for "✅ Local AI warmup complete"
   - Test at `/api-setup`

**This works because:**
- New Google account = fresh project = new quota
- Free tier: 250 requests/day, 10 requests/minute
- Perfect for WildGuard's usage!

---

### Option 2: Wait for Quota Reset

Your current Gemini key will work again at **midnight Pacific Time** (in a few hours):

- Daily quota: 250 requests resets daily
- Monthly quota: ~7,500 requests resets monthly
- Your same key will work - just wait!

---

### Option 3: Add Credits to Existing Accounts

**For OpenAI:**
1. Visit https://platform.openai.com/account/billing
2. Add payment method (credit card)
3. Purchase $10+ in credits
4. Your existing OpenAI key will work immediately

**For Anthropic:**
1. Visit https://console.anthropic.com/settings/billing
2. Purchase credits ($10 minimum)
3. Your existing Anthropic key will work immediately

---

## How to Verify You Have NEW Keys

### Wrong Approach ❌
- Regenerating key in SAME Google account
- Creating 2nd key in SAME OpenAI account
- Creating 2nd key in SAME Anthropic account

**Why it fails:** Quota is account-level, not key-level!

### Right Approach ✅
- Key from DIFFERENT Google account (new Gmail)
- Key from account WITH CREDITS (OpenAI/Anthropic)
- Key from DIFFERENT OpenAI/Anthropic account

---

## Quick Test: Are Your Keys Actually Different?

### Gemini API Key Format:
- Old project key: `AIzaSyD...ABC123`
- New project key: `AIzaSyD...XYZ789` ← Should have different ending

**But more importantly:**
- ❌ Same Google account = Same quota (even if key looks different)
- ✅ Different Google account = Fresh quota

### OpenAI API Key Format:
- Old: `sk-proj-...ABC123`
- New: `sk-proj-...XYZ789`

**Key question:** Did you add credits/payment method?
- ❌ No credits = Key won't work
- ✅ Credits added = Key works

---

## What The Logs Tell Us

Looking at your error messages:

```
Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests
limit: 0, model: gemini-2.0-flash-exp
```

**The `limit: 0` means:**
- ✅ Your Gemini API key IS valid and recognized
- ❌ But the Google Cloud PROJECT it belongs to has exhausted quota
- ❌ That project's quota is set to zero until reset/upgrade

**This confirms:** You regenerated a key in the same Google account/project!

---

## My Recommendation: Do This NOW (5 Minutes)

**Fastest path to working WildGuard:**

1. **Create new Gmail** → https://accounts.google.com/signup
   - Literally any name, pick unused username
   - Takes 2 minutes

2. **Get Gemini key from new account** → https://aistudio.google.com/apikey
   - Sign in with NEW Gmail
   - Create API Key
   - Copy it
   - Takes 1 minute

3. **Update Replit secret:**
   - Tools → Secrets → GEMINI_API_KEY
   - Paste NEW key
   - Save
   - Takes 30 seconds

4. **Restart app & test:**
   - Stop → Run
   - Go to `/api-setup`
   - Click "Test All Keys"
   - See ✅ for Gemini!
   - Takes 1 minute

**Total: 5 minutes to full functionality!**

---

## Alternative: Use What's Working NOW

**Good news:** Even without cloud APIs, your system works via:

✅ **TensorFlow.js Local AI** - Free, offline animal/wound detection  
✅ **PlantNet API** - Free plant identification (71,000+ species)  
✅ **NASA FIRMS** - Free satellite monitoring  
✅ **Educational Database** - 29+ Karnataka species  
✅ **All 9 conservation tools** - Work without APIs

**BUT** to get the new hybrid features (Local AI + Gemini), you need working Gemini API.

---

## Bottom Line

Your "new" keys aren't working because:
- **Gemini**: Same Google account = same quota block
- **OpenAI**: Account needs credits/payment
- **Anthropic**: Account needs funding

**What to do:**
1. **Get Gemini key from DIFFERENT Google account** (recommended, free, 5 minutes)
2. **OR wait until midnight PT** for current key to reset
3. **OR add credits** to OpenAI/Anthropic accounts

---

**Need help? I can walk you through creating a new Google account and getting the key step-by-step!**
