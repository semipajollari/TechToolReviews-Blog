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
 * Send email via Resend API
 */
async function sendEmail(to, subject, html) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.log('[Newsletter] Resend API key not configured');
    return false;
  }

  // Use custom domain email for production
  const fromEmail = process.env.FROM_EMAIL || 'TechToolReviews <noreply@techtoolreviews.co>';
  const replyTo = process.env.ADMIN_EMAIL || 'semipajo2003@gmail.com';

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
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('[Newsletter] Email error:', error.message);
    return false;
  }
}

/**
 * Generate newsletter HTML
 */
function getNewsletterHtml(unsubscribeUrl) {
  const baseUrl = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
  
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
        <h1 style="color: #18181b; margin: 20px 0 0; font-size: 24px;">TechToolReviews Weekly</h1>
      </div>
      
      <p style="color: #52525b; line-height: 1.6; margin: 0 0 24px;">
        Hey there! 👋 Here's what's new this week in tech tools and reviews.
      </p>
      
      <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <h3 style="color: #18181b; margin: 0 0 12px; font-size: 18px;">🔥 This Week's Highlights</h3>
        <ul style="color: #52525b; line-height: 1.8; margin: 0; padding-left: 20px;">
          <li>Latest software reviews and comparisons</li>
          <li>Tech stack recommendations</li>
          <li>Developer tools and productivity tips</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${baseUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Read All Articles
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;">
      
      <p style="color: #a1a1aa; font-size: 12px; text-align: center; margin: 0;">
        © 2026 TechToolReviews. All rights reserved.<br><br>
        <a href="${unsubscribeUrl}" style="color: #a1a1aa;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Weekly newsletter cron job
 * Triggered by Vercel Cron: vercel.json
 */
export default async function handler(req, res) {
  // Verify cron secret (optional security)
  const authHeader = req.headers.authorization;
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('[Newsletter] Unauthorized cron request');
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  console.log('[Newsletter] Starting weekly send...');

  try {
    await getMongoConnection();
    const Subscriber = getSubscriberModel();

    // Get only active (verified) subscribers
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const subscribers = await Subscriber.find({
      status: 'active',
      $or: [
        { lastEmailSent: { $exists: false } },
        { lastEmailSent: null },
        { lastEmailSent: { $lt: oneWeekAgo } }
      ]
    }).limit(100); // Process in batches to avoid timeout

    if (subscribers.length === 0) {
      console.log('[Newsletter] No subscribers to email');
      return res.status(200).json({ 
        success: true, 
        message: 'No subscribers to email',
        sent: 0 
      });
    }

    console.log(`[Newsletter] Sending to ${subscribers.length} subscribers`);

    const baseUrl = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${subscriber.unsubscribeToken}`;
        const html = getNewsletterHtml(unsubscribeUrl);

        const success = await sendEmail(
          subscriber.email,
          '⚡ TechToolReviews Weekly Digest',
          html
        );

        if (success) {
          subscriber.lastEmailSent = new Date();
          await subscriber.save();
          sent++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`[Newsletter] Error for ${subscriber.email}:`, error.message);
        failed++;
      }
    }

    console.log(`[Newsletter] ✅ Complete: ${sent} sent, ${failed} failed`);

    return res.status(200).json({
      success: true,
      message: `Newsletter sent to ${sent} subscribers`,
      sent,
      failed,
    });

  } catch (error) {
    console.error('[Newsletter] ❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Newsletter job failed',
    });
  }
}
