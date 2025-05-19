// const { z } = require('zod');

// const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// const createdBySchema = z.object({
//   id: objectId,
//   userType: z.enum(['alumni', 'student']),
// });

// const attendeeSchema = z.object({
//   userId: objectId,
//   userType: z.enum(['alumni', 'student']),
//   registeredAt: z.date().optional(), // defaults in Mongoose
// });

// const eventSchema = z.object({
//   title: z.string().trim().min(1),
//   description: z.string().min(1),
//   startDate: z.coerce.date(),
//   endDate: z.coerce.date(),
//   location: z.string().trim().min(1),
//   isVirtual: z.boolean().optional().default(false),
//   meetingLink: z.string().url().optional().or(z.literal('')),
//   maxAttendees: z.number().int().min(1),
//   category: z
//     .enum(['networking', 'workshop', 'seminar', 'social', 'conference', 'other'])
//     .optional()
//     .default('other'),
//   imageUrl: z.string().url().optional().or(z.literal('')),
//   createdBy: createdBySchema,
//   attendees: z.array(attendeeSchema).optional(),
//   isActive: z.boolean().optional().default(true),
// });

// module.exports = eventSchema;

const { z } = require('zod');
const mongoose = require('mongoose');

// Helper schemas with error messages
const titleSchema = z
  .string({
    required_error: 'Event title is required',
    invalid_type_error: 'Title must be a string',
  })
  .trim()
  .min(5, 'Title must be at least 5 characters long')
  .max(200, 'Title cannot exceed 200 characters');

const descriptionSchema = z
  .string({
    required_error: 'Event description is required',
    invalid_type_error: 'Description must be a string',
  })
  .min(20, 'Description must be at least 20 characters long')
  .max(5000, 'Description cannot exceed 5000 characters');

const dateSchema = z.coerce.date({
  required_error: 'Date is required',
  invalid_type_error: 'Must be a valid date',
});

// Define startDate schema without referencing endDate
const startDateSchema = dateSchema.min(new Date(), {
  message: 'Start date must be in the future',
});

// Define a basic endDate schema without referring to startDate
const endDateSchema = dateSchema;

const locationSchema = z
  .string({
    required_error: 'Location is required',
    invalid_type_error: 'Location must be a string',
  })
  .trim()
  .min(2, 'Location must be at least 2 characters long')
  .max(200, 'Location cannot exceed 200 characters');

const meetingLinkSchema = z
  .string({
    invalid_type_error: 'Meeting link must be a string',
  })
  .trim()
  .url('Meeting link must be a valid URL')
  .optional();

const maxAttendeesSchema = z.coerce
  .number({
    required_error: 'Maximum attendees is required',
    invalid_type_error: 'Maximum attendees must be a number',
  })
  .int('Must be an integer')
  .min(1, 'Must have at least 1 attendee')
  .max(10000, 'Cannot exceed 10,000 attendees');

const categorySchema = z
  .enum(['networking', 'workshop', 'seminar', 'social', 'conference', 'other'], {
    invalid_type_error:
      'Category must be one of: networking, workshop, seminar, social, conference, or other',
  })
  .default('other');

const imageUrlSchema = z
  .string({
    invalid_type_error: 'Image URL must be a string',
  })
  .url('Image must be a valid URL')
  .or(z.literal(''))
  .default('');

const creatorSchema = z
  .object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid creator ID'),
    userType: z.enum(['alumni', 'student'], {
      required_error: 'Creator type is required',
      invalid_type_error: 'Creator type must be either alumni or student',
    }),
  })
  .strict();

const attendeeSchema = z
  .object({
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid user ID'),
    userType: z.enum(['alumni', 'student'], {
      required_error: 'Attendee type is required',
      invalid_type_error: 'Attendee type must be either alumni or student',
    }),
    registeredAt: z.date().default(() => new Date()),
  })
  .strict();

// Define the base object schema without refinement first
const baseEventObject = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    startDate: startDateSchema,
    endDate: endDateSchema,
    location: locationSchema,
    isVirtual: z
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
    meetingLink: meetingLinkSchema,
    maxAttendees: maxAttendeesSchema,
    category: categorySchema,
    imageUrl: imageUrlSchema,
    createdBy: creatorSchema.optional(),
    attendees: z.array(attendeeSchema).default([]),
    isActive: z
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
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict('Unknown field detected in event data');

// Base event schema - with date validation added
const eventSchema = baseEventObject.refine((data) => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'], // This path helps identify which field has the issue
});

// Schema for creating an event
const createEventSchema = baseEventObject
  .pick({
    title: true,
    description: true,
    startDate: true,
    endDate: true,
    location: true,
    maxAttendees: true,
    createdBy: true,
    isVirtual: true,
  })
  .extend({
    meetingLink: meetingLinkSchema.optional(),
    category: categorySchema.optional(),
    imageUrl: imageUrlSchema.optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

// Schema for updating an event
const updateEventSchema = baseEventObject
  .partial()
  .omit({
    createdBy: true,
    attendees: true,
    createdAt: true,
    updatedAt: true,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  })
  // Add a conditional refinement for date validation during update
  .refine(
    (data) => {
      // If both dates are provided, check their relationship
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      // If only one date is provided, we can't validate their relationship here
      return true;
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  );

// Schema for event registration
const eventRegistrationSchema = z
  .object({
    eventId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid event ID'),
    userId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid user ID'),
    userType: z.enum(['alumni', 'student'], {
      required_error: 'User type is required',
      invalid_type_error: 'User type must be either alumni or student',
    }),
  })
  .strict();

module.exports = {
  eventSchema,
  createEventSchema,
  updateEventSchema,
  eventRegistrationSchema,
  titleSchema,
  descriptionSchema,
  startDateSchema,
  endDateSchema,
  locationSchema,
  meetingLinkSchema,
  maxAttendeesSchema,
  categorySchema,
  imageUrlSchema,
  creatorSchema,
  attendeeSchema,
};
