import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Flame, 
  FolderKanban, 
  CheckSquare, 
  Target, 
  Clock, 
  TrendingUp,
  Sparkles,
  GraduationCap
} from 'lucide-react';

const NAV = [
  {
    section: 'Main',
    links: [
      { to: '/',         Icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/subjects', Icon: BookOpen,        label: 'Learning' },
      { to: '/planner',  Icon: Calendar,        label: 'Planner' },
      { to: '/habits',   Icon: Flame,           label: 'Habits' },
    ]
  },
  {
    section: 'Workspaces',
    links: [
      { to: '/topics',   Icon: FolderKanban,    label: 'Topics' },
      { to: '/tasks',    Icon: CheckSquare,     label: 'Tasks' },
      { to: '/goals',    Icon: Target,          label: 'Goals' },
    ]
  },
  {
    section: 'Analytics',
    links: [
      { to: '/sessions', Icon: Clock,           label: 'Study Sessions' },
      { to: '/progress', Icon: TrendingUp,      label: 'Progress' },
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand-logo">
        <div className="logo-icon">
          <Sparkles size={20} color="#fff" />
        </div>
        <div>
          <span className="brand-title">Study Planner</span>
          <span className="brand-subtitle">Learning Workspace</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((group) => (
          <div className="nav-section" key={group.section}>
            <span className="nav-section-label">{group.section}</span>
            {group.links.map(({ to, Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                <Icon className="nav-link-icon" size={18} />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">
            <GraduationCap size={18} color="#6366f1" />
          </div>
          <div className="user-info">
            <span className="user-name">Pro Learner</span>
            <span className="user-streak">
              <Flame size={12} className="inline-icon" /> Daily Streak Active
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
