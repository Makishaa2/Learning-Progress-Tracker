const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true
    },
    category: {
      type: String,
      default: 'General'
    },
    frequency: {
      type: String,
      enum: ['Daily', 'Weekly'],
      default: 'Daily'
    },
    targetCount: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      default: 'times'
    },
    reminderTime: {
      type: String,
      default: '08:00 AM'
    },
    icon: {
      type: String,
      default: '⚡'
    },
    color: {
      type: String,
      default: '#10b981'
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    bestStreak: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Habit', habitSchema);
