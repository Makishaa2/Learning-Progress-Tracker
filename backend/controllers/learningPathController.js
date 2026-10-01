const learningPathService = require('../services/learningPathService');

class LearningPathController {
  async getPaths(req, res) {
    try {
      const paths = await learningPathService.getPaths();
      return res.status(200).json({ success: true, data: paths });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createPath(req, res) {
    try {
      if (!req.body.title || !req.body.subject) {
        return res.status(400).json({ success: false, message: 'Title and subject are required' });
      }
      const path = await learningPathService.createPath(req.body);
      return res.status(201).json({ success: true, data: path });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new LearningPathController();
