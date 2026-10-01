const studySessionService = require('../services/studySessionService');

const getSessions = async (req, res, next) => {
  try {
    const filters = {
      subject: req.query.subject,
      date: req.query.date
    };
    const sessions = await studySessionService.getSessions(filters);
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    next(error);
  }
};

const createSession = async (req, res, next) => {
  try {
    const session = await studySessionService.createSession(req.body);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
};

const deleteSession = async (req, res, next) => {
  try {
    const session = await studySessionService.deleteSession(req.params.id);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    res.json({ success: true, message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await studySessionService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSessions,
  createSession,
  deleteSession,
  getStats
};
