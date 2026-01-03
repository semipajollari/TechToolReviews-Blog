import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
    unique: true
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
    trim: true,
    maxLength: 150
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
tagSchema.methods.updatePostCount = async function() {
  const BlogPost = mongoose.model('BlogPost');
  this.postCount = await BlogPost.countDocuments({
    tags: this.name,
    isPublished: true
  });
  await this.save();
};

export default mongoose.model('Tag', tagSchema);