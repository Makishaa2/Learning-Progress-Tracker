import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Sprout, 
  Flame, 
  Check, 
  Plus, 
  X, 
  Calendar, 
  Trophy, 
  Activity, 
  CheckCircle2 
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [heatmapData, setHeatmapData] = useState({});
  const [loading, setLoading] = useState(true);

  // New Habit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    category: 'Academics',
    frequency: 'Daily',
    targetCount: 1,
    unit: 'times',
    reminderTime: '08:00 AM',
    color: '#10b981'
  });

  useEffect(() => {
    fetchHabitsData();
  }, []);

  const fetchHabitsData = async () => {
    setLoading(true);
    try {
      const [resHabits, resHeatmap] = await Promise.all([
        fetch('http://localhost:5000/api/habits'),
        fetch('http://localhost:5000/api/habits/heatmap')
      ]);
      if (resHabits.ok) {
        const data = await resHabits.json();
        setHabits(data.data || []);
      }
      if (resHeatmap.ok) {
        const data = await resHeatmap.json();
        setHeatmapData(data.data || {});
      }
    } catch (err) {
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habitId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/habits/${habitId}/toggle`, { method: 'POST' });
      if (res.ok) {
        setHabits(habits.map(h => {
          if (h._id === habitId) {
            const nextComp = !h.completedToday;
            return {
              ...h,
              completedToday: nextComp,
              currentStreak: nextComp ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1)
            };
          }
          return h;
        }));
      }
    } catch (err) {
      console.error('Error toggling habit:', err);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newHabit)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewHabit({
          name: '',
          category: 'Academics',
          frequency: 'Daily',
          targetCount: 1,
          unit: 'times',
          reminderTime: '08:00 AM',
          color: '#10b981'
        });
        fetchHabitsData();
      }
    } catch (err) {
      console.error('Error creating habit:', err);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Loading habits tracker…</span>
      </div>
    );
  }

  const completedCount = habits.filter(h => h.completedToday).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sprout size={28} color="var(--success)" /> Habit Tracker Dashboard
            </h1>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginTop: 4 }}>
              Build consistency with daily habits, streak milestones, and completion heatmaps.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> New Habit
          </button>
        </div>

        {/* Overview Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 20 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', fontWeight: 600 }}>Done Today</span>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginTop: 4, color: 'var(--text-1)' }}>{completedCount}/{habits.length}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', fontWeight: 600 }}>Daily Rate</span>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginTop: 4, color: 'var(--success)' }}>{completionRate}%</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', fontWeight: 600 }}>Best Streak</span>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginTop: 4, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Flame size={18} /> {habits.length > 0 ? Math.max(...habits.map(h => h.bestStreak || 0)) : 0}d
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Daily Habits Checklist & Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Daily Habits List */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={20} color="var(--primary)" /> Today's Habits
            </h3>
            <span className="badge badge-neutral">{new Date().toLocaleDateString()}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {habits.map((habit) => (
              <div 
                key={habit._id}
                onClick={() => toggleHabit(habit._id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: habit.completedToday ? 'var(--success-muted)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  border: '2px solid var(--border)',
                  background: habit.completedToday ? 'var(--success)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {habit.completedToday && <Check size={14} strokeWidth={3} />}
                </div>

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: habit.completedToday ? 'var(--text-4)' : 'var(--text-1)', textDecoration: habit.completedToday ? 'line-through' : 'none' }}>
                    {habit.name}
                  </h4>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)' }}>
                    Target: {habit.targetCount} {habit.unit} · Reminder: {habit.reminderTime}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Flame size={12} /> {habit.currentStreak}d
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habit Heatmap Matrix */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Activity size={20} color="var(--accent)" /> Completion Heatmap (30 Days)
          </h3>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginBottom: 16 }}>Daily visual consistency matrix</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {Array.from({ length: 30 }, (_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (29 - i));
              const dateStr = d.toISOString().split('T')[0];
              const count = heatmapData[dateStr] || 0;

              let bgColor = 'rgba(255,255,255,0.05)';
              if (count >= 4) bgColor = 'var(--success)';
              else if (count >= 2) bgColor = 'rgba(16, 185, 129, 0.6)';
              else if (count >= 1) bgColor = 'rgba(16, 185, 129, 0.3)';

              return (
                <div
                  key={dateStr}
                  style={{ height: 32, borderRadius: 6, background: bgColor, border: '1px solid var(--glass-border)' }}
                  title={`${dateStr}: ${count} habits completed`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="card" style={{ width: '100%', maxWidth: 440, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>Create New Habit</h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)} style={{ color: 'var(--text-4)' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Habit Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Study 2 Hours, Drink Water..."
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Category</label>
                  <select
                    className="form-control"
                    value={newHabit.category}
                    onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                  >
                    <option value="Academics">Academics</option>
                    <option value="Health">Health</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    value={newHabit.frequency}
                    onChange={e => setNewHabit({ ...newHabit, frequency: e.target.value })}
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Reminder Time</label>
                  <input
                    type="text"
                    placeholder="08:00 AM"
                    value={newHabit.reminderTime}
                    onChange={e => setNewHabit({ ...newHabit, reminderTime: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="💧 / 📖 / 🏃‍♂️"
                    value={newHabit.icon}
                    onChange={e => setNewHabit({ ...newHabit, icon: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Habit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
