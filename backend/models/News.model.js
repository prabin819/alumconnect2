const mongoose = require('mongoose');

// News Schema
const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
      maxlength: 300,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: ['academic', 'career', 'announcement', 'achievement', 'general'],
      default: 'general',
    },
    createdBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      userType: {
        type: String,
        enum: ['Alumni', 'Student'],
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        commentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment',
        },
        // addedAt: {
        //   type: Date,
        //   default: Date.now,
        // },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for news search
NewsSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('News', NewsSchema);
