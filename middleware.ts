import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from '@/routes';

// Initialize NextAuth
const { auth } = NextAuth(authConfig);

// Middleware function
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  console.log('Middleware - isLoggedIn:', isLoggedIn);
  console.log('Middleware - Pathname:', pathname);

  // Determine route types
  const isAPIAuthRoute = pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthenticationRoute = authRoutes.includes(pathname);

  // Handle API auth routes
  if (isAPIAuthRoute) {
    console.log('API auth route, no redirect needed.');
    return null;
  }

  // Handle authentication routes
  if (isAuthenticationRoute) {
    if (isLoggedIn) {
      console.log('Already logged in, redirecting to default login redirect.');
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    console.log('Authentication route, no redirect needed.');
    return null;
  }

  // Handle public routes
  if (isPublicRoute) {
    console.log('Public route, no redirect needed.');
    return null;
  }

  // Redirect unauthenticated users to login page
  if (!isLoggedIn) {
    console.log('Not logged in, redirecting to login.');
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  console.log('Route allowed, no redirect needed.');
  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
