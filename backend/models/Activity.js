const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      default: ''
    },
    topic: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['subject', 'topic', 'session', 'resource', 'note', 'task', 'habit'],
      default: 'topic'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Activity', activitySchema);
