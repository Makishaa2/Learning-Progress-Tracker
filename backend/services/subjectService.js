const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const { logActivity } = require('./activityService');

const getSubjects = async () => {
  try {
    if (!getIsConnected()) {
      return memoryStore.subjects.map(s => {
        const topics = memoryStore.topics.filter(t => t.subject === s.name);
        const totalTopics = topics.length;
        const completedTopics = topics.filter(t => t.status === 'Completed').length;
        const calculatedProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
        return { ...s, totalTopics, completedTopics, calculatedProgress };
      });
    }

    const subjects = await Subject.find().sort({ name: 1 });
    const enriched = await Promise.all(
      subjects.map(async (subj) => {
        const topics = await Topic.find({ subject: subj.name });
        const totalTopics = topics.length;
        const completedTopics = topics.filter((t) => t.status === 'Completed').length;
        const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
        
        const obj = subj.toObject();
        obj.totalTopics = totalTopics;
        obj.completedTopics = completedTopics;
        obj.calculatedProgress = progressPct;
        return obj;
      })
    );
    return enriched;
  } catch (err) {
    return memoryStore.subjects.map(s => {
      const topics = memoryStore.topics.filter(t => t.subject === s.name);
      const totalTopics = topics.length;
      const completedTopics = topics.filter(t => t.status === 'Completed').length;
      const calculatedProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
      return { ...s, totalTopics, completedTopics, calculatedProgress };
    });
  }
};

const getSubjectById = async (id) => {
  try {
    if (!getIsConnected()) {
      const s = memoryStore.subjects.find(sub => sub._id === id || sub.name.toLowerCase() === id.toLowerCase());
      if (!s) return null;
      const topics = memoryStore.topics.filter(t => t.subject === s.name);
      const totalTopics = topics.length;
      const completedTopics = topics.filter(t => t.status === 'Completed').length;
      const calculatedProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
      return { ...s, topics, totalTopics, completedTopics, calculatedProgress };
    }
    const subject = await Subject.findById(id);
    if (!subject) return null;

    const topics = await Topic.find({ subject: subject.name }).sort({ createdAt: -1 });
    const totalTopics = topics.length;
    const completedTopics = topics.filter((t) => t.status === 'Completed').length;
    const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const obj = subject.toObject();
    obj.topics = topics;
    obj.totalTopics = totalTopics;
    obj.completedTopics = completedTopics;
    obj.calculatedProgress = progressPct;
    return obj;
  } catch (err) {
    const s = memoryStore.subjects.find(sub => sub._id === id);
    if (!s) return null;
    const topics = memoryStore.topics.filter(t => t.subject === s.name);
    return { ...s, topics, totalTopics: topics.length, completedTopics: topics.filter(t => t.status === 'Completed').length, calculatedProgress: 0 };
  }
};

const getSubjectByName = async (name) => {
  try {
    const subject = await Subject.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (!subject) return null;

    const topics = await Topic.find({ subject: subject.name }).sort({ createdAt: -1 });
    const totalTopics = topics.length;
    const completedTopics = topics.filter((t) => t.status === 'Completed').length;
    const progressPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const obj = subject.toObject();
    obj.topics = topics;
    obj.totalTopics = totalTopics;
    obj.completedTopics = completedTopics;
    obj.calculatedProgress = progressPct;
    return obj;
  } catch (err) {
    console.error('Error in getSubjectByName:', err.message);
    return null;
  }
};

const createSubject = async (data) => {
  try {
    if (getIsConnected()) {
      const subject = new Subject(data);
      const saved = await subject.save();
      await logActivity(`Created Subject: ${saved.name}`, saved.name, '', 'subject');
      return saved;
    }
  } catch (err) {
    console.error('Database connection error, saving subject to memory fallback:', err.message);
  }
  const newSubj = {
    _id: 'subj_' + Date.now(),
    ...data,
    estimatedHours: Number(data.estimatedHours) || 0,
    completedHours: Number(data.completedHours) || 0,
    createdAt: new Date().toISOString()
  };
  memoryStore.subjects.unshift(newSubj);
  await logActivity(`Created Subject: ${newSubj.name}`, newSubj.name, '', 'subject');
  return newSubj;
};

const updateSubject = async (id, data) => {
  try {
    if (getIsConnected()) {
      return await Subject.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
  } catch (err) {
    console.error('Database connection error, updating subject in memory fallback:', err.message);
  }
  const idx = memoryStore.subjects.findIndex(s => s._id === id);
  if (idx !== -1) {
    memoryStore.subjects[idx] = { ...memoryStore.subjects[idx], ...data };
    return memoryStore.subjects[idx];
  }
  return null;
};

const deleteSubject = async (id) => {
  try {
    if (getIsConnected()) {
      const subject = await Subject.findByIdAndDelete(id);
      if (subject) {
        await logActivity(`Deleted Subject: ${subject.name}`, subject.name, '', 'subject');
      }
      return subject;
    }
  } catch (err) {
    console.error('Database connection error, deleting subject from memory fallback:', err.message);
  }
  const idx = memoryStore.subjects.findIndex(s => s._id === id);
  if (idx !== -1) {
    const deleted = memoryStore.subjects.splice(idx, 1)[0];
    await logActivity(`Deleted Subject: ${deleted.name}`, deleted.name, '', 'subject');
    return deleted;
  }
  return null;
};

module.exports = {
  getSubjects,
  getSubjectById,
  getSubjectByName,
  createSubject,
  updateSubject,
  deleteSubject
};
