const express = require('express');
const router = express.Router();
const { getActivityLog } = require('../controllers/activityController');

router.get('/', getActivityLog);

module.exports = router;
