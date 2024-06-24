import { db } from '@/lib/db';

/**
 * Retrieves the verification token associated with the given email.
 * @param email - The email address to search for.
 * @returns The verification token object if found, or null if not found or an error occurred.
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves the verification token associated with the given token.
 * @param token - The token to search for.
 * @returns The verification token object if found, or null if not found or an error occurred.
 */
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
