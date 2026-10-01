const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habitController');

router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);
router.put('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);
router.post('/:id/toggle', habitController.toggleHabitToday);
router.get('/heatmap', habitController.getHeatmap);
router.get('/stats', habitController.getHabitStats);

module.exports = router;
