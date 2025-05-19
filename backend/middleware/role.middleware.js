const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const roleMiddleware = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Authentication required');
    }

    if (!allowedRoles.includes(req.user.userType)) {
      throw new ApiError(403, 'Access denied, not authorized for this role');
    }

    next();
  });
};

module.exports = roleMiddleware;
