const Topic = require('../models/Topic');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../config/memoryStore');
const { logActivity } = require('./activityService');

const getTopics = async (filters = {}) => {
  try {
    if (!getIsConnected()) {
      let result = [...memoryStore.topics];
      if (filters.subject && filters.subject !== 'All') {
        result = result.filter(t => t.subject === filters.subject);
      }
      if (filters.status && filters.status !== 'All') {
        result = result.filter(t => t.status === filters.status);
      }
      if (filters.search) {
        const s = filters.search.toLowerCase();
        result = result.filter(t => 
          (t.topicName && t.topicName.toLowerCase().includes(s)) ||
          (t.subject && t.subject.toLowerCase().includes(s)) ||
          (t.description && t.description.toLowerCase().includes(s))
        );
      }
      return result;
    }

    const query = {};
    if (filters.subject && filters.subject !== 'All') query.subject = filters.subject;
    if (filters.status && filters.status !== 'All') query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.search) {
      query.$or = [
        { topicName: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { notes: { $regex: filters.search, $options: 'i' } }
      ];
    }
    if (filters.isBookmarked) query.isBookmarked = true;

    return await Topic.find(query).sort({ createdAt: -1 });
  } catch (err) {
    let result = [...memoryStore.topics];
    if (filters.subject && filters.subject !== 'All') {
      result = result.filter(t => t.subject === filters.subject);
    }
    return result;
  }
};

const getTopicById = async (id) => {
  try {
    if (!getIsConnected()) {
      return memoryStore.topics.find(t => t._id === id || t.id === id) || memoryStore.topics[0] || null;
    }
    return await Topic.findById(id);
  } catch (err) {
    return memoryStore.topics.find(t => t._id === id || t.id === id) || memoryStore.topics[0] || null;
  }
};

const createTopic = async (topicData) => {
  try {
    if (getIsConnected()) {
      const topic = new Topic(topicData);
      const saved = await topic.save();
      await logActivity(`Added Topic: ${saved.topicName}`, saved.subject, saved.topicName, 'topic');
      return saved;
    }
  } catch (err) {
    console.error('MongoDB Atlas save error, saving to memory fallback:', err.message);
  }
  const newTopic = { _id: 'top_' + Date.now(), ...topicData, progress: topicData.progress || 0, createdAt: new Date().toISOString() };
  memoryStore.topics.unshift(newTopic);
  return newTopic;
};

const updateTopic = async (id, updateData) => {
  try {
    if (getIsConnected()) {
      const updated = await Topic.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (updated) {
        if (updateData.status === 'Completed') {
          await logActivity(`Finished Topic: ${updated.topicName}`, updated.subject, updated.topicName, 'topic');
        } else if (updateData.notes) {
          await logActivity(`Updated notes for ${updated.topicName}`, updated.subject, updated.topicName, 'note');
        }
        return updated;
      }
    }
  } catch (err) {
    console.error('MongoDB update error, updating in memory fallback:', err.message);
  }
  const idx = memoryStore.topics.findIndex(t => t._id === id || t.id === id);
  if (idx !== -1) {
    memoryStore.topics[idx] = { ...memoryStore.topics[idx], ...updateData };
    return memoryStore.topics[idx];
  }
  return null;
};

const deleteTopic = async (id) => {
  try {
    if (getIsConnected()) {
      const topic = await Topic.findByIdAndDelete(id);
      if (topic) {
        await logActivity(`Deleted Topic: ${topic.topicName}`, topic.subject, topic.topicName, 'topic');
        return topic;
      }
    }
  } catch (err) {
    console.error('MongoDB delete error, deleting from memory fallback:', err.message);
  }
  const idx = memoryStore.topics.findIndex(t => t._id === id || t.id === id);
  if (idx !== -1) {
    const deleted = memoryStore.topics.splice(idx, 1)[0];
    return deleted;
  }
  return null;
};

const toggleChecklistItem = async (topicId, itemId) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return null;

  const item = topic.checklist.id(itemId);
  if (item) {
    item.completed = !item.completed;
    const completedCount = topic.checklist.filter((i) => i.completed).length;
    topic.progress = topic.checklist.length > 0 
      ? Math.round((completedCount / topic.checklist.length) * 100)
      : topic.progress;
      
    if (topic.progress === 100) topic.status = 'Completed';
    else if (topic.progress > 0) topic.status = 'Learning';

    await topic.save();

    if (item.completed) {
      await logActivity(`Completed Task: ${item.title}`, topic.subject, topic.topicName, 'task');
    }
  }
  return topic;
};

const addResource = async (topicId, resourceData) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return null;

  topic.resources.push(resourceData);
  await topic.save();
  await logActivity(`Added Resource: ${resourceData.title}`, topic.subject, topic.topicName, 'resource');
  return topic;
};

const deleteResource = async (topicId, resourceId) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return null;

  topic.resources.pull({ _id: resourceId });
  await topic.save();
  return topic;
};

const toggleBookmark = async (topicId) => {
  const topic = await Topic.findById(topicId);
  if (!topic) return null;

  topic.isBookmarked = !topic.isBookmarked;
  await topic.save();
  return topic;
};

module.exports = {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  toggleChecklistItem,
  addResource,
  deleteResource,
  toggleBookmark
};
