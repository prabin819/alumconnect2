const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const { resumeandcvUpload } = require('../middleware/multer');

/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   get:
 *     summary: Get a job posting by ID
 *     description: Retrieve detailed information about a specific job posting including the creator's profile
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the job posting
 *     responses:
 *       200:
 *         description: Job fetched successfully
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
 *                     job:
 *                       $ref: '#/components/schemas/Job'
 *                 message:
 *                   type: string
 *                   example: "Job fetched successfully"
 *       400:
 *         description: Invalid Job ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 400
 *               message: "Invalid Job ID"
 *               success: false
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Job not found"
 *               success: false
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', jobController.getJobByJobId);
/**
 * @swagger
 * /api/v1/jobs:
 *   get:
 *     summary: Get all active job listings
 *     description: Retrieve a list of active job postings with filtering and sorting options
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text in title, description, company, or location
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company name
 *       - in: query
 *         name: jobType
 *         schema:
 *           type: string
 *           enum: [full-time, part-time, contract, internship]
 *         description: Filter by job type
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [latest, deadline]
 *         description: |
 *           Sort results by:
 *           - latest (newest first)
 *           - deadline (closest deadline first)
 *     responses:
 *       200:
 *         description: List of jobs retrieved successfully
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
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *                 message:
 *                   type: string
 *                   example: "Jobs fetched successfully"
 */
router.get('/', jobController.getAllJobs);
/**
 * @swagger
 * /api/v1/jobs/user/{userId}:
 *   get:
 *     summary: Get all job postings by a specific user
 *     description: Retrieve all job postings created by a particular user (alumni or admin)
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user who created the jobs
 *     responses:
 *       200:
 *         description: Successfully retrieved jobs by user
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
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Job'
 *                     count:
 *                       type: integer
 *                       example: 3
 *                 message:
 *                   type: string
 *                   example: "Jobs fetched successfully"
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
 *       404:
 *         description: No jobs found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "No jobs found for this user"
 *               success: false
 *     security:
 *       - bearerAuth: []
 */
router.get('/user/:userId', jobController.getJobsByUserId);
/**
 * @swagger
 * /api/v1/jobs:
 *   post:
 *     summary: Create a new job posting
 *     description: Allows alumni users to post new job opportunities
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobInput'
 *     responses:
 *       201:
 *         description: Job created successfully
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
 *                     job:
 *                       $ref: '#/components/schemas/Job'
 *                 message:
 *                   type: string
 *                   example: "Job posted successfully"
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
 *                     - field: "title"
 *                       message: "Title is required"
 *                       code: "invalid_type"
 *                     - field: "applicationDeadline"
 *                       message: "Date must be in the future"
 *                       code: "invalid_date"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not alumni)
 */
router.post('/', authMiddleware, roleMiddleware(['Alumni']), jobController.createJob);
/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   put:
 *     summary: Update a job posting
 *     description: Allows the job creator to update their job posting
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the job to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJobInput'
 *     responses:
 *       200:
 *         description: Job updated successfully
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
 *                     job:
 *                       $ref: '#/components/schemas/Job'
 *                 message:
 *                   type: string
 *                   example: "Job updated successfully"
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidJobId:
 *                 value:
 *                   statusCode: 400
 *                   message: "Invalid Job ID"
 *                   success: false
 *               validationError:
 *                 value:
 *                   statusCode: 400
 *                   message: "Validation failed"
 *                   success: false
 *                   errors:
 *                     - field: "applicationDeadline"
 *                       message: "Date must be in the future"
 *                       code: "invalid_date"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not the job creator)
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Job not found"
 *               success: false
 */
router.put('/:id', authMiddleware, jobController.updateJob);
/**
 * @swagger
 * /api/v1/jobs/{id}:
 *   delete:
 *     summary: Delete a job posting
 *     description: Allows the job creator to delete their job posting and removes the reference from their alumni profile
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the job to delete
 *     responses:
 *       200:
 *         description: Job deleted successfully
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
 *                   example: "Job deleted successfully"
 *       400:
 *         description: Invalid Job ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 400
 *               message: "Invalid Job ID"
 *               success: false
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user is not the job creator)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 403
 *               message: "Not authorized to delete this job"
 *               success: false
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Job not found"
 *               success: false
 */
router.delete('/:id', authMiddleware, jobController.deleteJob);
/**
 * @swagger
 * /api/v1/jobs/{id}/apply:
 *   post:
 *     summary: Apply for a job
 *     description: Submit application for a job posting including resume and cover letter
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *         cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the job to apply for
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: PDF or DOCX file (max 5MB)
 *               coverLetter:
 *                 type: string
 *                 format: binary
 *                 description: PDF or DOCX file (max 5MB)
 *     responses:
 *       200:
 *         description: Application submitted successfully
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
 *                     job:
 *                       $ref: '#/components/schemas/Job'
 *                 message:
 *                   type: string
 *                   example: "Application submitted successfully"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             examples:
 *               invalidJobId:
 *                 value:
 *                   statusCode: 400
 *                   message: "Invalid Job ID"
 *                   success: false
 *               alreadyApplied:
 *                 value:
 *                   statusCode: 400
 *                   message: "You have already applied for this job"
 *                   success: false
 *               missingFiles:
 *                 value:
 *                   statusCode: 400
 *                   message: "Both resume and cover letter are required"
 *                   success: false
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (user not authorized to apply)
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "Job not found with id of 507f1f77bcf86cd799439011"
 *               success: false
 */
router.post(
  '/:id/apply',
  authMiddleware,
  resumeandcvUpload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
  ]),
  jobController.applyForJob
);

module.exports = router;
