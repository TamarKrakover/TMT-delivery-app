const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Get recommendations based on userId and last viewed productId
router.get('/:userId/:productId', authMiddleware, recommendationController.getRecommendations);

module.exports = router;
