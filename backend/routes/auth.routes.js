const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { imageUpload } = require('../middleware/multer');

// Auth routes
// router.post('/signup', authController.signup);

/**
 * @swagger
 * /api/v1/auth/signup/alumni:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new alumni account
 *     description: |
 *       - Validates input using Zod.
 *       - Sends verification email.
 *       - Returns JWT tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AlumniSignupRequest"
 *     responses:
 *       201:
 *         description: Alumni created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AlumniSignupResponse"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=abc123; Path=/; HttpOnly; SameSite=Strict"
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error (e.g., email service down)
 */
router.post('/signup/alumni', authController.signupAlumni);
/**
 * @swagger
 * /api/v1/auth/signup/student:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new student account
 *     description: |
 *       - Validates input using Zod.
 *       - Ensures unique email and studentId.
 *       - Sends verification email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/StudentSignupRequest"
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StudentSignupResponse"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=abc123; Path=/; HttpOnly; SameSite=Strict"
 *       400:
 *         description: |
 *           Possible errors:
 *           - Validation failed (Zod errors)
 *           - Email already exists
 *           - Student ID already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error (e.g., email service failure)
 */
router.post('/signup/student', authController.signupStudent);
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in a user
 *     description: |
 *       - Validates email/password.
 *       - Returns JWT tokens and user details.
 *       - Sets HttpOnly cookies for tokens (secure in production).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict"
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Internal server error
 */
router.post('/login', authController.login);
/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out user and clear tokens
 *     description: |
 *       - Requires valid access token (cookie or Authorization header)
 *       - Removes refreshToken from user document
 *       - Clears HTTP-only cookies
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LogoutResponse"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           missingToken:
 *             value:
 *               statusCode: 401
 *               message: "Unauthorized request"
 *           invalidToken:
 *             value:
 *               statusCode: 401
 *               message: "Invalid access token"
 */
router.post('/logout', authMiddleware, authController.logout);
/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current user details
 *     description: |
 *       - Returns the profile of the authenticated user
 *       - Requires valid access token (cookie or Authorization header)
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CurrentUserResponse"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           missingToken:
 *             value:
 *               statusCode: 401
 *               message: "Unauthorized request"
 *           invalidToken:
 *             value:
 *               statusCode: 401
 *               message: "Invalid access token"
 *       404:
 *         description: User not found (if you enable the commented-out check)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/me', authMiddleware, authController.getCurrentUser);
/**
 * @swagger
 * /api/v1/auth/refreshAccessToken:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh access token
 *     description: |
 *       - Requires valid refresh token (cookie or body)
 *       - Returns new access/refresh tokens
 *       - Updates refresh token in database
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RefreshTokenRequest"
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TokenRefreshResponse"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict"
 *       401:
 *         description: Unauthorized (invalid/missing refresh token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           missingToken:
 *             value:
 *               statusCode: 401
 *               message: "Unauthorized request"
 *           invalidToken:
 *             value:
 *               statusCode: 401
 *               message: "Refresh token is expired or used"
 */
router.post('/refreshAccessToken', authMiddleware, authController.refreshAccessToken);
/**
 * @swagger
 * /api/v1/auth/changeCurrentPassword:
 *   put:
 *     tags: [Authentication]
 *     summary: Change user password
 *     description: |
 *       - Requires valid access token
 *       - Verifies old password
 *       - Updates to new password
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ChangePasswordRequest"
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ChangePasswordResponse"
 *       400:
 *         description: Invalid old password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           invalidPassword:
 *             value:
 *               statusCode: 400
 *               message: "Invalid old password"
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/changeCurrentPassword', authMiddleware, authController.changeCurrentPassword);
// router.put('/updateAccountDetails', authMiddleware, authController.updateAccountDetails);

/**
 * @swagger
 * /api/v1/auth/updateAlumniAccount:
 *   put:
 *     tags: [Alumni]
 *     summary: Update alumni account details
 *     description: |
 *       - Requires authentication
 *       - Accepts multipart form data (profile picture + JSON data)
 *       - Validates input with Zod
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg/png/gif)
 *               data:
 *                 type: string
 *                 format: json
 *                 description: JSON string of update data
 *                 example: |
 *                   {
 *                     "name": "Updated Name",
 *                     "bio": "New bio text",
 *                     "skills": ["New Skill"]
 *                   }
 *     responses:
 *       200:
 *         description: Alumni account updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateAlumniResponse"
 *       400:
 *         description: |
 *           Possible errors:
 *           - Validation failed
 *           - Invalid file type
 *           - Alumni not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put(
  '/updateAlumniAccount',
  authMiddleware,
  imageUpload.single('profilePicture'),
  authController.updateAlumniAccount
);
/**
 * @swagger
 * /api/v1/auth/updateStudentAccount:
 *   put:
 *     tags: [Student]
 *     summary: Update student account details
 *     description: |
 *       - Requires authentication
 *       - Accepts multipart form data (profile picture + JSON data)
 *       - Validates input with Zod
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpeg/png/gif, max 5MB)
 *               data:
 *                 type: string
 *                 format: json
 *                 description: JSON string of update data
 *                 example: |
 *                   {
 *                     "name": "Updated Name",
 *                     "major": "Computer Engineering",
 *                     "interests": ["AI", "Cybersecurity"]
 *                   }
 *     responses:
 *       200:
 *         description: Student account updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateStudentResponse"
 *       400:
 *         description: |
 *           Possible errors:
 *           - Validation failed
 *           - Invalid file type
 *           - Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       413:
 *         description: File too large (max 5MB)
 */
router.put(
  '/updateStudentAccount',
  authMiddleware,
  imageUpload.single('profilePicture'),
  authController.updateStudentAccount
);
/**
 * @swagger
 * /api/v1/auth/changeProfilePic:
 *   put:
 *     tags: [User]
 *     summary: Update user profile picture
 *     description: |
 *       - Requires authentication
 *       - Accepts single image file (jpeg/png/gif)
 *       - Max file size 5MB
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (jpeg, jpg, png, gif)
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProfilePictureUpdateResponse"
 *       400:
 *         description: |
 *           Possible errors:
 *           - No file uploaded
 *           - Invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       413:
 *         description: File too large (max 5MB)
 */
router.put(
  '/changeProfilePic',
  authMiddleware,
  imageUpload.single('profilePicture'),
  authController.changeProfilePic
);
/**
 * @swagger
 * /api/v1/auth/deleteProfilePic:
 *   delete:
 *     tags: [User]
 *     summary: Delete user profile picture
 *     description: |
 *       - Requires authentication
 *       - Removes profile picture from filesystem
 *       - Clears profile picture reference in database
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile picture deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteProfilePictureResponse"
 *       400:
 *         description: No profile picture exists to delete
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           noPicture:
 *             value:
 *               statusCode: 400
 *               message: "No profile picture to delete"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Failed to delete file from server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/deleteProfilePic', authMiddleware, authController.deleteProfilePic);
/**
 * @swagger
 * /api/v1/auth/deleteUser/{id}:
 *   delete:
 *     tags: [User]
 *     summary: Delete user account
 *     description: |
 *       - Requires authentication
 *       - Only allows users to delete their own account
 *       - Permanently removes user data
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete (must match authenticated user)
 *     responses:
 *       204:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteUserResponse"
 *       400:
 *         description: Invalid user ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           invalidId:
 *             value:
 *               statusCode: 400
 *               message: "Invalid User ID"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden (attempt to delete another user)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           notOwner:
 *             value:
 *               statusCode: 403
 *               message: "Not authorized to delete this user"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/deleteUser/:id', authMiddleware, authController.deleteUser);
// router.delete('/deleteUser', authMiddleware, authController.deleteUser);

/**
 * @swagger
 * /api/v1/auth/forgotPassword:
 *   post:
 *     tags: [Authentication]
 *     summary: Request password reset
 *     description: |
 *       - Generates password reset token
 *       - Sends reset instructions to user's email
 *       - Token expires after 10 minutes (configurable)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ForgotPasswordRequest"
 *     responses:
 *       200:
 *         description: Password reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ForgotPasswordResponse"
 *       404:
 *         description: No user found with this email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           notFound:
 *             value:
 *               statusCode: 404
 *               message: "There is no user with that email"
 *       500:
 *         description: Email could not be sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/forgotPassword', authController.forgotPassword);
/**
 * @swagger
 * /api/v1/auth/resetpassword/{resettoken}:
 *   post:
 *     tags: [Authentication]
 *     summary: Reset user password
 *     description: |
 *       - Validates password reset token
 *       - Updates password and clears token
 *       - Returns new JWT tokens
 *       - Token expires after use
 *     parameters:
 *       - in: path
 *         name: resettoken
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token from email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ResetPasswordRequest"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResetPasswordResponse"
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: "accessToken=abc123; Path=/; HttpOnly; Secure; SameSite=Strict"
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           invalidToken:
 *             value:
 *               statusCode: 400
 *               message: "Invalid token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/resetpassword/:resettoken', authController.resetPassword);
/**
 * @swagger
 * /api/v1/auth/verify-email/{token}:
 *   get:
 *     tags: [Authentication]
 *     summary: Verify user email
 *     description: |
 *       - Validates email verification token
 *       - Marks user as verified
 *       - One-time use token
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to user's email
 *     responses:
 *       200:
 *         description: Email successfully verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VerifyEmailResponse"
 *       400:
 *         description: Invalid verification token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           invalidToken:
 *             value:
 *               statusCode: 400
 *               message: "Invalid verification token"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/verify-email/:token', authController.verifyEmail);
/**
 * @swagger
 * /api/v1/auth/resend-verification-email:
 *   post:
 *     tags: [Authentication]
 *     summary: Resend email verification
 *     description: |
 *       - Requires authentication
 *       - Generates new verification token
 *       - Sends verification email
 *       - Only works for unverified accounts
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ResendVerificationResponse"
 *       400:
 *         description: Email already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           alreadyVerified:
 *             value:
 *               statusCode: 400
 *               message: "Email already verified"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       500:
 *         description: Email could not be sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/resend-verification-email', authMiddleware, authController.resendVerificationEmail);

module.exports = router;
