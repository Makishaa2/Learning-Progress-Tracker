const CalendarEvent = require('../models/CalendarEvent');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const { logActivity } = require('./activityService');

const getEvents = async (query = {}) => {
  try {
    if (!getIsConnected()) {
      let result = [...memoryStore.events];
      if (query.date) result = result.filter(e => e.date === query.date);
      if (query.eventType) result = result.filter(e => e.eventType === query.eventType);
      return result;
    }
    const filter = {};
    if (query.date) filter.date = query.date;
    if (query.eventType) filter.eventType = query.eventType;
    return await CalendarEvent.find(filter).sort({ date: 1, time: 1 });
  } catch (err) {
    return memoryStore.events;
  }
};

const createEvent = async (data) => {
  try {
    if (getIsConnected()) {
      const event = new CalendarEvent(data);
      const saved = await event.save();
      await logActivity(`Scheduled: ${saved.title}`, saved.subject || '', '', 'topic');
      return saved;
    }
  } catch (err) {}
  const newEv = {
    _id: 'ev_' + Date.now(),
    title: data.title,
    subject: data.subject || '',
    topic: data.topic || '',
    eventType: data.eventType || 'Study Session',
    date: data.date || new Date().toISOString().split('T')[0],
    time: data.time || '10:00 AM',
    durationMinutes: Number(data.durationMinutes) || 60,
    priority: data.priority || 'Medium',
    status: data.status || 'Scheduled'
  };
  memoryStore.events.push(newEv);
  await logActivity(`Scheduled: ${newEv.title}`, newEv.subject || '', '', 'topic');
  return newEv;
};

const updateEvent = async (id, data) => {
  try {
    if (getIsConnected()) {
      return await CalendarEvent.findByIdAndUpdate(id, data, { new: true });
    }
  } catch (err) {}
  const idx = memoryStore.events.findIndex(e => e._id === id);
  if (idx !== -1) {
    memoryStore.events[idx] = { ...memoryStore.events[idx], ...data };
    return memoryStore.events[idx];
  }
  return null;
};

const deleteEvent = async (id) => {
  try {
    if (getIsConnected()) {
      return await CalendarEvent.findByIdAndDelete(id);
    }
  } catch (err) {}
  const idx = memoryStore.events.findIndex(e => e._id === id);
  if (idx !== -1) {
    return memoryStore.events.splice(idx, 1)[0];
  }
  return null;
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
