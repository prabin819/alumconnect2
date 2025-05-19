const User = require('../models/User.model');
const Alumni = require('../models/Alumni.model');
const Student = require('../models/Student.model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const sendEmail = require('../utils/sendEmail');
const { createAlumniSchema, updateAlumniSchema } = require('../validation/alumni.schema');
const { createStudentSchema, updateStudentSchema } = require('../validation/student.schema');
const fs = require('fs');
const path = require('path');

// Register: User
// exports.signup = asyncHandler(async (req, res) => {
//   const { email, password, name, userType } = req.body;

//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     throw new ApiError(400, 'User already exists with this email');
//   }

//   const user = new User({
//     email,
//     password,
//     name,
//     userType,
//   });

//   // Generate verification token
//   const verificationToken = user.generateVerificationToken();
//   await user.save({ validateBeforeSave: false });

//   // Create verification URL
//   const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${verificationToken}`;

//   const message = `Please verify your email by clicking on this link: \n\n ${verificationUrl}`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Email Verification Token',
//       message,
//     });
//   } catch (err) {
//     user.verificationToken = undefined;
//     await user.save({ validateBeforeSave: false });

//     // return next(new ApiError(500, 'Account created but verification Email could not be sent'));
//   }

//   const accessToken = user.generateAccessToken();
//   const refreshToken = user.generateRefreshToken();

//   user.refreshToken = refreshToken;
//   await user.save();

//   const options = {
//     // httpOnly: true,
//     // secure: true,
//     // sameSite: 'strict',
//     // maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
//   }; //only in production

//   return res
//     .status(201)
//     .cookie('accessToken', accessToken, options)
//     .cookie('refreshToken', refreshToken, options)
//     .json(
//       new ApiResponse(
//         201,
//         {
//           accessToken,
//           refreshToken,
//           user: user.filterSafeProperties(),
//         },
//         'User account created successfully. A verification email is sent to verify your email. If you did not receive any email, you can ask to resend Verification Email.'
//       )
//     );
// });

// Register: Alumni
exports.signupAlumni = asyncHandler(async (req, res) => {
  if (typeof req.body.skills === 'string') {
    req.body.skills = req.body.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const result = createAlumniSchema.safeParse(req.body);
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

  // const { email, password, name, graduationYear, degree } = result.data;
  const {
    email,
    password,
    name,
    graduationYear,
    degree,
    bio,
    company,
    position,
    industry,
    linkedIn,
    skills,
  } = result.data;

  // const { email, password, name, graduationYear, degree } = req.body;

  const existingUser = await Alumni.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Alumni already exists with this email');
  }

  const alumni = new Alumni({
    email,
    password,
    name,
    userType: 'Alumni',
    graduationYear,
    degree,
    //isVerified: false,  //(no need to specify, it is false by defalut)
    bio,
    company,
    position,
    industry,
    linkedIn,
    skills,
  });

  // Generate verification token
  const verificationToken = alumni.generateVerificationToken();
  await alumni.save({ validateBeforeSave: false });

  // Create verification URL
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verifyemail/${verificationToken}`;

  const message = `Please verify your email by clicking on this link: \n\n ${verificationUrl}`;

  try {
    await sendEmail({
      email: alumni.email,
      subject: 'Email Verification Token',
      message,
    });
  } catch (err) {
    alumni.verificationToken = undefined;
    await alumni.save({ validateBeforeSave: false });

    // return next(new ApiError(500, 'Account created but verification Email could not be sent'));
  }

  const accessToken = alumni.generateAccessToken();
  const refreshToken = alumni.generateRefreshToken();

  alumni.refreshToken = refreshToken;
  await alumni.save();

  const options = {
    // httpOnly: true,
    // secure: true,
    // sameSite: 'strict',
    // maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  }; //only in production

  return res
    .status(201)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          accessToken,
          refreshToken,
          user: alumni.filterSafeProperties(),
        },
        'Alumni account created successfully. A verification email is sent to verify your email. If you did not receive any email, you can ask to resend Verification Email.'
      )
    );
});

// Register: Student
exports.signupStudent = asyncHandler(async (req, res) => {
  if (typeof req.body.interests === 'string') {
    req.body.interests = req.body.interests
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const result = createStudentSchema.safeParse(req.body);
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

  const {
    email,
    password,
    name,
    enrollmentYear,
    expectedGraduationYear,
    major,
    studentId,
    bio,
    interests,
  } = result.data;

  // const { email, password, name, enrollmentYear, expectedGraduationYear, major, studentId } = req.body;

  const existingUser = await Student.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Student already exists with this email');
  }

  const existingStudent = await Student.findOne({ studentId });
  if (existingStudent) {
    throw new ApiError(400, 'Student ID already exists');
  }

  const student = new Student({
    email,
    password,
    name,
    userType: 'Student',
    enrollmentYear,
    expectedGraduationYear,
    major,
    studentId,
    bio,
    interests,
    //isVerified: false,    //(no need to specify, it is false by defalut)
  });

  // Generate verification token
  const verificationToken = student.generateVerificationToken();
  await student.save({ validateBeforeSave: false });

  // Create verification URL
  const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verificationToken}`;

  const message = `Please verify your email by clicking on this link: \n\n ${verificationUrl}`;

  try {
    await sendEmail({
      email: student.email,
      subject: 'Email Verification Token',
      message,
    });
  } catch (err) {
    student.verificationToken = undefined;
    await student.save({ validateBeforeSave: false });

    // return next(new ApiError(500, 'Account created but Email could not be sent.'));
  }

  const accessToken = student.generateAccessToken();
  const refreshToken = student.generateRefreshToken();

  student.refreshToken = refreshToken;
  await student.save();

  const options = {
    // httpOnly: true,
    // secure: true,
    // sameSite: 'strict',
    // maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  }; //only in production

  return res
    .status(201)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          accessToken,
          refreshToken,
          user: student.filterSafeProperties(),
        },
        'Student account created successfully. A verification email is sent to verify your email. If you did not receive any email, you can ask to resend Verification Email.'
      )
    );
});

// Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select(
    // '-password -refreshToken -verificationToken -resetPasswordToken'
    '-refreshToken -verificationToken -resetPasswordToken'
  );
  if (!user) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(400, 'Invalid credentials');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.lastLogin = Date.now();
  user.refreshToken = refreshToken;
  await user.save();

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
          },
        },
        'Login successful'
      )
    );
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, //this removes the field from the document
      },
    },
    {
      new: true, //The { new: true } option ensures that the updated document is returned, rather than the original document before the update.
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie('accessToken', options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(200, {}, 'User logged out successfully.'));
});

// Get current user
exports.getCurrentUser = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id).select(
  //   '-password -refreshToken -verificationToken -resetPasswordToken'
  // );
  // if (!user) {
  //   throw new ApiError(404, 'User not found');
  // }

  // return res.status(200).json(new ApiResponse(200, { user }, 'User fetched successfully'));

  const user = req.user;
  return res.status(200).json(new ApiResponse(200, { user }, 'current user fetched successfully.'));
});

exports.refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Unauthorized request');
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, 'Refresh token os expired or used');
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(200, { accessToken, refreshToken }, 'Access token refreshed successfully')
      );
  } catch (error) {
    throw new ApiError(401, error?.message || 'Invalid refresh token');
  }
});

exports.changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Invalid old password.');
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully'));
});

// exports.updateAccountDetails = asyncHandler(async (req, res) => {
//   const { name, email, bio, isActive } = req.body;

//   // if (!name || !email) {
//   //   throw new ApiError(400, 'Name and email are required.');
//   // }

//   const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     {
//       $set: {
//         fullName,
//         email,
//         bio,
//         isActive,
//       },
//     },
//     { new: true, runValidators: true }
//   ).select('-password -refreshToken -verificationToken -resetPasswordToken');

//   return res.status(200).json(new ApiResponse(200, user, 'Account details updated successfully.'));
// });

// exports.updateProfilePicture = asyncHandler(async (req, res) => {
//   const CoverImageLocalPath = req.file?.path;

//   if (!CoverImageLocalPath) {
//     throw new ApiError(400, 'CoverImage file is missing.');
//   }

//   const coverImage = await uploadOnCloudinary(CoverImageLocalPath);

//   if (!coverImage.url) {
//     throw new ApiError(400, 'Error while uploading CoverImage.');
//   }

//   const user = await User.findByIdAndUpdate(
//     req.user?._id,
//     {
//       $set: {
//         coverImage: coverImage.url,
//       },
//     },
//     { new: true }
//   ).select('-password');

//   return res.status(200).json(new ApiResponse(200, user, 'CoverImage updated successfully'));
// });

exports.changeProfilePic = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  // delete old picture if present
  if (user.profilePicture) {
    const oldPath = path.join(__dirname, '../public', user.profilePicture);
    fs.unlink(oldPath, (err) => {
      if (err) console.error('Failed to delete old profile pic:', err);
    });
  }
  user.profilePicture = req.file?.path.replace(/^public[\\/]/, '');
  await user.save();

  //   const user = await User.findByIdAndUpdate(
  //   req.user?._id,
  //   {
  //     $set: {
  //       coverImage: coverImage.url,
  //     },
  //   },
  //   { new: true }
  // ).select('-password');

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { path: req.file?.path.replace(/^public[\\/]/, '') },
        'Profile picture updated'
      )
    );
});

exports.deleteProfilePic = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!user.profilePicture) {
    throw new ApiError(400, 'No profile picture to delete');
  }

  const filePath = path.join(__dirname, '../public', user.profilePicture);

  // Remove the image from the filesystem
  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Failed to delete profile picture:', err);
      throw new ApiError(500, 'Failed to delete profile picture from server');
    }
  });

  // Remove the reference in the database
  user.profilePicture = undefined;
  await user.save();

  return res.status(200).json(new ApiResponse(200, null, 'Profile picture deleted successfully'));
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, 'Invalid User ID'));
  }
  //const user = User.findById()
  if (req.params.id !== req.user.id) {
    return next(new ApiError(403, 'Not authorized to delete this user.'));
  }
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json(new ApiResponse(204, {}, 'User deleted successfully'));
});

exports.updateAlumniAccount = asyncHandler(async (req, res) => {
  if (typeof req.body.skills === 'string') {
    req.body.skills = req.body.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const result = updateAlumniSchema.safeParse(req.body);
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

  const {
    name,
    bio,
    isActive,
    graduationYear,
    degree,
    company,
    position,
    industry,
    linkedIn,
    skills,
  } = result.data;
  // const { name, bio, isActive, graduationYear, degree, company, position, industry, linkedIn, skills,} = req.body;

  // if (!name || !email) {
  //   throw new ApiError(400, 'Name and email are required.');
  // }
  let user = await Alumni.findById(req.user._id);

  if (!user) {
    throw new ApiError(400, 'No alumni found with the id.');
  }

  user = await Alumni.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,
        bio,
        isActive,
        profilePicture: req.file?.path.replace(/^public[\\/]/, ''),
        graduationYear,
        degree,
        company,
        position,
        industry,
        linkedIn,
        skills,
      },
    },
    { new: true, runValidators: true }
  ).select('-password -refreshToken -verificationToken -resetPasswordToken');

  return res.status(200).json(new ApiResponse(200, user, 'Account details updated successfully.'));

  // let user = await User.findById(req.user._id);
  // if (!user) {
  //   throw new ApiError(400, 'No alumni found with the id.');
  // }

  // // Update fields one by one
  // user.name = name;
  // user.bio = bio;
  // user.isActive = isActive;
  // user.profilePicture = req.file?.path;
  // user.graduationYear = graduationYear;
  // user.degree = degree;
  // user.company = company;
  // user.position = position;
  // user.industry = industry;
  // user.linkedIn = linkedIn;
  // user.skills = skills;

  // await user.save(); // Save the updated user

  // res.status(200).json(new ApiResponse(200, user, 'Account details updated successfully.'));
});

exports.updateStudentAccount = asyncHandler(async (req, res) => {
  if (typeof req.body.interests === 'string') {
    req.body.interests = req.body.interests
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const result = updateStudentSchema.safeParse(req.body);
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

  const {
    name,
    bio,
    isActive,
    enrollmentYear,
    expectedGraduationYear,
    major,
    studentId,
    interests,
  } = result.data;

  // const { name, bio, isActive, enrollmentYear, expectedGraduationYear, major, studentId, interests, = req.body;

  // if (!name || !email) {
  //   throw new ApiError(400, 'Name and email are required.');
  // }
  let user = await Student.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'No student found with the id.');
  }

  user = await Student.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,
        bio,
        isActive,
        profilePicture: req.file?.path.replace(/^public[\\/]/, ''),
        enrollmentYear,
        expectedGraduationYear,
        major,
        studentId,
        interests,
      },
    },
    { new: true, runValidators: true }
  ).select('-password -refreshToken -verificationToken -resetPasswordToken');

  return res.status(200).json(new ApiResponse(200, user, 'Account details updated successfully.'));
});

//********************************************************************************************* */

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError(404, 'There is no user with that email'));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json(new ApiResponse(200, {}, 'Email sent'));
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ApiError(500, 'Email could not be sent'));
  }
});

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError(400, 'Invalid token'));
  }

  // Set new password
  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  //await user.save();

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.lastLogin = Date.now();
  user.refreshToken = refreshToken;
  await user.save();

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
          },
        },
        'Password reset successful'
      )
    );
});

/******************************************************************** */

// @desc    Verify email
// @route   GET /api/v1/auth/verifyemail/:token
// @access  Public
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  // Hash the token from URL
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  // Find user with this token
  const user = await User.findOne({
    verificationToken: hashedToken,
  });

  if (!user) {
    return next(new ApiError(400, 'Invalid verification token'));
  }

  // Verify the user
  user.verifyEmail();
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, 'Email verification successful'));
});

// @desc    Resend verification email
// @route   POST /api/v1/auth/resendverification
// @access  Private
exports.resendVerificationEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.isVerified) {
    throw new ApiError(400, 'Email already verified');
  }

  // Generate new token
  const verificationToken = user.generateVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verifyemail/${verificationToken}`;

  const message = `Please verify your email by clicking on this link: \n\n ${verificationUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Email Verification Token',
      message,
    });

    res.status(200).json(new ApiResponse(200, {}, 'Verification email sent'));
  } catch (err) {
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, 'Email could not be sent');
  }
});
