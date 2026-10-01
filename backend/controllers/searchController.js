const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const Habit = require('../models/Habit');
const CalendarEvent = require('../models/CalendarEvent');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');

const globalSearch = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.json({ success: true, data: { topics: [], subjects: [], habits: [], events: [] } });
    }

    const lowerQ = q.toLowerCase();

    if (!getIsConnected()) {
      const topics = memoryStore.topics.filter(t => t.topicName?.toLowerCase().includes(lowerQ) || t.subject?.toLowerCase().includes(lowerQ)).slice(0, 10);
      const subjects = memoryStore.subjects.filter(s => s.name?.toLowerCase().includes(lowerQ)).slice(0, 5);
      const habits = memoryStore.habits.filter(h => h.name?.toLowerCase().includes(lowerQ)).slice(0, 5);
      const events = memoryStore.events.filter(e => e.title?.toLowerCase().includes(lowerQ)).slice(0, 5);
      return res.json({ success: true, data: { topics, subjects, habits, events } });
    }

    const regex = new RegExp(q, 'i');

    const [topics, subjects, habits, events] = await Promise.all([
      Topic.find({
        $or: [{ topicName: regex }, { description: regex }, { notes: regex }]
      }).limit(10),
      Subject.find({ $or: [{ name: regex }, { description: regex }] }).limit(5),
      Habit.find({ name: regex }).limit(5),
      CalendarEvent.find({ title: regex }).limit(5)
    ]);

    res.json({ success: true, data: { topics, subjects, habits, events } });
  } catch (error) {
    const lowerQ = (req.query.q || '').trim().toLowerCase();
    const topics = memoryStore.topics.filter(t => t.topicName?.toLowerCase().includes(lowerQ)).slice(0, 10);
    const subjects = memoryStore.subjects.filter(s => s.name?.toLowerCase().includes(lowerQ)).slice(0, 5);
    const habits = memoryStore.habits.filter(h => h.name?.toLowerCase().includes(lowerQ)).slice(0, 5);
    const events = memoryStore.events.filter(e => e.title?.toLowerCase().includes(lowerQ)).slice(0, 5);
    res.json({ success: true, data: { topics, subjects, habits, events } });
  }
};

module.exports = { globalSearch };
