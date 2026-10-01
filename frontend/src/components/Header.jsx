import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Search, 
  X, 
  Bell, 
  Command,
  BookMarked,
  Sun,
  Moon
} from 'lucide-react';

const PAGE_TITLES = {
  '/':          { Icon: LayoutDashboard, title: 'Dashboard',      desc: "Here's your study overview" },
  '/subjects':  { Icon: BookOpen,        title: 'Learning',        desc: 'Your subject workspaces' },
  '/planner':   { Icon: Calendar,        title: 'Planner',         desc: 'Schedule & calendar' },
  '/habits':    { Icon: Flame,           title: 'Habits',          desc: 'Daily habit tracker' },
  '/topics':    { Icon: FolderKanban,    title: 'Topics',          desc: 'All study topics' },
  '/tasks':     { Icon: CheckSquare,     title: 'Tasks',           desc: 'Track your tasks' },
  '/goals':     { Icon: Target,          title: 'Goals',           desc: 'Study goals & milestones' },
  '/sessions':  { Icon: Clock,           title: 'Study Sessions',  desc: 'Log & review study time' },
  '/progress':  { Icon: TrendingUp,      title: 'Progress',        desc: 'Analytics & insights' },
};

export default function Header({ pathname }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('studyos_theme') === 'dark';
  });
  const navigate = useNavigate();

  const meta = PAGE_TITLES[pathname] || { Icon: BookMarked, title: 'Study Planner', desc: '' };
  const PageIcon = meta.Icon;

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('studyos_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('studyos_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.data);
      } catch {
        setResults(null);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const goTo = (path) => {
    setQuery('');
    setResults(null);
    navigate(path);
  };

  return (
    <header className="main-header">
      <div className="flex items-center gap-3">
        <div className="header-title-icon">
          <PageIcon size={20} color="var(--primary)" />
        </div>
        <div>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
            {meta.title}
          </span>
          {meta.desc && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-4)', marginLeft: 10, fontWeight: 500 }}>
              — {meta.desc}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div style={{ position: 'relative' }}>
          <div className="header-search-wrap">
            <Search className="header-search-icon" size={16} />
            <input
              className="header-search-input"
              placeholder="Search topics, subjects…"
              value={query}
              onChange={handleSearch}
              onBlur={() => setTimeout(() => setResults(null), 200)}
            />
            {query ? (
              <button
                className="btn-ghost btn-icon"
                onClick={() => { setQuery(''); setResults(null); }}
                style={{ width: 22, height: 22, color: 'var(--text-4)' }}
              >
                <X size={14} />
              </button>
            ) : (
              <span className="kbd-shortcut"><Command size={10} /> K</span>
            )}
          </div>

          {results && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 8,
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--glass-shadow)',
              backdropFilter: 'var(--glass-blur)',
              zIndex: 200,
              maxHeight: 320,
              overflowY: 'auto'
            }}>
              {results.subjects?.length === 0 && results.topics?.length === 0 && results.habits?.length === 0 ? (
                <div style={{ padding: '14px 16px', color: 'var(--text-4)', fontSize: 'var(--text-sm)' }}>
                  No results for "{query}"
                </div>
              ) : (
                <>
                  {results.subjects?.slice(0, 3).map(s => (
                    <div
                      key={s._id}
                      onClick={() => goTo(`/subjects/${s._id}`)}
                      style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border-subtle)' }}
                      className="search-result-item"
                    >
                      <BookOpen size={16} color="var(--primary)" />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-1)', fontWeight: 600 }}>{s.name}</span>
                      <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>Subject</span>
                    </div>
                  ))}
                  {results.topics?.slice(0, 5).map(t => (
                    <div
                      key={t._id}
                      onClick={() => goTo(`/topics`)}
                      style={{ padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border-subtle)' }}
                      className="search-result-item"
                    >
                      <FolderKanban size={16} color="var(--accent)" />
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-1)' }}>{t.topicName}</span>
                      <span className="badge badge-neutral" style={{ marginLeft: 'auto' }}>Topic</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <button className="header-icon-btn" onClick={toggleTheme} title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}>
          {isDark ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        <button className="header-icon-btn" title="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
}
