const ActivityLog = require('../models/ActivityLog');

const logActivity = async (message, subject = '', topic = '', type = 'topic') => {
  try {
    await ActivityLog.create({ message, subject, topic, type });
  } catch (err) {
    // Non-critical — don't propagate
    console.error('Activity log failed:', err.message);
  }
};

const getActivity = async (limit = 20) => {
  try {
    return await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
  } catch {
    return [];
  }
};

module.exports = { logActivity, getActivity };
