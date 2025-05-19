// const { z } = require('zod');
// const { userSchema } = require('./user.schema');

// const alumniSchema = z.object({
//   graduationYear: z.number().int().min(1900).max(new Date().getFullYear()),
//   degree: z.string().min(1),
//   company: z.string().optional().or(z.literal('')),
//   position: z.string().optional().or(z.literal('')),
//   industry: z.string().optional().or(z.literal('')),
//   linkedIn: z.string().url().optional().or(z.literal('')),
//   skills: z.array(z.string().trim()).optional(),
//   jobPostings: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(), // MongoDB ObjectId format
// });

// const registerAlumniSchema = userSchema
//   .extend({ userType: z.literal('alumni') }) // force alumni type
//   .merge(alumniSchema);

// module.exports = { alumniSchema, registerAlumniSchema };

const { z } = require('zod');
const { userSchema } = require('./user.schema'); // Assuming you have the user schema from previous example

// Helper schemas with error messages
const graduationYearSchema = z.coerce
  .number({
    required_error: 'Graduation year is required',
    invalid_type_error: 'Graduation year must be a number',
  })
  .int('Graduation year must be an integer')
  .min(1900, 'Graduation year must be after 1900')
  .max(new Date().getFullYear() + 5, 'Graduation year cannot be more than 5 years in the future');

const degreeSchema = z
  .string({
    required_error: 'Degree is required',
    invalid_type_error: 'Degree must be a string',
  })
  .trim()
  .min(2, 'Degree must be at least 2 characters long')
  .max(100, 'Degree cannot exceed 100 characters');

const companySchema = z
  .string({
    invalid_type_error: 'Company must be a string',
  })
  .trim()
  .max(100, 'Company name cannot exceed 100 characters')
  .default('');

const positionSchema = z
  .string({
    invalid_type_error: 'Position must be a string',
  })
  .trim()
  .max(100, 'Position cannot exceed 100 characters')
  .default('');

const industrySchema = z
  .string({
    invalid_type_error: 'Industry must be a string',
  })
  .trim()
  .max(50, 'Industry cannot exceed 50 characters')
  .default('');

const linkedInSchema = z
  .string({
    invalid_type_error: 'LinkedIn URL must be a string',
  })
  .url('Please enter a valid LinkedIn URL')
  .or(z.literal(''))
  .default('');

const skillSchema = z
  .string({
    invalid_type_error: 'Skill must be a string',
  })
  .trim()
  .min(1, 'Skill cannot be empty')
  .max(50, 'Skill cannot exceed 50 characters');

const jobPostingSchema = z
  .string({
    invalid_type_error: 'Job posting ID must be a string',
  })
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid job posting ID format',
  });

// Base alumni schema
const alumniSchema = userSchema
  .extend({
    graduationYear: graduationYearSchema,
    degree: degreeSchema,
    company: companySchema,
    position: positionSchema,
    industry: industrySchema,
    linkedIn: linkedInSchema,
    skills: z.array(skillSchema).default([]),
    jobPostings: z.array(jobPostingSchema).default([]),
  })
  .strict('Unknown field detected in alumni data');

// Schema for creating a new alumni
const createAlumniSchema = alumniSchema
  .pick({
    email: true,
    password: true,
    name: true,
    graduationYear: true,
    degree: true,
  })
  .extend({
    company: companySchema.optional(),
    position: positionSchema.optional(),
    industry: industrySchema.optional(),
    linkedIn: linkedInSchema.optional(),
    profilePicture: z.string().optional(),
    bio: z.string().max(500).optional(),
    skills: z.array(skillSchema).optional(),
  });

// Schema for updating alumni profile
const updateAlumniSchema = alumniSchema
  .partial()
  .omit({
    password: true,
    refreshToken: true,
    isVerified: true,
    verificationToken: true,
    resetPasswordToken: true,
    resetPasswordExpires: true,
    email: true, // Typically don't allow email changes via profile update
    userType: true, // Don't allow changing user type
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

module.exports = {
  alumniSchema,
  createAlumniSchema,
  updateAlumniSchema,
  graduationYearSchema,
  degreeSchema,
  companySchema,
  positionSchema,
  industrySchema,
  linkedInSchema,
  skillSchema,
  jobPostingSchema,
};
