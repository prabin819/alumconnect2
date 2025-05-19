const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // If the error is not an instance of ApiError, wrap it
  if (!(err instanceof ApiError)) {
    err = new ApiError(statusCode, message, [err.message]);
  }

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    data: err.data || null,
    message: err.message,
    success: err.success,
    errors: err.errors || [],
  });
};

module.exports = errorHandler;
