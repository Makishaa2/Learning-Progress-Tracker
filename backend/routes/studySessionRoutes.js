const express = require('express');
const router = express.Router();
const studySessionController = require('../controllers/studySessionController');

router.get('/', studySessionController.getSessions);
router.get('/stats', studySessionController.getStats);
router.post('/', studySessionController.createSession);
router.delete('/:id', studySessionController.deleteSession);

module.exports = router;
