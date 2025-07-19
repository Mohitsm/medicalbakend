import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    enum: ['logout', 'security', 'password_change', 'admin_action'],
    default: 'logout'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for automatic cleanup of expired tokens
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for fast token lookup
tokenBlacklistSchema.index({ token: 1 });

const tokenBlacklist = mongoose.model('TokenBlacklist', tokenBlacklistSchema);

export default tokenBlacklist;
