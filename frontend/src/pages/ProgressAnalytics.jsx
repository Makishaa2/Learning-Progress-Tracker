import React, { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, BookOpen, Flame, TrendingUp, Clock, Target } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

export default function ProgressAnalytics() {
  const [goals, setGoals] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [habitStats, setHabitStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [resGoals, resSess, resTop, resHabits] = await Promise.all([
        fetch('http://localhost:5000/api/goals'),
        fetch('http://localhost:5000/api/study-sessions'),
        fetch('http://localhost:5000/api/topics'),
        fetch('http://localhost:5000/api/habits/stats'),
      ]);
      if (resGoals.ok) setGoals((await resGoals.json()).data || []);
      if (resSess.ok) setSessions((await resSess.json()).data || []);
      if (resTop.ok) setTopics((await resTop.json()).data || []);
      if (resHabits.ok) setHabitStats((await resHabits.json()).data || null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Loading analytics…</span>
      </div>
    );
  }

  const completedTopics = topics.filter(t => t.status === 'Completed').length;
  const inProgressTopics = topics.filter(t => t.status === 'Learning').length;
  const totalStudyMinutes = sessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
  const totalHours = (totalStudyMinutes / 60).toFixed(1);

  // Group sessions by subject for a simple breakdown
  const sessionsBySubject = sessions.reduce((acc, s) => {
    if (!s.subject) return acc;
    if (!acc[s.subject]) acc[s.subject] = 0;
    acc[s.subject] += s.durationMinutes || 0;
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <TrendingUp size={28} color="var(--primary)" /> Progress Analytics
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginTop: 4 }}>
          Track your study sessions, topic mastery, and habit consistency.
        </p>
      </div>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-muted)', border: '1px solid var(--primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Trophy size={22} />
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)' }}>{totalHours}h</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', display: 'block', fontWeight: 600 }}>Total Study Time</span>
          </div>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--success-muted)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)' }}>{completedTopics}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', display: 'block', fontWeight: 600 }}>Topics Mastered</span>
          </div>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-muted)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <BookOpen size={22} />
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)' }}>{inProgressTopics}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', display: 'block', fontWeight: 600 }}>In Progress</span>
          </div>
        </div>

        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--warning-muted)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
            <Flame size={22} />
          </div>
          <div>
            <span style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)' }}>
              {habitStats ? `${habitStats.completedToday}/${habitStats.totalHabits}` : '—'}
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', display: 'block', fontWeight: 600 }}>Habits Today</span>
          </div>
        </div>
      </div>

      {/* Study Time by Subject */}
      {Object.keys(sessionsBySubject).length > 0 && (
        <div className="card margin-v">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Study Time by Subject</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(sessionsBySubject)
              .sort((a, b) => b[1] - a[1])
              .map(([subject, minutes]) => {
                const pct = Math.round((minutes / totalStudyMinutes) * 100);
                return (
                  <div key={subject} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 120, fontSize: 13, color: 'var(--text-2)', flexShrink: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {subject}
                    </span>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-4)', flexShrink: 0, width: 60, textAlign: 'right' }}>
                      {(minutes / 60).toFixed(1)}h
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Goals Section */}
      {goals.length > 0 && (
        <div className="card margin-v">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Goals</h3>
          <div className="goals-grid">
            {goals.map(g => (
              <div key={g._id} className="goal-card">
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>{g.title}</h4>
                  <span className="badge-pill">{g.status}</span>
                </div>
                {g.description && (
                  <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 8 }}>{g.description}</p>
                )}
                {g.deadline && (
                  <p style={{ fontSize: 12, color: 'var(--text-4)' }}>
                    Deadline: <strong>{new Date(g.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Study Sessions Table */}
      {sessions.length > 0 ? (
        <div className="card margin-v">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Logged Sessions</h3>
          <table className="custom-table margin-v">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Topic</th>
                <th>Duration</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(0, 20).map(s => (
                <tr key={s._id}>
                  <td>{s.date}</td>
                  <td><span className="subject-pill-sm">{s.subject}</span></td>
                  <td><strong style={{ color: 'var(--text-1)' }}>{s.topic}</strong></td>
                  <td><strong>{s.durationMinutes} min</strong></td>
                  <td style={{ color: 'var(--text-4)', fontSize: 12 }}>{s.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {sessions.length > 20 && (
            <p style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', marginTop: 8 }}>
              Showing 20 of {sessions.length} sessions
            </p>
          )}
        </div>
      ) : (
        <div className="card margin-v" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-4)' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⏱️</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>No sessions logged yet</p>
          <p style={{ fontSize: 13 }}>Start a study session from any topic page to see your data here.</p>
        </div>
      )}
    </div>
  );
}
