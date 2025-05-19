const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { imageUpload } = require('../middleware/multer');

// // // /**
// // //  * @swagger
// // //  * components:
// // //  *   schemas:
// // //  *     $ref: './schemas/news.schemas.yaml'
// // //  *
// // //  * /api/v1/news:
// // //  *   get:
// // //  *     tags: [News]
// // //  *     summary: Get all published news articles
// // //  *     parameters:
// // //  *       - $ref: '#/components/schemas/NewsQueryParams/properties/search'
// // //  *       - $ref: '#/components/schemas/NewsQueryParams/properties/category'
// // //  *       - $ref: '#/components/schemas/NewsQueryParams/properties/sortBy'
// // //  *     responses:
// // //  *       200:
// // //  *         description: List of news articles
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               $ref: "#/components/schemas/NewsListResponse"
// // //  */

/**
 * @swagger
 * /api/v1/news:
 *   get:
 *     summary: Get all published news articles
 *     description: Retrieve a list of published news articles with filtering and sorting options
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search text in title, content, or tags
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [academic, career, announcement, achievement, general]
 *         description: Filter by news category
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [latest, popular]
 *         description: |
 *           Sort results by:
 *           - latest (newest first)
 *           - popular (most viewed first)
 *     responses:
 *       200:
 *         description: List of news articles retrieved successfully
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
 *                     $ref: '#/components/schemas/News'
 *                 message:
 *                   type: string
 *                   example: "News fetched successfully"
 *       404:
 *         description: No news articles found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *             example:
 *               statusCode: 404
 *               message: "No news found"
 *               success: false
 */
router.get('/', newsController.getAllNews);
/**
 * @swagger
 * /api/v1/news/{id}:
 *   get:
 *     tags: [News]
 *     summary: Get single news article by ID
 *     description: |
 *       - Returns full details of a news article
 *       - Automatically increments view count
 *       - Includes populated comments and creator info
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the news article
 *         example: "65a1f2b3c4d5e6f7g8h9i0j"
 *     responses:
 *       200:
 *         description: News article details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NewsDetailResponse"
 *             examples:
 *               academicNews:
 *                 value:
 *                   _id: "65a1f2b3c4d5e6f7g8h9i0j"
 *                   title: "New Scholarship Program"
 *                   content: "Full details about the scholarship..."
 *                   viewCount: 151
 *                   comments:
 *                     - text: "How do I apply for this?"
 *                       name: "Student User"
 *                       userType: "student"
 *                   createdBy:
 *                     name: "Admin User"
 *                     userType: "admin"
 *       404:
 *         description: News article not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *         examples:
 *           notFound:
 *             value:
 *               statusCode: 404
 *               message: "News not found"
 */
router.get('/:id', newsController.getNewsByNewsId);
/**
 * @swagger
 * /api/v1/news/user/{userId}:
 *   get:
 *     tags: [News]
 *     summary: Get news articles by user ID
 *     description: |
 *       - Returns all news articles created by a specific user
 *       - Includes basic article info without view count increment
 *       - Populates creator details
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the user
 *         example: "65a1f2b3c4d5e6f7g8h9i0k"
 *     responses:
 *       200:
 *         description: List of user's news articles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserNewsResponse"
 *             examples:
 *               userNews:
 *                 value:
 *                   - _id: "65a1f2b3c4d5e6f7g8h9i0j"
 *                     title: "My First Article"
 *                     category: "general"
 *                     createdBy:
 *                       name: "John Doe"
 *                       userType: "alumni"
 *       404:
 *         description: No news found for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/user/:userId', newsController.getNewsByUserId);
/**
 * @swagger
 * /api/v1/news:
 *   post:
 *     tags: [News]
 *     summary: Create a new news article
 *     description: |
 *       - Requires authentication
 *       - Validates input with Zod schema
 *       - Automatically sets creator info from JWT
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateNewsRequest"
 *           examples:
 *             sampleNews:
 *               value:
 *                 title: "New Scholarship Program"
 *                 content: "Full details about the new scholarship..."
 *                 summary: "University announces new scholarship opportunities"
 *                 tags: ["academic", "scholarship"]
 *                 category: "academic"
 *     responses:
 *       201:
 *         description: News article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CreateNewsResponse"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               validationError:
 *                 value:
 *                   statusCode: 400
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "title"
 *                       message: "Title must be at least 5 characters"
 *       401:
 *         description: Unauthorized (missing or invalid token)
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
 */
router.post('/', authMiddleware, imageUpload.single('image'), newsController.createNews);
/**
 * @swagger
 * /api/v1/news/{id}:
 *   put:
 *     tags: [News]
 *     summary: Update a news article
 *     description: |
 *       - Requires authentication
 *       - Only the original creator can update
 *       - Validates input with Zod schema
 *       - Returns updated news without sensitive fields
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the news article
 *         example: "65a1f2b3c4d5e6f7g8h9i0j"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateNewsRequest"
 *           examples:
 *             sampleUpdate:
 *               value:
 *                 title: "Updated Scholarship Info"
 *                 summary: "Revised scholarship application dates"
 *                 isPublished: false
 *     responses:
 *       200:
 *         description: News updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UpdateNewsResponse"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               validationError:
 *                 value:
 *                   statusCode: 400
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "title"
 *                       message: "Title must be at least 5 characters"
 *       403:
 *         description: Forbidden (not the original creator)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               notCreator:
 *                 value:
 *                   statusCode: 403
 *                   message: "Not authorized to update this news"
 *       404:
 *         description: News not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.put('/:id', authMiddleware, imageUpload.single('image'), newsController.updateNews);
/**
 * @swagger
 * /api/v1/news/{id}:
 *   delete:
 *     tags: [News]
 *     summary: Delete a news article
 *     description: |
 *       - Requires authentication
 *       - Only the original creator can delete
 *       - Permanently removes news article
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the news article
 *         example: "65a1f2b3c4d5e6f7g8h9i0j"
 *     responses:
 *       200:
 *         description: News deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteNewsResponse"
 *       403:
 *         description: Forbidden (not the original creator)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               notCreator:
 *                 value:
 *                   statusCode: 403
 *                   message: "Not authorized to delete this news"
 *       404:
 *         description: News not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', authMiddleware, newsController.deleteNews);
/**
 * @swagger
 * /api/v1/news/{id}/like:
 *   post:
 *     tags: [News]
 *     summary: Toggle like on news article
 *     description: |
 *       - Requires authentication
 *       - Toggles like status (like/unlike)
 *       - Returns success message
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the news article
 *         example: "65a1f2b3c4d5e6f7g8h9i0j"
 *     responses:
 *       200:
 *         description: Like status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ToggleLikeResponse"
 *             examples:
 *               liked:
 *                 value:
 *                   statusCode: 200
 *                   message: "News liked successfully"
 *                   success: true
 *               unliked:
 *                 value:
 *                   statusCode: 200
 *                   message: "News unliked successfully"
 *                   success: true
 *       404:
 *         description: News not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/:id/like', authMiddleware, newsController.toggleLikeNews);
/**
 * @swagger
 * /api/v1/news/{id}/comment:
 *   post:
 *     tags: [News]
 *     summary: Add comment to news article
 *     description: |
 *       - Requires authentication
 *       - Validates comment text
 *       - Associates comment with user and news article
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectID of the news article
 *         example: "65a1f2b3c4d5e6f7g8h9i0j"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CommentRequest"
 *           examples:
 *             sampleComment:
 *               value:
 *                 text: "Great article, very informative!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CommentResponse"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *             examples:
 *               missingText:
 *                 value:
 *                   statusCode: 400
 *                   message: "Comment text is required"
 *       404:
 *         description: News not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/:id/comment', authMiddleware, newsController.addComment);
/**
 * @swagger
 * /api/v1/news/{newsId}/{commentId}:
 *   delete:
 *     summary: Delete a comment from a news article
 *     description: |
 *       Allows authenticated users to delete their own comments from news articles.
 *       Requires either cookie-based authentication or Bearer token.
 *     tags: [News]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: newsId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the news article containing the comment
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       403:
 *         description: Forbidden - User not authorized to delete this comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 *       404:
 *         description: Not Found - News article or comment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.delete('/:newsId/comment/:commentId', authMiddleware, newsController.deleteComment);

module.exports = router;
