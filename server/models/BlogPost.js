import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    trim: true,
    maxLength: 500
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  pros: [{
    type: String,
    trim: true
  }],
  cons: [{
    type: String,
    trim: true
  }],
  affiliateLinks: [{
    label: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    position: {
      type: String,
      enum: ['top', 'middle', 'bottom', 'cta-box'],
      default: 'bottom'
    }
  }],
  seoMeta: {
    title: String,
    description: String
  },
  comparisonTable: {
    headers: [String],
    rows: [[String]]
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
blogPostSchema.index({ category: 1, isPublished: 1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ createdAt: -1 });

export default mongoose.model('BlogPost', blogPostSchema);