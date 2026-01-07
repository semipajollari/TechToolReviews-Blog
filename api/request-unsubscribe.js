import mongoose from 'mongoose';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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
 * Unsubscribe email template
 */
function getUnsubscribeEmailHtml(unsubscribeUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 60px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 900; letter-spacing: -0.5px;">
                TechToolReviews
              </h1>
              <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px; font-weight: 600;">
                Unsubscribe Request
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 900;">
                We're sorry to see you go
              </h2>
              <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 16px; line-height: 1.6; font-weight: 500;">
                We received a request to unsubscribe this email address from TechToolReviews newsletter.
              </p>
              <p style="margin: 0 0 30px 0; color: #6b7280; font-size: 16px; line-height: 1.6; font-weight: 500;">
                To confirm your unsubscribe request, please click the button below:
              </p>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px 0;">
                    <a href="${unsubscribeUrl}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
                      Unsubscribe Now
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px; line-height: 1.6; font-weight: 500;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px 0; word-break: break-all;">
                <a href="${unsubscribeUrl}" style="color: #6366f1; text-decoration: underline; font-size: 13px;">
                  ${unsubscribeUrl}
                </a>
              </p>

              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 30px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                  ⚠️ If you didn't request this, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; text-align: center; font-weight: 500;">
                TechToolReviews &copy; 2025
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                Questions? Contact us at <a href="mailto:techtoolreview@gmail.com" style="color: #6366f1; text-decoration: none;">techtoolreview@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * API Handler
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Connect to database
    await getMongoConnection();
    const Subscriber = getSubscriberModel();

    // Find subscriber
    const subscriber = await Subscriber.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found in our subscriber list' });
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(400).json({ error: 'This email is already unsubscribed' });
    }

    // Generate unsubscribe link
    const frontendUrl = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
    const unsubscribeUrl = `${frontendUrl}/unsubscribe?token=${subscriber.unsubscribeToken}`;

    // Email configuration
    const FROM_EMAIL = process.env.FROM_EMAIL || 'TechToolReviews <noreply@techtoolreviews.co>';
    const REPLY_TO_EMAIL = process.env.REPLY_TO_EMAIL || 'techtoolreview@gmail.com';

    // Send email
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject: 'Confirm Your Unsubscribe Request - TechToolReviews',
      html: getUnsubscribeEmailHtml(unsubscribeUrl),
      headers: {
        'X-Entity-Ref-ID': subscriber._id.toString(),
      },
    });

    return res.status(200).json({ 
      success: true, 
      message: 'Unsubscribe confirmation email sent' 
    });

  } catch (error) {
    console.error('Request unsubscribe error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
}
