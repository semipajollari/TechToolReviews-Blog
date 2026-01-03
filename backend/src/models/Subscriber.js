import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [254, 'Email too long'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for active subscribers query (email already indexed by unique: true)
subscriberSchema.index({ active: 1, subscribedAt: -1 }, { background: true });

export const Subscriber = mongoose.model('Subscriber', subscriberSchema);
