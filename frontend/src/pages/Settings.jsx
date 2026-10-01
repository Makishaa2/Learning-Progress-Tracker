import React from 'react';

export default function Settings() {
  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure your study workspace preferences.</p>
      </div>

      <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
            Daily Study Goal
          </label>
          <input
            type="text"
            className="header-search-input"
            style={{ width: '240px', paddingLeft: '0.75rem' }}
            defaultValue="4 tasks per day"
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
            Default Priority
          </label>
          <select className="header-search-input" style={{ width: '180px', paddingLeft: '0.5rem' }} defaultValue="Medium">
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
        </div>

        <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn btn-primary btn-xs">Save Preferences</button>
        </div>
      </div>
    </div>
  );
}
