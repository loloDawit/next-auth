import * as z from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
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
    const passwordComplexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]).{8,}$/;

    if (!passwordComplexityRegex.test(password)) {
      checkPassComplexity.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message:
          'Password must be 8+ characters, include upper, lower, number, and special characters',
      });
    }
  });
