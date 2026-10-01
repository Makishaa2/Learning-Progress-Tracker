const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { connectDB } = require('./config/db');

connectDB();

const topicRoutes = require('./routes/topicRoutes');
const taskRoutes = require('./routes/taskRoutes');
const learningPathRoutes = require('./routes/learningPathRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const habitRoutes = require('./routes/habitRoutes');
const goalRoutes = require('./routes/goalRoutes');
const searchRoutes = require('./routes/searchRoutes');
const activityRoutes = require('./routes/activityRoutes');

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

app.use('/api/topics', topicRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/activity', activityRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Study Planner API', version: '4.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`StudyOS API running on port ${PORT}`);
});
