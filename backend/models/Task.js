const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true
    },
    topicId: {
      type: String,
      default: ''
    },
    topicName: {
      type: String,
      default: ''
    },
    dueDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    },
    completed: {
      type: Boolean,
      default: false
    },
    estimatedMinutes: {
      type: Number,
      default: 30
    }
  },
  {
    timestamps: true
  }
);

taskSchema.index({ completed: 1, dueDate: 1 });
taskSchema.index({ topicId: 1 });

module.exports = mongoose.model('Task', taskSchema);
