'use server';

import { getVerificationTokenByToken } from '@/data/verification-token';
import { getUserByEmail } from '@/data/user';
import { db } from '@/lib/db';
import { getPasswordResetTokenByToken } from '@/data/password-reset-token';
import { ForgotPasswordSchema } from '@/schemas';
import { hash } from 'bcrypt';

export const newVerificationToken = async (token: string) => {
  const verificationToken = await getVerificationTokenByToken(token);
  if (!verificationToken) {
    return { error: 'Invalid token' };
  }

  // check if token is expired
  if (new Date() > verificationToken.expiresAt) {
    return { error: 'Token has expired' };
  }

  const user = await getUserByEmail(verificationToken.email);
  if (!user) {
    return { error: 'User not found' };
  }

  // Update user emailVerified status
  await db.user.update({
    where: { id: user.id },
    // Update the user's emailVerified status
    // to the current date and time
    // also update the email address
    // to the one in the verification token - useful if the user has changed their email address
    // instead of creating a new user account, we will create a new verification token and use the new email address
    data: { emailVerified: new Date(), email: verificationToken.email },
  });

  // Delete verification token
  await db.verificationToken.delete({ where: { token } });

  return { success: 'Your email has been successfully verified.' };
};

export const verifyPasswordResetToken = async (token: string) => {
  const verificationToken = await getPasswordResetTokenByToken(token);
  if (!verificationToken) {
    return { error: 'Invalid token' };
  }

  // check if token is expired
  if (new Date() > verificationToken.expiresAt) {
    return { error: 'Token has expired' };
  }

  const user = await getUserByEmail(verificationToken.email);
  if (!user) {
    return { error: 'User not found' };
  }

  return { success: 'Your email has been successfully verified.', status: true };
};

export const resetPasswordUsingTokenVerification = async (data: object, token: string) => {
  const validatedData = ForgotPasswordSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'invalid data' };
  }

  const passwordResetToken = await getPasswordResetTokenByToken(token);
  if (!passwordResetToken) {
    return { error: 'Invalid token' };
  }

  // check if token is expired
  if (new Date() > passwordResetToken.expiresAt) {
    return { error: 'Token has expired' };
  }

  const user = await getUserByEmail(passwordResetToken.email);
  if (!user) {
    return { error: 'User not found' };
  }

  // Update user emailVerified status
  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      email: passwordResetToken.email,
      password: await hash(validatedData.data.password, 10),
    },
  });

  // Delete verification token
  await db.passwordResetToken.delete({ where: { token } });

  return { success: 'Your password has been successfully reset.', status: true };
};
