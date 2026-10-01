const mongoose = require('mongoose');

const pathNodeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['Completed', 'Learning', 'Not Started'], default: 'Not Started' },
  topicId: { type: String, default: '' },
  order: { type: Number, default: 0 }
});

const learningPathSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Learning path title is required'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    nodes: [pathNodeSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LearningPath', learningPathSchema);
