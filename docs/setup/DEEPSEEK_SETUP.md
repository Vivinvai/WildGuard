# DeepSeek API Integration Guide

## Overview
Wild Guard now supports **DeepSeek AI** as a primary AI provider. DeepSeek offers an Anthropic-compatible API that provides fast, accurate, and cost-effective AI inference.

## Setup Instructions

### 1. Get Your DeepSeek API Key
1. Visit [DeepSeek Platform](https://platform.deepseek.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Copy your API key

### 2. Configure Environment Variables

Edit your `.env` file and replace `your_deepseek_api_key_here` with your actual API key:

```env
# DeepSeek API Configuration (Anthropic-compatible)
ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
ANTHROPIC_AUTH_TOKEN=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
API_TIMEOUT_MS=600000
ANTHROPIC_MODEL=deepseek-chat
ANTHROPIC_SMALL_FAST_MODEL=deepseek-chat
```

### 3. Restart Your Application

```powershell
# Terminal 1: Start TensorFlow Service
npm run tensorflow

# Terminal 2: Start Main Application
npm run dev
```

## Features Powered by DeepSeek

### 🦁 Animal Identification
- Fast and accurate wildlife species identification
- Karnataka-specific animal knowledge
- Conservation status information
- Behavioral insights

### 🌿 Flora Identification
- Plant species recognition
- Medicinal and culinary uses
- Karnataka native plants
- Botanical information

### 💬 Wildlife Chatbot
- Expert wildlife conservation advice
- Educational content
- Rescue and protection guidance
- Interactive Q&A

## AI Provider Priority

DeepSeek is integrated into the AI orchestrator with the following priority:

1. **DeepSeek AI** (Primary - if API key configured) ⚡ Fast & Cost-effective
2. **Gemini AI** (Fallback) 🎯 High accuracy
3. **Local TensorFlow** (Always available) 🔒 Offline & Free
4. **Educational Database** (Last resort) 📚 Basic info

## Advantages of DeepSeek

✅ **Fast Response Times** - Optimized inference  
✅ **Cost-Effective** - Competitive pricing  
✅ **Anthropic-Compatible** - Standard API interface  
✅ **High Accuracy** - Latest AI models  
✅ **Long Context** - Up to 600 seconds timeout  
✅ **Reliable** - Production-ready infrastructure  

## Testing Your Integration

### Check API Configuration
```powershell
# Start the application
npm run dev

# Check health endpoint
curl http://localhost:5000/api/health
```

### Test Animal Identification
Use the Wild Guard web interface:
1. Navigate to "Identify" page
2. Upload an animal image
3. Check the response for "DeepSeek AI" provider

### Monitor Logs
Look for these log entries:
```
[animal_identification] 🌐 Tier 1: Attempting DeepSeek AI (Fast & Accurate)...
[animal_identification] ✅ DeepSeek AI success: Bengal Tiger (95.3%)
```

## Troubleshooting

### API Key Not Working
- Verify your API key is correct in `.env`
- Check that you have API credits
- Ensure no extra spaces in the environment variable

### Connection Errors
- Check your internet connection
- Verify the ANTHROPIC_BASE_URL is correct
- Ensure firewall isn't blocking API calls

### Timeout Issues
- Increase API_TIMEOUT_MS value (default: 600000ms = 10 minutes)
- Check your network stability

### Fallback Behavior
If DeepSeek fails, the system automatically falls back to:
- Gemini AI (if configured)
- Local TensorFlow (always available)
- Educational database (basic information)

## API Usage Limits

DeepSeek has usage limits based on your plan:
- **Free Tier**: Limited requests per day
- **Paid Tiers**: Higher rate limits

Monitor your usage at: https://platform.deepseek.com/usage

## Cost Optimization

To optimize API costs:
1. Use Local TensorFlow for basic identification
2. Reserve DeepSeek for complex cases
3. Enable caching in production
4. Monitor usage regularly

## Security Best Practices

⚠️ **Important Security Notes:**
- Never commit `.env` file to version control
- Keep your API key secret
- Rotate keys periodically
- Use environment-specific keys (dev/staging/prod)
- Monitor API usage for anomalies

## Support

For DeepSeek API issues:
- Documentation: https://platform.deepseek.com/docs
- Support: https://platform.deepseek.com/support

For Wild Guard integration issues:
- Check `docs/technical/TECHNICAL_DOCUMENTATION.md`
- Review server logs for error details

---

**Last Updated**: November 2025  
**Status**: ✅ Production Ready
