const express = require('express');
const router = express.Router();
const {
  saveContent,
  getSavedContent,
  removeSavedContent
} = require('../controllers/savedController');

// POST /api/saved - Save content to session/user list
router.post('/', saveContent);

// GET /api/saved - Retrieve saved content for session/user
router.get('/', getSavedContent);

// DELETE /api/saved/:contentId - Remove saved content item
router.delete('/:contentId', removeSavedContent);

module.exports = router;
