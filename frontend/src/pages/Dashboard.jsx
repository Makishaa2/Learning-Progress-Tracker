import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Calendar, 
  Flame, 
  BookOpen, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Play,
  Check
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';

// ─── Quick Stat Card ────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color = 'var(--primary)' }) {
  return (
    <div className="card stat-card hover-lift">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon" style={{ color, borderColor: `${color}40`, background: `${color}15` }}>
          {typeof Icon === 'string' ? Icon : <Icon size={18} />}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-subtext" style={{ color: 'var(--text-3)' }}>{sub}</div>}
    </div>
  );
}

// ─── Today's Habit Row ───────────────────────────────────────────────────────
function HabitRow({ habit, onToggle }) {
  return (
    <div className={`habit-row${habit.completedToday ? ' habit-done' : ''}`}>
      <button
        className={`habit-check${habit.completedToday ? ' checked' : ''}`}
        onClick={() => onToggle(habit._id)}
      >
        {habit.completedToday ? <Check size={12} strokeWidth={3} /> : null}
      </button>
      <span className="habit-name">{habit.name}</span>
      {habit.currentStreak > 0 && (
        <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Flame size={12} /> {habit.currentStreak}d
        </span>
      )}
    </div>
  );
}

// ─── Subject Progress Row ─────────────────────────────────────────────────
function SubjectRow({ subject }) {
  const pct = subject.estimatedHours > 0
    ? Math.round((subject.completedHours / subject.estimatedHours) * 100)
    : 0;

  const COLORS = ['#6366f1','#10b981','#8b5cf6','#f59e0b','#f43f5e','#06b6d4','#d946ef'];
  const colorIndex = subject.name.charCodeAt(0) % COLORS.length;
  const color = COLORS[colorIndex];

  return (
    <div className="progress-row">
      <span className="progress-name truncate" title={subject.name}>{subject.name}</span>
      <ProgressBar value={subject.completedHours} max={subject.estimatedHours || 1} color={color} />
      <span className="progress-pct">{pct}%</span>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    subjects: [],
    sessionStats: null,
    habits: [],
    habitStats: null,
    events: [],
    tasks: [],
    activity: [],
    loading: true
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [subjectsRes, sessionStatsRes, habitsRes, habitStatsRes, eventsRes, tasksRes, activityRes] = await Promise.allSettled([
          fetch('http://localhost:5000/api/subjects').then(r => r.json()),
          fetch('http://localhost:5000/api/study-sessions/stats').then(r => r.json()),
          fetch('http://localhost:5000/api/habits').then(r => r.json()),
          fetch('http://localhost:5000/api/habits/stats').then(r => r.json()),
          fetch(`http://localhost:5000/api/calendar?upcoming=7`).then(r => r.json()),
          fetch('http://localhost:5000/api/tasks?status=pending&limit=5').then(r => r.json()),
          fetch('http://localhost:5000/api/activity?limit=6').then(r => r.json()),
        ]);

        setData({
          subjects: subjectsRes.status === 'fulfilled' ? (subjectsRes.value.data || []) : [],
          sessionStats: sessionStatsRes.status === 'fulfilled' ? (sessionStatsRes.value.data || null) : null,
          habits: habitsRes.status === 'fulfilled' ? (habitsRes.value.data || []) : [],
          habitStats: habitStatsRes.status === 'fulfilled' ? (habitStatsRes.value.data || null) : null,
          events: eventsRes.status === 'fulfilled' ? (eventsRes.value.data || []) : [],
          tasks: tasksRes.status === 'fulfilled' ? (tasksRes.value.data || []) : [],
          activity: activityRes.status === 'fulfilled' ? (activityRes.value.data || []) : [],
          loading: false
        });
      } catch {
        setData(d => ({ ...d, loading: false }));
      }
    };

    fetchAll();
  }, []);

  const toggleHabit = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/habits/${id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const updated = await res.json();
      if (updated.success) {
        setData(d => ({
          ...d,
          habits: d.habits.map(h =>
            h._id === id
              ? { ...h, completedToday: updated.data.log.completed, currentStreak: updated.data.habit.currentStreak }
              : h
          )
        }));
      }
    } catch { }
  };

  if (data.loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Loading your workspace…</span>
      </div>
    );
  }

  const stats = data.sessionStats;
  const hStats = data.habitStats;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Next revision subject
  const nextRevisionSubject = data.subjects.find(s => s.nextRevision);
  const overdueTasks = data.tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date());
  const upcomingEvents = data.events.slice(0, 4);

  return (
    <div className="dashboard animate-fade-in">
      {/* ── Hero Banner ── */}
      <div className="haven-hero-card">
        <div className="haven-hero-overlay" />
        <div className="haven-hero-content">
          <div className="haven-badge-pill">
            <span>Learning Progress Tracker</span>
          </div>

          <h1 className="haven-title">Track your subjects & progress cleanly.</h1>
          <p className="haven-subtitle">
            Manage your subjects, study topics, checklist tasks, habit streaks, and study sessions in one simple workspace.
          </p>

          <div className="haven-actions">
            <button className="btn-haven-primary" onClick={() => navigate('/subjects')}>
              Subject Workspaces <ArrowRight size={16} />
            </button>
            <button className="btn-haven-secondary" onClick={() => navigate('/sessions')}>
              <Clock size={14} /> Log Study Time
            </button>
          </div>
        </div>
      </div>

      {/* ── Welcome Greeting ── */}
      <div className="dash-greeting">
        <div>
          <h1 className="dash-title">Good {getGreeting()} 👋</h1>
          <p className="dash-date">{today}</p>
        </div>
        {overdueTasks.length > 0 && (
          <div className="overdue-alert">
            <AlertCircle size={16} color="var(--danger)" />
            <span>{overdueTasks.length} overdue task{overdueTasks.length > 1 ? 's' : ''}</span>
            <Link to="/tasks" className="btn-link" style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              View <ArrowRight size={12} />
            </Link>
          </div>
        )}
      </div>

      {/* ── Continue Learning CTA ── */}
      {nextRevisionSubject ? (
        <div className="cta-card hover-lift" onClick={() => navigate(`/subjects/${nextRevisionSubject._id}`)}>
          <div>
            <div className="cta-overline">
              <Sparkles size={14} /> Continue Learning
            </div>
            <div className="cta-title">{nextRevisionSubject.name}</div>
            <div className="cta-desc">
              Next revision scheduled · {nextRevisionSubject.completedHours}h completed of {nextRevisionSubject.estimatedHours}h
            </div>
          </div>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Play size={16} fill="#fff" /> Continue
          </button>
        </div>
      ) : data.subjects.length > 0 ? (
        <div className="cta-card hover-lift" onClick={() => navigate('/subjects')}>
          <div>
            <div className="cta-overline">
              <Sparkles size={14} /> Pick up where you left off
            </div>
            <div className="cta-title">Open a subject workspace</div>
            <div className="cta-desc">You have {data.subjects.length} active subject{data.subjects.length > 1 ? 's' : ''}</div>
          </div>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Browse Workspace <ArrowRight size={16} />
          </button>
        </div>
      ) : null}

      {/* ── Stats Row ── */}
      <div className="dash-stats-grid">
        <StatCard
          icon={Clock}
          label="Hours Today"
          value={stats ? `${stats.todayHours}h` : '0h'}
          sub={stats ? `${stats.weekHours}h this week` : null}
          color="var(--primary)"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Sessions"
          value={stats ? stats.totalSessions : '0'}
          sub={stats ? `${stats.totalHours}h all time` : null}
          color="var(--success)"
        />
        <StatCard
          icon={Flame}
          label="Habits Done"
          value={hStats ? `${hStats.completedToday}/${hStats.totalHabits}` : '0/0'}
          sub={hStats ? `${hStats.completionRateToday}% today` : null}
          color="var(--warning)"
        />
        <StatCard
          icon={BookOpen}
          label="Active Subjects"
          value={data.subjects.length}
          sub={data.subjects.length > 0 ? `${data.subjects.filter(s => s.status === 'Active').length} in progress` : null}
          color="#8b5cf6"
        />
      </div>

      {/* ── Main Content Grid ── */}
      <div className="desk-layout">
        {/* LEFT: Learning Progress + Habits */}
        <div className="desk-main">

          {/* Subject Progress */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Learning Progress</h4>
              <Link to="/subjects" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {data.subjects.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No subjects yet"
                description="Add your first subject to start tracking your learning."
                actions={
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/subjects')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={14} /> Add Subject
                  </button>
                }
              />
            ) : (
              data.subjects.slice(0, 5).map(s => <SubjectRow key={s._id} subject={s} />)
            )}
          </div>

          {/* Habit Check-in */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Today's Habits</h4>
              <Link to="/habits" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                All habits <ArrowRight size={14} />
              </Link>
            </div>
            {data.habits.length === 0 ? (
              <EmptyState
                icon={Flame}
                title="No habits tracked"
                description="Build consistency by adding your daily habits."
                actions={
                  <button className="btn btn-primary btn-sm" onClick={() => navigate('/habits')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={14} /> Add Habit
                  </button>
                }
              />
            ) : (
              <div className="habits-list">
                {data.habits.map(h => (
                  <HabitRow key={h._id} habit={h} onToggle={toggleHabit} />
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Recent Activity</h4>
            </div>
            {data.activity.length === 0 ? (
              <div className="empty-inline">
                <p className="empty-inline-desc">Your activity will appear here as you study.</p>
              </div>
            ) : (
              <div className="activity-list">
                {data.activity.map((a, i) => (
                  <div className="activity-item" key={i}>
                    <div className="activity-dot" />
                    <div className="activity-info">
                      <span className="activity-text">{a.message}</span>
                      <span className="activity-time">{formatRelative(a.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Calendar + Tasks */}
        <div className="desk-aside">

          {/* Upcoming Events */}
          <div className="card card-sm">
            <div className="card-header">
              <h4 className="card-title">Upcoming</h4>
              <Link to="/planner" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Calendar <ArrowRight size={14} />
              </Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-4)', fontSize: 'var(--text-sm)' }}>
                No upcoming events
              </div>
            ) : (
              <div className="events-list">
                {upcomingEvents.map(ev => (
                  <div className="event-item" key={ev._id}>
                    <div className="event-date-badge">
                      <span>{new Date(ev.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span style={{ fontWeight: 800, fontSize: 'var(--text-md)', display: 'block' }}>
                        {new Date(ev.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <div className="event-title">{ev.title}</div>
                      {ev.subject && <div className="event-sub">{ev.subject}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Tasks */}
          <div className="card card-sm">
            <div className="card-header">
              <h4 className="card-title">Pending Tasks</h4>
              <Link to="/tasks" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                All <ArrowRight size={14} />
              </Link>
            </div>
            {data.tasks.length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-4)', fontSize: 'var(--text-sm)' }}>
                All tasks done 🎉
              </div>
            ) : (
              <div className="task-list">
                {data.tasks.slice(0, 5).map(t => (
                  <div className="task-item" key={t._id}>
                    <span className={`task-priority-dot priority-${(t.priority || 'medium').toLowerCase()}`} />
                    <span className="task-name truncate">{t.title || t.taskName}</span>
                    {t.dueDate && (
                      <span className={`task-due ${new Date(t.dueDate) < new Date() ? 'overdue' : ''}`}>
                        {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function formatRelative(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}
