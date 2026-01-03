import crypto from 'crypto';
import mongoose from 'mongoose';

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
      console.log('[Subscribers] Using registered Subscriber model');
      return mongoose.models.Subscriber;
    }

    console.log('[Subscribers] Creating Subscriber model...');
    
    // Define the schema
    const subscriberSchema = new mongoose.Schema(
      {
        email: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          lowercase: true,
          match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          sparse: true,
        },
        unsubscribeToken: {
          type: String,
          sparse: true,
        },
        subscribedAt: {
          type: Date,
          default: Date.now,
        },
        lastEmailSent: {
          type: Date,
        },
        preferences: {
          categories: [{ type: String, trim: true }],
          frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'weekly',
          },
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
      { timestamps: true }
    );

    // Indexes
    subscriberSchema.index({ email: 1 });
    subscriberSchema.index({ verificationToken: 1 });

    // Register model
    const model = mongoose.model('Subscriber', subscriberSchema);
    console.log('[Subscribers] ✅ Subscriber model created');
    return model;
  } catch (error) {
    // If model already exists, return it
    if (error.message && error.message.includes('Cannot overwrite')) {
      console.log('[Subscribers] Model already exists, retrieving...');
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

      // Create new subscriber
      console.log('[Subscribers] 🆕 Creating new subscriber...');
      const newSubscriber = new Subscriber({
        email: emailLower,
        verificationToken: crypto.randomBytes(32).toString('hex'),
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
