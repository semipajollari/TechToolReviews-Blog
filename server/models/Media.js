import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: Number,
    required: true,
    min: 0
  },
  url: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  alt: {
    type: String,
    trim: true
  },
  caption: {
    type: String,
    trim: true
  },
  uploadedBy: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Indexes for better performance
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ createdAt: -1 });

export default mongoose.model('Media', mediaSchema);