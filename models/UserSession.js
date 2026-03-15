// models/UserSession.js

const mongoose = require('mongoose');

const UserSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 28800 // auto-delete after 8 hours
  }
});

// INDEX — every single API request calls findOne({ userId, token, isActive })
// Without this index, MongoDB does a full collection scan on every request.
// With 8 users each checking every 60s this is 8 scans/min. The index makes
// each lookup near-instant regardless of how many sessions exist.
UserSessionSchema.index({ userId: 1, token: 1, isActive: 1 });

const UserSession = mongoose.model('sessions', UserSessionSchema);

module.exports = UserSession;
