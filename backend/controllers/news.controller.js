const News = require('../models/News.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { createNewsSchema, updateNewsSchema } = require('../validation/news.schema');

const getAllNews = asyncHandler(async (req, res, next) => {
  const { search, category, sortBy } = req.query;
  let query = { isPublished: true };

  // Search functionality
  if (search) {
    query.$text = { $search: search };
  }

  // Filter by category
  if (category) {
    query.category = category;
  }

  // Sorting
  let sort = {};
  if (sortBy === 'latest') {
    sort = { createdAt: -1 };
  } else if (sortBy === 'popular') {
    sort = { viewCount: -1 };
  }

  const news = await News.find(query).sort(sort).populate('createdBy.id', 'name');

  if (!news) {
    return next(new ApiError(404, 'No news found'));
  }

  const response = new ApiResponse(200, news, 'News fetched successfully');
  res.status(response.statusCode).json(response);
});

const getNewsByNewsId = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id)
    .populate('createdBy.id', 'name')
    .populate('comments.commentId', 'text name userType createdAt');

  if (!news) {
    return next(new ApiError(404, 'News not found'));
  }

  // Increment view count
  news.viewCount += 1;
  await news.save();

  const response = new ApiResponse(200, news, 'News fetched successfully');
  res.status(response.statusCode).json(response);
});

const getNewsByUserId = asyncHandler(async (req, res, next) => {
  const news = await News.find({ 'createdBy.id': req.params.userId, isPublished: true })
    .populate('createdBy.id', 'name userType')
    .sort({ createdAt: -1 });

  if (!news.length) {
    return next(new ApiError(404, 'No news found for this user'));
  }

  res.status(200).json(new ApiResponse(200, news, 'User news fetched successfully'));
});

const createNews = asyncHandler(async (req, res, next) => {
  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const result = createNewsSchema.safeParse(req.body);
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

  const { title, content, summary, tags, category, isPublished } = result.data;
  // const { title, content, summary, tags, category, isPublished = true } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  const news = new News({
    title,
    content,
    summary,
    imageUrl: req.file?.path.replace(/^public[\\/]/, ''),
    tags,
    category,
    createdBy: {
      id: req.user._id,
      userType: req.user.userType,
      name: user.name,
    },
    isPublished,
  });

  await news.save();

  const response = new ApiResponse(201, news, 'News created successfully');
  res.status(response.statusCode).json(response);
});

const updateNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ApiError(404, 'News not found'));
  }

  // Check if user is the creator
  if (news.createdBy.id.toString() !== req.user._id.toString()) {
    // console.log(req.user.id);
    // console.log(req.user._id);

    return next(new ApiError(403, 'Not authorized to update this news'));
  }

  if (typeof req.body.tags === 'string') {
    req.body.tags = req.body.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const result = updateNewsSchema.safeParse(req.body);
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

  const { title, content, summary, tags, category, isPublished } = result.data;

  // const { title, content, summary, tags, category, isPublished = true } = req.body;

  const updatedNews = await News.findByIdAndUpdate(
    req.params.id,
    {
      title,
      content,
      summary,
      imageUrl: req.file?.path.replace(/^public[\\/]/, ''),
      tags,
      category,
      isPublished,
    },
    { new: true }
  );

  const response = new ApiResponse(200, updatedNews, 'News updated successfully');
  res.status(response.statusCode).json(response);
});

const deleteNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ApiError(404, 'News not found'));
  }

  // Check if user is the creator
  if (news.createdBy.id.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized to delete this news'));
  }

  await News.findByIdAndDelete(req.params.id);

  const response = new ApiResponse(200, null, 'News deleted successfully');
  res.status(response.statusCode).json(response);
});

const toggleLikeNews = asyncHandler(async (req, res, next) => {
  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ApiError(404, 'News not found'));
  }

  // Check if user already liked the news
  const likeIndex = news.likes.findIndex(
    (like) => like.userId.toString() === req.user._id.toString()
  );

  if (likeIndex !== -1) {
    // Remove like
    news.likes.splice(likeIndex, 1);
    await news.save();

    //return new ApiResponse(200, null, 'News unliked successfully').send(res);
    const response = new ApiResponse(200, null, 'News unliked successfully');
    return res.status(response.statusCode).json(response);
  }

  // Add like
  news.likes.push({
    userId: req.user._id,
    addedAt: Date.now(),
  });

  await news.save();

  //new ApiResponse(200, null, 'News liked successfully').send(res);
  const response = new ApiResponse(200, null, 'News liked successfully');
  res.status(response.statusCode).json(response);
});

const addComment = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return next(new ApiError(400, 'Comment text is required'));
  }

  const news = await News.findById(req.params.id);

  if (!news) {
    return next(new ApiError(404, 'News not found'));
  }

  const user = await User.findById(req.user._id);
  // const user = await User.findById(req.user.id);  //this will also work
  //console.log(user);

  const comment = new Comment({
    userId: user._id,
    userType: user.userType,
    name: user.name,
    text,
  });
  await comment.save();

  news.comments.push(comment.id);

  await news.save();

  //return new ApiResponse(res, 201, 'Comment added successfully', news.comments[news.comments.length - 1]);
  const response = new ApiResponse(
    201,
    // news.comments[news.comments.length - 1],
    comment,
    'Comment added successfully'
  );
  res.status(response.statusCode).json(response);
});

const deleteComment = asyncHandler(async (req, res, next) => {
  const { newsId, commentId } = req.params;

  // Find the news article
  const news = await News.findById(newsId);

  if (!news) {
    return next(new ApiError(404, 'News not found'));
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    //console.log(comment);
    return next(new ApiError(404, 'comment not found'));
  }

  if (comment.userId.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, 'Not authorized to delete this comment'));
  }

  // Find the comment to delete
  const commentIndex = news.comments.findIndex((comment) => comment._id.toString() === commentId);
  console.log(commentIndex);
  console.log(news);

  if (commentIndex === -1) {
    return next(new ApiError(404, 'Comment not found, 2'));
  }

  //   // Check if the user is the author of the comment
  //   if (news.comments[commentIndex].userId.toString() !== req.user._id) {
  //     return next(new ApiError(403, 'Not authorized to delete this comment'));
  //   }

  // Remove the comment
  news.comments.splice(commentIndex, 1);

  await news.save();

  return new ApiResponse(res, 200, 'Comment deleted successfully');
});

module.exports = {
  getAllNews,
  getNewsByNewsId,
  getNewsByUserId,
  createNews,
  updateNews,
  deleteNews,
  toggleLikeNews,
  addComment,
  deleteComment,
};
