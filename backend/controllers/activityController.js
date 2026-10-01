const { getActivity } = require('../services/activityService');

const getActivityLog = async (req, res, next) => {
  try {
    const limit = req.query.limit || 20;
    const logs = await getActivity(limit);
    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivityLog };
