import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout', 
      'register',
      'password_change',
      'profile_update',
      'failed_login',
      'account_locked',
      'password_reset_request',
      'password_reset_complete'
    ]
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  success: {
    type: Boolean,
    default: true
  },
  details: {
    type: String // Additional details about the action
  },
  location: {
    country: String,
    city: String,
    region: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
userActivitySchema.index({ userId: 1, createdAt: -1 });
userActivitySchema.index({ userEmail: 1, createdAt: -1 });
userActivitySchema.index({ action: 1, createdAt: -1 });

// Auto-delete old activity logs after 90 days
userActivitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;
