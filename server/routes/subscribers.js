import express from 'express';
import subscriberController from '../controllers/subscriberController.js';
import { validateSubscription } from '../utils/validation.js';

const router = express.Router();

// POST /api/subscribe - Subscribe to newsletter
router.post('/', validateSubscription, subscriberController.subscribe);

// POST /api/subscribe/verify - Verify email subscription
router.post('/verify', subscriberController.verifySubscription);

// POST /api/subscribe/unsubscribe - Unsubscribe from newsletter
router.post('/unsubscribe', subscriberController.unsubscribe);

// GET /api/subscribe/stats - Get subscription statistics (admin only)
router.get('/stats', subscriberController.getSubscriptionStats);

export default router;