import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Lazy-loaded page components for optimal code splitting & fast initial render
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LearningModule = lazy(() => import('./pages/LearningModule'));
const SubjectWorkspace = lazy(() => import('./pages/SubjectWorkspace'));
const MyTopics = lazy(() => import('./pages/MyTopics'));
const AddTopic = lazy(() => import('./pages/AddTopic'));
const EditTopic = lazy(() => import('./pages/EditTopic'));
const TopicDetails = lazy(() => import('./pages/TopicDetails'));
const CalendarPlanner = lazy(() => import('./pages/CalendarPlanner'));
const HabitTracker = lazy(() => import('./pages/HabitTracker'));
const ProgressAnalytics = lazy(() => import('./pages/ProgressAnalytics'));
const StudySessions = lazy(() => import('./pages/StudySessions'));
const Goals = lazy(() => import('./pages/Goals'));
const Tasks = lazy(() => import('./pages/Tasks'));

function PageFallback() {
  return (
    <div className="page-loading">
      <div className="spinner" />
      <span>Loading page…</span>
    </div>
  );
}

function AppShell() {
  const location = useLocation();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header pathname={location.pathname} />
        <main className="content-area">
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/"                       element={<Dashboard />} />
              <Route path="/subjects"               element={<LearningModule />} />
              <Route path="/subjects/:id"           element={<SubjectWorkspace />} />
              <Route path="/topics"                 element={<MyTopics />} />
              <Route path="/topics/new"             element={<AddTopic />} />
              <Route path="/topics/:id"             element={<TopicDetails />} />
              <Route path="/topics/:id/edit"        element={<EditTopic />} />
              <Route path="/planner"                element={<CalendarPlanner />} />
              <Route path="/habits"                 element={<HabitTracker />} />
              <Route path="/goals"                  element={<Goals />} />
              <Route path="/tasks"                  element={<Tasks />} />
              <Route path="/sessions"               element={<StudySessions />} />
              <Route path="/progress"               element={<ProgressAnalytics />} />
              {/* Legacy redirect */}
              <Route path="/learning"               element={<Navigate to="/subjects" replace />} />
              <Route path="/learning/:subjectName"  element={<Navigate to="/subjects" replace />} />
              <Route path="*"                       element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
