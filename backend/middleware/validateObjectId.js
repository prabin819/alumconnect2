const mongoose = require('mongoose');
const ApiError = require('../path/to/ApiError');

const validateObjectId =
  (paramName = 'id') =>
  (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return next(new ApiError(400, `Invalid ${paramName}`));
    }
    next();
  };

module.exports = validateObjectId;
