import mongoose from 'mongoose';

let cachedConnection = null;

async function getMongoConnection() {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('Database configuration missing');
  }

  const conn = await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  cachedConnection = conn;
  return conn;
}

function getSubscriberModel() {
  if (mongoose.models?.Subscriber) {
    return mongoose.models.Subscriber;
  }

  const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    status: { type: String, enum: ['pending', 'active', 'unsubscribed'], default: 'pending' },
    verificationToken: String,
    tokenExpiresAt: Date,
    unsubscribeToken: String,
    verifiedAt: Date,
    lastEmailSent: Date,
    createdAt: { type: Date, default: Date.now },
  });

  return mongoose.model('Subscriber', subscriberSchema);
}

/**
 * Success page HTML
 */
function getSuccessHtml(message, description) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${message} - TechToolReviews</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 48px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .icon {
      width: 80px;
      height: 80px;
      background: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 40px;
    }
    h1 { color: #18181b; margin-bottom: 16px; font-size: 28px; }
    p { color: #52525b; line-height: 1.6; margin-bottom: 32px; }
    .btn {
      display: inline-block;
      background: #6366f1;
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
    .btn:hover { background: #4f46e5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <h1>${message}</h1>
    <p>${description}</p>
    <a href="https://tech-tool-reviews-blog.vercel.app" class="btn">Go to Homepage</a>
  </div>
</body>
</html>`;
}

/**
 * Error page HTML
 */
function getErrorHtml(message, description) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${message} - TechToolReviews</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 48px;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .icon {
      width: 80px;
      height: 80px;
      background: #ef4444;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 40px;
    }
    h1 { color: #18181b; margin-bottom: 16px; font-size: 28px; }
    p { color: #52525b; line-height: 1.6; margin-bottom: 32px; }
    .btn {
      display: inline-block;
      background: #6366f1;
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✕</div>
    <h1>${message}</h1>
    <p>${description}</p>
    <a href="https://tech-tool-reviews-blog.vercel.app" class="btn">Go to Homepage</a>
  </div>
</body>
</html>`;
}

/**
 * Verify email endpoint - /api/verify?token=xxx
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { token } = req.query;

  if (!token) {
    res.setHeader('Content-Type', 'text/html');
    return res.status(400).send(getErrorHtml('Invalid Link', 'The verification link is invalid or missing.'));
  }

  try {
    await getMongoConnection();
    const Subscriber = getSubscriberModel();

    const subscriber = await Subscriber.findOne({ verificationToken: token });

    if (!subscriber) {
      res.setHeader('Content-Type', 'text/html');
      return res.status(404).send(getErrorHtml('Link Expired', 'This verification link has expired or is invalid. Please subscribe again.'));
    }

    // Check if token expired
    if (subscriber.tokenExpiresAt && new Date() > subscriber.tokenExpiresAt) {
      res.setHeader('Content-Type', 'text/html');
      return res.status(400).send(getErrorHtml('Link Expired', 'This verification link has expired. Please subscribe again to get a new link.'));
    }

    // Already verified
    if (subscriber.status === 'active') {
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(getSuccessHtml('Already Verified', 'Your email is already verified. You\'re all set!'));
    }

    // Verify the subscriber
    subscriber.status = 'active';
    subscriber.verifiedAt = new Date();
    subscriber.verificationToken = null;
    subscriber.tokenExpiresAt = null;
    await subscriber.save();

    console.log('[Verify] ✅ Email verified:', subscriber.email);

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(getSuccessHtml('Email Verified!', 'You\'re now subscribed to TechToolReviews. We\'ll send you the best tech reviews and guides every week.'));

  } catch (error) {
    console.error('[Verify] ❌ Error:', error.message);
    res.setHeader('Content-Type', 'text/html');
    return res.status(500).send(getErrorHtml('Something Went Wrong', 'Please try again later or contact support.'));
  }
}
