const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
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
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      required: true,
    },
    salary: {
      type: String,
      default: 'Not specified',
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    applicationLink: {
      type: String,
      trim: true,
    },
    applications: [
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        applicationDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['Pending', 'Reviewed', 'Rejected', 'Accepted'],
          default: 'Pending',
        },
        resume: String,
        coverLetter: String,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for job search
JobSchema.index({ title: 'text', description: 'text', company: 'text', location: 'text' });

// // After fetching jobs, update isActive dynamically
// JobSchema.post('find', function (docs) {
//   docs.forEach((doc) => {
//     if (doc.applicationDeadline) {
//       doc.isActive = doc.applicationDeadline > new Date();
//     }
//   });
// });

// JobSchema.post('findOne', function (doc) {
//   if (doc && doc.applicationDeadline) {
//     doc.isActive = doc.applicationDeadline > new Date();
//   }
// });

// JobSchema.post('findById', function (doc) {
//   if (doc && doc.applicationDeadline) {
//     doc.isActive = doc.applicationDeadline > new Date();
//   }
// });

module.exports = mongoose.model('Job', JobSchema);
