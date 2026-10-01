const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const resourceItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['Documentation', 'YouTube', 'Practice', 'Book', 'PDF', 'Article', 'GitHub', 'Other'],
    default: 'Documentation'
  },
  url: { type: String, required: true }
});

const practiceQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, default: '' },
  solved: { type: Boolean, default: false },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' }
});

const revisionItemSchema = new mongoose.Schema({
  intervalDays: { type: Number, required: true }, // e.g. 1, 7, 30
  scheduledDate: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const topicSchema = new mongoose.Schema(
  {
    topicName: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    parentTopic: {
      type: String,
      default: '' // Empty string if root topic, otherwise name of parent topic (e.g., 'Basics', 'Arrays', 'OOP')
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['Not Started', 'Learning', 'Completed'],
      default: 'Not Started'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    estimatedTimeMinutes: {
      type: Number,
      default: 120
    },
    timeSpentMinutes: {
      type: Number,
      default: 0
    },
    startDate: {
      type: String,
      default: ''
    },
    targetDate: {
      type: String,
      default: ''
    },
    completionDate: {
      type: String,
      default: ''
    },
    nextRevisionDate: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    },
    isBookmarked: {
      type: Boolean,
      default: false
    },
    tags: [{ type: String }],
    checklist: [checklistItemSchema],
    resources: [resourceItemSchema],
    practiceQuestions: [practiceQuestionSchema],
    revisionSchedule: [revisionItemSchema]
  },
  {
    timestamps: true
  }
);

topicSchema.index({ subject: 1, status: 1 });
topicSchema.index({ topicName: 1 });
topicSchema.index({ isBookmarked: 1 });
topicSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Topic', topicSchema);
