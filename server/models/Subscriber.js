import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String,
    sparse: true
  },
  unsubscribeToken: {
    type: String,
    sparse: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  lastEmailSent: {
    type: Date
  },
  preferences: {
    categories: [{
      type: String,
      trim: true
    }],
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ verificationToken: 1 });
subscriberSchema.index({ unsubscribeToken: 1 });

export default mongoose.model('Subscriber', subscriberSchema);