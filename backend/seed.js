const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('./models/Subject');
const Topic = require('./models/Topic');
const StudySession = require('./models/StudySession');
const CalendarEvent = require('./models/CalendarEvent');
const Habit = require('./models/Habit');
const HabitLog = require('./models/HabitLog');
const Goal = require('./models/Goal');

dotenv.config();

const sampleSubjects = [
  {
    name: 'Java',
    code: 'CS101',
    icon: '☕',
    color: '#f97316',
    description: 'Core Java Programming, OOP concepts, Collection Framework, and Concurrency.',
    startedDate: '2026-07-10',
    targetDate: '2026-08-20',
    estimatedHours: 40,
    completedHours: 28,
    nextRevisionDate: '2026-08-01',
    tags: ['Core', 'Backend', 'OOP']
  },
  {
    name: 'Python',
    code: 'CS102',
    icon: '🐍',
    color: '#3b82f6',
    description: 'Python Basics, Data Structures, Automation scripts, and NumPy/Pandas.',
    startedDate: '2026-07-01',
    targetDate: '2026-08-15',
    estimatedHours: 35,
    completedHours: 20,
    nextRevisionDate: '2026-08-03',
    tags: ['Language', 'Data Science', 'Scripting']
  },
  {
    name: 'DBMS',
    code: 'CS201',
    icon: '🗄️',
    color: '#8b5cf6',
    description: 'Relational Database Design, SQL, Normalization, Indexing, and Transactions.',
    startedDate: '2026-07-05',
    targetDate: '2026-08-25',
    estimatedHours: 30,
    completedHours: 18,
    nextRevisionDate: '2026-08-02',
    tags: ['Database', 'SQL', 'Backend']
  },
  {
    name: 'Operating Systems',
    code: 'CS202',
    icon: '💻',
    color: '#10b981',
    description: 'Process Management, Threads, Deadlocks, Memory Management & File Systems.',
    startedDate: '2026-07-15',
    targetDate: '2026-09-01',
    estimatedHours: 45,
    completedHours: 15,
    nextRevisionDate: '2026-08-05',
    tags: ['Core CS', 'Systems']
  },
  {
    name: 'DSA',
    code: 'CS301',
    icon: '⚡',
    color: '#ec4899',
    description: 'Data Structures and Algorithms: Trees, Graphs, Dynamic Programming, Sorting.',
    startedDate: '2026-06-15',
    targetDate: '2026-09-15',
    estimatedHours: 80,
    completedHours: 52,
    nextRevisionDate: '2026-08-01',
    tags: ['Interview', 'Problem Solving']
  },
  {
    name: 'AI',
    code: 'CS401',
    icon: '🤖',
    color: '#06b6d4',
    description: 'Artificial Intelligence, Search Algorithms, Machine Learning Basics, Neural Networks.',
    startedDate: '2026-07-20',
    targetDate: '2026-10-01',
    estimatedHours: 50,
    completedHours: 10,
    nextRevisionDate: '2026-08-10',
    tags: ['Advanced', 'ML', 'AI']
  },
  {
    name: 'Mathematics',
    code: 'MATH101',
    icon: '📐',
    color: '#f59e0b',
    description: 'Discrete Mathematics, Linear Algebra, Probability & Statistics for CS.',
    startedDate: '2026-07-01',
    targetDate: '2026-09-30',
    estimatedHours: 40,
    completedHours: 22,
    nextRevisionDate: '2026-08-04',
    tags: ['Math', 'Foundation']
  }
];

const sampleTopics = [];

const sampleStudySessions = [
  {
    subject: 'Java',
    topic: '2D Arrays',
    startTime: '07:00 PM',
    endTime: '08:15 PM',
    durationMinutes: 75,
    date: '2026-07-31',
    notes: 'Completed Matrix Traversal and Spiral Matrix implementation.'
  },
  {
    subject: 'DBMS',
    topic: 'SQL Joins & Subqueries',
    startTime: '04:00 PM',
    endTime: '05:30 PM',
    durationMinutes: 90,
    date: '2026-07-30',
    notes: 'Practiced complex join queries.'
  },
  {
    subject: 'DSA',
    topic: 'Binary Search',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    durationMinutes: 90,
    date: '2026-07-29',
    notes: 'Revised search in rotated sorted array.'
  }
];

const sampleEvents = [
  {
    title: 'Java 2D Arrays Deep Dive',
    subject: 'Java',
    topic: '2D Arrays',
    eventType: 'Study Session',
    date: '2026-07-31',
    time: '07:00 PM',
    durationMinutes: 75,
    priority: 'High',
    status: 'Completed'
  },
  {
    title: 'Inheritance Spaced Revision (Day 1)',
    subject: 'Java',
    topic: 'Inheritance & OOP',
    eventType: 'Revision Day',
    date: '2026-08-01',
    time: '10:00 AM',
    durationMinutes: 45,
    priority: 'High',
    status: 'Scheduled'
  },
  {
    title: 'DBMS Assignment 2 Deadline',
    subject: 'DBMS',
    topic: 'SQL Joins',
    eventType: 'Assignment Deadline',
    date: '2026-08-03',
    time: '11:59 PM',
    durationMinutes: 30,
    priority: 'High',
    status: 'Scheduled'
  },
  {
    title: 'DSA Weekly Contest & Mock Exam',
    subject: 'DSA',
    topic: 'Binary Search',
    eventType: 'Exam',
    date: '2026-08-05',
    time: '02:00 PM',
    durationMinutes: 120,
    priority: 'High',
    status: 'Scheduled'
  }
];

const sampleHabits = [
  {
    name: 'Study 2 Hours',
    category: 'Academics',
    frequency: 'Daily',
    targetCount: 2,
    unit: 'hours',
    reminderTime: '06:00 PM',
    icon: '📖',
    color: '#3b82f6',
    currentStreak: 12,
    bestStreak: 25
  },
  {
    name: 'Drink Water (3L)',
    category: 'Health',
    frequency: 'Daily',
    targetCount: 3,
    unit: 'liters',
    reminderTime: '10:00 AM',
    icon: '💧',
    color: '#06b6d4',
    currentStreak: 18,
    bestStreak: 30
  },
  {
    name: 'Exercise / Gym',
    category: 'Fitness',
    frequency: 'Daily',
    targetCount: 45,
    unit: 'mins',
    reminderTime: '06:30 AM',
    icon: '🏋️‍♂️',
    color: '#10b981',
    currentStreak: 5,
    bestStreak: 14
  },
  {
    name: 'Meditation',
    category: 'Wellness',
    frequency: 'Daily',
    targetCount: 15,
    unit: 'mins',
    reminderTime: '07:30 AM',
    icon: '🧘',
    color: '#8b5cf6',
    currentStreak: 8,
    bestStreak: 15
  },
  {
    name: 'Read Book (15 pages)',
    category: 'Personal',
    frequency: 'Daily',
    targetCount: 15,
    unit: 'pages',
    reminderTime: '09:30 PM',
    icon: '📚',
    color: '#f59e0b',
    currentStreak: 9,
    bestStreak: 20
  },
  {
    name: 'Sleep Before 11 PM',
    category: 'Health',
    frequency: 'Daily',
    targetCount: 1,
    unit: 'time',
    reminderTime: '10:30 PM',
    icon: '🌙',
    color: '#ec4899',
    currentStreak: 4,
    bestStreak: 10
  }
];

const sampleGoals = [
  {
    title: 'Finish Java Mastery',
    subject: 'Java',
    targetValue: 40,
    currentValue: 28,
    unit: 'hours',
    targetDate: '2026-08-20',
    status: 'In Progress'
  },
  {
    title: 'Solve 300 DSA Problems',
    subject: 'DSA',
    targetValue: 300,
    currentValue: 185,
    unit: 'problems',
    targetDate: '2026-09-15',
    status: 'In Progress'
  },
  {
    title: 'Total Study 250 Hours',
    subject: 'Overall',
    targetValue: 250,
    currentValue: 165,
    unit: 'hours',
    targetDate: '2026-09-30',
    status: 'In Progress'
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learning_tracker';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await Subject.deleteMany({});
    await Topic.deleteMany({});
    await StudySession.deleteMany({});
    await CalendarEvent.deleteMany({});
    await Habit.deleteMany({});
    await HabitLog.deleteMany({});
    await Goal.deleteMany({});
    console.log('Cleared existing database documents...');

    await Subject.insertMany(sampleSubjects);
    await Topic.insertMany(sampleTopics);
    await StudySession.insertMany(sampleStudySessions);
    await CalendarEvent.insertMany(sampleEvents);
    await Habit.insertMany(sampleHabits);
    await Goal.insertMany(sampleGoals);

    // Create habit log for today
    const habits = await Habit.find();
    const today = new Date().toISOString().split('T')[0];
    for (const h of habits.slice(0, 3)) {
      await HabitLog.create({
        habitId: h._id,
        habitName: h.name,
        date: today,
        completed: true
      });
    }

    console.log('Successfully seeded database with full Study & Habit data!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDB();
