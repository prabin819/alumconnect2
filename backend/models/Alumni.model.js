const mongoose = require('mongoose');
const User = require('./User.model');

const AlumniSchema = new mongoose.Schema({
  graduationYear: {
    type: Number,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: '',
  },
  position: {
    type: String,
    default: '',
  },
  industry: {
    type: String,
    default: '',
  },
  linkedIn: {
    type: String,
    default: '',
  },
  skills: [
    {
      type: String,
      trim: true,
    },
  ],
  jobPostings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
  ],
});

AlumniSchema.methods.filterSafeProperties = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    userType: this.userType,
    graduationYear: this.graduationYear,
    degree: this.degree,
    isVerified: this.isVerified,
  };
};

module.exports = User.discriminator('Alumni', AlumniSchema);
