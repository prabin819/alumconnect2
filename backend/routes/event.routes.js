const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { imageUpload } = require('../middleware/multer');

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events with filtering options
 *     description: Retrieve a list of events with search, filtering, and sorting capabilities
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text for event title, description, or location
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [networking, workshop, seminar, social, conference, other]
 *         description: Filter events by category
 *       - in: query
 *         name: upcoming
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter for upcoming events (startDate >= current date)
 *       - in: query
 *         name: past
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter for past events (endDate < current date)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [latest, upcoming]
 *         description: |
 *           Sort events by:
 *           - latest (newest created first)
 *           - upcoming (earliest starting first)
 *     responses:
 *       200:
 *         description: Successfully retrieved events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     events:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 *                 message:
 *                   type: string
 *                   example: "Events fetched successfully"
 */
router.get('/', eventController.getAllEvents);
/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get a specific event by ID
 *     description: Retrieve detailed information about a single event including creator and attendee information
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event
 *     responses:
 *       200:
 *         description: Event details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/EventWithDetails'
 *                 message:
 *                   type: string
 *                   example: "Event fetched successfully"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Event not found"
 *               success: false
 */
router.get('/:id', eventController.getEventByEventId);
/**
 * @swagger
 * /api/v1/events/user/{userId}:
 *   get:
 *     summary: Get all events created by a specific user
 *     description: Retrieve a list of events created by a particular user (alumni or student)
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user who created the events
 *     responses:
 *       200:
 *         description: Successfully retrieved user's events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     events:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 *                     count:
 *                       type: integer
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: "Events fetched successfully"
 *       400:
 *         description: Invalid User ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 400
 *               message: "Invalid User ID"
 *               success: false
 */
router.get('/user/:userId', eventController.getEventsByUserId);
/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     description: Create a new event with the provided details. Requires authentication.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - startDate
 *               - endDate
 *               - location
 *               - maxAttendees
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 100
 *                 example: "Annual Alumni Meet"
 *               description:
 *                 type: string
 *                 minLength: 20
 *                 example: "Join us for our yearly alumni gathering with special guests"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-15T18:00:00Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-15T22:00:00Z"
 *               location:
 *                 type: string
 *                 minLength: 3
 *                 example: "Campus Auditorium"
 *               isVirtual:
 *                 type: boolean
 *                 default: false
 *               meetingLink:
 *                 type: string
 *                 format: uri
 *                 example: "https://meet.example.com/alumni-2023"
 *               maxAttendees:
 *                 type: integer
 *                 minimum: 1
 *                 example: 100
 *               category:
 *                 type: string
 *                 enum: [networking, workshop, seminar, social, conference, other]
 *                 example: "social"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Event cover image (JPEG/PNG)
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *                 message:
 *                   type: string
 *                   example: "Event created successfully"
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
 *                     - field: "startDate"
 *                       message: "Start date must be before end date"
 *                       code: "invalid_date"
 *                     - field: "maxAttendees"
 *                       message: "Number must be greater than 0"
 *                       code: "too_small"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (invalid permissions)
 */
router.post('/', authMiddleware, imageUpload.single('imageUrl'), eventController.createEvent);
/**
 * @swagger
 * /api/v1/events/{id}:
 *   put:
 *     summary: Update an existing event
 *     description: Update event details. Only the event creator can modify the event.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventInput'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *                 message:
 *                   type: string
 *                   example: "Event updated successfully"
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
 *                     - field: "endDate"
 *                       message: "End date must be after start date"
 *                       code: "invalid_date"
 *                     - field: "maxAttendees"
 *                       message: "Number must be greater than current attendees"
 *                       code: "too_small"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not the event creator)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 403
 *               message: "Not authorized to update this event"
 *               success: false
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Event not found"
 *               success: false
 */
router.put('/:id', authMiddleware, imageUpload.single('imageUrl'), eventController.updateEvent);
/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Permanently delete an event. Only the event creator can delete the event.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event to delete
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       400:
 *         description: Invalid event ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 400
 *               message: "Invalid event ID"
 *               success: false
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not the event creator)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 403
 *               message: "Not authorized to delete this event"
 *               success: false
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Event not found"
 *               success: false
 */
router.delete('/:id', authMiddleware, eventController.deleteEvent);
/**
 * @swagger
 * /api/v1/events/{id}/book:
 *   post:
 *     summary: Register for an event
 *     description: Register the authenticated user for a specific event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event to register for
 *     responses:
 *       200:
 *         description: Successfully registered for the event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Successfully registered for the event"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               inactiveEvent:
 *                 value:
 *                   statusCode: 400
 *                   message: "This event is no longer active"
 *                   success: false
 *               fullCapacity:
 *                 value:
 *                   statusCode: 400
 *                   message: "Event is at full capacity"
 *                   success: false
 *               alreadyRegistered:
 *                 value:
 *                   statusCode: 400
 *                   message: "You are already registered for this event"
 *                   success: false
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user not authorized to register)
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Event not found"
 *               success: false
 */
router.post('/:id/book', authMiddleware, eventController.bookEvent);
/**
 * @swagger
 * /api/v1/events/{id}/cancel:
 *   delete:
 *     summary: Cancel event registration
 *     description: Allows authenticated users to cancel their registration for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the event to cancel registration from
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Successfully cancelled event registration"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Event not found"
 *               success: false
 */
router.delete('/:id/cancel', authMiddleware, eventController.cancelEventRegistration);

module.exports = router;
