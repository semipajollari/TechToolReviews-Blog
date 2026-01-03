import { connectToDatabase } from '../config/db.js';
import { sendVerificationEmail } from '../utils/email.js';
import crypto from 'crypto';

// Validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Connect to database
    await connectToDatabase();
    const { default: Subscriber } = await import('../server/models/Subscriber.js');

    // POST /api/subscribers - Subscribe to newsletter
    if (req.method === 'POST') {
      console.log('📧 POST /api/subscribers - New subscription:', req.body.email);

      const { email, preferences } = req.body;

      if (!email || !validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
      }

      // Check if already subscribed
      const existingSubscriber = await Subscriber.findOne({ email });
      if (existingSubscriber && existingSubscriber.isActive) {
        if (existingSubscriber.isVerified) {
          console.log('❌ Email already subscribed:', email);
          return res.status(400).json({
            success: false,
            message: 'Email is already subscribed'
          });
        } else {
          // Resend verification email
          const verificationToken = crypto.randomBytes(32).toString('hex');
          existingSubscriber.verificationToken = verificationToken;
          await existingSubscriber.save();

          await sendVerificationEmail(email, verificationToken);
          console.log('📧 Verification email resent:', email);

          return res.status(200).json({
            success: true,
            message: 'Verification email sent. Please check your inbox.'
          });
        }
      }

      // Create new subscriber
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const subscriber = new Subscriber({
        email,
        preferences: preferences || {},
        verificationToken,
        isVerified: false,
        isActive: true
      });

      await subscriber.save();

      // Send verification email
      await sendVerificationEmail(email, verificationToken);

      console.log('✅ New subscriber created:', email);

      return res.status(201).json({
        success: true,
        message: 'Subscription successful! Please check your email to verify your subscription.'
      });
    }

    // GET /api/subscribers/stats - Get subscription statistics
    if (req.method === 'GET' && req.query.action === 'stats') {
      console.log('📊 GET /api/subscribers/stats - Fetching subscription stats');

      const totalSubscribers = await Subscriber.countDocuments({ isActive: true });
      const verifiedSubscribers = await Subscriber.countDocuments({
        isActive: true,
        isVerified: true
      });
      const recentSubscribers = await Subscriber.countDocuments({
        isActive: true,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      });

      return res.status(200).json({
        success: true,
        data: {
          total: totalSubscribers,
          verified: verifiedSubscribers,
          unverified: totalSubscribers - verifiedSubscribers,
          recent: recentSubscribers
        }
      });
    }

    // Method not allowed
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });

  } catch (error) {
    console.error('❌ Subscriber API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}