import { useState, useEffect } from 'react';
import { Clock, Smile, Plus, Trash2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

export default function StudySessions() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({
    subject: '', topic: '', durationMinutes: '', date: new Date().toISOString().split('T')[0], notes: '', mood: 'Good'
  });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sessRes, statsRes, subRes] = await Promise.allSettled([
        fetch('http://localhost:5000/api/study-sessions').then(r => r.json()),
        fetch('http://localhost:5000/api/study-sessions/stats').then(r => r.json()),
        fetch('http://localhost:5000/api/subjects').then(r => r.json()),
      ]);
      setSessions(sessRes.value?.data || []);
      setStats(statsRes.value?.data || null);
      setSubjects(subRes.value?.data?.map(s => s.name) || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/study-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, durationMinutes: parseInt(form.durationMinutes) })
      });
      setShowModal(false);
      setForm({ subject: '', topic: '', durationMinutes: '', date: new Date().toISOString().split('T')[0], notes: '', mood: 'Good' });
      fetchAll();
    } catch { }
  };

  const deleteSession = async (id) => {
    await fetch(`http://localhost:5000/api/study-sessions/${id}`, { method: 'DELETE' });
    fetchAll();
  };

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>Study Sessions</h1>
          <p>Log and review your study time</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Log Session</button>
      </div>

      {/* Stats Strip */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          {[
            { label: 'Today', value: `${stats.todayHours}h` },
            { label: 'This Week', value: `${stats.weekHours}h` },
            { label: 'All Time', value: `${stats.totalHours}h` },
            { label: 'Total Sessions', value: stats.totalSessions }
          ].map(s => (
            <div key={s.label} className="card card-sm" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-1)' }}>{s.value}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon="⏱"
          title="No sessions logged yet"
          description="Log your first study session to start tracking your study hours."
          actions={
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Log Session</button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {sessions.map(s => (
            <div key={s._id} className="card card-sm flex items-center gap-4">
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--primary-muted)',
                color: 'var(--primary)', display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', fontSize: 'var(--text-sm)', fontWeight: 700, flexShrink: 0
              }}>
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800 }}>{Math.round(s.durationMinutes / 60 * 10) / 10}</span>
                <span style={{ fontSize: 'var(--text-xs)', opacity: 0.7 }}>hrs</span>
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 700, color: 'var(--text-1)' }}>{s.subject}</span>
                  {s.topic && <span className="badge badge-neutral">{s.topic}</span>}
                  {s.mood && (
                    <span className="badge badge-neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <Smile size={12} /> {s.mood}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} />
                  {new Date(s.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  &nbsp;·&nbsp;{s.durationMinutes} min
                </div>
                {s.notes && <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginTop: 3 }}>{s.notes}</div>}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => deleteSession(s._id)} style={{ color: 'var(--danger)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title="Log Study Session"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit} disabled={!form.subject || !form.durationMinutes}>Log Session</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Subject *</label>
            {subjects.length > 0 ? (
              <select className="form-control" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                <option value="">Select subject…</option>
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
            ) : (
              <input className="form-control" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g., Java" />
            )}
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Topic</label>
              <input className="form-control" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Optional" />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (minutes) *</label>
              <input type="number" className="form-control" value={form.durationMinutes} onChange={e => setForm({ ...form, durationMinutes: e.target.value })} placeholder="e.g., 60" min="1" />
            </div>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Mood</label>
              <select className="form-control" value={form.mood} onChange={e => setForm({ ...form, mood: e.target.value })}>
                <option>Great</option>
                <option>Good</option>
                <option>Okay</option>
                <option>Tired</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="What did you study? Any key takeaways?" style={{ minHeight: 70 }} />
          </div>
        </Modal>
      )}
    </div>
  );
}
