[![codecov](https://codecov.io/github/loloDawit/next-auth/graph/badge.svg?token=Y7EAXRH8MY)](https://codecov.io/github/loloDawit/next-auth)

# Next.js 14 Authentication and Role-Based Access Control Project

This project is built using the latest features of Next.js 14, incorporating Tailwind CSS, ShadcnUI, NextAuth v5, Prisma, Resend, and Neon. It provides a robust authentication system and role-based access control to manage different levels of user access.

## Key Features

### Authentication

- 🔐 **Next-auth v5 (Auth.js):** Integrated for authentication.
- 🔑 **Credentials Provider:** For custom login systems.
- 🌐 **OAuth Provider:** Social login with Google & GitHub.
- 🔒 **Forgot password functionality:** Allows users to recover their accounts.
- ✉️ **Email verification:** Ensures user email authenticity.
- 📱 **Two-factor verification (2FA):** Adds an extra layer of security.

### User Management

- 👥 **User roles (Admin & User):** Different access levels for different users.
- 🔓 **Login component:** Can be opened in a redirect or modal.
- 📝 **Register component:** For new users to create an account.
- 🤔 **Forgot password component:** For account recovery.
- ✅ **Verification component:** For email and 2FA verification.
- ⚠️ **Error component:** To display authentication and other errors.
- 🔘 **Login button:** For initiating the login process.
- 🚪 **Logout button:** For users to sign out.
- 🔍 **Exploring Next.js middleware:** For advanced routing and server-side logic.

### Role-Based Access

- 🚧 **Role Gate:** To restrict content based on user roles.
- 🛡️ **Protect API Routes for admins only:** Ensures only admins can access certain APIs.
- 🔐 **Protect Server Actions for admins only:** Restricts server actions to admins.
- 👑 **Render content for admins using RoleGate component:** For admin-specific content.

### Utilities and Hooks

- 👤 **useCurrentUser hook:** To fetch the current user's data.
- 🛂 **useRole hook:** To determine the user's role.
- 🧑 **currentUser utility:** For accessing current user information.
- 👮 **currentRole utility:** For accessing the current user's role.

### Examples

- 🖥️ **Example with server component:** Demonstrates server-side components.
- 💻 **Example with client component:** Demonstrates client-side components.

### Settings

- 📧 **Change email with new verification in Settings page:** Allows users to update their email.
- 🔑 **Change password with old password confirmation in Settings page:** For secure password updates.
- 🔔 **Enable/disable two-factor auth in Settings page:** User control over 2FA.
- 🔄 **Change user role in Settings page (for development purposes only):** Allows role changes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
