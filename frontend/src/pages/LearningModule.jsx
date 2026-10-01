import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, FolderKanban, Plus, Clock, ArrowRight, BookMarked, FileText } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';

export default function LearningModule() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSubj, resTop] = await Promise.all([
        fetch('http://localhost:5000/api/subjects'),
        fetch('http://localhost:5000/api/topics')
      ]);
      if (resSubj.ok) {
        const data = await resSubj.json();
        setSubjects(data.data || []);
      }
      if (resTop.ok) {
        const data = await resTop.json();
        setTopics(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching learning module data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Loading Learning Workspaces…</span>
      </div>
    );
  }

  return (
    <div className="learning-module-container animate-fade-in">
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1>Learning Workspaces</h1>
          <p>Access subject workspaces, topic hierarchies, notes, and study analytics.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/topics/new')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> Add New Topic
        </button>
      </div>

      <div className="section-block" style={{ marginBottom: 36 }}>
        <h2 className="section-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={20} color="var(--primary)" /> Subject Workspaces
        </h2>
        <div className="subjects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {subjects.map((subj) => (
            <div 
              key={subj._id} 
              className="card hover-lift" 
              style={{ borderTop: `4px solid ${subj.color || 'var(--primary)'}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--primary-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookMarked size={20} color={subj.color || 'var(--primary)'} />
                  </div>
                  <span className="badge badge-neutral">{subj.code || 'SUBJ'}</span>
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-1)', marginBottom: 6 }}>{subj.name}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', lineHeight: 1.5 }}>{subj.description}</p>
              </div>

              <div>
                <ProgressBar value={subj.calculatedProgress || 0} max={100} showLabel={true} color={subj.color} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                    <Clock size={14} /> {subj.completedHours || 0}/{subj.estimatedHours || 40} hrs
                  </span>
                  <Link to={`/subjects/${subj._id}`} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    Open Workspace <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-block">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-xl)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderKanban size={20} color="var(--accent)" /> Active Topic Hierarchy
          </h2>
          <Link to="/topics" className="btn-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            View All Topics <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-sm)' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Topic / Subtopic</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Subject</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Difficulty</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700 }}>Progress</th>
                  <th style={{ padding: '14px 20px', color: 'var(--text-4)', fontWeight: 700, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {topics.map((t) => (
                  <tr key={t._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <strong style={{ color: 'var(--text-1)', display: 'block' }}>{t.topicName}</strong>
                      {t.parentTopic && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)' }}>Subtopic of {t.parentTopic}</span>}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className="badge badge-primary">{t.subject}</span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <StatusBadge type="status" value={t.status} />
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span className={`diff-${(t.difficulty || 'medium').toLowerCase()}`}>{t.difficulty || 'Medium'}</span>
                    </td>
                    <td style={{ padding: '14px 20px', minWidth: 140 }}>
                      <ProgressBar value={t.progress || 0} max={100} showLabel={true} />
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <Link to={`/topics/${t._id}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <FileText size={14} /> Notebook
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
