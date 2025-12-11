/**
 * Local Wildlife Chat AI Service
 * Bridge to Python-based trained neural network for wildlife Q&A
 */

import fetch from 'node-fetch';

const TENSORFLOW_SERVICE_URL = process.env.TENSORFLOW_SERVICE_URL || 'http://localhost:5001';

export interface LocalChatResponse {
  answer: string | null;
  confidence: number;
  error?: string;
}

/**
 * Check if local chat AI is available
 */
export async function isLocalChatAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${TENSORFLOW_SERVICE_URL}/chat/available`, {
      method: 'GET',
      timeout: 3000,
    });
    
    if (response.ok) {
      const data = await response.json() as { available: boolean };
      return data.available;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Get response from local chat AI
 */
export async function getLocalChatResponse(question: string): Promise<string | null> {
  try {
    const response = await fetch(`${TENSORFLOW_SERVICE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
      timeout: 10000,
    });

    if (!response.ok) {
      console.error(`Local chat AI error: ${response.status}`);
      return null;
    }

    const data = await response.json() as LocalChatResponse;
    
    if (data.answer && data.confidence >= 0.3) {
      console.log(`✅ Local AI chat response (confidence: ${(data.confidence * 100).toFixed(1)}%)`);
      return data.answer;
    } else {
      console.log(`⚠️ Local AI low confidence (${(data.confidence * 100).toFixed(1)}%)`);
      return null;
    }
  } catch (error) {
    console.error('Local chat AI request failed:', error);
    return null;
  }
}
