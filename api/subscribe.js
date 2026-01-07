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

  // Production-ready email configuration
  const fromEmail = process.env.FROM_EMAIL || 'TechToolReviews <noreply@techtoolreviews.co>';
  const replyTo = process.env.REPLY_TO_EMAIL || 'techtoolreview@gmail.com';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        reply_to: replyTo,
        to: [to],
        subject,
        html,
        text: html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(), // Plain text version
        headers: {
          'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
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
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your TechToolReviews subscription</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #6366f1; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Verify Your Email</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 32px;">
              <p style="color: #111827; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                Thank you for subscribing to <strong>TechToolReviews</strong>! Please confirm your email address by clicking the button below.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Confirm Email Address</a>
                  </td>
                </tr>
              </table>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 24px 0 0;">
                If the button doesn't work, copy and paste this link:<br>
                <a href="${verifyUrl}" style="color: #6366f1; word-break: break-all; font-size: 13px;">${verifyUrl}</a>
              </p>
              <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0;">
                This link expires in 7 days. If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 32px; border-top: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
                © 2026 TechToolReviews · Weekly tech reviews for developers
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
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
      const baseUrl = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
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
    const baseUrl = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
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
