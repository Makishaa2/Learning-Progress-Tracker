import { useState, useEffect } from 'react';
import { Target, Calendar, Plus, Trash2, ArrowRight } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

const STATUSES = ['Not Started', 'In Progress', 'Achieved'];

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', deadline: '', status: 'Not Started', description: '' });

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/goals');
      const data = await res.json();
      setGoals(data.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchGoals(); }, []);

  const createGoal = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setShowModal(false);
      setForm({ title: '', subject: '', deadline: '', status: 'Not Started', description: '' });
      fetchGoals();
    } catch { }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchGoals();
    } catch { }
  };

  const deleteGoal = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/goals/${id}`, { method: 'DELETE' });
      fetchGoals();
    } catch { }
  };

  const statusBadge = (s) => {
    if (s === 'Achieved') return 'badge-success';
    if (s === 'In Progress') return 'badge-primary';
    return 'badge-neutral';
  };

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-1)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Target size={28} color="var(--warning)" /> Study Goals
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginTop: 4 }}>Set and track your study milestones</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add Goal
        </button>
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals set yet"
          description="Define your study milestones to stay on track."
          actions={
            <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> Add Your First Goal
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {goals.map(g => (
            <div key={g._id} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-1)' }}>{g.title}</span>
                  {g.subject && <span className="badge badge-neutral">{g.subject}</span>}
                  <span className={`badge ${statusBadge(g.status)}`}>{g.status}</span>
                </div>
                {g.description && (
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginTop: 4 }}>{g.description}</p>
                )}
                {g.deadline && (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={12} /> Due: {new Date(g.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {STATUSES.filter(s => s !== g.status).map(s => (
                  <button key={s} className="btn btn-secondary btn-sm" onClick={() => updateStatus(g._id, s)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <ArrowRight size={12} /> {s}
                  </button>
                ))}
                <button className="btn btn-secondary btn-sm" onClick={() => deleteGoal(g._id)} style={{ color: 'var(--danger)' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title="Add New Goal"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>Add Goal</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Goal Title *</label>
            <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Complete Java Basics" required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-control" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Java, Python…" />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input type="date" className="form-control" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What does achieving this goal look like?" style={{ minHeight: 80 }} />
          </div>
        </Modal>
      )}
    </div>
  );
}
