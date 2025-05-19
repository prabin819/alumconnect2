const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

/**
 * @swagger
 * /api/v1/contacts:
 *   post:
 *     summary: Submit a contact form
 *     description: Create a new contact inquiry message
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Contact message submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/Contact'
 *                 message:
 *                   type: string
 *                   example: "Message sent successfully"
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
 *                     - field: "subject"
 *                       message: "Subject must be at least 5 characters"
 *                       code: "too_small"
 */
router.post('/', contactController.submitContactForm);
/**
 * @swagger
 * /api/v1/contacts/admin:
 *   get:
 *     summary: Get all contact messages (Admin only)
 *     description: Retrieve all contact submissions sorted by creation date (newest first)
 *     tags: [Contact]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
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
  '/admin',
  authMiddleware,
  roleMiddleware(['Admin']),
  contactController.getAllContactMessages
);
/**
 * @swagger
 * /api/v1/contacts/admin/{id}:
 *   put:
 *     summary: Update contact message status (Admin only)
 *     description: Update the status and response of a contact message
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
 *             $ref: '#/components/schemas/UpdateContactStatusInput'
 *     responses:
 *       200:
 *         description: Contact status updated successfully
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
  '/admin/:id',
  authMiddleware,
  roleMiddleware(['Admin']),
  contactController.updateContactStatus
);

module.exports = router;
