// models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isVirtual: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    maxAttendees: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['networking', 'workshop', 'seminar', 'social', 'conference', 'other'],
      default: 'other',
    },
    imageUrl: {
      type: String,
      default: '',
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
    },
    attendees: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        userType: {
          type: String,
          enum: ['Alumni', 'Student'],
          required: true,
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for event search
EventSchema.index({ title: 'text', description: 'text', location: 'text' });

// // After fetching events, update isActive dynamically
// EventSchema.post('find', function (docs) {
//   docs.forEach((doc) => {
//     if (doc.endDate) {
//       doc.isActive = doc.endDate > new Date();
//     }
//   });
// });

// EventSchema.post('findOne', function (doc) {
//   if (doc && doc.endDate) {
//     doc.isActive = doc.endDate > new Date();
//   }
// });

// EventSchema.post('findById', function (doc) {
//   if (doc && doc.endDate) {
//     doc.isActive = doc.endDate > new Date();
//   }
// });

module.exports = mongoose.model('Event', EventSchema);
