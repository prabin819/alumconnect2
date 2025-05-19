const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Node.js built-in module

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    refreshToken: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: 500,
    },
    userType: {
      type: String,
      required: true,
      enum: ['Alumni', 'Student', 'Admin'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
    discriminatorKey: 'userType',
  }
);

// Password hashing middleware
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      userType: this.userType,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.getResetPasswordToken = function () {
  // 1. Generate a random token (unhashed, sent to user via email)
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash the token and save to database (for security)
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // 3. Set expiration (e.g., 10 minutes from now)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  // 4. Return the unhashed token (to be sent in email)
  return resetToken;
};

// for email verification
UserSchema.methods.generateVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash and save to DB
  this.verificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

  return verificationToken;
};

UserSchema.methods.verifyEmail = function () {
  this.isVerified = true;
  this.verificationToken = undefined;
};

module.exports = mongoose.model('User', UserSchema);
