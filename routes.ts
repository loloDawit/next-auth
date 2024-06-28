/**
 * Array of public routes
 * @type {string[]}
 */
export const publicRoutes: string[] = ['/', '/auth/new-verification'];

/**
 * Array of routes that are used for authentication
 * These routes will redirect to the login page if the user is not authenticated
 * @type {string[]}
 */
export const authRoutes: string[] = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset',
  '/auth/reset-password',
];

/**
 * The prefix for the auth API
 * Routes that start with this prefix are considered auth routes
 * @type {string}
 */
export const apiAuthPrefix: string = '/api/auth';

/**
 * The default login redirect
 */
export const DEFAULT_LOGIN_REDIRECT = '/settings';
