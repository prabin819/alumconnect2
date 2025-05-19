// const { z } = require('zod');
// const { userSchema } = require('./user.schema');

// const studentSchema = z.object({
//   enrollmentYear: z
//     .number()
//     .int()
//     .min(1900)
//     .max(new Date().getFullYear() + 1),
//   expectedGraduationYear: z
//     .number()
//     .int()
//     .min(1900)
//     .max(new Date().getFullYear() + 10),
//   major: z.string().min(1).trim(),
//   studentId: z.string().min(1).trim(),
//   interests: z.array(z.string().trim()).optional(),
// });

// const registerStudentSchema = userSchema
//   .extend({ userType: z.literal('student') }) // lock userType
//   .merge(studentSchema);

// module.exports = { studentSchema, registerStudentSchema };

/************************************************************************************************************* */

// const { z } = require('zod');
// const { userSchema } = require('./user.schema'); // Import base user schema

// // Helper schemas with error messages
// const yearSchema = z
//   .number({
//     required_error: 'Year is required',
//     invalid_type_error: 'Year must be a number',
//   })
//   .int('Year must be an integer')
//   .min(2000, 'Year must be 2000 or later')
//   .max(new Date().getFullYear() + 6, 'Year cannot be more than 6 years in the future');

// const enrollmentYearSchema = yearSchema.refine(
//   (year) => year <= new Date().getFullYear(),
//   'Enrollment year cannot be in the future'
// );

// const graduationYearSchema = yearSchema.refine(
//   (year) => year >= new Date().getFullYear(),
//   'Graduation year must be in the future or current year'
// );

// const majorSchema = z
//   .string({
//     required_error: 'Major is required',
//     invalid_type_error: 'Major must be a string',
//   })
//   .trim()
//   .min(2, 'Major must be at least 2 characters long')
//   .max(100, 'Major cannot exceed 100 characters');

// const studentIdSchema = z
//   .string({
//     required_error: 'Student ID is required',
//     invalid_type_error: 'Student ID must be a string',
//   })
//   .trim()
//   .min(3, 'Student ID must be at least 3 characters long')
//   .max(20, 'Student ID cannot exceed 20 characters')
//   .regex(
//     /^[A-Za-z0-9\-_]+$/,
//     'Student ID can only contain letters, numbers, hyphens, and underscores'
//   );

// const interestSchema = z
//   .string({
//     invalid_type_error: 'Interest must be a string',
//   })
//   .trim()
//   .min(2, 'Interest must be at least 2 characters long')
//   .max(50, 'Interest cannot exceed 50 characters');

// // Base student schema
// const studentSchema = userSchema
//   .extend({
//     enrollmentYear: enrollmentYearSchema,
//     expectedGraduationYear: graduationYearSchema,
//     major: majorSchema,
//     studentId: studentIdSchema,
//     interests: z.array(interestSchema).default([]),
//   })
//   .strict('Unknown field detected in student data')
//   .refine((data) => data.expectedGraduationYear > data.enrollmentYear, {
//     message: 'Graduation year must be after enrollment year',
//     path: ['expectedGraduationYear'],
//   });

// // Schema for creating a new student
// const createStudentSchema = studentSchema
//   .pick({
//     email: true,
//     password: true,
//     name: true,
//     enrollmentYear: true,
//     expectedGraduationYear: true,
//     major: true,
//     studentId: true,
//   })
//   .extend({
//     profilePicture: z.string().optional(),
//     bio: z.string().max(500).optional(),
//     interests: z.array(interestSchema).optional(),
//   });

// // Schema for updating student profile
// const updateStudentSchema = studentSchema
//   .partial()
//   .omit({
//     password: true,
//     refreshToken: true,
//     isVerified: true,
//     verificationToken: true,
//     resetPasswordToken: true,
//     resetPasswordExpires: true,
//     email: true, // Typically don't allow email changes
//     userType: true, // Don't allow changing user type
//     studentId: true, // Student ID should typically not change
//   })
//   .refine((data) => Object.keys(data).length > 0, {
//     message: 'At least one field must be provided for update',
//   });

// module.exports = {
//   studentSchema,
//   createStudentSchema,
//   updateStudentSchema,
//   enrollmentYearSchema,
//   graduationYearSchema,
//   majorSchema,
//   studentIdSchema,
//   interestSchema,
// };

/************************************************************************************************************* */

const { z } = require('zod');
const { userSchema } = require('./user.schema'); // Import base user schema

// Helper schemas with error messages
const yearSchema = z.coerce
  .number({
    required_error: 'Year is required',
    invalid_type_error: 'Year must be a number',
  })
  .int('Year must be an integer')
  .min(2000, 'Year must be 2000 or later')
  .max(new Date().getFullYear() + 6, 'Year cannot be more than 6 years in the future');

const enrollmentYearSchema = yearSchema.refine(
  (year) => year <= new Date().getFullYear(),
  'Enrollment year cannot be in the future'
);

const graduationYearSchema = yearSchema.refine(
  (year) => year >= new Date().getFullYear(),
  'Graduation year must be in the future or current year'
);

const majorSchema = z
  .string({
    required_error: 'Major is required',
    invalid_type_error: 'Major must be a string',
  })
  .trim()
  .min(2, 'Major must be at least 2 characters long')
  .max(100, 'Major cannot exceed 100 characters');

const studentIdSchema = z
  .string({
    required_error: 'Student ID is required',
    invalid_type_error: 'Student ID must be a string',
  })
  .trim()
  .min(3, 'Student ID must be at least 3 characters long')
  .max(20, 'Student ID cannot exceed 20 characters')
  .regex(
    /^[A-Za-z0-9\-_]+$/,
    'Student ID can only contain letters, numbers, hyphens, and underscores'
  );

const interestSchema = z
  .string({
    invalid_type_error: 'Interest must be a string',
  })
  .trim()
  .min(2, 'Interest must be at least 2 characters long')
  .max(50, 'Interest cannot exceed 50 characters');

// Base student schema (unchanged)
const studentSchema = userSchema
  .extend({
    enrollmentYear: enrollmentYearSchema,
    expectedGraduationYear: graduationYearSchema,
    major: majorSchema,
    studentId: studentIdSchema,
    interests: z.array(interestSchema).default([]),
  })
  .strict('Unknown field detected in student data')
  .refine((data) => data.expectedGraduationYear > data.enrollmentYear, {
    message: 'Graduation year must be after enrollment year',
    path: ['expectedGraduationYear'],
  });

// Schema for creating a new student - FIXED VERSION
const createStudentSchema = z
  .object({
    email: userSchema.shape.email,
    password: userSchema.shape.password,
    name: userSchema.shape.name,
    enrollmentYear: enrollmentYearSchema,
    expectedGraduationYear: graduationYearSchema,
    major: majorSchema,
    studentId: studentIdSchema,
  })
  .extend({
    profilePicture: z.string().optional(),
    bio: z.string().max(500).optional(),
    interests: z.array(interestSchema).optional(),
  });

// Schema for updating student profile - ALTERNATIVE CLEANER VERSION
const updateStudentSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    bio: z.string().max(500).optional(),
    enrollmentYear: enrollmentYearSchema.optional(),
    expectedGraduationYear: graduationYearSchema.optional(),
    major: majorSchema.optional(),
    interests: z.array(interestSchema).optional(),
    profilePicture: z.string().optional(),
    studentId: studentIdSchema.optional(),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

module.exports = {
  studentSchema,
  createStudentSchema,
  updateStudentSchema,
  enrollmentYearSchema,
  graduationYearSchema,
  majorSchema,
  studentIdSchema,
  interestSchema,
};
