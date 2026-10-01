const LearningPath = require('../models/LearningPath');
const { getIsConnected } = require('../config/db');

let inMemoryPaths = [];


class LearningPathService {
  async getPaths() {
    if (getIsConnected()) {
      return await LearningPath.find().sort({ createdAt: -1 });
    }
    return [...inMemoryPaths];
  }

  async createPath(data) {
    if (getIsConnected()) {
      const path = new LearningPath(data);
      return await path.save();
    }
    const newPath = {
      _id: 'lp_' + Date.now(),
      title: data.title,
      subject: data.subject,
      description: data.description || '',
      nodes: data.nodes || []
    };
    inMemoryPaths.push(newPath);
    return newPath;
  }
}

module.exports = new LearningPathService();
