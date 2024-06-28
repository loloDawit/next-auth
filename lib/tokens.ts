import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

/**
 * Generates a verification token for the given email.
 * @param email - The email for which the verification token is generated.
 * @returns A Promise that resolves to the generated verification token.
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  // token expiration is 1 hour
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  const hasExistingToken = await getVerificationTokenByEmail(email);
  if (hasExistingToken) {
    await db.verificationToken.delete({
      where: { id: hasExistingToken.id },
    });
  }
  // genreate new token
  return await db.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
};

/**
 * Generates a password reset token for the given email.
 * If there is an existing token for the email, it will be deleted before generating a new one.
 * @param email - The email for which to generate the password reset token.
 * @returns A Promise that resolves to the newly generated password reset token.
 */
export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  // token expiration is 1 hour
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  const hasExistingToken = await getPasswordResetTokenByEmail(email);
  if (hasExistingToken) {
    await db.passwordResetToken.delete({
      where: { id: hasExistingToken.id },
    });
  }
  // genreate new token
  return await db.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
};

/**
 * Generates a two-factor authentication token for the given email.
 * @param email - The email for which to generate the token.
 * @returns A Promise that resolves to the created two-factor token.
 */
export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100000, 999999).toString();
  // token expiration is 1 hour
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  const hasExistingToken = await getTwoFactorTokenByEmail(email);
  if (hasExistingToken) {
    await db.twoFactorToken.delete({
      where: { id: hasExistingToken.id },
    });
  }

  return await db.twoFactorToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });
};
