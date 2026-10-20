const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');

// POST /api/recommend - Infer mood and return ranked entertainment recommendations
router.post('/', getRecommendations);

module.exports = router;
