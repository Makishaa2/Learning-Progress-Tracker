const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: [true, 'Subject is required']
    },
    topic: {
      type: String,
      required: [true, 'Topic is required']
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    durationMinutes: {
      type: Number,
      required: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StudySession', studySessionSchema);
