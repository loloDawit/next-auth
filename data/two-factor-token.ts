import { db } from '@/lib/db';

/**
 * Retrieves the verification token associated with the given email.
 * @param email - The email address to search for.
 * @returns The verification token object if found, or null if not found or an error occurred.
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};

/**
 * Retrieves the verification token associated with the given token.
 * @param token - The token to search for.
 * @returns The verification token object if found, or null if not found or an error occurred.
 */
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twoFactorToken;
  } catch (error) {
    return null;
  }
};
