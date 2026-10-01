const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.get('/', topicController.getTopics);
router.get('/:id', topicController.getTopicById);
router.post('/', topicController.createTopic);
router.put('/:id', topicController.updateTopic);
router.delete('/:id', topicController.deleteTopic);

router.put('/:id/checklist/:itemId', topicController.toggleChecklist);
router.post('/:id/resources', topicController.addResource);
router.delete('/:id/resources/:resourceId', topicController.deleteResource);
router.put('/:id/bookmark', topicController.toggleBookmark);

module.exports = router;
