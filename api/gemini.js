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
    const body = req.body || {};
    const query = body.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    const sanitizedQuery = query.trim().slice(0, 500);
    if (sanitizedQuery.length < 10) {
      return res.status(400).json({ success: false, message: 'Query must be at least 10 characters' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ success: false, message: 'Gemini API key not set on server' });
    }
    
    // We want a JSON response
    const prompt = `You are a tech stack advisor. Based on this idea: "${sanitizedQuery}"

Return ONLY this JSON format, nothing else:
{"stackName":"Name","frontend":"Frontend tech","backend":"Backend tech","database":"Database","hosting":"Hosting","reasoning":"Why this stack"}`;

    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { 
        temperature: 0.7, 
        maxOutputTokens: 4096 
      }
    });

    const result = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          resolve({ statusCode: response.statusCode, body: data });
        });
      });

      request.on('error', (e) => reject(e));
      request.setTimeout(20000, () => {
        request.destroy();
        reject(new Error('Timeout'));
      });
      request.write(postData);
      request.end();
    });

    if (result.statusCode !== 200) {
      console.error('Gemini error response:', result.body);
      let errorMsg = 'AI service error';
      try {
        const errData = JSON.parse(result.body);
        errorMsg = errData.error?.message || errorMsg;
      } catch (e) {}
      
      // If quota exceeded
      if (result.statusCode === 429) {
        return res.status(200).json({ success: false, message: 'AI service busy, try again later' });
      }
      
      return res.status(200).json({ success: false, message: errorMsg });
    }

    let data;
    try {
      data = JSON.parse(result.body);
    } catch (e) {
      return res.status(200).json({ success: false, message: 'Invalid AI response' });
    }

    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      return res.status(200).json({ success: false, message: 'Empty AI response' });
    }

    // Parse JSON from response
    let recommendation;
    try {
      let jsonStr = textContent.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```/g, '');
      }
      recommendation = JSON.parse(jsonStr.trim());
    } catch (e) {
      return res.status(200).json({ success: false, message: 'Could not parse AI response' });
    }

    // Validate
    const fields = ['stackName', 'frontend', 'backend', 'database', 'hosting', 'reasoning'];
    for (const f of fields) {
      if (!recommendation[f]) {
        return res.status(200).json({ success: false, message: `Missing: ${f}` });
      }
    }

    return res.status(200).json({ success: true, recommendation });

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(200).json({ success: false, message: 'Server error' });
  }
}
