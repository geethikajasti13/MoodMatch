const express = require('express');
const router = express.Router();
const { getContentList, getContentById } = require('../controllers/contentController');

// GET /api/content - List content with multi-criteria filters and search
router.get('/', getContentList);

// GET /api/content/:id - Detail view for a specific content record
router.get('/:id', getContentById);

module.exports = router;
