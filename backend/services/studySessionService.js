const StudySession = require('../models/StudySession');
const Subject = require('../models/Subject');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const { logActivity } = require('./activityService');

const getSessions = async (filters = {}) => {
  try {
    if (!getIsConnected()) {
      let result = [...memoryStore.studySessions];
      if (filters.subject) result = result.filter(s => s.subject === filters.subject);
      if (filters.date) result = result.filter(s => s.date === filters.date);
      return result;
    }
    const query = {};
    if (filters.subject) query.subject = filters.subject;
    if (filters.date) query.date = filters.date;
    return await StudySession.find(query).sort({ createdAt: -1 });
  } catch (err) {
    return memoryStore.studySessions;
  }
};

const createSession = async (data) => {
  try {
    if (getIsConnected()) {
      const session = new StudySession(data);
      const saved = await session.save();

      if (data.subject && data.durationMinutes) {
        const hoursAdded = parseFloat((data.durationMinutes / 60).toFixed(1));
        await Subject.findOneAndUpdate(
          { name: data.subject },
          { $inc: { completedHours: hoursAdded } }
        );
      }

      await logActivity(
        `Studied ${data.subject} for ${data.durationMinutes} minutes`,
        data.subject,
        data.topic || '',
        'session'
      );
      return saved;
    }
  } catch (err) {}

  const newSession = {
    _id: 'ss_' + Date.now(),
    subject: data.subject || 'General',
    topic: data.topic || '',
    startTime: data.startTime || '',
    endTime: data.endTime || '',
    durationMinutes: Number(data.durationMinutes) || 0,
    date: data.date || new Date().toISOString().split('T')[0],
    notes: data.notes || ''
  };

  memoryStore.studySessions.unshift(newSession);

  // Update in-memory subject
  if (data.subject) {
    const subj = memoryStore.subjects.find(s => s.name.toLowerCase() === data.subject.toLowerCase());
    if (subj) {
      const hoursAdded = parseFloat((data.durationMinutes / 60).toFixed(1));
      subj.completedHours = (subj.completedHours || 0) + hoursAdded;
    }
  }

  await logActivity(
    `Studied ${data.subject} for ${data.durationMinutes} minutes`,
    data.subject,
    data.topic || '',
    'session'
  );
  return newSession;
};

const deleteSession = async (id) => {
  try {
    if (getIsConnected()) {
      return await StudySession.findByIdAndDelete(id);
    }
  } catch (err) {}
  const idx = memoryStore.studySessions.findIndex(s => s._id === id);
  if (idx !== -1) {
    return memoryStore.studySessions.splice(idx, 1)[0];
  }
  return null;
};

const getStats = async () => {
  try {
    const sessions = getIsConnected() ? await StudySession.find() : memoryStore.studySessions;
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaySessions = sessions.filter(s => s.date === todayStr);
    const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekSessions = sessions.filter(s => new Date(s.date) >= weekStart);
    const weekMinutes = weekSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

    const subjectMinutes = {};
    sessions.forEach((s) => {
      subjectMinutes[s.subject] = (subjectMinutes[s.subject] || 0) + (s.durationMinutes || 0);
    });

    return {
      totalSessions: sessions.length,
      totalMinutes,
      totalHours: parseFloat((totalMinutes / 60).toFixed(1)),
      todayMinutes,
      todayHours: parseFloat((todayMinutes / 60).toFixed(1)),
      weekMinutes,
      weekHours: parseFloat((weekMinutes / 60).toFixed(1)),
      subjectMinutes
    };
  } catch (err) {
    return { totalSessions: 0, totalMinutes: 0, totalHours: 0, todayMinutes: 0, todayHours: 0, weekMinutes: 0, weekHours: 0, subjectMinutes: {} };
  }
};

module.exports = {
  getSessions,
  createSession,
  deleteSession,
  getStats
};
