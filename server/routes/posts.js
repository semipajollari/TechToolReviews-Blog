import express from 'express';
import postController from '../controllers/postController.js';
import { validatePost } from '../utils/validation.js';

const router = express.Router();

// GET /api/posts - Get all posts with pagination and filtering
router.get('/', postController.getPosts);

// GET /api/posts/:slug - Get single post by slug
router.get('/:slug', postController.getPostBySlug);

// POST /api/posts - Create new post
router.post('/', validatePost, postController.createPost);

// PUT /api/posts/:id - Update post
router.put('/:id', validatePost, postController.updatePost);

// DELETE /api/posts/:id - Delete post
router.delete('/:id', postController.deletePost);

export default router;