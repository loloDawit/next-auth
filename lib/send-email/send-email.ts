import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

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
const sendEmail = async ({
  from,
  to,
  subject,
  html,
}: SendEmailParams): Promise<SendEmailResponse> => {
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
};

export default sendEmail;
