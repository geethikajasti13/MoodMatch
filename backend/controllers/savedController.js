const mongoose = require('mongoose');
const SavedContent = require('../models/SavedContent');
const Content = require('../models/Content');

/**
 * Extracts and validates session identifier from headers, query, or body.
 */
function extractSessionId(req) {
  const rawId = req.headers['x-session-id'] || req.query.sessionId || (req.body && req.body.sessionId);
  if (!rawId || typeof rawId !== 'string') return null;
  const trimmed = rawId.trim();
  if (trimmed.length === 0 || trimmed.length > 128) return null;
  return trimmed;
}

/**
 * POST /api/saved
 * Save a content item for an anonymous session or user.
 */
async function saveContent(req, res, next) {
  try {
    const sessionId = extractSessionId(req);
    const { contentId, notes } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "A valid 'sessionId' must be provided in the request body, query parameter, or 'x-session-id' header."
      });
    }

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        error: "A valid 'contentId' MongoDB ObjectId is required."
      });
    }

    // Verify content exists in database
    const contentExists = await Content.findById(contentId);
    if (!contentExists) {
      return res.status(404).json({
        success: false,
        error: `Content with ID '${contentId}' does not exist.`
      });
    }

    // Check for existing saved record to prevent duplicate saves
    const existing = await SavedContent.findOne({ sessionId, contentId });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Content is already saved in this session.'
      });
    }

    const savedRecord = await SavedContent.create({
      contentId,
      sessionId,
      notes: typeof notes === 'string' ? notes.trim() : ''
    });

    const populatedRecord = await SavedContent.findById(savedRecord._id).populate('contentId');

    return res.status(201).json({
      success: true,
      message: 'Content saved successfully.',
      data: populatedRecord
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Content is already saved in this session.'
      });
    }
    next(error);
  }
}

/**
 * GET /api/saved
 * Retrieve all saved content items for the current session.
 */
async function getSavedContent(req, res, next) {
  try {
    const sessionId = extractSessionId(req);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "A valid 'sessionId' must be provided in the query parameter or 'x-session-id' header."
      });
    }

    const savedItems = await SavedContent.find({ sessionId })
      .populate('contentId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: savedItems.length,
      data: savedItems
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/saved/:contentId
 * Remove a saved item from a session's list.
 */
async function removeSavedContent(req, res, next) {
  try {
    const { contentId } = req.params;
    const sessionId = extractSessionId(req);

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: "A valid 'sessionId' must be provided in the query parameter, body, or 'x-session-id' header."
      });
    }

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        error: `Invalid content ID format: '${contentId}'`
      });
    }

    const deleted = await SavedContent.findOneAndDelete({ sessionId, contentId });
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Saved content item not found for this session.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Saved content item removed successfully.'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  saveContent,
  getSavedContent,
  removeSavedContent,
  extractSessionId
};
