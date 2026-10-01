import { useState, useEffect } from 'react';
import { CheckSquare, Check, Calendar, Plus, Trash2 } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', dueDate: '', priority: 'Medium', status: 'pending' });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' ? 'http://localhost:5000/api/tasks' : `http://localhost:5000/api/tasks?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      setTasks(data.data || []);
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [filter]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, taskName: form.title })
      });
      setShowModal(false);
      setForm({ title: '', subject: '', dueDate: '', priority: 'Medium', status: 'pending' });
      fetchTasks();
    } catch { }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  const priorityColor = (p) => {
    if (p === 'High') return 'var(--danger)';
    if (p === 'Low') return 'var(--success)';
    return 'var(--warning)';
  };

  const FILTERS = ['all', 'pending', 'completed'];

  return (
    <div>
      <div className="page-header flex items-center justify-between">
        <div>
          <h1>Tasks</h1>
          <p>Track your study tasks and to-dos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter(f)}
            style={{ textTransform: 'capitalize' }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={filter === 'completed' ? 'No completed tasks' : 'No tasks yet'}
          description={filter === 'completed' ? 'Complete some tasks to see them here.' : 'Add tasks to keep track of your study agenda.'}
          actions={filter !== 'completed' && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> Add Task
            </button>
          )}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tasks.map(t => (
            <div key={t._id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={() => toggleStatus(t)}
                style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: `2px solid ${t.status === 'completed' ? 'var(--success)' : 'var(--border)'}`,
                  background: t.status === 'completed' ? 'var(--success)' : 'transparent',
                  color: '#fff', fontSize: 13, flexShrink: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {t.status === 'completed' && <Check size={14} strokeWidth={3} />}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: 'var(--text-sm)',
                      color: t.status === 'completed' ? 'var(--text-4)' : 'var(--text-1)',
                      textDecoration: t.status === 'completed' ? 'line-through' : 'none'
                    }}
                  >
                    {t.title || t.taskName}
                  </span>
                  {t.subject && <span className="badge badge-neutral">{t.subject}</span>}
                  {t.priority && (
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: priorityColor(t.priority) }}>
                      {t.priority}
                    </span>
                  )}
                </div>
                {t.dueDate && (
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: new Date(t.dueDate) < new Date() && t.status !== 'completed' ? 'var(--danger)' : 'var(--text-4)',
                      marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <Calendar size={12} /> {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {new Date(t.dueDate) < new Date() && t.status !== 'completed' && ' · Overdue'}
                  </span>
                )}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => deleteTask(t._id)} style={{ color: 'var(--danger)' }}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal
          title="Add Task"
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>Add</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Complete chapter 3 exercises" required />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input className="form-control" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Optional" />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-control" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-control" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}
