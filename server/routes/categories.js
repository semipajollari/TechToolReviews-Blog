import express from 'express';
import categoryController from '../controllers/categoryController.js';
import { validateCategory } from '../utils/validation.js';

const router = express.Router();

// GET /api/categories - Get all categories
router.get('/', categoryController.getCategories);

// GET /api/categories/:slug - Get category by slug
router.get('/:slug', categoryController.getCategoryBySlug);

// POST /api/categories - Create new category
router.post('/', validateCategory, categoryController.createCategory);

// PUT /api/categories/:id - Update category
router.put('/:id', validateCategory, categoryController.updateCategory);

// DELETE /api/categories/:id - Delete category
router.delete('/:id', categoryController.deleteCategory);

export default router;