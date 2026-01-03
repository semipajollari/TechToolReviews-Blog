import { validationResult } from 'express-validator';
import crypto from 'crypto';
import Subscriber from '../models/Subscriber.js';
import { sendVerificationEmail } from '../services/emailService.js';

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
export const subscribe = async (req, res) => {
  try {
    console.log('📧 POST /api/subscribers - New subscription:', req.body.email);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, preferences } = req.body;

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

        return res.json({
          success: true,
          message: 'Verification email sent. Please check your inbox.'
        });
      }
    }

    // Create new subscriber
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const unsubscribeToken = crypto.randomBytes(32).toString('hex');

    const subscriber = new Subscriber({
      email,
      verificationToken,
      unsubscribeToken,
      preferences: preferences || {}
    });

    await subscriber.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    console.log('✅ Subscriber created and verification email sent:', email);

    res.status(201).json({
      success: true,
      message: 'Subscription successful! Please check your email to verify your subscription.'
    });
  } catch (error) {
    console.error('❌ Error subscribing:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing subscription',
      error: error.message
    });
  }
};

// @desc    Verify email subscription
// @route   POST /api/subscribers/verify
// @access  Public
export const verifySubscription = async (req, res) => {
  try {
    console.log('✅ POST /api/subscribers/verify - Verifying subscription');

    const { token } = req.body;

    if (!token) {
      console.log('❌ No verification token provided');
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    const subscriber = await Subscriber.findOne({ verificationToken: token });
    if (!subscriber) {
      console.log('❌ Invalid verification token:', token);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    subscriber.isVerified = true;
    subscriber.verificationToken = undefined; // Remove token after verification
    await subscriber.save();

    console.log('✅ Email verified for:', subscriber.email);

    res.json({
      success: true,
      message: 'Email verified successfully! You will now receive our newsletter.'
    });
  } catch (error) {
    console.error('❌ Error verifying subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying subscription',
      error: error.message
    });
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/subscribers/unsubscribe
// @access  Public
export const unsubscribe = async (req, res) => {
  try {
    console.log('🚫 POST /api/subscribers/unsubscribe - Unsubscribing');

    const { email, token } = req.body;

    let subscriber;
    if (token) {
      subscriber = await Subscriber.findOne({ unsubscribeToken: token });
    } else if (email) {
      subscriber = await Subscriber.findOne({ email });
    } else {
      console.log('❌ No email or token provided');
      return res.status(400).json({
        success: false,
        message: 'Email or unsubscribe token is required'
      });
    }

    if (!subscriber) {
      console.log('❌ Subscriber not found');
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    subscriber.isActive = false;
    await subscriber.save();

    console.log('✅ Successfully unsubscribed:', subscriber.email);

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('❌ Error unsubscribing:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing unsubscription',
      error: error.message
    });
  }
};

// @desc    Get subscription statistics
// @route   GET /api/subscribers/stats
// @access  Private/Admin
export const getSubscriptionStats = async (req, res) => {
  try {
    console.log('📊 GET /api/subscribers/stats - Fetching statistics');

    const total = await Subscriber.countDocuments();
    const verified = await Subscriber.countDocuments({ isVerified: true });
    const active = await Subscriber.countDocuments({ isVerified: true, isActive: true });

    const stats = {
      total,
      verified,
      active,
      unverified: total - verified,
      inactive: verified - active
    };

    console.log('✅ Subscription stats:', stats);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error fetching subscription stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Get all subscribers (admin)
// @route   GET /api/subscribers
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
  try {
    console.log('👥 GET /api/subscribers - Fetching subscribers');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const subscribers = await Subscriber.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-verificationToken -unsubscribeToken -__v');

    const total = await Subscriber.countDocuments();

    console.log(`✅ Found ${subscribers.length} subscribers`);

    res.json({
      success: true,
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers',
      error: error.message
    });
  }
};

export default {
  subscribe,
  verifySubscription,
  unsubscribe,
  getSubscriptionStats
};