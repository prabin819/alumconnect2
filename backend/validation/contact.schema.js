// const { z } = require('zod');

// const contactSchema = z.object({
//   name: z.string().min(1),
//   email: z.string().email(),
//   subject: z.string().min(1),
//   message: z.string().min(1),
//   status: z.enum(['New', 'In Progress', 'Resolved']).optional().default('New'),
//   responded: z.boolean().optional().default(false),
//   response: z.string().optional(),
//   createdAt: z.date().optional(), // Mongoose sets default
// });

// module.exports = contactSchema;

const { z } = require('zod');

// Helper schemas with error messages
const nameSchema = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
  .trim()
  .min(2, 'Name must be at least 2 characters long')
  .max(100, 'Name cannot exceed 100 characters');

const emailSchema = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address');

const subjectSchema = z
  .string({
    required_error: 'Subject is required',
    invalid_type_error: 'Subject must be a string',
  })
  .trim()
  .min(5, 'Subject must be at least 5 characters long')
  .max(200, 'Subject cannot exceed 200 characters');

const messageSchema = z
  .string({
    required_error: 'Message is required',
    invalid_type_error: 'Message must be a string',
  })
  .min(10, 'Message must be at least 10 characters long')
  .max(2000, 'Message cannot exceed 2000 characters');

const statusSchema = z
  .enum(['New', 'In Progress', 'Resolved'], {
    invalid_type_error: 'Status must be one of: New, In Progress, or Resolved',
  })
  .default('New');

const responseSchema = z
  .string({
    invalid_type_error: 'Response must be a string',
  })
  .trim()
  .max(2000, 'Response cannot exceed 2000 characters')
  .optional();

// Base contact schema
const contactSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    subject: subjectSchema,
    message: messageSchema,
    status: statusSchema,
    responded: z.boolean().default(false),
    response: responseSchema,
    createdAt: z.date().default(() => new Date()),
  })
  .strict('Unknown field detected in contact data');

// Schema for submitting a contact form
const submitContactSchema = contactSchema.pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

// Schema for updating contact status
const updateContactStatusSchema = z
  .object({
    status: statusSchema,
    response: responseSchema,
  })
  .refine(
    (data) => {
      // If status is Resolved, response is required
      if (data.status === 'Resolved' && !data.response) {
        return false;
      }
      return true;
    },
    {
      message: 'Response is required when status is Resolved',
      path: ['response'],
    }
  );

module.exports = {
  contactSchema,
  submitContactSchema,
  updateContactStatusSchema,
  nameSchema,
  emailSchema,
  subjectSchema,
  messageSchema,
  statusSchema,
  responseSchema,
};
