import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FolderKanban, 
  BookOpen, 
  Calendar, 
  Target, 
  Clock, 
  Link as LinkIcon, 
  CheckCircle2, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  ExternalLink, 
  FileText 
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';

export default function SubjectWorkspace() {
  const { id } = useParams();

  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Resource state
  const [newResource, setNewResource] = useState({ title: '', url: '', category: 'Documentation', description: '' });
  const [showResourceForm, setShowResourceForm] = useState(false);

  // Notebook state
  const [subjectNote, setSubjectNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(true);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving' | 'saved' | ''

  useEffect(() => {
    fetchSubjectData();
  }, [id]);

  const fetchSubjectData = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await fetch(`http://localhost:5000/api/subjects/id/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSubject(data.data);
        setTopics(data.data.topics || []);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Error loading subject workspace:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!subject) return;
    setSaveStatus('saving');
    try {
      await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: subjectNote })
      });
      setSaveStatus('saved');
      setNoteSaved(true);
      setTimeout(() => setSaveStatus(''), 2000);
    } catch {
      setSaveStatus('');
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Opening workspace…</span>
      </div>
    );
  }

  if (notFound || !subject) {
    return (
      <div style={{ padding: '40px 0', maxWidth: 480, margin: '0 auto' }}>
        <EmptyState
          icon={FolderKanban}
          title="Subject not found"
          description="This subject may have been deleted or the link is incorrect."
          actions={<Link to="/subjects" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><ArrowLeft size={16} /> Back to Subjects</Link>}
        />
      </div>
    );
  }

  const tabs = ['Overview', 'Topics', 'Resources', 'Notes', 'Tasks'];
  const allResources = topics.flatMap(t =>
    (t.resources || []).map(r => ({ ...r, topicName: t.topicName, topicId: t._id }))
  );
  const allTasks = topics.flatMap(t =>
    (t.checklist || []).map(c => ({ ...c, topicName: t.topicName, topicId: t._id }))
  );
  const pct = subject.calculatedProgress || 0;

  return (
    <div className="animate-fade-in">
      {/* Notebook Header */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--primary-muted)', border: '1px solid var(--primary-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <span className="badge badge-primary">{subject.code || 'WORKSPACE'}</span>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginTop: 4 }}>{subject.name}</h1>
            </div>
          </div>
          <Link to="/subjects" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Back to Subjects
          </Link>
        </div>

        {subject.description && (
          <p style={{ color: 'var(--text-3)', fontSize: 'var(--text-sm)', marginTop: 12 }}>
            {subject.description}
          </p>
        )}

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 'var(--text-sm)', color: 'var(--text-3)' }}>
            <span>Progress: <strong style={{ color: 'var(--text-1)' }}>{pct}%</strong></span>
            <span>{subject.completedHours || 0}/{subject.estimatedHours || 0} hrs · {subject.completedTopics || 0}/{subject.totalTopics || 0} topics</span>
          </div>
          <ProgressBar value={pct} max={100} showLabel={false} color={subject.color || 'var(--primary)'} />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--glass-border)', paddingBottom: 8 }}>
        {tabs.map(t => (
          <button
            key={t}
            className={`btn ${activeTab === t ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px', fontSize: 'var(--text-sm)' }}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {/* OVERVIEW */}
        {activeTab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 16 }}>Current Focus</h3>
              {topics.length > 0 ? (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <span className="badge badge-neutral" style={{ marginBottom: 8, display: 'inline-block' }}>{subject.name}</span>
                  <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 6 }}>{topics[0].topicName}</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', marginBottom: 16 }}>{topics[0].description || 'No description'}</p>
                  <Link to={`/topics/${topics[0]._id}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    Open Topic <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <EmptyState
                  icon={FolderKanban}
                  title="No topics yet"
                  description="Add a topic to start tracking your progress in this subject."
                  actions={<Link to="/topics/new" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Add Topic</Link>}
                />
              )}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 16 }}>Subject Info</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {subject.startedDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Calendar size={18} color="var(--primary)" />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>Started: <strong style={{ color: 'var(--text-1)' }}>{subject.startedDate}</strong></span>
                  </div>
                )}
                {subject.targetDate && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Target size={18} color="var(--warning)" />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>Target Date: <strong style={{ color: 'var(--text-1)' }}>{subject.targetDate}</strong></span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Clock size={18} color="var(--success)" />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>
                    <strong style={{ color: 'var(--text-1)' }}>{subject.completedHours || 0}h</strong> of estimated <strong style={{ color: 'var(--text-1)' }}>{subject.estimatedHours || 0}h</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <BookOpen size={18} color="var(--accent)" />
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-2)' }}>
                    <strong style={{ color: 'var(--text-1)' }}>{subject.completedTopics || 0}</strong> of <strong style={{ color: 'var(--text-1)' }}>{subject.totalTopics || 0}</strong> topics completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOPICS */}
        {activeTab === 'Topics' && (
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Topics in {subject.name}</h3>
              <Link to="/topics/new" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Add Topic</Link>
            </div>
            {topics.length === 0 ? (
              <EmptyState
                icon={FolderKanban}
                title="No topics yet"
                description="Add your first topic to start tracking subtopics and resources."
                actions={<Link to="/topics/new" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Add Topic</Link>}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {topics.map(t => (
                  <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <div>
                      <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-1)' }}>{t.topicName}</span>
                      {t.parentTopic && <span className="badge badge-neutral" style={{ marginLeft: 8 }}>Subtopic of {t.parentTopic}</span>}
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginTop: 4 }}>{t.description || 'No description'}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="badge badge-primary">{t.progress}%</span>
                      <Link to={`/topics/${t._id}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        Open <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RESOURCES */}
        {activeTab === 'Resources' && (
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Resources</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowResourceForm(!showResourceForm)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Plus size={14} /> Add Resource
              </button>
            </div>
            {allResources.length === 0 && !showResourceForm ? (
              <EmptyState
                icon={LinkIcon}
                title="No resources yet"
                description="Add links, docs, and references to your topics."
                actions={
                  <button className="btn btn-primary btn-sm" onClick={() => setShowResourceForm(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <Plus size={14} /> Add Resource
                  </button>
                }
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {allResources.map((res, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <div>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-1)' }}>{res.title}</span>
                      <span className="badge badge-primary" style={{ marginLeft: 8 }}>{res.type || 'Resource'}</span>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginTop: 2 }}>From topic: {res.topicName}</p>
                    </div>
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <ExternalLink size={12} /> Open Link
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTES */}
        {activeTab === 'Notes' && (
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>Subject Notes</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {saveStatus === 'saving' && <span style={{ fontSize: 12, color: 'var(--text-4)' }}>Saving…</span>}
                {saveStatus === 'saved' && <span style={{ fontSize: 12, color: 'var(--success)' }}>Saved <Check size={12} /></span>}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveNote}
                  disabled={saveStatus === 'saving'}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Check size={14} /> Save
                </button>
              </div>
            </div>
            <textarea
              className="form-control"
              style={{
                width: '100%',
                minHeight: 280,
                fontSize: 'var(--text-sm)',
                fontFamily: 'inherit',
                lineHeight: 1.7,
                resize: 'vertical'
              }}
              placeholder="Write your subject notes, key concepts, and summaries here…"
              value={subjectNote}
              onChange={e => { setSubjectNote(e.target.value); setNoteSaved(false); setSaveStatus(''); }}
            />
          </div>
        )}

        {/* TASKS */}
        {activeTab === 'Tasks' && (
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 16 }}>Checklist Tasks</h3>
            {allTasks.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="No checklist items"
                description="Open individual topics to add checklist items."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allTasks.map(c => (
                  <div key={c._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 'var(--radius-md)', background: c.completed ? 'var(--success-muted)' : 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: c.completed ? 'var(--success)' : 'transparent', border: '2px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      {c.completed && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', color: c.completed ? 'var(--text-4)' : 'var(--text-1)', textDecoration: c.completed ? 'line-through' : 'none', flex: 1 }}>{c.title}</span>
                    <span className="badge badge-neutral">{c.topicName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
