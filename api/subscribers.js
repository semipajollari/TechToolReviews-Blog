import crypto from 'crypto';
import mongoose from 'mongoose';
import { Resend } from 'resend';

// Validation function
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// ============================================================
// CACHE LAYER - Prevent re-connection
// ============================================================
let cachedConnection = null;

/**
 * Get or create MongoDB connection (with caching for serverless)
 */
async function getMongoConnection() {
  // Return cached connection if exists and is connected
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    console.log('[Subscribers] Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    // Check for both MONGODB_URI and MONGO_URI for compatibility
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('[Subscribers] ❌ No MongoDB URI configured');
      throw new Error('Database configuration missing');
    }

    // Log sanitized URI for debugging (hide password)
    const sanitizedUri = mongoURI.replace(/:([^@]+)@/, ':***@');
    console.log('[Subscribers] Connecting to:', sanitizedUri);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
    });

    cachedConnection = conn;
    console.log('[Subscribers] ✅ MongoDB connection established');
    return conn;
  } catch (error) {
    console.error('[Subscribers] ❌ Connection failed:', error.message);
    cachedConnection = null;
    throw error;
  }
}

/**
 * Get Subscriber model from mongoose (safe re-registration)
 */
function getSubscriberModel() {
  try {
    // Check if model is already registered
    if (mongoose.models && mongoose.models.Subscriber) {
      return mongoose.models.Subscriber;
    }
    
    // Define the schema (matches subscribe.js)
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

    // Indexes
    subscriberSchema.index({ email: 1 });
    subscriberSchema.index({ verificationToken: 1 });

    // Register model
    const model = mongoose.model('Subscriber', subscriberSchema);
    return model;
  } catch (error) {
    // If model already exists, return it
    if (error.message && error.message.includes('Cannot overwrite')) {
      return mongoose.models.Subscriber;
    }
    console.error('[Subscribers] ❌ Model error:', error.message);
    throw error;
  }
}

/**
 * Main handler function - default export for Vercel
 */
export default async function handler(req, res) {
  try {
    console.log(`[Subscribers] ⚡ ${req.method} request received`);

    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token,X-Requested-With,Accept,Accept-Version,Content-Length,Content-MD5,Content-Type,Date,X-Api-Version'
    );

    // Handle OPTIONS requests
    if (req.method === 'OPTIONS') {
      console.log('[Subscribers] ✅ CORS preflight handled');
      res.status(200).end();
      return;
    }

    // ============================================================
    // CONNECT TO DATABASE
    // ============================================================
    console.log('[Subscribers] 🔗 Connecting to database...');
    await getMongoConnection();
    const Subscriber = getSubscriberModel();
    console.log('[Subscribers] ✅ Database ready');

    // ============================================================
    // POST /api/subscribers - Create new subscriber
    // ============================================================
    if (req.method === 'POST') {
      console.log('[Subscribers] 📧 Processing POST request');

      const { email, preferences } = req.body || {};
      console.log('[Subscribers] Email:', email ? email.substring(0, 5) + '***' : 'MISSING');

      // Validate email
      if (!email || typeof email !== 'string' || !validateEmail(email)) {
        console.log('[Subscribers] ❌ Invalid email format');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address',
        });
      }

      const emailLower = email.toLowerCase().trim();

      // Check for existing subscriber
      console.log('[Subscribers] 🔍 Checking for existing subscription...');
      const existing = await Subscriber.findOne({ email: emailLower });

      if (existing) {
        console.log('[Subscribers] ⚠️  Email already subscribed');
        if (existing.isVerified) {
          return res.status(400).json({
            success: false,
            message: 'This email is already subscribed',
          });
        } else {
          // Resend verification
          existing.verificationToken = crypto.randomBytes(32).toString('hex');
          await existing.save();
          console.log('[Subscribers] ✅ Verification resent');
          return res.status(200).json({
            success: true,
            message: 'Verification email resent. Please check your inbox.',
            email: existing.email,
          });
        }
      }

      // Simple rate limiting - check for recent subscriptions from same IP (if available)
      const clientIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
      const recentCount = await Subscriber.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 60000) } // Last 1 minute
      });
      
      if (recentCount > 10) {
        console.log('[Subscribers] ⚠️ Rate limit triggered');
        return res.status(429).json({
          success: false,
          message: 'Too many subscription requests. Please try again in a minute.',
        });
      }

      // Create new subscriber
      console.log('[Subscribers] 🆕 Creating new subscriber...');
      const newSubscriber = new Subscriber({
        email: emailLower,
        verificationToken: crypto.randomBytes(32).toString('hex'),
        unsubscribeToken: crypto.randomBytes(32).toString('hex'),
        preferences: preferences || {
          frequency: 'weekly',
          categories: [],
        },
        isVerified: false,
        isActive: true,
      });

      console.log('[Subscribers] 💾 Saving to MongoDB...');
      await newSubscriber.save();
      console.log('[Subscribers] ✅ Subscriber created');

      // Send Welcome Email
      if (process.env.RESEND_API_KEY) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const fromEmail = process.env.FROM_EMAIL || 'TechToolReviews <noreply@techtoolreviews.co>';
          const replyTo = 'techtoolreview@gmail.com';
          const frontendUrl = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
          
          await resend.emails.send({
            from: fromEmail,
            to: newSubscriber.email,
            replyTo: replyTo,
            subject: 'Welcome to TechToolReviews',
            headers: {
              'X-Entity-Ref-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              'List-Unsubscribe': `<${frontendUrl}/unsubscribe?token=${newSubscriber.unsubscribeToken || ''}>`,
            },
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <div style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900;">Welcome to the Insider List! 🎉</h1>
                  </div>
                  <div style="padding: 40px 30px; color: #374151;">
                    <p style="font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">Hey there!</p>
                    <p style="font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Thanks for joining <strong>TechToolReviews</strong>! You're now part of an exclusive community of 125,000+ developers and founders.
                    </p>
                    <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 20px; margin: 30px 0; border-radius: 8px;">
                      <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">What You'll Get:</h2>
                      <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                        <li style="margin-bottom: 10px;">📊 Weekly analysis of high-growth tech stacks</li>
                        <li style="margin-bottom: 10px;">⚙️ Unbiased, in-depth developer tool reviews</li>
                        <li style="margin-bottom: 10px;">🤖 AI implementation guides and best practices</li>
                        <li style="margin-bottom: 10px;">🚀 Early access to new features and content</li>
                      </ul>
                    </div>
                    <div style="text-align: center; margin: 40px 0;">
                      <a href="${frontendUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 700; font-size: 16px;">Browse Latest Guides</a>
                    </div>
                    <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin: 30px 0 0 0;">
                      Questions? Just reply to this email - we read every message.
                    </p>
                  </div>
                  <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                      You can <a href="${frontendUrl}/unsubscribe?token=${newSubscriber.unsubscribeToken || ''}" style="color: #6b7280; text-decoration: underline;">unsubscribe</a> at any time.
                    </p>
                  </div>
                </div>
              </body>
              </html>
            `
          });
          console.log('[Subscribers] 📧 Welcome email sent successfully');
        } catch (emailError) {
          console.error('[Subscribers] ❌ Failed to send welcome email:', emailError.message);
          // Don't fail the subscription if email fails
        }
      } else {
        console.log('[Subscribers] ⚠️ RESEND_API_KEY missing - skipping welcome email');
      }

      return res.status(201).json({
        success: true,
        message: 'Subscription successful! Check your email to verify.',
        email: newSubscriber.email,
        data: {
          email: newSubscriber.email,
          subscribedAt: newSubscriber.subscribedAt,
          isVerified: false,
        },
      });
    }

    // ============================================================
    // GET /api/subscribers?action=stats - Statistics
    // ============================================================
    if (req.method === 'GET' && req.query.action === 'stats') {
      console.log('[Subscribers] 📊 Fetching statistics...');

      const [total, verified, recent] = await Promise.all([
        Subscriber.countDocuments({ isActive: true }),
        Subscriber.countDocuments({ isActive: true, isVerified: true }),
        Subscriber.countDocuments({
          isActive: true,
          subscribedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
      ]);

      console.log('[Subscribers] ✅ Stats retrieved');

      return res.status(200).json({
        success: true,
        data: {
          total,
          verified,
          unverified: total - verified,
          recent,
        },
      });
    }

    // ============================================================
    // GET /api/subscribers - List all subscribers
    // ============================================================
    if (req.method === 'GET') {
      console.log('[Subscribers] 📋 Fetching subscriber list...');

      const subscribers = await Subscriber.find({ isActive: true })
        .select('email isVerified subscribedAt preferences')
        .sort({ subscribedAt: -1 })
        .limit(100)
        .lean();

      console.log('[Subscribers] ✅ List retrieved');

      return res.status(200).json({
        success: true,
        data: subscribers,
        total: subscribers.length,
      });
    }

    // ============================================================
    // 405 Method Not Allowed
    // ============================================================
    console.log('[Subscribers] ❌ Method not allowed:', req.method);
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} not allowed`,
    });
  } catch (error) {
    console.error('[Subscribers] ❌ ERROR:', error.message);
    console.error('[Subscribers] Stack:', error.stack);

    // Return error response
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
        type: error.constructor.name,
      }),
    });
  }
}
