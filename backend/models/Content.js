
const mongoose = require('mongoose');

/**
 * Validate optional URLs.
 * Empty values are allowed; non-empty values must use HTTP or HTTPS.
 */
const validateOptionalUrl = (value) => {
  if (value == null || (typeof value === 'string' && value.trim() === '')) {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      index: true,
    },
    contentType: {
      type: String,
      required: [true, 'Content type is required'],
      enum: {
        values: ['movie', 'series', 'book'],
        message: '{VALUE} is not a supported content type',
      },
      lowercase: true,
      trim: true,
      index: true,
    },
    platform: {
      type: String,
      trim: true,
      default: '',
    },
    isNetflixOriginal: {
      type: Boolean,
      default: false,
    },
    genres: {
      type: [String],
      default: [],
    },
    moods: {
      type: [String],
      default: [],
    },
    experiences: {
      type: [String],
      default: [],
    },
    intensity: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid intensity level',
      },
      default: 'medium',
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    posterUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: validateOptionalUrl,
        message: 'posterUrl must be a valid HTTP or HTTPS URL.',
      },
    },
    externalUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: validateOptionalUrl,
        message: 'externalUrl must be a valid HTTP or HTTPS URL.',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Preserve the teammate's lookup and text-search indexes.
contentSchema.index({ moods: 1 });
contentSchema.index({ experiences: 1 });
contentSchema.index({ genres: 1 });
contentSchema.index({ title: 'text', description: 'text' });

// Support filtering by content type and mood.
contentSchema.index({ contentType: 1, moods: 1 });

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
