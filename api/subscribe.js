import crypto from 'crypto';
import mongoose from 'mongoose';

// Validation function
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Cache connection for serverless
let cachedConnection = null;

/**
 * Get or create MongoDB connection
 */
async function getMongoConnection() {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    console.log('[Subscribe] Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('[Subscribe] ❌ No MongoDB URI configured');
      throw new Error('Database configuration missing');
    }

    // Log sanitized URI for debugging (hide password)
    const sanitizedUri = mongoURI.replace(/:([^@]+)@/, ':***@');
    console.log('[Subscribe] Connecting to:', sanitizedUri);

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
    });

    cachedConnection = conn;
    console.log('[Subscribe] ✅ MongoDB connected');
    return conn;
  } catch (error) {
    console.error('[Subscribe] ❌ Connection failed:', error.message);
    cachedConnection = null;
    throw error;
  }
}

/**
 * Get Subscriber model
 */
function getSubscriberModel() {
  if (mongoose.models && mongoose.models.Subscriber) {
    return mongoose.models.Subscriber;
  }

  const subscriberSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
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

  return mongoose.model('Subscriber', subscriberSchema);
}

/**
 * Main handler for /api/subscribe
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    });
  }

  try {
    console.log('[Subscribe] POST request received');

    // Connect to database
    await getMongoConnection();
    const Subscriber = getSubscriberModel();

    // Get email from body
    const { email, preferences } = req.body || {};
    console.log('[Subscribe] Email:', email ? email.substring(0, 5) + '***' : 'MISSING');

    // Validate email
    if (!email || typeof email !== 'string' || !validateEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const emailLower = email.toLowerCase().trim();

    // Check for existing subscriber
    const existing = await Subscriber.findOne({ email: emailLower });

    if (existing) {
      if (existing.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed',
        });
      } else {
        // Resend verification
        existing.verificationToken = crypto.randomBytes(32).toString('hex');
        await existing.save();
        return res.status(200).json({
          success: true,
          message: 'Verification email resent. Please check your inbox.',
          email: existing.email,
        });
      }
    }

    // Create new subscriber
    const newSubscriber = new Subscriber({
      email: emailLower,
      verificationToken: crypto.randomBytes(32).toString('hex'),
      preferences: preferences || { frequency: 'weekly', categories: [] },
      isVerified: false,
      isActive: true,
    });

    await newSubscriber.save();
    console.log('[Subscribe] ✅ Subscriber created:', emailLower);

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
  } catch (error) {
    console.error('[Subscribe] ❌ Error:', error.message);
    console.error('[Subscribe] Stack:', error.stack);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
