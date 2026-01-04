import mongoose from 'mongoose';
import { getArticleModel } from './models/Article.js';

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

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await getMongoConnection();
    const Article = getArticleModel();

    // Get only published articles for public access
    const articles = await Article.find({ published: true })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    return res.status(200).json({
      success: true,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error('[Public Articles] Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
    });
  }
}
