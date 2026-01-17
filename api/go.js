// Vercel Serverless Function: /api/go
export default async function handler(req, res) {
  // 1. Validate and extract the destination URL
  const { url } = req.query;
  if (!url) return res.status(400).end();

  let dest;
  try {
    dest = decodeURIComponent(url);
  } catch {
    return res.status(400).end();
  }

  // 2. Optional: Whitelist allowed domains
  const allowed = [
    'voluumtrk.com',
    'voluum.com',
    'voluumrtb.com',
    'voluum.click',
    'prizonomyprecigner.com'
  ];
  try {
    const { hostname } = new URL(dest);
    if (!allowed.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
      return res.status(403).end();
    }
  } catch {
    return res.status(400).end();
  }

  // 3. Register blog visit (analytics) - e.g., call your analytics endpoint
  // await fetch('https://yourblog.com/api/track-visit', { method: 'POST', body: JSON.stringify({ ref: dest }) });

  // 4. 302 Redirect
  res.setHeader('Location', dest);
  res.status(302).end();
}
