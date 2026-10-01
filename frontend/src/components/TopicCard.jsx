import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';

export default function TopicCard({ topic, onDeleteRequest }) {
  const { _id, topicName, subject, description, status, progress, priority } = topic;

  return (
    <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', gap: '0.5rem' }}>
          <span className="badge badge-primary">
            {subject}
          </span>
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            <StatusBadge type="status" value={status} />
            <StatusBadge type="priority" value={priority} />
          </div>
        </div>

        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.5rem', lineHeight: '1.3' }}>
          <Link to={`/topics/${_id}`} style={{ color: 'inherit' }}>
            {topicName}
          </Link>
        </h3>

        {description && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-3)', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        )}
      </div>

      <div>
        <ProgressBar progress={progress} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.2rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)' }}>
          <Link to={`/topics/${_id}`} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Eye size={14} /> Details
          </Link>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link to={`/topics/${_id}/edit`} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Edit3 size={14} /> Edit
            </Link>
            <button className="btn btn-danger btn-sm" onClick={() => onDeleteRequest(topic)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
