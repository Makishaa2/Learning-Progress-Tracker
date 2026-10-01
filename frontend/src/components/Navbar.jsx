import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="brand-title">
          <span className="brand-icon">🎓</span>
          <span>StudyQuest</span>
        </NavLink>

        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <span>📊</span> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/topics" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <span>📚</span> My Topics
            </NavLink>
          </li>
          <li>
            <NavLink to="/topics/new" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              <span>🚀</span> Add Topic
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
