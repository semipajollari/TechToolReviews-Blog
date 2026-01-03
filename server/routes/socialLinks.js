import express from 'express';
import socialController from '../controllers/socialController.js';
import { validateSocialLink } from '../utils/validation.js';

const router = express.Router();

// GET /api/social-links - Get all active social links
router.get('/', socialController.getSocialLinks);

// POST /api/social-links - Create new social link (admin)
router.post('/', validateSocialLink, socialController.createSocialLink);

// PUT /api/social-links/:platform - Update social link (admin)
router.put('/:platform', validateSocialLink, socialController.updateSocialLink);

// GET /api/redirect/:platform - Redirect to social platform and track clicks
router.get('/redirect/:platform', socialController.redirectToSocialLink);

// DELETE /api/social-links/:platform - Delete social link (admin)
router.delete('/:platform', socialController.deleteSocialLink);

export default router;