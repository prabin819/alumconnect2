const mongoose = require('mongoose');
const User = require('./User.model');

const StudentSchema = new mongoose.Schema({
  enrollmentYear: {
    type: Number,
    required: true,
  },
  expectedGraduationYear: {
    type: Number,
    required: true,
  },
  major: {
    type: String,
    required: true,
    trim: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    // sparse: true, // only enforces uniqueness when studentId is not null or undefined
    trim: true,
  },
  interests: [
    {
      type: String,
      trim: true,
    },
  ],
});

StudentSchema.methods.filterSafeProperties = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    userType: this.userType,
    major: this.major,
    studentId: this.studentId,
    isVerified: this.isVerified,
  };
};

module.exports = User.discriminator('Student', StudentSchema);
