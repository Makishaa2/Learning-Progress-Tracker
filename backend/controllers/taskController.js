const taskService = require('../services/taskService');

class TaskController {
  async getTasks(req, res) {
    try {
      const tasks = await taskService.getTasks();
      return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async createTask(req, res) {
    try {
      if (!req.body.title) {
        return res.status(400).json({ success: false, message: 'Task title is required' });
      }
      const task = await taskService.createTask(req.body);
      return res.status(201).json({ success: true, data: task });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateTask(req, res) {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.status(200).json({ success: true, data: task });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      const deleted = await taskService.deleteTask(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.status(200).json({ success: true, data: deleted });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new TaskController();
