# Quick Setup: Add Your DeepSeek API Key

## Step 1: Add Your API Key

Open `.env` file and replace this line:

```env
ANTHROPIC_AUTH_TOKEN=your_deepseek_api_key_here
```

With your actual API key:

```env
ANTHROPIC_AUTH_TOKEN=sk-your-actual-deepseek-api-key
```

## Step 2: Restart Services

```powershell
# Terminal 1
npm run tensorflow

# Terminal 2  
npm run dev
```

## Step 3: Test It

Visit http://localhost:5000 and try the "Identify" feature with an animal image.

You should see "DeepSeek AI" in the provider name!

---

**That's it!** DeepSeek is now integrated and will be used as the primary AI provider.
