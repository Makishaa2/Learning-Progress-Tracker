const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.route('/')
  .get((req, res) => taskController.getTasks(req, res))
  .post((req, res) => taskController.createTask(req, res));

router.route('/:id')
  .put((req, res) => taskController.updateTask(req, res))
  .delete((req, res) => taskController.deleteTask(req, res));

module.exports = router;
