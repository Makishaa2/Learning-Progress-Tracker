const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      unique: true,
      trim: true
    },
    code: {
      type: String,
      trim: true,
      default: ''
    },
    icon: {
      type: String,
      default: '📚'
    },
    color: {
      type: String,
      default: '#3b82f6'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    startedDate: {
      type: String,
      default: ''
    },
    targetDate: {
      type: String,
      default: ''
    },
    estimatedHours: {
      type: Number,
      default: 40
    },
    completedHours: {
      type: Number,
      default: 0
    },
    nextRevisionDate: {
      type: String,
      default: ''
    },
    tags: [{ type: String }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Subject', subjectSchema);
