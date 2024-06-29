'use server';

import { LoginSchema, TwoFactorSchema } from '@/schemas';
import * as z from 'zod';
import { db } from '@/lib/db';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/tokens';
import sendEmailVerification from '@/lib/send-email/email-verification';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getTwoFactorConfirmationById } from '@/data/two-factor-confirmation';

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: 'invalid data' };
  }

  const { email, password } = validatedData.data;
  const user = await getUserByEmail(email);
  if (!user || !user.email || !user.password) {
    return { error: 'Invalid credentials!' };
  }

  if (!user.emailVerified) {
    const verificationToken = await generateVerificationToken(email);
    sendEmailVerification(verificationToken.email, verificationToken.token, 'new-verification');
    return { success: 'New confirmation email sent' };
  }

  if (user.isTwoFactorEnabled && user.email) {
    const twoFactorToken = await generateTwoFactorToken(email);
    sendEmailVerification(twoFactorToken.email, twoFactorToken.token, '', false, true);
    return { success: 'Two-factor authentication email sent', twoFactorTokenSent: true };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: true,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        // case 'OAuthSignin':
        //   return { error: 'OAuthSignin' };
        // case 'OAuthCallback':
        //   return { error: 'OAuthCallback' };
        // case 'OAuthCreateAccount':
        //   return { error: 'OAuthCreateAccount' };
        // case 'EmailCreateAccount':
        //   return { error: 'EmailCreateAccount' };
        // case 'Callback':
        //   return { error: 'Callback' };
        // case 'OAuthAccountNotLinked':
        //   return { error: 'OAuthAccountNotLinked' };
        // case 'EmailSignin':
        //   return { error: 'EmailSignin' };
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        // case 'Signin':
        //   return { error: 'Signin' };
        // case 'VerificationRequest':
        //   return { error: 'VerificationRequest' };
        // case 'OAuthSigninToken':
        //   return { error: 'OAuthSigninToken' };
        // case 'OAuthSigninCallback':
        //   return { error: 'OAuthSigninCallback' };
        // case 'OAuthCallbackError':
        //   return { error: 'OAuthCallbackError' };
        // case 'OAuthSigninTokenError':
        //   return { error: 'OAuthSigninTokenError' };
        // case 'OAuthSigninCallbackError':
        //   return { error: 'OAuthSigninCallbackError' };
        // case 'OAuthCallbackVerification':
        //   return { error: 'OAuthCallbackVerification' };
        // case 'OAuthCallbackVerificationError':
        //   return { error: 'OAuthCallbackVerificationError' };
        default:
          return { error: 'something went wrong!' };
      }
    }
    throw error;
  }
};

export const verifyOtp = async (
  email: string,
  password: string,
  otp: z.infer<typeof TwoFactorSchema>,
) => {
  const validatedData = TwoFactorSchema.safeParse(otp);

  if (!validatedData.success) {
    return { error: 'invalid data' };
  }

  const user = await getUserByEmail(email);
  if (!user || !user.email || !user.password) {
    return { error: 'Invalid credentials!' };
  }

  const twoFactorToken = await getTwoFactorTokenByEmail(email);
  if (!twoFactorToken || !twoFactorToken.token) {
    return { error: 'Invalid code!' };
  }

  if (twoFactorToken.token !== otp.code) {
    return { error: 'Invalid code!' };
  }

  const twoFactorTokenExpiry = new Date(twoFactorToken.expiresAt) < new Date();

  if (twoFactorTokenExpiry) {
    return { error: 'Code expired!' };
  }

  await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

  const existingTwoFactorConfirmation = await getTwoFactorConfirmationById(user.id);

  if (existingTwoFactorConfirmation) {
    await db.twoFactorConfirmation.delete({ where: { id: existingTwoFactorConfirmation.id } });
  }

  console.log('Creating two factor confirmation', user);

  await db.twoFactorConfirmation.create({
    data: {
      userId: user.id,
    },
  });

  console.log('About to sign in with credentials');

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: true,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'something went wrong!' };
      }
    }
    throw error;
  }
};
