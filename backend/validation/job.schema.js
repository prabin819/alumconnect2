// const { z } = require('zod');

// const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// const jobApplicationSchema = z.object({
//   applicant: objectId,
//   applicationDate: z.date().optional(),
//   status: z.enum(['Pending', 'Reviewed', 'Rejected', 'Accepted']).optional().default('Pending'),
//   resume: z.string().optional(),
//   coverLetter: z.string().optional(),
// });

// const jobSchema = z.object({
//   title: z.string().trim().min(1),
//   description: z.string().min(1),
//   company: z.string().trim().min(1),
//   location: z.string().trim().min(1),
//   jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']),
//   salary: z.string().optional().default('Not specified'),
//   applicationDeadline: z.coerce.date(),
//   requirements: z.array(z.string().trim()).optional(),
//   applicationLink: z.string().url().optional().or(z.literal('')),
//   applications: z.array(jobApplicationSchema).optional(),
//   createdBy: objectId,
//   isActive: z.boolean().optional().default(true),
// });

// module.exports = jobSchema;

const { z } = require('zod');
const mongoose = require('mongoose');

// Helper schemas with error messages
const titleSchema = z
  .string({
    required_error: 'Job title is required',
    invalid_type_error: 'Job title must be a string',
  })
  .trim()
  .min(3, 'Job title must be at least 3 characters long')
  .max(100, 'Job title cannot exceed 100 characters');

const descriptionSchema = z
  .string({
    required_error: 'Job description is required',
    invalid_type_error: 'Job description must be a string',
  })
  .min(20, 'Job description must be at least 20 characters long')
  .max(5000, 'Job description cannot exceed 5000 characters');

const companySchema = z
  .string({
    required_error: 'Company name is required',
    invalid_type_error: 'Company name must be a string',
  })
  .trim()
  .min(2, 'Company name must be at least 2 characters long')
  .max(100, 'Company name cannot exceed 100 characters');

const locationSchema = z
  .string({
    required_error: 'Job location is required',
    invalid_type_error: 'Job location must be a string',
  })
  .trim()
  .min(2, 'Job location must be at least 2 characters long')
  .max(100, 'Job location cannot exceed 100 characters');

const jobTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship'], {
  required_error: 'Job type is required',
  invalid_type_error: 'Job type must be one of: full-time, part-time, contract, or internship',
});

const salarySchema = z
  .string({
    invalid_type_error: 'Salary must be a string',
  })
  .trim()
  .max(50, 'Salary cannot exceed 50 characters')
  .default('Not specified');

// const applicationDeadlineSchema = z
//   .date({
//     required_error: 'Application deadline is required',
//     invalid_type_error: 'Application deadline must be a valid date',
//   })
//   .min(new Date(), 'Application deadline must be in the future');
const applicationDeadlineSchema = z
  .string()
  .refine(
    (dateString) => {
      // First check if it's a valid date string
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    },
    {
      message: 'Application deadline must be a valid date',
    }
  )
  .refine(
    (dateString) => {
      // Then check if it's in the future
      const date = new Date(dateString);
      const now = new Date();
      return date > now;
    },
    {
      message: 'Application deadline must be in the future',
    }
  )
  .transform((dateString) => new Date(dateString)); // Transform to Date object after validation

const requirementSchema = z
  .string({
    invalid_type_error: 'Requirement must be a string',
  })
  .trim()
  .min(5, 'Requirement must be at least 5 characters long')
  .max(200, 'Requirement cannot exceed 200 characters');

const applicationLinkSchema = z
  .string({
    invalid_type_error: 'Application link must be a string',
  })
  .trim()
  .url('Application link must be a valid URL')
  .optional();

const applicationStatusSchema = z
  .enum(['Pending', 'Reviewed', 'Rejected', 'Accepted'], {
    invalid_type_error: 'Status must be one of: Pending, Reviewed, Rejected, or Accepted',
  })
  .default('Pending');

const applicationSchema = z
  .object({
    applicant: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid applicant ID'),
    applicationDate: z.date().default(() => new Date()),
    status: applicationStatusSchema,
    resume: z.string().optional(),
    coverLetter: z.string().optional(),
  })
  .strict();

// Base job schema
const jobSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    company: companySchema,
    location: locationSchema,
    jobType: jobTypeSchema,
    salary: salarySchema,
    applicationDeadline: applicationDeadlineSchema,
    requirements: z.array(requirementSchema).default([]),
    applicationLink: z.string().optional(),
    applications: z.array(applicationSchema).default([]),
    createdBy: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid creator ID')
      .optional(),
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
  .strict('Unknown field detected in job data');

// Schema for creating a new job
const createJobSchema = jobSchema
  .pick({
    title: true,
    description: true,
    company: true,
    location: true,
    jobType: true,
    applicationDeadline: true,
  })
  .extend({
    createdBy: z.string().optional(),
    salary: salarySchema.optional(),
    requirements: z.array(requirementSchema).optional(),
    applicationLink: applicationLinkSchema.optional(),
  });

// Schema for updating a job
const updateJobSchema = jobSchema
  .partial()
  .omit({
    createdBy: true,
    applications: true,
    //isActive: true,
    createdAt: true,
    updatedAt: true,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// Schema for job application
const jobApplicationSchema = z
  .object({
    jobId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid job ID'),
    applicantId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid applicant ID'),
    resume: z.string().optional(),
    coverLetter: z.string().optional(),
  })
  .strict();

// Schema for updating application status
const updateApplicationStatusSchema = z
  .object({
    jobId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid job ID'),
    applicantId: z
      .string()
      .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid applicant ID'),
    status: applicationStatusSchema,
  })
  .strict();

module.exports = {
  jobSchema,
  createJobSchema,
  updateJobSchema,
  jobApplicationSchema,
  updateApplicationStatusSchema,
  titleSchema,
  descriptionSchema,
  companySchema,
  locationSchema,
  jobTypeSchema,
  salarySchema,
  applicationDeadlineSchema,
  requirementSchema,
  applicationLinkSchema,
  applicationStatusSchema,
};
