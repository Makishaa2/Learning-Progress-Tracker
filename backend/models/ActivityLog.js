const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    subject: { type: String, default: '' },
    topic:   { type: String, default: '' },
    type:    {
      type: String,
      enum: ['topic', 'session', 'habit', 'goal', 'task'],
      default: 'topic'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
