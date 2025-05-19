const User = require('../models/User.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createUserSchema } = require('../validation/user.schema');

exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().sort({ userType: -1 });
  //res.status(200).json(res.advancedResults);
  const response = new ApiResponse(200, users, 'Users fetched successfully');
  res.status(response.statusCode).json(response);
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  const response = new ApiResponse(200, user, 'User fetched successfully');
  res.status(response.statusCode).json(response);
});

exports.createUser = asyncHandler(async (req, res, next) => {
  const result = createUserSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
      ...(err.minimum && { minimum: err.minimum }),
      ...(err.maximum && { maximum: err.maximum }),
    }));
    throw new ApiError(400, 'Validation failed', errors);
  }

  const { email, password, name } = result.data;
  const userType = 'Admin';
  //const { email, password, name} = req.body;

  // const user = await User.create({ ...req.body, userType: 'Admin' });
  const user = await User.create(email, password, name, userType);

  const response = new ApiResponse(201, user, 'User created successfully');
  res.status(response.statusCode).json(response);
});

// exports.updateUser = asyncHandler(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   const response = new ApiResponse(200, user, 'User updated successfully');
//   res.status(response.statusCode).json(response);
// });

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  const response = new ApiResponse(204, {}, 'User deleted successfully');
  res.status(response.statusCode).json(response); //return not needed as this is the last line of the fn.
});
