/**
 * @swagger
 * components:
 *   securitySchemes:
 *     CookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: accessToken
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const authMiddleware = asyncHandler(async (req, _, next) => {
  const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized request');
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken -verificationToken -resetPasswordToken'
  );

  if (!user) {
    throw new ApiError(401, 'Invalid access token');
  }

  req.user = user;
  next();
});

module.exports = authMiddleware;
