const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User.model');

exports.ensureVerified = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user.isVerified) {
    throw new ApiError(401, 'Please verify your email to access this route');
  }

  next();
});
