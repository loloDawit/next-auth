import { getVerificationTokenByEmail } from '@/data/verification-token';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';

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
