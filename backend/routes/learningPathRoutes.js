const express = require('express');
const router = express.Router();
const learningPathController = require('../controllers/learningPathController');

router.route('/')
  .get((req, res) => learningPathController.getPaths(req, res))
  .post((req, res) => learningPathController.createPath(req, res));

module.exports = router;
