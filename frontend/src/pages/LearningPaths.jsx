import React, { useState, useEffect } from 'react';
import { topicService } from '../services/topicService';

export default function LearningPaths() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        setLoading(true);
        const data = await topicService.getLearningPaths();
        setPaths(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaths();
  }, []);

  if (loading) {
    return <div className="page-subtitle">Loading learning paths...</div>;
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Learning Paths</h1>
        <p className="page-subtitle">Structured curriculum paths mapping your study sequences from basics to mastery.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {paths.map((path) => (
          <div key={path._id} className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <span className="status-pill learning" style={{ fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {path.subject}
                </span>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {path.title}
                </h2>
              </div>
            </div>

            {path.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {path.description}
              </p>
            )}

            {/* Sequential Nodes Flow */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              {path.nodes.map((node, index) => {
                let badgeStyle = {
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-light)'
                };
                let icon = '○';

                if (node.status === 'Completed') {
                  badgeStyle = {
                    backgroundColor: 'var(--status-completed-bg)',
                    color: 'var(--status-completed-text)',
                    border: '1px solid #bbf7d0'
                  };
                  icon = '✓';
                } else if (node.status === 'Learning') {
                  badgeStyle = {
                    backgroundColor: 'var(--primary)',
                    color: '#ffffff',
                    border: '1px solid var(--primary)'
                  };
                  icon = '▶';
                }

                return (
                  <React.Fragment key={index}>
                    <div
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.83rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        ...badgeStyle
                      }}
                    >
                      <span style={{ fontSize: '0.75rem' }}>{icon}</span>
                      <span>{node.name}</span>
                    </div>

                    {index < path.nodes.length - 1 && (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', fontWeight: 700 }}>
                        →
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
