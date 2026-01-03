import express from 'express';
import { Subscriber } from '../models/Subscriber.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Email already subscribed',
      });
    }

    const subscriber = new Subscriber({ email: email.toLowerCase() });
    await subscriber.save();

    return res.status(200).json({
      success: true,
      message: 'Subscription successful',
    });
  } catch (error) {
    console.error('Subscribe error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

export default router;
