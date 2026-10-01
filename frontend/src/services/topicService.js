const API_BASE = '/api';

export const topicService = {
  // Topics API
  async getTopics(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.subject && filters.subject !== 'All') params.append('subject', filters.subject);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/topics${qs}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch topics');
    return data.data;
  },

  async getTopic(id) {
    const res = await fetch(`${API_BASE}/topics/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `Failed to fetch topic ${id}`);
    return data.data;
  },

  async createTopic(topicData) {
    const res = await fetch(`${API_BASE}/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create topic');
    return data.data;
  },

  async updateTopic(id, topicData) {
    const res = await fetch(`${API_BASE}/topics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update topic');
    return data.data;
  },

  async deleteTopic(id) {
    const res = await fetch(`${API_BASE}/topics/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete topic');
    return data.data;
  },

  // Tasks API
  async getTasks() {
    const res = await fetch(`${API_BASE}/tasks`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data.data;
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create task');
    return data.data;
  },

  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update task');
    return data.data;
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete task');
    return data.data;
  },

  // Learning Paths API
  async getLearningPaths() {
    const res = await fetch(`${API_BASE}/learning-paths`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch learning paths');
    return data.data;
  }
};
