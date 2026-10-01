import React from 'react';
import { Target, Rocket, CheckCircle2, Leaf, Zap, Flame } from 'lucide-react';

export default function StatusBadge({ type = 'status', value }) {
  if (!value) return null;

  if (type === 'status') {
    let badgeClass = 'badge-not-started';
    let Icon = Target;
    
    if (value === 'Learning') {
      badgeClass = 'badge-learning';
      Icon = Rocket;
    } else if (value === 'Completed') {
      badgeClass = 'badge-completed';
      Icon = CheckCircle2;
    }

    return (
      <span className={`badge ${badgeClass}`}>
        <Icon size={12} className="badge-icon" /> {value}
      </span>
    );
  }

  if (type === 'priority') {
    let badgeClass = 'badge-medium';
    let Icon = Zap;

    if (value === 'Low') {
      badgeClass = 'badge-low';
      Icon = Leaf;
    } else if (value === 'High') {
      badgeClass = 'badge-high';
      Icon = Flame;
    }

    return (
      <span className={`badge ${badgeClass}`}>
        <Icon size={12} className="badge-icon" /> {value}
      </span>
    );
  }

  return <span className="badge">{value}</span>;
}
