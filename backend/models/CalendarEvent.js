const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    subject: {
      type: String,
      default: ''
    },
    topic: {
      type: String,
      default: ''
    },
    eventType: {
      type: String,
      enum: ['Study Session', 'Revision Day', 'Assignment Deadline', 'Exam', 'Personal Event', 'Habit Reminder'],
      default: 'Study Session'
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true
    },
    time: {
      type: String,
      default: '09:00 AM'
    },
    durationMinutes: {
      type: Number,
      default: 60
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    reminder: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Overdue', 'Cancelled'],
      default: 'Scheduled'
    }
  },
  {
    timestamps: true
  }
);

calendarEventSchema.index({ date: 1 });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
