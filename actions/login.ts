'use server';

import { LoginSchema } from '@/schemas';
import * as z from 'zod';
import { db } from '@/lib/db';
import { signIn } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import sendEmailVerification from '@/lib/send-email/email-verification';

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  console.log('Validated data:', validatedData);

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
