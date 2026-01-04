import mongoose from 'mongoose';
import { getArticleModel } from '../models/Article.js';
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
function validateArticle(data, isUpdate = false) {
  const errors = [];

  if (data.title !== undefined && data.title.trim().length < 5) {
    errors.push('Title must be at least 5 characters');
  }
  if (data.description !== undefined && data.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters');
  }
  if (data.imageUrl !== undefined && !/^https:\/\/.+/i.test(data.imageUrl)) {
    errors.push('Image URL must be a valid HTTPS URL');
  }
  if (data.affiliateLink !== undefined && !/^https?:\/\/.+/i.test(data.affiliateLink)) {
    errors.push('Affiliate link must be a valid URL');
  }

  return errors;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authenticate admin
  const authError = authenticateAdmin(req);
  if (authError) {
    return res.status(authError.status).json(authError.body);
  }

  // Get article ID from query
  const { id } = req.query;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Valid article ID is required',
    });
  }

  try {
    await getMongoConnection();
    const Article = getArticleModel();

    // GET - Get single article
    if (req.method === 'GET') {
      const article = await Article.findById(id).lean();

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found',
        });
      }

      return res.status(200).json({
        success: true,
        article,
      });
    }

    // PUT - Update article
    if (req.method === 'PUT') {
      const { title, description, imageUrl, affiliateLink, category, author, published } = req.body;

      // Check if article exists
      const existingArticle = await Article.findById(id);
      if (!existingArticle) {
        return res.status(404).json({
          success: false,
          message: 'Article not found',
        });
      }

      // Validate fields being updated
      const validationErrors = validateArticle(req.body, true);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors,
        });
      }

      // Track if this is a new publish
      const wasUnpublished = !existingArticle.published;
      const isNowPublished = published === true;

      // Update fields
      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl.trim();
      if (affiliateLink !== undefined) updateData.affiliateLink = affiliateLink.trim();
      if (category !== undefined) updateData.category = category;
      if (author !== undefined) updateData.author = author;
      if (published !== undefined) updateData.published = published;

      const article = await Article.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      // Send newsletter if just published
      if (wasUnpublished && isNowPublished) {
        try {
          await sendNewArticleEmail(article);
          console.log('[Articles] Newsletter sent for:', article.title);
        } catch (emailError) {
          console.error('[Articles] Failed to send newsletter:', emailError.message);
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Article updated successfully',
        article,
      });
    }

    // DELETE - Delete article
    if (req.method === 'DELETE') {
      const article = await Article.findByIdAndDelete(id);

      if (!article) {
        return res.status(404).json({
          success: false,
          message: 'Article not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Article deleted successfully',
        articleId: id,
      });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('[Article API] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
