import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  from: string;
  to: string;
  subject: string;
  html: string;
}

interface SendEmailResponse {}

/**
 * Sends an email using the Resend service.
 * @param {SendEmailParams} params - The parameters for sending the email.
 * @param {string} params.from - The sender's email address.
 * @param {string} params.to - The recipient's email address.
 * @param {string} params.subject - The subject of the email.
 * @param {string} params.html - The HTML content of the email.
 */
async function sendEmail({ from, to, subject, html }: SendEmailParams): Promise<SendEmailResponse> {
  try {
    await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
    return {}; // Return an empty object as a placeholder for the response
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Sends an email verification email.
 * @param {string} email - The recipient's email address.
 * @param {string} token - The confirmation link.
 * @returns {Promise<SendEmailResponse>} - The response from the Resend service.
 */
async function sendEmailVerification(
  email: string,
  token: string,
  route: string,
  reset: boolean = false,
): Promise<SendEmailResponse> {
  const confirmLink = `http://localhost:3000/auth/${route}?token=${token}`;
  const from = 'onboarding@resend.dev';
  const subject = `Welcome to oneTodo! ${reset ? 'reset your password' : 'Confirm your email'}`;
  const html = `Click <a href="${confirmLink}">here</a> to <p>${reset ? 'Reset your password' : 'Confirm your email'}</p>`;

  return sendEmail({ from, to: email, subject, html });
}

export default sendEmailVerification;
