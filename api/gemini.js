// Gemini AI API endpoint for tech stack recommendations
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
    const { query } = req.body;

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
    
    // Call Gemini API using REST endpoint - using gemini-1.5-flash for stability
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a tech stack advisor for modern web applications in 2025-2026. 
              
Based on this business idea: "${sanitizedQuery}"

Suggest a complete modern tech stack. Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, just pure JSON):
{"stackName": "A catchy name for this stack", "frontend": "Frontend framework and key libraries", "backend": "Backend technology", "database": "Database choice", "hosting": "Hosting platform", "reasoning": "A 2-3 sentence explanation of why this stack is perfect"}

Be specific, modern, and practical. Focus on developer experience and scalability.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', JSON.stringify(errorData));
      return res.status(500).json({ 
        success: false, 
        message: errorData.error?.message || 'Failed to get recommendation from AI'
      });
    }

    const data = await response.json();
    
    // Extract the text from Gemini response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textContent) {
      return res.status(500).json({ 
        success: false, 
        message: 'No response from AI' 
      });
    }

    // Parse the JSON from the response (handle markdown code blocks)
    let recommendation;
    try {
      // Remove markdown code blocks if present
      let jsonStr = textContent.trim();
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.slice(7);
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith('```')) {
        jsonStr = jsonStr.slice(0, -3);
      }
      jsonStr = jsonStr.trim();
      
      recommendation = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', textContent);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to parse AI response' 
      });
    }

    // Validate the response structure
    const required = ['stackName', 'frontend', 'backend', 'database', 'hosting', 'reasoning'];
    for (const field of required) {
      if (!recommendation[field]) {
        return res.status(500).json({ 
          success: false, 
          message: `Missing required field: ${field}` 
        });
      }
    }

    return res.status(200).json({ 
      success: true, 
      recommendation 
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}
