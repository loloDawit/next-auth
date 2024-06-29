import * as z from 'zod';

const passwordComplexityRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]).{8,}$/;

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
});

export const TwoFactorSchema = z.object({
  code: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
});

export const ForgotPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
    if (!passwordComplexityRegex.test(password)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message:
          'Password must be 8+ characters, include upper, lower, number, and special characters',
      });
    }
  });

export const RegisterSchema = z
  .object({
    email: z.string().trim().email({
      message: 'Please enter a valid email address',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters',
    }),
    name: z.string().trim().min(2, { message: 'Name must be more than 1 character' }),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    if (!passwordComplexityRegex.test(password)) {
      checkPassComplexity.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message:
          'Password must be 8+ characters, include upper, lower, number, and special characters',
      });
    }
  });
