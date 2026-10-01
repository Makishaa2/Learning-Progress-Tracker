import React, { useState, useEffect } from 'react';
import { topicService } from '../services/topicService';

export default function Progress() {
  const [topics, setTopics] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tp, tk] = await Promise.all([
          topicService.getTopics(),
          topicService.getTasks()
        ]);
        setTopics(tp);
        setTasks(tk);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const completedTopicsCount = topics.filter((t) => t.status === 'Completed').length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const totalProgress = topics.reduce((acc, t) => acc + (Number(t.progress) || 0), 0);
  const avgProgress = topics.length > 0 ? Math.round(totalProgress / topics.length) : 0;

  // 7-day weekly activity heights (clean minimalist bar chart)
  const weeklyData = [
    { day: 'Mon', count: 4, height: '65%' },
    { day: 'Tue', count: 5, height: '85%' },
    { day: 'Wed', count: 3, height: '50%' },
    { day: 'Thu', count: 6, height: '95%' },
    { day: 'Fri', count: 4, height: '65%' },
    { day: 'Sat', count: 2, height: '35%' },
    { day: 'Sun', count: 0, height: '5%' }
  ];

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Progress & Analytics</h1>
        <p className="page-subtitle">Track your weekly study consistency, task completion rates, and learning streak.</p>
      </div>

      {/* 4 Summary Stats */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Topics Completed</div>
          <div className="metric-val">{completedTopicsCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Tasks Completed</div>
          <div className="metric-val">{completedTasksCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Study Sessions</div>
          <div className="metric-val">14</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Average Progress</div>
          <div className="metric-val">{avgProgress}%</div>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="panel" style={{ marginBottom: '1.5rem' }}>
        <div className="panel-header">
          <h2 className="panel-title">Weekly Study Activity</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>This Week</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', padding: '1rem 0.5rem 0.5rem 0.5rem', borderBottom: '1px solid var(--border-light)' }}>
          {weeklyData.map((item) => (
            <div key={item.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{item.count}</span>
              <div
                style={{
                  width: '28px',
                  height: item.height,
                  backgroundColor: item.count > 0 ? 'var(--primary)' : 'var(--bg-subtle)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }}
              />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Streak */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Learning Streak</h2>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>
            🔥 6 Day Consistency Streak
          </span>
        </div>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Consistently studying every day builds long-term knowledge retention.
        </p>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={idx} style={{ textAlign: 'center', flex: 1, padding: '0.75rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>{day}</div>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: idx < 6 ? 'var(--primary)' : 'transparent',
                  border: idx < 6 ? 'none' : '1px dashed var(--text-tertiary)',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '0.7rem'
                }}
              >
                {idx < 6 ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
