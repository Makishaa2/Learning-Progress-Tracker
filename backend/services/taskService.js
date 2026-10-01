const Task = require('../models/Task');
const { getIsConnected } = require('../config/db');

let inMemoryTasks = [];


class TaskService {
  async getTasks() {
    if (getIsConnected()) {
      return await Task.find().sort({ createdAt: -1 });
    }
    return [...inMemoryTasks];
  }

  async createTask(data) {
    if (getIsConnected()) {
      const task = new Task(data);
      return await task.save();
    }
    const newTask = {
      _id: 't_' + Date.now(),
      title: data.title,
      topicId: data.topicId || '',
      topicName: data.topicName || '',
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      completed: Boolean(data.completed),
      estimatedMinutes: Number(data.estimatedMinutes) || 30,
      createdAt: new Date().toISOString()
    };
    inMemoryTasks.unshift(newTask);
    return newTask;
  }

  async updateTask(id, data) {
    if (getIsConnected()) {
      return await Task.findByIdAndUpdate(id, { $set: data }, { new: true });
    }
    const index = inMemoryTasks.findIndex((t) => t._id === id);
    if (index === -1) return null;
    inMemoryTasks[index] = { ...inMemoryTasks[index], ...data };
    return inMemoryTasks[index];
  }

  async deleteTask(id) {
    if (getIsConnected()) {
      return await Task.findByIdAndDelete(id);
    }
    const index = inMemoryTasks.findIndex((t) => t._id === id);
    if (index === -1) return null;
    const [deleted] = inMemoryTasks.splice(index, 1);
    return deleted;
  }
}

module.exports = new TaskService();
