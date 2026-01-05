const https = require('https');

const apiKey = 'AIzaSyA3q6sWr7ghbmihjrB1auWlEbsgcqoqtyo';
const prompt = `You are a tech stack advisor. Based on this idea: "A social network for cats"

Return ONLY this JSON format, nothing else:
{"stackName":"Name","frontend":"Frontend tech","backend":"Backend tech","database":"Database","hosting":"Hosting","reasoning":"Why this stack"}`;

const postData = JSON.stringify({
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  safetySettings: [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
  ]
});

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

console.log('Testing Gemini API with full prompt...');
const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('BODY:', data);
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e);
});

req.write(postData);
req.end();