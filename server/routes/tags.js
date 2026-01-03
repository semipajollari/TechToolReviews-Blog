import express from 'express';
import tagController from '../controllers/tagController.js';
import { validateTag } from '../utils/validation.js';

const router = express.Router();

// GET /api/tags - Get all tags
router.get('/', tagController.getTags);

// GET /api/tags/:slug - Get tag by slug
router.get('/:slug', tagController.getTagBySlug);

// POST /api/tags - Create new tag
router.post('/', validateTag, tagController.createTag);

// PUT /api/tags/:id - Update tag
router.put('/:id', validateTag, tagController.updateTag);

// DELETE /api/tags/:id - Delete tag
router.delete('/:id', tagController.deleteTag);

export default router;