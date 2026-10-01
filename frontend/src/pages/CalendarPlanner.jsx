import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildMonthGrid(year, month) {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells = [];

  // Previous month tail
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, month: month - 1, year, outside: true });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month, year, outside: false });
  }
  // Next month head (pad to complete last row)
  const remainder = cells.length % 7;
  if (remainder > 0) {
    for (let d = 1; d <= 7 - remainder; d++) {
      cells.push({ day: d, month: month + 1, year, outside: true });
    }
  }
  return cells;
}

function toDateStr(year, month, day) {
  const m = ((month % 12) + 12) % 12;
  const y = year + Math.floor(month / 12);
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function CalendarPlanner() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth()); // 0-indexed
  const [events, setEvents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    subject: '',
    eventType: 'Study Session',
    date: now.toISOString().split('T')[0],
    time: '07:00 PM',
    priority: 'Medium'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resEvents, resSubjects] = await Promise.all([
        fetch('http://localhost:5000/api/calendar'),
        fetch('http://localhost:5000/api/subjects'),
      ]);
      if (resEvents.ok) setEvents((await resEvents.json()).data || []);
      if (resSubjects.ok) {
        const sData = (await resSubjects.json()).data || [];
        setSubjects(sData);
        if (sData.length > 0) {
          setNewEvent(e => ({ ...e, subject: sData[0].name }));
        }
      }
    } catch (err) {
      console.error('Error fetching calendar data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(prev => [...prev, data.data]);
        setShowEventModal(false);
        setNewEvent(e => ({ ...e, title: '' }));
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/calendar/${id}`, { method: 'DELETE' });
      if (res.ok) setEvents(prev => prev.filter(ev => ev._id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const todayStr = now.toISOString().split('T')[0];
  const cells = buildMonthGrid(viewYear, viewMonth);
  const eventsForDate = events.filter(ev => ev.date === selectedDate);

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <span>Loading planner…</span>
      </div>
    );
  }

  return (
    <div className="planner-container">
      <div className="planner-header-flex">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-1)', marginBottom: 4 }}>
            Planner
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-4)' }}>
            Schedule study sessions, revision days, and deadlines.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowEventModal(true)}>
          + Schedule Event
        </button>
      </div>

      <div className="grid-3-col margin-v">
        {/* Calendar Matrix */}
        <div className="card grid-span-2">
          {/* Month navigation */}
          <div className="calendar-matrix-header">
            <button
              className="btn btn-secondary btn-sm"
              onClick={prevMonth}
              style={{ padding: '4px 10px', fontSize: 16 }}
            >
              ←
            </button>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={nextMonth}
              style={{ padding: '4px 10px', fontSize: 16 }}
            >
              →
            </button>
          </div>

          <div className="calendar-days-grid">
            {WEEKDAYS.map(d => (
              <div key={d} className="grid-header-cell">{d}</div>
            ))}
            {cells.map((cell, i) => {
              const dateStr = toDateStr(cell.year, cell.month, cell.day);
              const dayEvents = events.filter(ev => ev.date === dateStr);
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;
              return (
                <div
                  key={i}
                  className={`calendar-day-cell${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}${cell.outside ? ' outside-month' : ''}`}
                  onClick={() => setSelectedDate(dateStr)}
                >
                  <span className="day-number">{cell.day}</span>
                  {dayEvents.length > 0 && (
                    <div className="event-dots-cluster">
                      {dayEvents.slice(0, 3).map((ev, idx) => (
                        <span key={idx} className="event-dot" title={ev.title} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day Inspector */}
        <div className="card day-inspector-card">
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
            {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 14 }}>
            {eventsForDate.length} event{eventsForDate.length !== 1 ? 's' : ''} scheduled
          </p>

          <div className="events-inspector-list">
            {eventsForDate.length === 0 ? (
              <div className="empty-inspector">
                <p>Nothing scheduled</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setNewEvent(e => ({ ...e, date: selectedDate })); setShowEventModal(true); }}
                >
                  + Add Event
                </button>
              </div>
            ) : (
              eventsForDate.map(ev => (
                <div key={ev._id} className="inspector-event-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="event-type-badge">{ev.eventType}</div>
                    <button
                      onClick={() => handleDeleteEvent(ev._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-4)', cursor: 'pointer', fontSize: 12, padding: '0 2px' }}
                      title="Remove event"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <h4>{ev.title}</h4>
                  <div className="event-meta">
                    {ev.time && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {ev.time}</span>}
                    {ev.subject && <span className="subj-badge">{ev.subject}</span>}
                  </div>
                  <span className={`priority-pill priority-${(ev.priority || 'medium').toLowerCase()}`}>
                    {ev.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Event</h2>
              <button className="close-btn" onClick={() => setShowEventModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateEvent} className="modal-form">
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DSA Revision Session"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Event Type</label>
                  <select value={newEvent.eventType} onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value })}>
                    <option value="Study Session">Study Session</option>
                    <option value="Revision Day">Revision Day</option>
                    <option value="Assignment Deadline">Assignment Deadline</option>
                    <option value="Exam">Exam</option>
                    <option value="Personal Event">Personal Event</option>
                    <option value="Habit Reminder">Habit Reminder</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <select value={newEvent.subject} onChange={e => setNewEvent({ ...newEvent, subject: e.target.value })}>
                    <option value="">None</option>
                    {subjects.map(s => (
                      <option key={s._id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    placeholder="07:00 PM"
                    value={newEvent.time}
                    onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select value={newEvent.priority} onChange={e => setNewEvent({ ...newEvent, priority: e.target.value })}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEventModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
