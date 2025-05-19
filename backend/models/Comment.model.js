const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userType: {
      type: String,
      enum: ['Alumni', 'Student'],
    },
    name: {
      type: String,
    },
    text: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', CommentSchema);
