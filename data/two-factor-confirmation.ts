import { db } from '@/lib/db';

export const getTwoFactorConfirmationById = async (id: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId: id },
    });
    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
