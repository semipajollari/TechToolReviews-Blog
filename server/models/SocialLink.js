import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['instagram', 'linkedin', 'twitter', 'facebook', 'youtube', 'github', 'discord'],
    unique: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  clickCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better performance
socialLinkSchema.index({ platform: 1 });
socialLinkSchema.index({ order: 1 });

// Method to increment click count
socialLinkSchema.methods.incrementClick = async function() {
  this.clickCount += 1;
  await this.save();
};

export default mongoose.model('SocialLink', socialLinkSchema);