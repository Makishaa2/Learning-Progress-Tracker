const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true
    },
    subject: {
      type: String,
      default: ''
    },
    targetValue: {
      type: Number,
      required: true
    },
    currentValue: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: 'items' // e.g. Problems, Hours, Topics
    },
    targetDate: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['In Progress', 'Achieved', 'Paused'],
      default: 'In Progress'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Goal', goalSchema);
