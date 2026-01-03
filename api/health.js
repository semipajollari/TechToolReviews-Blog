/**
 * Health check endpoint for /api/health
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  return res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
