import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Lazy load heavy modules only when needed
let cloudinaryV2 = null;
let resendClient = null;

function getCloudinary() {
  if (!cloudinaryV2) {
    const cloudinary = require('cloudinary');
    cloudinaryV2 = cloudinary.v2;
    cloudinaryV2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  return cloudinaryV2;
}

function getResend() {
  if (!resendClient) {
    const { Resend } = require('resend');
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

// ============================================================
// MODELS (inline to avoid import issues)
// ============================================================

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, select: false },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  lastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

function getAdminModel() {
  return mongoose.models.Admin || mongoose.model('Admin', adminSchema);
}

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, trim: true, maxlength: 10000 },
  imageUrl: { type: String, required: true },
  affiliateLink: { type: String, required: true },
  affiliateName: { type: String, default: '' },
  merchantLogo: { type: String, default: '' },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  published: { type: Boolean, default: false },
  category: { type: String, enum: ['software', 'tech-stacks', 'ai-tools', 'guides'], default: 'software' },
  author: { type: String, default: 'TechToolReviews Team' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

articleSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 100);
    if (this.isNew) this.slug = `${this.slug}-${Date.now().toString(36)}`;
  }
  this.updatedAt = new Date();
  next();
});

function getArticleModel() {
  return mongoose.models.Article || mongoose.model('Article', articleSchema);
}

// Subscriber Schema
// Matching api/subscribe.js to avoid schema conflict
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'unsubscribed'],
    default: 'pending',
  },
  verificationToken: String,
  tokenExpiresAt: Date,
  unsubscribeToken: String,
  verifiedAt: Date,
  lastEmailSent: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function getSubscriberModel() {
  return mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);
}

// ============================================================
// AUTH HELPERS
// ============================================================

const JWT_SECRET = process.env.JWT_SECRET || 'techtoolreviews-admin-secret-2026';

function generateToken(adminId, username, role = 'admin') {
  return jwt.sign({ id: adminId, username, role }, JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(token) {
  try {
    return { valid: true, decoded: jwt.verify(token, JWT_SECRET) };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

function authenticateAdmin(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { status: 401, body: { success: false, message: 'Access denied. No token provided.' } };
  }
  const { valid, decoded, error } = verifyToken(authHeader.split(' ')[1]);
  if (!valid) {
    return { status: 401, body: { success: false, message: 'Invalid or expired token.' } };
  }
  req.admin = decoded;
  return null;
}

// ============================================================
// DATABASE CONNECTION
// ============================================================
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

// ============================================================
// NEWSLETTER
// ============================================================
async function sendNewArticleEmail(article) {
  try {
    const resend = getResend();
    const Subscriber = getSubscriberModel();
    const subscribers = await Subscriber.find({ status: 'active' }).lean();
    if (subscribers.length === 0) return { success: true, sent: 0 };

    const FRONTEND_URL = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'TechToolReviews <onboarding@resend.dev>';
    const articleUrl = `${FRONTEND_URL}/article/${article.slug}`;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">New Article: ${article.title}</h1>
        <img src="${article.imageUrl}" alt="${article.title}" style="width: 100%; max-height: 300px; object-fit: cover;">
        <p>${article.description.substring(0, 300)}...</p>
        <a href="${articleUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Read Full Article</a>
      </div>
    `;

    let sentCount = 0;
    for (const subscriber of subscribers.slice(0, 50)) {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: `📰 New: ${article.title}`,
          html: emailHtml,
        });
        sentCount++;
      } catch (e) { console.error('Email failed:', e.message); }
    }
    return { success: true, sent: sentCount };
  } catch (error) {
    console.error('[Newsletter] Error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// MAIN HANDLER
// ============================================================
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, id } = req.query;

  try {
    // Connect to database first for all actions
    await getMongoConnection();

    // LOGIN - No auth required
    if (action === 'login' && req.method === 'POST') {
      return await handleLogin(req, res);
    }

    // UPLOAD - Auth required
    if (action === 'upload' && req.method === 'POST') {
      const authError = authenticateAdmin(req);
      if (authError) return res.status(authError.status).json(authError.body);
      return await handleUpload(req, res);
    }

    // ARTICLES - Auth required for all
    const authError = authenticateAdmin(req);
    if (authError) return res.status(authError.status).json(authError.body);

    if (action === 'articles') {
      if (req.method === 'GET') return await handleGetArticles(req, res, id);
      if (req.method === 'POST') return await handleCreateArticle(req, res);
      if (req.method === 'PUT' && id) return await handleUpdateArticle(req, res, id);
      if (req.method === 'DELETE' && id) return await handleDeleteArticle(req, res, id);
    }
    
    // SUBSCRIBERS - Auth required
    if (action === 'subscribers') {
      if (req.method === 'GET') return await handleGetSubscribers(req, res);
    }
    
    // NEWSLETTER - Auth required
    if (action === 'newsletter') {
      if (req.method === 'POST') return await handleSendNewsletter(req, res);
    }
    
    // VERIFY SUBSCRIBER - Auth required
    if (action === 'verify-subscriber' && id) {
      if (req.method === 'POST') return await handleVerifySubscriber(req, res, id);
    }
    
    // STATS
    if (action === 'stats') {
      return await handleGetStats(req, res);
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });
  } catch (error) {
    console.error('[Admin API] Error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

// ============================================================
// HANDLERS
// ============================================================

async function handleLogin(req, res) {
  try {
    console.log('[handleLogin] Request body:', JSON.stringify(req.body));
    const { username, password } = req.body || {};
    
    if (!username || !password) {
      console.log('[handleLogin] Missing credentials');
      return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const Admin = getAdminModel();
    console.log('[handleLogin] Looking for admin:', username.toLowerCase());

    let admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');
    console.log('[handleLogin] Found admin:', !!admin);

    // Create default admin if not exists
    if (!admin && username.toLowerCase() === 'admin') {
      console.log('[handleLogin] Creating default admin');
      admin = new Admin({
        username: 'admin',
        password: process.env.ADMIN_PASSWORD || 'TechTool@2026!',
        email: process.env.ADMIN_EMAIL || 'admin@techtoolreviews.co',
        role: 'superadmin',
      });
      await admin.save();
      admin = await Admin.findOne({ username: 'admin' }).select('+password');
    }

    if (!admin) {
      console.log('[handleLogin] Admin not found');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const passwordMatch = await admin.comparePassword(password);
    console.log('[handleLogin] Password match:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id.toString(), admin.username, admin.role);
    console.log('[handleLogin] Login successful');
    return res.status(200).json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
    });
  } catch (error) {
    console.error('[handleLogin] Error:', error);
    return res.status(500).json({ success: false, message: 'Login error: ' + error.message });
  }
}

async function handleUpload(req, res) {
  try {
    const { image } = req.body;
    if (!image || !image.startsWith('data:image/')) {
      return res.status(400).json({ success: false, message: 'Invalid image data' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({ success: false, message: 'Cloudinary not configured' });
    }

    const cloudinary = getCloudinary();
    const result = await cloudinary.uploader.upload(image, {
      folder: 'techtoolreviews/articles',
      transformation: [{ width: 1200, height: 630, crop: 'fill', quality: 'auto:best' }],
    });

    return res.status(200).json({ success: true, imageUrl: result.secure_url });
  } catch (error) {
    console.error('[handleUpload] Error:', error);
    return res.status(500).json({ success: false, message: 'Upload failed: ' + error.message });
  }
}

async function handleGetArticles(req, res, id) {
  const Article = getArticleModel();
  if (id) {
    const article = await Article.findById(id).lean();
    if (!article) return res.status(404).json({ success: false, message: 'Article not found' });
    return res.status(200).json({ success: true, article });
  }
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
  return res.status(200).json({ success: true, count: articles.length, articles });
}

async function handleCreateArticle(req, res) {
  const { title, description, imageUrl, affiliateLink, affiliateName, merchantLogo, category, author, published } = req.body;

  if (!title || title.length < 5) return res.status(400).json({ success: false, message: 'Title must be at least 5 characters' });
  if (!description || description.length < 20) return res.status(400).json({ success: false, message: 'Description must be at least 20 characters' });
  if (!imageUrl || !imageUrl.startsWith('https://')) return res.status(400).json({ success: false, message: 'Valid HTTPS image URL required' });
  if (!affiliateLink) return res.status(400).json({ success: false, message: 'Affiliate link required' });

  const Article = getArticleModel();
  const article = new Article({ 
    title, 
    description, 
    imageUrl, 
    affiliateLink, 
    affiliateName: affiliateName || '',
    merchantLogo: merchantLogo || '', 
    category, 
    author, 
    published 
  });
  await article.save();

  if (published) {
    try { await sendNewArticleEmail(article); } catch (e) { console.error('Newsletter failed:', e); }
  }

  return res.status(201).json({ success: true, article });
}

async function handleUpdateArticle(req, res, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid article ID' });
  }

  const Article = getArticleModel();
  const existing = await Article.findById(id);
  if (!existing) return res.status(404).json({ success: false, message: 'Article not found' });

  const wasUnpublished = !existing.published;
  const { title, description, imageUrl, affiliateLink, affiliateName, merchantLogo, category, author, published } = req.body;

  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (imageUrl !== undefined) update.imageUrl = imageUrl;
  if (affiliateLink !== undefined) update.affiliateLink = affiliateLink;
  if (affiliateName !== undefined) update.affiliateName = affiliateName;
  if (merchantLogo !== undefined) update.merchantLogo = merchantLogo;
  if (category !== undefined) update.category = category;
  if (author !== undefined) update.author = author;
  if (published !== undefined) update.published = published;
  update.updatedAt = new Date();

  const article = await Article.findByIdAndUpdate(id, { $set: update }, { new: true });

  if (wasUnpublished && published) {
    try { await sendNewArticleEmail(article); } catch (e) { console.error('Newsletter failed:', e); }
  }

  return res.status(200).json({ success: true, article });
}

async function handleDeleteArticle(req, res, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: 'Invalid article ID' });
  }

  const Article = getArticleModel();
  const article = await Article.findByIdAndDelete(id);
  if (!article) return res.status(404).json({ success: false, message: 'Article not found' });

  return res.status(200).json({ success: true, message: 'Article deleted' });
}

async function handleGetSubscribers(req, res) {
  try {
    const Subscriber = getSubscriberModel();
    // Get stats
    const total = await Subscriber.countDocuments();
    const active = await Subscriber.countDocuments({ status: 'active' });
    const pending = await Subscriber.countDocuments({ status: 'pending' });
    
    // Get list (limit 500 for now)
    const subscribers = await Subscriber.find()
      .sort({ createdAt: -1 })
      .limit(500)
      .lean();
      
    return res.status(200).json({ success: true, subscribers, stats: { total, active, pending } });
  } catch (error) {
    console.error('Failed to get subscribers:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function handleSendNewsletter(req, res) {
  try {
    const { subject, content, test } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({ success: false, message: 'Subject and content required' });
    }
    
    // Update: If Resend not configured, log and return simulated success for testing if test=true
    if (!process.env.RESEND_API_KEY) {
       console.log('RESEND_API_KEY missing - simulating email send');
       return res.status(200).json({ success: true, message: 'Simulated email sent (Resend key missing)', sent: 1 });
    }
    
    const resend = getResend();
    const Subscriber = getSubscriberModel();
    const fromEmail = process.env.FROM_EMAIL || 'TechToolReviews <noreply@techtoolreviews.co>';
    
    // If test mode, send only to admin
    if (test) {
      const adminEmail = req.admin.email || process.env.ADMIN_EMAIL || 'semipajo2003@gmail.com';
      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `[TEST] ${subject}`,
        html: content
      });
      return res.status(200).json({ success: true, message: `Test email sent to ${adminEmail}`, sent: 1 });
    }
    
    // Process bulk send using Resend batch API (100 emails per batch)
    const subscribers = await Subscriber.find({ status: 'active' }).lean();
    if (subscribers.length === 0) {
      return res.status(200).json({ success: true, message: 'No active subscribers found', sent: 0 });
    }
    
    const BATCH_SIZE = 100; // Resend's max batch size
    let totalSent = 0;
    const errors = [];
    
    // Split subscribers into batches of 100
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      
      try {
        // Prepare batch payload
        const baseUrl = process.env.FRONTEND_URL || 'https://techtoolreviews.co';
        const emails = batch.map(sub => ({
          from: fromEmail,
          to: sub.email,
          subject: subject,
          html: content,
          headers: {
            'List-Unsubscribe': `<${baseUrl}/api/unsubscribe?token=${sub.unsubscribeToken || ''}>`
          }
        }));
        
        // Send batch
        const result = await resend.batch.send(emails);
        totalSent += batch.length;
        console.log(`[Newsletter] Batch ${Math.floor(i / BATCH_SIZE) + 1} sent: ${batch.length} emails`);
      } catch (err) {
        console.error('[Newsletter] Batch error:', err);
        errors.push({ batch: Math.floor(i / BATCH_SIZE) + 1, count: batch.length, error: err.message });
      }
    }
    
    return res.status(200).json({ 
      success: true, 
      sent: totalSent, 
      total: subscribers.length,
      batches: Math.ceil(subscribers.length / BATCH_SIZE),
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
async function handleVerifySubscriber(req, res, id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid subscriber ID' });
    }

    const Subscriber = getSubscriberModel();
    const subscriber = await Subscriber.findById(id);
    
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    subscriber.status = 'active';
    subscriber.verifiedAt = new Date();
    subscriber.verificationToken = undefined;
    subscriber.tokenExpiresAt = undefined;
    await subscriber.save();

    console.log('[Admin] Manually verified subscriber:', subscriber.email);
    return res.status(200).json({ success: true, message: 'Subscriber verified', subscriber });
  } catch (error) {
    console.error('Failed to verify subscriber:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
async function handleGetStats(req, res) {
  try {
    const Subscriber = getSubscriberModel();
    const Article = getArticleModel();
    
    const [subscriberCount, articleCount] = await Promise.all([
      Subscriber.countDocuments({ status: 'active' }),
      Article.countDocuments()
    ]);
    
    return res.status(200).json({ 
      success: true, 
      stats: {
        subscribers: subscriberCount,
        articles: articleCount,
        views: 12543 + (articleCount * 120), // Mock views based on articles
        growth: 12.5
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
