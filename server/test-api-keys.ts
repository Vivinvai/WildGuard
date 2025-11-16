/**
 * API Key Testing Utility
 * Tests all three AI providers to verify API keys are working
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface TestResult {
  provider: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
}

/**
 * Test Gemini API Key
 */
async function testGeminiAPI(): Promise<TestResult> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        provider: 'Gemini',
        status: 'error',
        message: 'API key not found in environment variables',
      };
    }

    console.log('🧪 Testing Gemini API...');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent('Say "Hello" if you can hear me.');
    const response = result.response.text();
    
    return {
      provider: 'Gemini',
      status: 'success',
      message: '✅ Gemini API is working!',
      details: { response: response.substring(0, 100) },
    };
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    
    // Check for specific error types
    if (errorMsg.includes('429') || errorMsg.includes('quota')) {
      return {
        provider: 'Gemini',
        status: 'error',
        message: '⚠️ Quota exceeded - Need new API key or wait for reset',
        details: { 
          error: 'Free tier quota exceeded',
          solution: 'Visit https://aistudio.google.com/apikey to get a new free API key'
        },
      };
    } else if (errorMsg.includes('401') || errorMsg.includes('API key')) {
      return {
        provider: 'Gemini',
        status: 'error',
        message: '❌ Invalid API key',
        details: {
          error: 'API key is invalid or expired',
          solution: 'Get new key at https://aistudio.google.com/apikey'
        },
      };
    } else {
      return {
        provider: 'Gemini',
        status: 'error',
        message: `❌ Error: ${errorMsg}`,
        details: { error: errorMsg },
      };
    }
  }
}

/**
 * Test OpenAI API Key
 */
async function testOpenAIAPI(): Promise<TestResult> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        provider: 'OpenAI',
        status: 'error',
        message: 'API key not found in environment variables',
      };
    }

    console.log('🧪 Testing OpenAI API...');
    const openai = new OpenAI({ apiKey });
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "Hello" if you can hear me.' }],
      max_tokens: 10,
    });
    
    return {
      provider: 'OpenAI',
      status: 'success',
      message: '✅ OpenAI API is working!',
      details: { response: completion.choices[0].message.content },
    };
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    
    if (errorMsg.includes('401') || errorMsg.includes('Incorrect API key')) {
      return {
        provider: 'OpenAI',
        status: 'error',
        message: '❌ Invalid API key',
        details: {
          error: 'API key is invalid or expired',
          solution: 'Get new key at https://platform.openai.com/api-keys (requires billing)'
        },
      };
    } else if (errorMsg.includes('quota') || errorMsg.includes('429')) {
      return {
        provider: 'OpenAI',
        status: 'error',
        message: '⚠️ Quota exceeded or rate limited',
        details: {
          error: 'Quota exceeded',
          solution: 'Add credits at https://platform.openai.com/account/billing'
        },
      };
    } else if (errorMsg.includes('insufficient_quota')) {
      return {
        provider: 'OpenAI',
        status: 'error',
        message: '⚠️ Insufficient quota - Need to add billing',
        details: {
          error: 'Free trial expired or no credits',
          solution: 'Add payment method at https://platform.openai.com/account/billing'
        },
      };
    } else {
      return {
        provider: 'OpenAI',
        status: 'error',
        message: `❌ Error: ${errorMsg}`,
        details: { error: errorMsg },
      };
    }
  }
}

/**
 * Test Anthropic API Key
 */
async function testAnthropicAPI(): Promise<TestResult> {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        provider: 'Anthropic',
        status: 'error',
        message: 'API key not found in environment variables',
      };
    }

    console.log('🧪 Testing Anthropic API...');
    const anthropic = new Anthropic({ apiKey });
    
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say "Hello" if you can hear me.' }],
    });
    
    return {
      provider: 'Anthropic',
      status: 'success',
      message: '✅ Anthropic API is working!',
      details: { response: message.content[0].type === 'text' ? message.content[0].text : 'OK' },
    };
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    
    if (errorMsg.includes('401') || errorMsg.includes('authentication')) {
      return {
        provider: 'Anthropic',
        status: 'error',
        message: '❌ Invalid API key',
        details: {
          error: 'API key is invalid or expired',
          solution: 'Get new key at https://console.anthropic.com/settings/keys'
        },
      };
    } else if (errorMsg.includes('400') || errorMsg.includes('credit')) {
      return {
        provider: 'Anthropic',
        status: 'error',
        message: '⚠️ Low credits or billing issue',
        details: {
          error: 'Account needs funding',
          solution: 'Add credits at https://console.anthropic.com/settings/billing'
        },
      };
    } else if (errorMsg.includes('429')) {
      return {
        provider: 'Anthropic',
        status: 'error',
        message: '⚠️ Rate limited',
        details: {
          error: 'Too many requests',
          solution: 'Wait a moment and try again'
        },
      };
    } else {
      return {
        provider: 'Anthropic',
        status: 'error',
        message: `❌ Error: ${errorMsg}`,
        details: { error: errorMsg },
      };
    }
  }
}

/**
 * Test all API keys
 */
export async function testAllAPIKeys(): Promise<TestResult[]> {
  console.log('🔑 Testing all API keys...\n');
  
  const results: TestResult[] = [];
  
  // Test all APIs in parallel
  const [geminiResult, openaiResult, anthropicResult] = await Promise.all([
    testGeminiAPI(),
    testOpenAIAPI(),
    testAnthropicAPI(),
  ]);
  
  results.push(geminiResult, openaiResult, anthropicResult);
  
  // Print summary
  console.log('\n📊 API KEY TEST RESULTS:');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    console.log(`\n${result.provider}: ${result.message}`);
    if (result.details?.solution) {
      console.log(`   Solution: ${result.details.solution}`);
    }
  });
  
  console.log('\n' + '='.repeat(60));
  
  const workingCount = results.filter(r => r.status === 'success').length;
  const totalCount = results.length;
  
  if (workingCount === totalCount) {
    console.log('✅ ALL API KEYS WORKING! System is fully operational.');
  } else if (workingCount > 0) {
    console.log(`⚠️  ${workingCount}/${totalCount} API keys working. Some providers need attention.`);
  } else {
    console.log('❌ NO API KEYS WORKING. All providers need new keys.');
  }
  
  return results;
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testAllAPIKeys()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}
