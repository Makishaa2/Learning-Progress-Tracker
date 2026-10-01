import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit3, Trash2, Filter, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';
import TopicCard from '../components/TopicCard';
import { topicService } from '../services/topicService';

export default function MyTopics() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('updated');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [deletingTopic, setDeletingTopic] = useState(null);

  const loadTopics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await topicService.getTopics({
        search,
        subject: selectedSubject,
        status: selectedStatus
      });
      setTopics(data);
    } catch (err) {
      setError(err.message || 'Failed to load topics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadTopics();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, selectedSubject, selectedStatus]);

  const handleDeleteConfirm = async () => {
    if (!deletingTopic) return;
    try {
      await topicService.deleteTopic(deletingTopic._id);
      setDeletingTopic(null);
      loadTopics();
    } catch (err) {
      alert(err.message || 'Failed to delete topic');
    }
  };

  const subjectsList = Array.from(new Set(topics.map((t) => t.subject))).filter(Boolean);

  const sortedTopics = [...topics].sort((a, b) => {
    if (sortBy === 'progress') {
      return (b.progress || 0) - (a.progress || 0);
    }
    if (sortBy === 'targetDate') {
      return (a.targetDate || '').localeCompare(b.targetDate || '');
    }
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>My Topics</h1>
          <p>Manage, filter, and track all your learning topics.</p>
        </div>
        <Link to="/topics/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add Topic
        </Link>
      </div>

      {/* Control Bar */}
      <div className="card card-sm" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-4)' }} />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: 40 }}
              placeholder="Search topics by name, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              className="form-control"
              style={{ width: 140 }}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="All">All Subjects</option>
              {subjectsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              className="form-control"
              style={{ width: 140 }}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Learning">Learning</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Not Started</option>
            </select>

            <select
              className="form-control"
              style={{ width: 160 }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="updated">Recently Updated</option>
              <option value="progress">Highest Progress</option>
              <option value="targetDate">Target Date</option>
            </select>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: 2, border: '1px solid var(--glass-border)' }}>
              <button 
                className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                style={{ width: 34, height: 34, background: viewMode === 'grid' ? 'var(--primary-muted)' : 'transparent', color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-4)' }}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
                style={{ width: 34, height: 34, background: viewMode === 'table' ? 'var(--primary-muted)' : 'transparent', color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-4)' }}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: 16, fontSize: 'var(--text-sm)' }}>{error}</div>}

      {loading ? (
        <div className="page-loading">
          <div className="spinner" />
          <span>Loading topics…</span>
        </div>
      ) : sortedTopics.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}>
          No topics match your current search and filter settings.
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {sortedTopics.map((t) => (
            <TopicCard key={t._id} topic={t} onDeleteRequest={setDeletingTopic} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Topic Name</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Subject</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Priority</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700, minWidth: 160 }}>Progress</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Target Date</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedTopics.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 700 }}>
                      <Link to={`/topics/${t._id}`} style={{ color: 'var(--text-1)', textDecoration: 'none' }}>
                        {t.topicName}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge badge-primary">{t.subject}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <StatusBadge type="status" value={t.status} />
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <StatusBadge type="priority" value={t.priority} />
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <ProgressBar value={t.progress || 0} max={100} showLabel={true} />
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-3)' }}>
                      {t.targetDate || '—'}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/topics/${t._id}`)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Eye size={14} /> View
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/topics/${t._id}/edit`)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeletingTopic(t)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deletingTopic)}
        title="Delete Topic"
        message={`Are you sure you want to delete "${deletingTopic?.topicName}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTopic(null)}
      />
    </div>
  );
}
