'use server';

import { getUserByEmail } from '@/data/user';
import sendEmailVerification from '@/lib/send-email/email-verification';
import { generatePasswordResetToken } from '@/lib/tokens';
import { ResetPasswordSchema } from '@/schemas';
import * as z from 'zod';

export const resetPassword = async (data: z.infer<typeof ResetPasswordSchema>) => {
  const validatedData = ResetPasswordSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'invalid data' };
  }

  const { email } = validatedData.data;
  const user = await getUserByEmail(email);
  if (!user || !user.email) {
    return { error: 'Invalid credentials!' };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  sendEmailVerification(passwordResetToken.email, passwordResetToken.token, 'reset-password', true);
  return { success: 'New confirmation email sent' };
};
