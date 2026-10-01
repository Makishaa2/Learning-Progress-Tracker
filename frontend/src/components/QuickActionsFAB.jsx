import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, FolderPlus, BookPlus, CheckSquare, Link as LinkIcon, FileText, Clock } from 'lucide-react';

export default function QuickActionsFAB() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (type) => {
    setOpen(false);
    switch (type) {
      case 'subject':
        navigate('/subjects');
        break;
      case 'topic':
        navigate('/topics/new');
        break;
      case 'task':
        navigate('/tasks');
        break;
      case 'resource':
        navigate('/subjects');
        break;
      case 'note':
        navigate('/topics');
        break;
      case 'session':
        navigate('/sessions');
        break;
      default:
        break;
    }
  };

  return (
    <div className="fab-container">
      {open && (
        <div className="fab-menu animate-slide-up">
          <button className="fab-item" onClick={() => handleAction('topic')}>
            <FolderPlus size={16} color="var(--primary)" /> Add Topic
          </button>
          <button className="fab-item" onClick={() => handleAction('subject')}>
            <BookPlus size={16} color="var(--accent)" /> Create Subject
          </button>
          <button className="fab-item" onClick={() => handleAction('task')}>
            <CheckSquare size={16} color="var(--success)" /> Add Task
          </button>
          <button className="fab-item" onClick={() => handleAction('resource')}>
            <LinkIcon size={16} color="var(--warning)" /> Add Resource
          </button>
          <button className="fab-item" onClick={() => handleAction('note')}>
            <FileText size={16} color="var(--primary)" /> Write Note
          </button>
          <button className="fab-item" onClick={() => handleAction('session')}>
            <Clock size={16} color="var(--accent)" /> Log Session
          </button>
        </div>
      )}

      <button 
        className={`fab-trigger ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        title="Quick Actions Command Menu"
      >
        {open ? <X size={22} /> : <Plus size={22} />}
      </button>
    </div>
  );
}
