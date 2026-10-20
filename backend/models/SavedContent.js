const mongoose = require('mongoose');

const savedContentSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: [true, 'Content ID is required'],
      index: true
    },
    sessionId: {
      type: String,
      required: [true, 'Session ID or User ID is required'],
      trim: true,
      index: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate saves for the same session/user and content item
savedContentSchema.index({ sessionId: 1, contentId: 1 }, { unique: true });

const SavedContent = mongoose.model('SavedContent', savedContentSchema);

module.exports = SavedContent;
