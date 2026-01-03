import express from 'express';
import { Subscriber } from '../models/Subscriber.js';

const router = express.Router();

// Simple rate limiting (in-memory, resets on restart)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 requests per minute per IP

const rateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, start: now };
  
  if (now - record.start > RATE_LIMIT_WINDOW) {
    record.count = 1;
    record.start = now;
  } else {
    record.count++;
  }
  
  rateLimitMap.set(ip, record);
  
  if (record.count > RATE_LIMIT_MAX) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  }
  next();
};

// Sanitize email input
const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return null;
  return email.toLowerCase().trim().slice(0, 254);
};

router.post('/subscribe', rateLimit, async (req, res) => {
  try {
    const rawEmail = req.body?.email;
    const email = sanitizeEmail(rawEmail);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Strict email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email) || email.length > 254) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Check existing with timeout
    const existing = await Subscriber.findOne({ email }).maxTimeMS(5000).lean();
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already subscribed',
      });
    }

    // Create with upsert to prevent race conditions
    await Subscriber.findOneAndUpdate(
      { email },
      { $setOnInsert: { email, subscribedAt: new Date(), active: true } },
      { upsert: true, new: true, maxTimeMS: 5000 }
    );

    return res.status(201).json({
      success: true,
      message: 'Subscription successful',
    });
  } catch (error) {
    console.error('Subscribe error:', error.message);
    
    // Handle duplicate key error (race condition fallback)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already subscribed',
      });
    }
    
    // Handle timeout
    if (error.name === 'MongooseError' && error.message.includes('timed out')) {
      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again.',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.',
    });
  }
});

export default router;
