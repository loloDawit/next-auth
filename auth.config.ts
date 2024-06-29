// import GitHub from 'next-auth/providers/github';
import { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';

import { getUserById } from '@/data/user';
import { LoginSchema } from '@/schemas';
import { getUserByEmail } from './data/user';
import { db } from './lib/db';
import { getTwoFactorConfirmationById } from './data/two-factor-confirmation';

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        // Validate credentials using the schema
        const validateFields = LoginSchema.safeParse(credentials);
        if (!validateFields.success) {
          console.error('Validation failed:', validateFields.error);
          return null;
        }

        const { email, password } = validateFields.data;
        console.error('Validated fields:', { email, password });

        // Fetch the user by email
        const existingUser = await getUserByEmail(email);
        console.error('Existing user:', existingUser);

        // Check if the user exists and has a password
        if (!existingUser || !existingUser.password) {
          console.error('User not found or no password set');
          return null;
        }

        // Validate the password using bcrypt
        const verifyPassword = await bcrypt.compare(password, existingUser.password);
        console.error('Password verification result:', verifyPassword);

        if (!verifyPassword) {
          console.error('Password verification failed');
          return null;
        }

        // Return the user object if everything checks out
        return existingUser;
      },
    }),
  ],
  events: {
    async signIn(message) {
      console.log('Sign in event:', message);
    },
    async signOut(message) {
      console.log('Sign out event:', message);
    },
    async createUser(message) {
      console.log('Create user event:', message);
    },
    async updateUser(message) {
      console.log('Update user event:', message);
    },
    async linkAccount({ user }) {
      console.log('Link account event:', user);
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    async session(message) {
      console.log('Session event:', message);
    },
    async error(message) {
      console.log('Error event:', message);
      // Redirect to custom error page
      if (message.error) {
        console.error('Error:', message.error);
      }
    },
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('Sign in callback:', user, account, profile, email, credentials);
      // allow OAuth without email verifications
      if (account?.provider !== 'credentials') {
        return true;
      }

      // prevent sign in if email is not verified
      const existingUser = await getUserById(user?.id ?? '');
      if (!existingUser || !existingUser?.emailVerified) {
        return false;
      }

      // add two factor authentication check
      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationById(existingUser.id);
        if (!twoFactorConfirmation) {
          return false;
        }

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ session, token, user }) {
      console.log('Session callback:', { session, token, user });
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as 'USER' | 'ADMIN';
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      console.log('JWT callback:', { token, user, account, profile });
      if (!token?.sub) return token;
      const existingUser = await getUserById(token?.sub);

      if (existingUser) {
        token.role = existingUser.role;
      }

      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error', // Error redirect page
  },
  debug: true, // Enable debug mode for more detailed logs
} satisfies NextAuthConfig;
