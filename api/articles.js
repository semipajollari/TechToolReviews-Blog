import mongoose from 'mongoose';

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 10000 },
  imageUrl: { type: String, required: true },
  affiliateLink: { type: String, required: true },
  merchantLogo: { type: String, default: '' },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  published: { type: Boolean, default: false },
  category: { type: String, enum: ['software', 'tech-stacks', 'ai-tools', 'guides'], default: 'software' },
  author: { type: String, default: 'TechToolReviews Team' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

function getArticleModel() {
  return mongoose.models.Article || mongoose.model('Article', articleSchema);
}

let cachedConnection = null;

async function getMongoConnection() {
  if (cachedConnection && cachedConnection.connection.readyState === 1) return cachedConnection;
  const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoURI) throw new Error('Database configuration missing');
  cachedConnection = await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
  });
  return cachedConnection;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    await getMongoConnection();
    const Article = getArticleModel();

    const { slug, category } = req.query;

    // Get single article by slug
    if (slug) {
      const article = await Article.findOne({ slug, published: true }).lean();
      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      return res.status(200).json({ success: true, article });
    }

    // Get articles by category
    const query = { published: true };
    if (category) {
      query.category = category;
    }

    const articles = await Article.find(query).sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, count: articles.length, articles });
  } catch (error) {
    console.error('[Articles API] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
