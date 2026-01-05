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
    
    // Call Gemini API using REST endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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

Suggest a complete modern tech stack. Respond ONLY with valid JSON in this exact format:
{
  "stackName": "A catchy name for this stack (e.g., 'The Indie Hacker Stack')",
  "frontend": "Frontend framework and key libraries (e.g., 'Next.js 15 + Tailwind CSS + shadcn/ui')",
  "backend": "Backend technology (e.g., 'Node.js + tRPC' or 'Supabase Edge Functions')",
  "database": "Database choice (e.g., 'PostgreSQL via Supabase' or 'MongoDB Atlas')",
  "hosting": "Hosting platform (e.g., 'Vercel + Cloudflare CDN')",
  "reasoning": "A 2-3 sentence explanation of why this stack is perfect for the described business idea, mentioning specific advantages for 2026."
}

Be specific, modern, and practical. Focus on developer experience and scalability.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to get recommendation from AI' 
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
