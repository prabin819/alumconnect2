// const { z } = require('zod');

// const userSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(8),
//   refreshToken: z.string().optional(),
//   name: z.string().min(1),
//   profilePicture: z.string().url().optional().or(z.literal('')),
//   bio: z.string().max(500).optional().or(z.literal('')),
//   userType: z.enum(['alumni', 'student']),
//   isActive: z.boolean().optional().default(true),
//   lastLogin: z.date().optional(),
//   isVerified: z.boolean().optional().default(false),
//   verificationToken: z.string().optional(),
//   resetPasswordToken: z.string().optional(),
//   resetPasswordExpires: z.date().optional(),
// });

// module.exports = userSchema;

const { z } = require('zod');

// Helper schemas with error messages
const emailSchema = z
  .string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  })
  .trim()
  .toLowerCase()
  .email('Please enter a valid email address');

const passwordSchema = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(8, 'Password must be at least 8 characters long');

const nameSchema = z
  .string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  })
  .trim()
  .min(1, 'Name cannot be empty');

const bioSchema = z
  .string({
    invalid_type_error: 'Bio must be a string',
  })
  .max(500, 'Bio cannot exceed 500 characters')
  .optional();

// const urlSchema = z
//   .union([z.string().url('Profile picture must be a valid URL'), z.literal('')])
//   .optional()
//   .catch('');

// User type enum with error message
const userTypeSchema = z.enum(['Alumni', 'Student', 'Admin'], {
  required_error: 'User type is required',
  invalid_type_error: 'User type must be either Alumni, Student, or Admin',
});

// Base user schema
const userSchema = z
  .object({
    _id: z.string().optional(),
    email: emailSchema,
    password: passwordSchema,
    refreshToken: z.string().optional(),
    name: nameSchema,
    profilePicture: z.string().optional(),
    bio: bioSchema.default(''),
    userType: userTypeSchema,
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
    lastLogin: z
      .date({
        invalid_type_error: 'lastLogin must be a valid date',
      })
      .optional(),
    isVerified: z
      .boolean({
        invalid_type_error: 'isVerified must be a boolean',
      })
      .default(false),
    verificationToken: z.string().optional(),
    resetPasswordToken: z.string().optional(),
    resetPasswordExpires: z
      .date({
        invalid_type_error: 'resetPasswordExpires must be a valid date',
      })
      .optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .strict('Unknown field detected in user data');

// Schema for creating a new user
const createUserSchema = userSchema
  .pick({
    email: true,
    password: true,
    name: true,
    userType: true,
  })
  .extend({
    profilePicture: z.string().optional(),
    bio: bioSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.userType === 'Admin') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Admin accounts can only be created by existing admins',
        path: ['userType'],
      });
    }
  });

// Schema for updating a user
const updateUserSchema = userSchema
  .partial()
  .omit({
    password: true,
    refreshToken: true,
    isVerified: true,
    verificationToken: true,
    resetPasswordToken: true,
    resetPasswordExpires: true,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

// Schema for login
const loginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
  })
  .strict('Unknown field detected in login data');

// Schema for changing password
const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema.refine(
      (val) => val.length >= 8,
      'New password must be at least 8 characters long'
    ),
  })
  .strict('Unknown field detected in password change data')
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// Schema for reset password request
const resetPasswordRequestSchema = z
  .object({
    email: emailSchema,
  })
  .strict('Unknown field detected in password reset request');

// Schema for reset password (with token)
const resetPasswordSchema = z
  .object({
    token: z
      .string({
        required_error: 'Token is required',
        invalid_type_error: 'Token must be a string',
      })
      .min(1, 'Token cannot be empty'),
    newPassword: passwordSchema,
  })
  .strict('Unknown field detected in password reset data');

// Schema for email verification
const verifyEmailSchema = z
  .object({
    token: z
      .string({
        required_error: 'Verification token is required',
        invalid_type_error: 'Token must be a string',
      })
      .min(1, 'Verification token cannot be empty'),
  })
  .strict('Unknown field detected in verification data');

module.exports = {
  userSchema,
  createUserSchema,
  updateUserSchema,
  loginSchema,
  changePasswordSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  verifyEmailSchema,
};
