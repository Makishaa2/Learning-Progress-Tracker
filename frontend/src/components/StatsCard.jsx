import React from 'react';

export default function StatsCard({ icon: Icon, label, value, subtext, trend }) {
  return (
    <div className="stat-card hover-lift">
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        {Icon && (
          <div className="stat-icon">
            {typeof Icon === 'string' ? Icon : <Icon size={18} />}
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {(subtext || trend) && (
        <div className="stat-subtext">
          {trend && <span className="stat-trend">{trend}</span>}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  );
}
