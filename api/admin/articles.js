import mongoose from 'mongoose';
import { getArticleModel } from '../models/Article.js';
import { getSubscriberModel } from './utils/models.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { sendNewArticleEmail } from './utils/newsletter.js';

// MongoDB connection cache
let cachedConnection = null;

async function getMongoConnection() {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    return cachedConnection;
  }

  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoURI) {
    throw new Error('Database configuration missing');
  }

  const conn = await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  });

  cachedConnection = conn;
  return conn;
}

// Validation helper
function validateArticle(data) {
  const errors = [];

  if (!data.title || data.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  if (!data.description || data.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters');
  }
  if (!data.imageUrl || !/^https:\/\/.+/i.test(data.imageUrl)) {
    errors.push('Image URL must be a valid HTTPS URL');
  }
  if (!data.affiliateLink || !/^https?:\/\/.+/i.test(data.affiliateLink)) {
    errors.push('Affiliate link must be a valid URL');
  }

  return errors;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authenticate admin for all operations
  const authError = authenticateAdmin(req);
  if (authError) {
    return res.status(authError.status).json(authError.body);
  }

  try {
    await getMongoConnection();
    const Article = getArticleModel();

    // GET - List all articles
    if (req.method === 'GET') {
      const articles = await Article.find({})
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        count: articles.length,
        articles,
      });
    }

    // POST - Create new article
    if (req.method === 'POST') {
      const { title, description, imageUrl, affiliateLink, category, author, published } = req.body;

      // Validate
      const validationErrors = validateArticle(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      const article = new Article({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        affiliateLink: affiliateLink.trim(),
        category: category || 'software',
        author: author || 'TechToolReviews Team',
        published: published || false,
      });

      await article.save();

      // Send newsletter if published
      if (published) {
        try {
          await sendNewArticleEmail(article);
          console.log('[Articles] Newsletter sent for:', article.title);
        } catch (emailError) {
          console.error('[Articles] Failed to send newsletter:', emailError.message);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Article created successfully',
        article,
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('[Articles API] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
