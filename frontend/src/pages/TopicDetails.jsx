import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Clock, 
  Flame, 
  CheckCircle2, 
  Link as LinkIcon, 
  FileText, 
  Check, 
  X, 
  Play, 
  Pause, 
  ExternalLink, 
  Trash2, 
  Plus, 
  Edit3,
  Calendar,
  Sparkles
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';

export default function TopicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  // Study timer state
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Resource input state
  const [newResource, setNewResource] = useState({ title: '', url: '', type: 'Documentation' });
  const [showResourceForm, setShowResourceForm] = useState(false);

  // Checklist input state
  const [newCheckItem, setNewCheckItem] = useState('');

  // Notes state
  const [notesContent, setNotesContent] = useState('');
  const [notesSaved, setNotesSaved] = useState(true);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchTopicDetails();
  }, [id]);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(sec => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const fetchTopicDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTopic(data.data);
        setNotesContent(data.data.notes || '');
      }
    } catch (err) {
      console.error('Error fetching topic details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChecklist = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${id}/checklist/${itemId}`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setTopic(data.data);
      }
    } catch (err) {
      console.error('Error toggling checklist:', err);
    }
  };

  const handleAddChecklistItem = async () => {
    if (!newCheckItem.trim()) return;
    const updatedChecklist = [...(topic.checklist || []), { title: newCheckItem, completed: false }];
    await updateTopicData({ checklist: updatedChecklist });
    setNewCheckItem('');
  };

  const handleAddResource = async () => {
    if (!newResource.title || !newResource.url) return;
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${id}/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResource)
      });
      if (res.ok) {
        const data = await res.json();
        setTopic(data.data);
        setNewResource({ title: '', url: '', type: 'Documentation' });
        setShowResourceForm(false);
      }
    } catch (err) {
      console.error('Error adding resource:', err);
    }
  };

  const handleDeleteResource = async (resourceId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${id}/resources/${resourceId}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setTopic(data.data);
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${id}/bookmark`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setTopic(data.data);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  const updateTopicData = async (fields) => {
    try {
      const res = await fetch(`http://localhost:5000/api/topics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) {
        const data = await res.json();
        setTopic(data.data);
      }
    } catch (err) {
      console.error('Error updating topic:', err);
    }
  };

  const handleSaveNotes = async () => {
    await updateTopicData({ notes: notesContent });
    setNotesSaved(true);
    setStatusMsg('Study notes saved successfully!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleStopAndLogTimer = async () => {
    setTimerRunning(false);
    const mins = Math.max(1, Math.round(timerSeconds / 60));
    const newTimeSpent = (topic.timeSpentMinutes || 0) + mins;
    await updateTopicData({ timeSpentMinutes: newTimeSpent });

    try {
      await fetch('http://localhost:5000/api/study-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: topic.subject,
          topic: topic.topicName,
          durationMinutes: mins,
          date: new Date().toISOString().split('T')[0],
          notes: `Studied topic "${topic.topicName}" for ${mins} minutes.`
        })
      });
    } catch (err) {
      console.error('Error logging session:', err);
    }

    setTimerSeconds(0);
    setStatusMsg(`Study session logged: +${mins} minute${mins !== 1 ? 's' : ''}`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const setSpacedRevision = async (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const dateStr = d.toISOString().split('T')[0];
    await updateTopicData({ nextRevisionDate: dateStr });
    setStatusMsg(`Spaced revision scheduled for ${dateStr} (+${days} day${days !== 1 ? 's' : ''})`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Loading topic details…</span>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <h3>Topic not found</h3>
        <Link to="/topics" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex', gap: 6 }}>
          Back to Topics
        </Link>
      </div>
    );
  }

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in">
      {/* Top Header Card */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginBottom: 6 }}>
              <Link to="/subjects" style={{ color: 'var(--primary)' }}>Subjects</Link> &gt;{' '}
              <span style={{ color: 'var(--text-3)' }}>{topic.subject}</span>
              {topic.parentTopic && <span> &gt; {topic.parentTopic}</span>}
            </div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800 }}>{topic.topicName}</h1>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button 
              className="btn btn-secondary" 
              onClick={toggleBookmark}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: topic.isBookmarked ? 'var(--warning)' : 'var(--text-3)' }}
            >
              <Bookmark size={16} fill={topic.isBookmarked ? 'var(--warning)' : 'transparent'} />
              {topic.isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
            <Link to={`/topics/${id}/edit`} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Edit3 size={16} /> Edit Topic
            </Link>
          </div>
        </div>

        {statusMsg && (
          <div style={{ marginTop: 16, padding: '10px 16px', background: 'var(--success-muted)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--success)', fontWeight: 600 }}>
            {statusMsg}
          </div>
        )}

        {/* Feature Metadata Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 20, marginBottom: 20 }}>
          <StatusBadge type="status" value={topic.status} />
          <StatusBadge type="priority" value={topic.priority} />
          <span className="badge badge-neutral">Difficulty: {topic.difficulty || 'Medium'}</span>
          <span className="badge badge-neutral">Est: {topic.estimatedTimeMinutes || 120} mins</span>
          <span className="badge badge-neutral">Time Spent: {topic.timeSpentMinutes || 0} mins</span>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            <span>Topic Progress</span>
            <span>{topic.progress}%</span>
          </div>
          <ProgressBar value={topic.progress || 0} max={100} showLabel={false} />
        </div>
      </div>

      {/* Grid: Study Session Timer & Spaced Repetition */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Study Timer Widget */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={20} color="var(--primary)" /> Active Study Session Timer
            </h3>
            <span className={`badge ${timerRunning ? 'badge-success' : 'badge-neutral'}`}>
              {timerRunning ? 'LIVE' : 'IDLE'}
            </span>
          </div>
          <div style={{ fontSize: 42, fontWeight: 800, fontFamily: 'var(--font-mono)', textAlign: 'center', margin: '20px 0', color: 'var(--text-1)' }}>
            {formatTimer(timerSeconds)}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            {!timerRunning ? (
              <button className="btn btn-primary" onClick={() => setTimerRunning(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Play size={16} fill="#fff" /> Start Session
              </button>
            ) : (
              <button className="btn btn-warning" onClick={() => setTimerRunning(false)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Pause size={16} fill="#fff" /> Pause Timer
              </button>
            )}
            {timerSeconds > 0 && (
              <button className="btn btn-success" onClick={handleStopAndLogTimer} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={16} /> Log Session
              </button>
            )}
          </div>
        </div>

        {/* Revision Planner Widget */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Flame size={20} color="var(--warning)" /> Spaced Revision Planner
          </h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginBottom: 16 }}>
            Next Revision Date: <strong style={{ color: 'var(--text-1)' }}>{topic.nextRevisionDate || 'Not scheduled'}</strong>
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginBottom: 16 }}>
            Schedule automatic spaced repetition reminders:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setSpacedRevision(1)}>Tomorrow (+1d)</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setSpacedRevision(7)}>After 7 Days</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setSpacedRevision(30)}>After 30 Days</button>
          </div>
        </div>
      </div>

      {/* Checklist & Resources Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 24 }}>
        {/* Topic Checklist */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={20} color="var(--success)" /> Topic Checklist
            </h3>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', fontWeight: 600 }}>
              {topic.checklist ? topic.checklist.filter(i => i.completed).length : 0}/{topic.checklist ? topic.checklist.length : 0} Done
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {topic.checklist && topic.checklist.map((item) => (
              <div 
                key={item._id} 
                onClick={() => handleToggleChecklist(item._id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: item.completed ? 'var(--success-muted)' : 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--glass-border)',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  border: '2px solid var(--border)',
                  background: item.completed ? 'var(--success)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {item.completed && <Check size={12} strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 'var(--text-sm)', color: item.completed ? 'var(--text-4)' : 'var(--text-1)', textDecoration: item.completed ? 'line-through' : 'none' }}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input 
              type="text" 
              className="form-control"
              placeholder="Add checklist item (e.g. Spiral Matrix)..." 
              value={newCheckItem}
              onChange={(e) => setNewCheckItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
            />
            <button className="btn btn-primary btn-sm" onClick={handleAddChecklistItem} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Topic Resources */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <LinkIcon size={20} color="var(--cyan-gradient)" /> Topic Resources
            </h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowResourceForm(!showResourceForm)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Plus size={14} /> Add Link
            </button>
          </div>

          {showResourceForm && (
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input 
                type="text" 
                className="form-control"
                placeholder="Link Title (e.g. Official Docs)" 
                value={newResource.title} 
                onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
              />
              <input 
                type="text" 
                className="form-control"
                placeholder="URL (https://...)" 
                value={newResource.url} 
                onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
              />
              <select 
                className="form-control"
                value={newResource.type}
                onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
              >
                <option value="Documentation">Official Documentation</option>
                <option value="YouTube">YouTube Playlist</option>
                <option value="Practice">Practice Problems</option>
                <option value="Book">Reference Book</option>
                <option value="PDF">PDF Notes</option>
                <option value="GitHub">GitHub Repository</option>
              </select>
              <button className="btn btn-primary btn-sm" onClick={handleAddResource}>Save Link</button>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topic.resources && topic.resources.map((res) => (
              <div key={res._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', gap: 10 }}>
                <span className="badge badge-primary">{res.type}</span>
                <span style={{ flex: 1, fontSize: 'var(--text-sm)', color: 'var(--text-1)', fontWeight: 600 }} className="truncate">{res.title}</span>
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <ExternalLink size={12} /> Open
                </a>
                <button className="btn-icon" onClick={() => handleDeleteResource(res._id)} style={{ color: 'var(--danger)', width: 28, height: 28 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Notebook / Study Notes Editor */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={20} color="var(--accent)" /> Topic Study Notebook
          </h3>
          <button className="btn btn-primary btn-sm" onClick={handleSaveNotes} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} /> {notesSaved ? 'Saved' : 'Save Notes'}
          </button>
        </div>
        <textarea
          className="form-control"
          rows={8}
          style={{ width: '100%', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}
          placeholder="Write your study notes here..."
          value={notesContent}
          onChange={(e) => { setNotesContent(e.target.value); setNotesSaved(false); }}
        ></textarea>
      </div>
    </div>
  );
}
