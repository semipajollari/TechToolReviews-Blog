import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  postCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Update post count when posts are added/removed
categorySchema.methods.updatePostCount = async function() {
  const BlogPost = mongoose.model('BlogPost');
  this.postCount = await BlogPost.countDocuments({
    category: this.slug,
    isPublished: true
  });
  await this.save();
};

export default mongoose.model('Category', categorySchema);