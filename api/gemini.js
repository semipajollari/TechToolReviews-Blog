// Gemini AI API endpoint for tech stack recommendations
import https from 'https';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { query } = req.body || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    // Sanitize input
    const sanitizedQuery = query.trim().slice(0, 500);
    if (sanitizedQuery.length < 10) {
      return res.status(400).json({ success: false, message: 'Query must be at least 10 characters' });
    }

    // Gemini API key
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyA3q6sWr7ghbmihjrB1auWlEbsgcqoqtyo';
    
    const prompt = `You are a tech stack advisor for modern web applications in 2025-2026. 
Based on this business idea: "${sanitizedQuery}"

Suggest a complete modern tech stack. Respond ONLY with valid JSON (no markdown, no code blocks):
{"stackName": "A catchy name", "frontend": "Frontend tech", "backend": "Backend tech", "database": "Database", "hosting": "Hosting", "reasoning": "2-3 sentence explanation"}`;

    const requestBody = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    // Make request using native https
    const geminiResponse = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          try {
            resolve({ status: response.statusCode, data: JSON.parse(data) });
          } catch (e) {
            resolve({ status: response.statusCode, data: data });
          }
        });
      });

      request.on('error', reject);
      request.setTimeout(25000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
      
      request.write(requestBody);
      request.end();
    });

    if (geminiResponse.status !== 200) {
      console.error('Gemini API error:', JSON.stringify(geminiResponse.data));
      const errorMessage = geminiResponse.data?.error?.message || 'Failed to get recommendation from AI';
      return res.status(500).json({ success: false, message: errorMessage });
    }

    // Extract the text from Gemini response
    const textContent = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      console.error('No text content in response:', JSON.stringify(geminiResponse.data));
      return res.status(500).json({ success: false, message: 'No response from AI' });
    }

    // Parse the JSON from the response
    let recommendation;
    try {
      let jsonStr = textContent.trim();
      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
      else if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
      if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
      jsonStr = jsonStr.trim();
      
      recommendation = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', textContent);
      return res.status(500).json({ success: false, message: 'Failed to parse AI response' });
    }

    // Validate the response structure
    const required = ['stackName', 'frontend', 'backend', 'database', 'hosting', 'reasoning'];
    for (const field of required) {
      if (!recommendation[field]) {
        return res.status(500).json({ success: false, message: `Missing field: ${field}` });
      }
    }

    return res.status(200).json({ success: true, recommendation });

  } catch (error) {
    console.error('Gemini API error:', error.message || error);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + (error.message || 'Unknown error') });
  }
}
