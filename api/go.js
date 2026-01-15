// 302 Redirect endpoint for affiliate links
// GET /api/go

export default function handler(req, res) {
  // Use a fixed affiliate URL for now
  const affiliateUrl = "https://tatrck.com/h/0Hu30_4_0P1g?model=cpa";
  res.setHeader("Location", affiliateUrl);
  res.status(302).end();
}
