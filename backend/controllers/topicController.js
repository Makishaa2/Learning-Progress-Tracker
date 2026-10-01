const topicService = require('../services/topicService');

const getTopics = async (req, res, next) => {
  try {
    const filters = {
      subject: req.query.subject,
      status: req.query.status,
      priority: req.query.priority,
      search: req.query.search,
      isBookmarked: req.query.bookmarked === 'true'
    };
    const topics = await topicService.getTopics(filters);
    res.json({ success: true, count: topics.length, data: topics });
  } catch (error) {
    next(error);
  }
};

const getTopicById = async (req, res, next) => {
  try {
    const topic = await topicService.getTopicById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

const createTopic = async (req, res, next) => {
  try {
    const topic = await topicService.createTopic(req.body);
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

const updateTopic = async (req, res, next) => {
  try {
    const topic = await topicService.updateTopic(req.params.id, req.body);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

const deleteTopic = async (req, res, next) => {
  try {
    const topic = await topicService.deleteTopic(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, message: 'Topic deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const toggleChecklist = async (req, res, next) => {
  try {
    const topic = await topicService.toggleChecklistItem(req.params.id, req.params.itemId);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic or item not found' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

const addResource = async (req, res, next) => {
  try {
    const topic = await topicService.addResource(req.params.id, req.body);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const topic = await topicService.deleteResource(req.params.id, req.params.resourceId);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

const toggleBookmark = async (req, res, next) => {
  try {
    const topic = await topicService.toggleBookmark(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, data: topic });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  toggleChecklist,
  addResource,
  deleteResource,
  toggleBookmark
};
