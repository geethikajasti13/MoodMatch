const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      index: true
    },
    contentType: {
      type: String,
      required: [true, 'Content type is required'],
      enum: {
        values: ['movie', 'series', 'book'],
        message: '{VALUE} is not a supported content type'
      },
      lowercase: true,
      trim: true,
      index: true
    },
    platform: {
      type: String,
      trim: true,
      default: ''
    },
    isNetflixOriginal: {
      type: Boolean,
      default: false
    },
    genres: {
      type: [String],
      default: []
    },
    moods: {
      type: [String],
      default: []
    },
    experiences: {
      type: [String],
      default: []
    },
    intensity: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid intensity level'
      },
      default: 'medium',
      lowercase: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    posterUrl: {
      type: String,
      trim: true,
      default: ''
    },
    externalUrl: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast filtering and searching
contentSchema.index({ moods: 1 });
contentSchema.index({ experiences: 1 });
contentSchema.index({ genres: 1 });
contentSchema.index({ title: 'text', description: 'text' });

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
