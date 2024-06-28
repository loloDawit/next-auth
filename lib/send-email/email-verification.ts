import sendEmail from './send-email';

interface SendEmailResponse {}
/**
 * Sends an email verification email.
 * @param {string} email - The recipient's email address.
 * @param {string} token - The confirmation link or authentication code.
 * @param {string} route - The route to be used in the confirmation link.
 * @param {boolean} [reset=false] - Indicates if the email is for password reset.
 * @param {boolean} [TwoFA=false] - Indicates if the email is for two-factor authentication.
 * @returns {Promise<SendEmailResponse>} - The response from the email service.
 */
async function sendEmailVerification(
  email: string,
  token: string,
  route: string,
  reset: boolean = false,
  TwoFA: boolean = false,
): Promise<SendEmailResponse> {
  const baseUrl = 'http://localhost:3000';
  const confirmLink = `${baseUrl}/auth/${route}?token=${token}`;

  const body = TwoFA
    ? `<p>Your two-factor authentication code is ${token}</p>`
    : `Click <a href="${confirmLink}">here</a> to ${reset ? 'reset your password' : 'confirm your email'}`;

  const emailOptions = {
    from: 'onboarding@resend.dev',
    to: email,
    subject: `Welcome to oneTodo! ${reset ? 'Reset your password' : 'Confirm your email'}`,
    html: body,
  };

  return sendEmail(emailOptions);
}

export default sendEmailVerification;
