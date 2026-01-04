import crypto from 'crypto';
import mongoose from 'mongoose';

// Validation function
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Cache connection for serverless
let cachedConnection = null;

/**
 * Get or create MongoDB connection
 */
async function getMongoConnection() {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoURI) {
    console.error('[Subscribe] ❌ No MongoDB URI configured');
    throw new Error('Database configuration missing');
  }

  const sanitizedUri = mongoURI.replace(/:([^@]+)@/, ':***@');
  console.log('[Subscribe] Connecting to:', sanitizedUri);

  const conn = await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority',
  });

  cachedConnection = conn;
  console.log('[Subscribe] ✅ MongoDB connected');
  return conn;
}

/**
 * Get Subscriber model with double opt-in schema
 */
function getSubscriberModel() {
  if (mongoose.models?.Subscriber) {
    return mongoose.models.Subscriber;
  }

  const subscriberSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'unsubscribed'],
      default: 'pending',
    },
    verificationToken: String,
    tokenExpiresAt: Date,
    unsubscribeToken: String,
    verifiedAt: Date,
    lastEmailSent: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

  return mongoose.model('Subscriber', subscriberSchema);
}

/**
 * Send email via Resend API
 */
async function sendEmail(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.log('[Email] Resend API key not configured, skipping email');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TechToolReviews <onboarding@resend.dev>',
        reply_to: 'techtoolreviews.co@gmail.com',
        to: [to],
        subject,
        html,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[Email] ✅ Sent to:', to, 'ID:', data.id);
      return true;
    } else {
      const error = await response.json();
      console.error('[Email] ❌ Failed:', error);
      return false;
    }
  } catch (error) {
    console.error('[Email] ❌ Error:', error.message);
    return false;
  }
}

/**
 * Generate verification email HTML
 */
function getVerificationEmailHtml(verifyUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; background: #6366f1; padding: 12px 16px; border-radius: 12px;">
          <span style="color: white; font-size: 24px;">⚡</span>
        </div>
        <h1 style="color: #18181b; margin: 20px 0 0; font-size: 24px;">TechToolReviews</h1>
      </div>
      
      <h2 style="color: #18181b; margin: 0 0 16px; font-size: 20px;">Verify your email</h2>
      <p style="color: #52525b; line-height: 1.6; margin: 0 0 24px;">
        Thanks for subscribing! Click the button below to confirm your email and start receiving our weekly tech reviews and guides.
      </p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Verify Email
        </a>
      </div>
      
      <p style="color: #71717a; font-size: 14px; line-height: 1.6;">
        This link expires in 24 hours. If you didn't subscribe, you can safely ignore this email.
      </p>
      
      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
      
      <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin: 0;">
        © 2026 TechToolReviews. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Main handler for /api/subscribe
 */
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('[Subscribe] POST request received');
    
    await getMongoConnection();
    const Subscriber = getSubscriberModel();

    const { email } = req.body || {};
    console.log('[Subscribe] Email:', email ? email.substring(0, 5) + '***' : 'MISSING');

    if (!email || !validateEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const emailLower = email.toLowerCase().trim();
    const existing = await Subscriber.findOne({ email: emailLower });

    if (existing) {
      if (existing.status === 'active') {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed',
        });
      }

      // Resend verification for pending/unsubscribed
      existing.verificationToken = crypto.randomBytes(32).toString('hex');
      existing.tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      existing.status = 'pending';
      await existing.save();

      // Send verification email
      const baseUrl = process.env.FRONTEND_URL || 'https://tech-tool-reviews-blog.vercel.app';
      const verifyUrl = `${baseUrl}/api/verify?token=${existing.verificationToken}`;
      const emailSent = await sendEmail(emailLower, 'Verify your TechToolReviews subscription', getVerificationEmailHtml(verifyUrl));
      console.log('[Subscribe] Email sent:', emailSent);

      return res.status(200).json({
        success: true,
        message: 'Verification email sent. Please check your inbox.',
        email: emailLower,
      });
    }

    // Create new subscriber
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const newSubscriber = new Subscriber({
      email: emailLower,
      status: 'pending',
      verificationToken,
      tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      unsubscribeToken,
    });

    await newSubscriber.save();
    console.log('[Subscribe] ✅ Subscriber created:', emailLower);

    // Send verification email
    const baseUrl = process.env.FRONTEND_URL || 'https://tech-tool-reviews-blog.vercel.app';
    const verifyUrl = `${baseUrl}/api/verify?token=${verificationToken}`;
    const emailSent = await sendEmail(emailLower, 'Verify your TechToolReviews subscription', getVerificationEmailHtml(verifyUrl));
    console.log('[Subscribe] Email sent:', emailSent);

    return res.status(201).json({
      success: true,
      message: 'Thanks! Please check your email to verify your subscription.',
      email: emailLower,
    });

  } catch (error) {
    console.error('[Subscribe] ❌ Error:', error.message);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again.',
    });
  }
}
