import mongoose from 'mongoose';

// Subscriber Schema
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
  verifiedAt: Date,
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

export function getSubscriberModel() {
  if (mongoose.models && mongoose.models.Subscriber) {
    return mongoose.models.Subscriber;
  }
  return mongoose.model('Subscriber', subscriberSchema);
}

export default { getSubscriberModel };
