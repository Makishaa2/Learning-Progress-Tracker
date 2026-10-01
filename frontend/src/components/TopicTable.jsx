import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit3, Trash2 } from 'lucide-react';
import ProgressBar from './ProgressBar';
import StatusBadge from './StatusBadge';

export default function TopicTable({ topics, onDeleteRequest }) {
  return (
    <div className="table-container">
      <table className="topics-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th style={{ width: '180px' }}>Progress</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {topics.map((topic) => (
            <tr key={topic._id}>
              <td>
                <Link to={`/topics/${topic._id}`} style={{ fontWeight: 700, color: 'var(--text-1)' }}>
                  {topic.topicName}
                </Link>
              </td>
              <td>
                <span className="badge badge-primary">{topic.subject}</span>
              </td>
              <td>
                <StatusBadge type="status" value={topic.status} />
              </td>
              <td>
                <StatusBadge type="priority" value={topic.priority} />
              </td>
              <td>
                <ProgressBar value={topic.progress || 0} max={100} showLabel={true} />
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                  <Link to={`/topics/${topic._id}`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Eye size={14} /> View
                  </Link>
                  <Link to={`/topics/${topic._id}/edit`} className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Edit3 size={14} /> Edit
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => onDeleteRequest(topic)} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
