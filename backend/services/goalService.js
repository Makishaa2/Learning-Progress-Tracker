const Goal = require('../models/Goal');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const { logActivity } = require('./activityService');

const getGoals = async () => {
  try {
    if (!getIsConnected()) {
      return memoryStore.goals;
    }
    return await Goal.find().sort({ createdAt: -1 });
  } catch (err) {
    return memoryStore.goals;
  }
};

const createGoal = async (data) => {
  try {
    if (getIsConnected()) {
      const goal = new Goal(data);
      const saved = await goal.save();
      await logActivity(`Set Goal: ${saved.title}`, saved.subject || '', '', 'topic');
      return saved;
    }
  } catch (err) {}
  const newGoal = {
    _id: 'gl_' + Date.now(),
    title: data.title,
    subject: data.subject || 'Overall',
    targetValue: Number(data.targetValue) || 10,
    currentValue: Number(data.currentValue) || 0,
    unit: data.unit || 'hours',
    targetDate: data.targetDate || '',
    status: data.status || 'In Progress'
  };
  memoryStore.goals.unshift(newGoal);
  await logActivity(`Set Goal: ${newGoal.title}`, newGoal.subject || '', '', 'topic');
  return newGoal;
};

const updateGoal = async (id, data) => {
  try {
    if (getIsConnected()) {
      const updated = await Goal.findByIdAndUpdate(id, data, { new: true });
      if (updated && data.status === 'Achieved') {
        await logActivity(`Achieved Goal: ${updated.title}`, updated.subject || '', '', 'topic');
      }
      return updated;
    }
  } catch (err) {}
  const idx = memoryStore.goals.findIndex(g => g._id === id);
  if (idx !== -1) {
    memoryStore.goals[idx] = { ...memoryStore.goals[idx], ...data };
    return memoryStore.goals[idx];
  }
  return null;
};

const deleteGoal = async (id) => {
  try {
    if (getIsConnected()) {
      return await Goal.findByIdAndDelete(id);
    }
  } catch (err) {}
  const idx = memoryStore.goals.findIndex(g => g._id === id);
  if (idx !== -1) {
    const deleted = memoryStore.goals.splice(idx, 1)[0];
    return deleted;
  }
  return null;
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
};
