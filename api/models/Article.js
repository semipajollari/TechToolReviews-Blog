import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [10000, 'Description cannot exceed 10000 characters'],
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        return /^https:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(v) || 
               /^https:\/\/res\.cloudinary\.com\/.+$/i.test(v);
      },
      message: 'Image URL must be a valid HTTPS image URL',
    },
  },
  affiliateLink: {
    type: String,
    required: [true, 'Affiliate link is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/i.test(v);
      },
      message: 'Affiliate link must be a valid URL',
    },
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['software', 'tech-stacks', 'ai-tools', 'guides'],
    default: 'software',
  },
  author: {
    type: String,
    default: 'TechToolReviews Team',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-generate slug from title before saving
articleSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
    
    // Add timestamp to ensure uniqueness
    if (this.isNew) {
      this.slug = `${this.slug}-${Date.now().toString(36)}`;
    }
  }
  this.updatedAt = new Date();
  next();
});

// Ensure slug uniqueness on update
articleSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  if (update.title) {
    const slug = update.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
    update.slug = slug;
  }
  update.updatedAt = new Date();
  next();
});

// Get Article model (with caching for serverless)
export function getArticleModel() {
  if (mongoose.models && mongoose.models.Article) {
    return mongoose.models.Article;
  }
  return mongoose.model('Article', articleSchema);
}

export default articleSchema;
