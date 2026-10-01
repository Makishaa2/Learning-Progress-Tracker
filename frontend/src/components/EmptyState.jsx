import React from 'react';
import { Inbox } from 'lucide-react';

/**
 * EmptyState – Component for all empty data scenarios.
 * Always pairs an icon with a title, description, and optional CTA.
 */
export default function EmptyState({ icon: Icon = Inbox, title, description, actions = null }) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">
        {typeof Icon === 'string' ? Icon : <Icon size={32} color="var(--primary)" />}
      </div>
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-desc">{description}</p>}
      {actions && <div className="empty-state-actions">{actions}</div>}
    </div>
  );
}
