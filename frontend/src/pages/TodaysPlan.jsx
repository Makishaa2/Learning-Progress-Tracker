import React, { useState, useEffect } from 'react';
import { topicService } from '../services/topicService';

export default function TodaysPlan() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await topicService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const created = await topicService.createTask({
        title: newTitle.trim(),
        estimatedMinutes: Number(estimatedMinutes) || 30
      });
      setTasks([created, ...tasks]);
      setNewTitle('');
    } catch (err) {
      alert(err.message || 'Failed to create task');
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const updated = await topicService.updateTask(task._id, { completed: !task.completed });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
    } catch (err) {
      alert(err.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await topicService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Today's Plan</h1>
        <p className="page-subtitle">Your daily study workspace and action checklist.</p>
      </div>

      {/* Progress Header */}
      <div className="panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Daily Goal Progress</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>
            {completedCount} of {totalCount} completed ({percentage}%)
          </span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Add Task Form */}
      <div className="panel" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            type="text"
            className="header-search-input"
            style={{ paddingLeft: '0.85rem', flex: 1 }}
            placeholder="Add a new study task (e.g. Complete Java inheritance)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <select
            className="header-search-input"
            style={{ width: '130px', paddingLeft: '0.5rem' }}
            value={estimatedMinutes}
            onChange={(e) => setEstimatedMinutes(e.target.value)}
          >
            <option value="15">15 mins</option>
            <option value="30">30 mins</option>
            <option value="45">45 mins</option>
            <option value="60">60 mins</option>
          </select>
          <button type="submit" className="btn btn-primary btn-xs">
            + Add Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Tasks for Today</h2>
        </div>

        {loading ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Loading daily plan...</div>
        ) : tasks.length === 0 ? (
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '1rem 0' }}>
            No study tasks added for today yet. Use the form above to add one.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {tasks.map((task) => (
              <div key={task._id} className="task-item">
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task)}
                />
                <div style={{ flex: 1 }}>
                  <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </span>
                  {task.topicName && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginLeft: '0.5rem' }}>
                      ({task.topicName})
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                  ⏱ {task.estimatedMinutes} mins
                </span>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', fontSize: '0.85rem', padding: '0 0.25rem' }}
                  title="Delete Task"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
