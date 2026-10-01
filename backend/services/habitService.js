const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const { logActivity } = require('./activityService');

const getHabits = async () => {
  try {
    if (!getIsConnected()) {
      const today = new Date().toISOString().split('T')[0];
      return memoryStore.habits.map(h => {
        const log = memoryStore.habitLogs.find(l => l.habitId === h._id && l.date === today);
        return { ...h, completedToday: log ? log.completed : false };
      });
    }

    const habits = await Habit.find().sort({ createdAt: 1 });
    const today = new Date().toISOString().split('T')[0];

    const enriched = await Promise.all(
      habits.map(async (habit) => {
        const log = await HabitLog.findOne({ habitId: habit._id, date: today });
        const obj = habit.toObject();
        obj.completedToday = log ? log.completed : false;
        return obj;
      })
    );
    return enriched;
  } catch (err) {
    const today = new Date().toISOString().split('T')[0];
    return memoryStore.habits.map(h => {
      const log = memoryStore.habitLogs.find(l => l.habitId === h._id && l.date === today);
      return { ...h, completedToday: log ? log.completed : true };
    });
  }
};

const createHabit = async (data) => {
  try {
    if (getIsConnected()) {
      const habit = new Habit(data);
      const saved = await habit.save();
      await logActivity(`Created Habit: ${saved.name}`, '', saved.name, 'habit');
      return saved;
    }
  } catch (err) {
    console.error('DB error, using memory fallback for habit creation:', err.message);
  }
  const newHabit = {
    _id: 'hab_' + Date.now(),
    name: data.name,
    category: data.category || 'Academics',
    frequency: data.frequency || 'Daily',
    targetCount: Number(data.targetCount) || 1,
    unit: data.unit || 'times',
    reminderTime: data.reminderTime || '',
    icon: data.icon || '📖',
    color: data.color || '#3b82f6',
    currentStreak: 0,
    bestStreak: 0
  };
  memoryStore.habits.push(newHabit);
  await logActivity(`Created Habit: ${newHabit.name}`, '', newHabit.name, 'habit');
  return newHabit;
};

const updateHabit = async (id, data) => {
  try {
    if (getIsConnected()) {
      return await Habit.findByIdAndUpdate(id, data, { new: true });
    }
  } catch (err) {}
  const idx = memoryStore.habits.findIndex(h => h._id === id);
  if (idx !== -1) {
    memoryStore.habits[idx] = { ...memoryStore.habits[idx], ...data };
    return memoryStore.habits[idx];
  }
  return null;
};

const deleteHabit = async (id) => {
  try {
    if (getIsConnected()) {
      const habit = await Habit.findByIdAndDelete(id);
      if (habit) {
        await HabitLog.deleteMany({ habitId: id });
      }
      return habit;
    }
  } catch (err) {}
  const idx = memoryStore.habits.findIndex(h => h._id === id);
  if (idx !== -1) {
    const deleted = memoryStore.habits.splice(idx, 1)[0];
    memoryStore.habitLogs = memoryStore.habitLogs.filter(l => l.habitId !== id);
    return deleted;
  }
  return null;
};

const toggleHabitToday = async (habitId, dateStr) => {
  const date = dateStr || new Date().toISOString().split('T')[0];
  try {
    if (getIsConnected()) {
      const habit = await Habit.findById(habitId);
      if (!habit) return null;

      let log = await HabitLog.findOne({ habitId, date });
      if (log) {
        log.completed = !log.completed;
        await log.save();
      } else {
        log = await HabitLog.create({
          habitId,
          habitName: habit.name,
          date,
          completed: true
        });
      }

      if (log.completed) {
        habit.currentStreak += 1;
        if (habit.currentStreak > habit.bestStreak) {
          habit.bestStreak = habit.currentStreak;
        }
        await logActivity(`Completed Habit: ${habit.name}`, '', habit.name, 'habit');
      } else {
        habit.currentStreak = Math.max(0, habit.currentStreak - 1);
      }
      await habit.save();
      return { habit, log };
    }
  } catch (err) {}

  const habit = memoryStore.habits.find(h => h._id === habitId);
  if (!habit) return null;
  let log = memoryStore.habitLogs.find(l => l.habitId === habitId && l.date === date);
  if (log) {
    log.completed = !log.completed;
  } else {
    log = { _id: 'hl_' + Date.now(), habitId, habitName: habit.name, date, completed: true };
    memoryStore.habitLogs.push(log);
  }
  if (log.completed) {
    habit.currentStreak = (habit.currentStreak || 0) + 1;
    habit.bestStreak = Math.max(habit.bestStreak || 0, habit.currentStreak);
    await logActivity(`Completed Habit: ${habit.name}`, '', habit.name, 'habit');
  } else {
    habit.currentStreak = Math.max(0, (habit.currentStreak || 0) - 1);
  }
  return { habit, log };
};

const getHeatmapData = async () => {
  try {
    const logs = await HabitLog.find({ completed: true });
    const countByDate = {};
    logs.forEach((log) => {
      countByDate[log.date] = (countByDate[log.date] || 0) + 1;
    });
    return countByDate;
  } catch (err) {
    return {};
  }
};

const getHabitStats = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const habits = await Habit.find();
    const todayLogs = await HabitLog.find({ date: today, completed: true });

    // Last 30 days completion stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentLogs = await HabitLog.find({
      completed: true,
      createdAt: { $gte: thirtyDaysAgo }
    });

    return {
      totalHabits: habits.length,
      completedToday: todayLogs.length,
      completionRateToday: habits.length > 0 ? Math.round((todayLogs.length / habits.length) * 100) : 0,
      totalCompletionsLast30Days: recentLogs.length
    };
  } catch (err) {
    return { totalHabits: 0, completedToday: 0, completionRateToday: 0, totalCompletionsLast30Days: 0 };
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitToday,
  getHeatmapData,
  getHabitStats
};
