/**
 * Test TensorFlow Service Response Format
 * This will help us understand what data the service actually returns
 */

import FormData from 'form-data';
import fetch from 'node-fetch';

async function testTensorFlowResponse() {
  console.log('🧪 Testing TensorFlow Service Response...\n');
  
  // First check health
  try {
    const healthResponse = await fetch('http://localhost:5004/health');
    const health = await healthResponse.json();
    console.log('✅ Service Health:', health);
    console.log('');
  } catch (error) {
    console.error('❌ Service not available:', error.message);
    return;
  }
  
  // Test with a sample image (we'll use a tiny test image)
  // Create a minimal valid JPEG
  const testImageBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA//2Q==';
  
  try {
    const formData = new FormData();
    const imageBuffer = Buffer.from(testImageBase64, 'base64');
    formData.append('image', imageBuffer, {
      filename: 'test.jpg',
      contentType: 'image/jpeg',
    });
    
    console.log('📤 Sending test image to TensorFlow service...');
    const response = await fetch('http://localhost:5004/identify/animal', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });
    
    if (!response.ok) {
      console.error('❌ Response error:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response body:', text);
      return;
    }
    
    const data = await response.json();
    console.log('\n📊 FULL RESPONSE FROM TENSORFLOW SERVICE:');
    console.log(JSON.stringify(data, null, 2));
    
    console.log('\n🔍 RESPONSE STRUCTURE ANALYSIS:');
    console.log('- success:', data.success);
    console.log('- species (root):', data.species);
    console.log('- animal (root):', data.animal);
    console.log('- scientific_name (root):', data.scientific_name);
    console.log('- results array length:', data.results?.length);
    
    if (data.results && data.results.length > 0) {
      console.log('\n📋 FIRST RESULT (results[0]):');
      const first = data.results[0];
      console.log('- species:', first.species);
      console.log('- scientific_name:', first.scientific_name);
      console.log('- confidence:', first.confidence);
      console.log('- habitat:', first.habitat);
      console.log('- conservation:', first.conservation);
      console.log('- population:', first.population);
    }
    
    console.log('\n✅ Test complete!');
    
  } catch (error) {
    console.error('❌ Error testing service:', error.message);
    console.error(error);
  }
}

testTensorFlowResponse();
