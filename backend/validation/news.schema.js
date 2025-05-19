// const { z } = require('zod');

// const createdBySchema = z.object({
//   id: z.string().regex(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId
//   userType: z.enum(['alumni', 'student']),
//   name: z.string().min(1),
// });

// const likeSchema = z.object({
//   userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
//   addedAt: z.date().optional(),
// });

// const commentSchema = z.object({
//   userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
//   userType: z.enum(['alumni', 'student']),
//   name: z.string().optional(),
//   text: z.string().min(1),
//   createdAt: z.date().optional(),
// });

// const newsSchema = z.object({
//   title: z.string().min(1).trim(),
//   content: z.string().min(1),
//   summary: z.string().max(300),
//   imageUrl: z.string().url().optional().or(z.literal('')),
//   tags: z.array(z.string().trim()).optional(),
//   category: z.enum(['academic', 'career', 'announcement', 'achievement', 'general']).optional(),
//   createdBy: createdBySchema,
//   isPublished: z.boolean().optional().default(true),
//   viewCount: z.number().int().nonnegative().optional().default(0),
//   likes: z.array(likeSchema).optional(),
//   comments: z.array(commentSchema).optional(),
// });

// module.exports = newsSchema;

const { z } = require('zod');
const mongoose = require('mongoose');

// Helper schemas with error messages
const titleSchema = z
  .string({
    required_error: 'News title is required',
    invalid_type_error: 'Title must be a string',
  })
  .trim()
  .min(5, 'Title must be at least 5 characters long')
  .max(200, 'Title cannot exceed 200 characters');

const contentSchema = z
  .string({
    required_error: 'News content is required',
    invalid_type_error: 'Content must be a string',
  })
  .min(50, 'Content must be at least 50 characters long')
  .max(10000, 'Content cannot exceed 10,000 characters');

const summarySchema = z
  .string({
    required_error: 'News summary is required',
    invalid_type_error: 'Summary must be a string',
  })
  .max(300, 'Summary cannot exceed 300 characters');

const imageUrlSchema = z
  .string({
    invalid_type_error: 'Image URL must be a string',
  })
  .url('Image must be a valid URL')
  .or(z.literal(''))
  .default('');

const tagSchema = z
  .string({
    invalid_type_error: 'Tag must be a string',
  })
  .trim()
  .min(2, 'Tag must be at least 2 characters long')
  .max(30, 'Tag cannot exceed 30 characters');

const categorySchema = z
  .enum(['academic', 'career', 'announcement', 'achievement', 'general'], {
    invalid_type_error:
      'Category must be one of: academic, career, announcement, achievement, or general',
  })
  .default('general');

const creatorSchema = z
  .object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid creator ID'),
    userType: z.enum(['alumni', 'student'], {
      required_error: 'Creator type is required',
      invalid_type_error: 'Creator type must be either alumni or student',
    }),
    name: z
      .string({
        required_error: 'Creator name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(2, 'Name must be at least 2 characters long')
      .max(100, 'Name cannot exceed 100 characters'),
  })
  .strict();

const likeSchema = z
  .object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid user ID'),
    addedAt: z.date().default(() => new Date()),
  })
  .strict();

const commentRefSchema = z
  .object({
    commentId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid comment ID'),
  })
  .strict();

// Base news schema
const newsSchema = z
  .object({
    title: titleSchema,
    content: contentSchema,
    summary: summarySchema,
    imageUrl: imageUrlSchema,
    tags: z.array(tagSchema).default([]),
    category: categorySchema,
    createdBy: creatorSchema.optional(),
    isPublished: z
      .preprocess(
        (val) => {
          if (val === undefined || val === null) return undefined; // allow default
          if (val === 'true' || val === true || val === '1' || val === 1) return true;
          if (val === 'false' || val === false || val === '0' || val === 0) return false;
          return val;
        },
        z.boolean({
          invalid_type_error: 'isActive must be a boolean',
        })
      )
      .default(true),
    viewCount: z
      .number({
        invalid_type_error: 'View count must be a number',
      })
      .int('View count must be an integer')
      .min(0, 'View count cannot be negative')
      .default(0),
    likes: z.array(likeSchema).default([]),
    comments: z.array(commentRefSchema).default([]),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict('Unknown field detected in news data');

// Schema for creating news
const createNewsSchema = newsSchema
  .pick({
    title: true,
    content: true,
    summary: true,
  })
  .extend({
    createdBy: creatorSchema.optional(),
    imageUrl: imageUrlSchema.optional(),
    tags: z.array(tagSchema).optional(),
    category: categorySchema.optional(),
    isPublished: z
      .preprocess(
        (val) => {
          if (val === undefined || val === null) return undefined; // allow default
          if (val === 'true' || val === true || val === '1' || val === 1) return true;
          if (val === 'false' || val === false || val === '0' || val === 0) return false;
          return val;
        },
        z.boolean({
          invalid_type_error: 'isActive must be a boolean',
        })
      )
      .default(true),
  });

// Schema for updating news
const updateNewsSchema = newsSchema
  .partial()
  .omit({
    createdBy: true,
    viewCount: true,
    likes: true,
    comments: true,
    createdAt: true,
    updatedAt: true,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// Schema for liking/unliking news
const likeNewsSchema = z
  .object({
    newsId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid news ID'),
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid user ID'),
  })
  .strict();

module.exports = {
  newsSchema,
  createNewsSchema,
  updateNewsSchema,
  likeNewsSchema,
  titleSchema,
  contentSchema,
  summarySchema,
  imageUrlSchema,
  tagSchema,
  categorySchema,
  creatorSchema,
  likeSchema,
  commentRefSchema,
};
