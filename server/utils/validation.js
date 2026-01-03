import { body } from 'express-validator';

// Blog Post Validation
export const validatePost = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),

  body('slug')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),

  body('excerpt')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Excerpt is required and must be less than 500 characters'),

  body('content')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Content is required'),

  body('category')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Category is required'),

  body('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author is required'),

  body('image')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Featured image is required')
    .isURL()
    .withMessage('Image must be a valid URL')
];

// Subscriber Validation
export const validateSubscription = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
];

// Category Validation
export const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Name is required and must be less than 50 characters'),

  body('slug')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Slug is required')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens'),

  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description is required and must be less than 200 characters'),

  body('icon')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Icon is required')
];

// Tag Validation
export const validateTag = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Name is required and must be less than 30 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Description must be less than 150 characters')
];

// Social Link Validation
export const validateSocialLink = [
  body('platform')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Platform is required')
    .isIn(['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'github', 'discord'])
    .withMessage('Invalid platform'),

  body('url')
    .trim()
    .isLength({ min: 1 })
    .withMessage('URL is required')
    .isURL()
    .withMessage('URL must be valid'),

  body('displayName')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Display name is required')
];