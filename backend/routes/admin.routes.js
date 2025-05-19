const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

/**
 * @swagger
 * /api/v1/admin/messages:
 *   get:
 *     summary: Get all contact messages (Admin only)
 *     description: Retrieve all contact submissions sorted by creation date (newest first)
 *     tags: [Contact]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [New, In Progress, Resolved]
 *         description: Filter messages by status
 *       - in: query
 *         name: responded
 *         schema:
 *           type: boolean
 *         description: Filter by responded status
 *     responses:
 *       200:
 *         description: Successfully retrieved contact messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 *                 message:
 *                   type: string
 *                   example: "Contact messages fetched successfully"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 401
 *               message: "Authentication required"
 *               success: false
 *       403:
 *         description: Forbidden (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 403
 *               message: "Access denied, not authorized for this role"
 *               success: false
 */
router.get(
  '/messages',
  authMiddleware,
  roleMiddleware(['Admin']),
  contactController.getAllContactMessages
);
/**
 * @swagger
 * /api/v1/admin/messages/{id}:
 *   put:
 *     summary: Update contact message status (Admin only)
 *     description: Update the status and/or add a response to a contact message
 *     tags: [Contact]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the contact message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [New, In Progress, Resolved]
 *                 description: New status of the contact message
 *                 example: "In Progress"
 *               response:
 *                 type: string
 *                 description: Admin response to the message
 *                 example: "We're looking into your inquiry"
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Contact message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *                 message:
 *                   type: string
 *                   example: "Contact status updated successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               validationError:
 *                 value:
 *                   statusCode: 400
 *                   message: "Validation failed"
 *                   success: false
 *                   errors:
 *                     - field: "status"
 *                       message: "Invalid status value"
 *                       code: "invalid_enum_value"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not an admin)
 *       404:
 *         description: Contact message not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Contact message not found"
 *               success: false
 */
router.put(
  '/messages/:id',
  authMiddleware,
  roleMiddleware(['Admin']),
  contactController.updateContactStatus
);
/******************************** */

/**
 * @swagger
 * /api/v1/admin/users:
 *   post:
 *     summary: Create a new admin user (Admin only)
 *     description: Create a new user with admin privileges. Requires admin authentication.
 *     tags: [Users]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               validationError:
 *                 value:
 *                   statusCode: 400
 *                   message: "Validation failed"
 *                   success: false
 *                   errors:
 *                     - field: "email"
 *                       message: "Invalid email format"
 *                       code: "invalid_string"
 *                     - field: "password"
 *                       message: "Password must be at least 8 characters"
 *                       code: "too_small"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not an admin)
 */
router.post('/users', authMiddleware, roleMiddleware(['Admin']), userController.createUser);
/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     description: Permanently delete a user account. Requires admin privileges.
 *     tags: [Users]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 204
 *                 data:
 *                   type: object
 *                   example: {}
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 401
 *               message: "Authentication required"
 *               success: false
 *       403:
 *         description: Forbidden (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 403
 *               message: "Access denied, not authorized for this role"
 *               success: false
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "User not found"
 *               success: false
 */
router.delete('/users/:id', authMiddleware, roleMiddleware(['Admin']), userController.deleteUser);
/**
 * @swagger
 * /api/v1/admin/allUsers:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Retrieve a list of all users sorted by userType (Admin first)
 *     tags: [Users]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userType
 *         schema:
 *           type: string
 *           enum: [Admin, Alumni, Student]
 *         description: Filter users by type
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: "Users fetched successfully"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 401
 *               message: "Authentication required"
 *               success: false
 *       403:
 *         description: Forbidden (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 403
 *               message: "Access denied, not authorized for this role"
 *               success: false
 */
router.get('/allUsers', authMiddleware, roleMiddleware(['Admin']), userController.getAllUsers);
/**
 * @swagger
 * /api/v1/admin/user/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     description: Retrieve detailed information about a specific user
 *     tags: [Users]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user to retrieve
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/UserDetails'
 *                 message:
 *                   type: string
 *                   example: "User fetched successfully"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 401
 *               message: "Authentication required"
 *               success: false
 *       403:
 *         description: Forbidden (not an admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 403
 *               message: "Access denied, not authorized for this role"
 *               success: false
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "User not found"
 *               success: false
 */
router.get('/user/:id', authMiddleware, roleMiddleware(['Admin']), userController.getUserById);

module.exports = router;
