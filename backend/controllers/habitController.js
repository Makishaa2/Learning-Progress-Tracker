const habitService = require('../services/habitService');

const getHabits = async (req, res, next) => {
  try {
    const habits = await habitService.getHabits();
    res.json({ success: true, count: habits.length, data: habits });
  } catch (error) {
    next(error);
  }
};

const createHabit = async (req, res, next) => {
  try {
    const habit = await habitService.createHabit(req.body);
    res.status(201).json({ success: true, data: habit });
  } catch (error) {
    next(error);
  }
};

const updateHabit = async (req, res, next) => {
  try {
    const habit = await habitService.updateHabit(req.params.id, req.body);
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }
    res.json({ success: true, data: habit });
  } catch (error) {
    next(error);
  }
};

const deleteHabit = async (req, res, next) => {
  try {
    const habit = await habitService.deleteHabit(req.params.id);
    if (!habit) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }
    res.json({ success: true, message: 'Habit deleted' });
  } catch (error) {
    next(error);
  }
};

const toggleHabitToday = async (req, res, next) => {
  try {
    const result = await habitService.toggleHabitToday(req.params.id, req.body.date);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Habit not found' });
    }
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getHeatmap = async (req, res, next) => {
  try {
    const heatmap = await habitService.getHeatmapData();
    res.json({ success: true, data: heatmap });
  } catch (error) {
    next(error);
  }
};

const getHabitStats = async (req, res, next) => {
  try {
    const stats = await habitService.getHabitStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitToday,
  getHeatmap,
  getHabitStats
};
