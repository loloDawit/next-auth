'use server';

import { RegisterSchema } from '@/schemas';
import * as z from 'zod';
import { db } from '@/lib/db';
import { hash } from 'bcrypt';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import sendEmailVerification from '@/lib/send-email/email-verification';

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedData = RegisterSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'invalid data' };
  }

  const { email, password, name } = validatedData.data;
  // check if email already exists
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'email already exists' };
  }

  await db.user.create({
    data: {
      email,
      password: await hash(password, 10),
      name,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  // send verification email
  sendEmailVerification(verificationToken.email, verificationToken.token, 'new-verification');

  return { success: 'Confirmation email sent. Check your inbox' };
};
