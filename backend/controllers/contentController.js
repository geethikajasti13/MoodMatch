const mongoose = require('mongoose');
const Content = require('../models/Content');

/**
 * Escapes regex special characters to prevent regex injection.
 */
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Sanitizes input to ensure it is a string and not an object containing MongoDB operators.
 */
function sanitizeString(val) {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  // Prevent common query injection characters
  if (trimmed.startsWith('$')) return null;
  return trimmed;
}

/**
 * GET /api/content
 * Retrieve content records with optional multi-criteria filtering and search.
 */
async function getContentList(req, res, next) {
  try {
    const { type, genre, mood, search, platform, intensity, page, limit } = req.query;
    const query = {};

    // Filter by contentType (supports 'type' query param)
    if (type !== undefined) {
      const sanitizedType = sanitizeString(type);
      if (sanitizedType && sanitizedType.toLowerCase() !== 'all') {
        const allowedTypes = ['movie', 'series', 'book'];
        const normalizedType = sanitizedType.toLowerCase();
        if (!allowedTypes.includes(normalizedType)) {
          return res.status(400).json({
            success: false,
            error: `Invalid content type '${type}'. Allowed values: movie, series, book, all`
          });
        }
        query.contentType = normalizedType;
      }
    }

    // Filter by genre
    if (genre !== undefined) {
      const sanitizedGenre = sanitizeString(genre);
      if (sanitizedGenre) {
        query.genres = { $regex: new RegExp(`^${escapeRegex(sanitizedGenre)}$`, 'i') };
      }
    }

    // Filter by mood
    if (mood !== undefined) {
      const sanitizedMood = sanitizeString(mood);
      if (sanitizedMood) {
        query.moods = { $regex: new RegExp(`^${escapeRegex(sanitizedMood)}$`, 'i') };
      }
    }

    // Filter by platform
    if (platform !== undefined) {
      const sanitizedPlatform = sanitizeString(platform);
      if (sanitizedPlatform) {
        query.platform = { $regex: new RegExp(`^${escapeRegex(sanitizedPlatform)}$`, 'i') };
      }
    }

    // Filter by intensity
    if (intensity !== undefined) {
      const sanitizedIntensity = sanitizeString(intensity);
      if (sanitizedIntensity) {
        const allowedIntensities = ['low', 'medium', 'high'];
        const normalizedIntensity = sanitizedIntensity.toLowerCase();
        if (!allowedIntensities.includes(normalizedIntensity)) {
          return res.status(400).json({
            success: false,
            error: `Invalid intensity '${intensity}'. Allowed values: low, medium, high`
          });
        }
        query.intensity = normalizedIntensity;
      }
    }

    // Case-insensitive title search
    if (search !== undefined) {
      const sanitizedSearch = sanitizeString(search);
      if (sanitizedSearch) {
        query.title = { $regex: escapeRegex(sanitizedSearch), $options: 'i' };
      }
    }

    // Optional pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const hasPagination = !isNaN(pageNum) && pageNum > 0 && !isNaN(limitNum) && limitNum > 0;

    let mongoQuery = Content.find(query).sort({ createdAt: -1 });

    if (hasPagination) {
      const skip = (pageNum - 1) * limitNum;
      const [items, total] = await Promise.all([
        mongoQuery.skip(skip).limit(limitNum).exec(),
        Content.countDocuments(query)
      ]);

      return res.status(200).json({
        success: true,
        count: items.length,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        data: items
      });
    }

    const items = await mongoQuery.exec();
    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/content/:id
 * Retrieve a single content item by MongoDB ObjectId.
 */
async function getContentById(req, res, next) {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: `Invalid content ID format: '${id}'`
      });
    }

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({
        success: false,
        error: `Content with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getContentList,
  getContentById,
  sanitizeString,
  escapeRegex
};
