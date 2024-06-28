import sendEmailVerification from '@/lib/send-email/email-verification';
import sendEmail from '@/lib/send-email/send-email';

import { Resend } from 'resend';

jest.mock('resend');
jest.mock('@/lib/send-email/send-email');
describe('sendEmailVerification', () => {
  const email = 'test@example.com';
  const token = 'test-token';
  const route = 'verify-email';
  const baseUrl = 'http://localhost:3000';
  const from = 'onboarding@resend.dev';

  let mockResendInstance: any;

  beforeAll(() => {
    mockResendInstance = {
      emails: {
        send: jest.fn(),
      },
    };
    (Resend as jest.Mock).mockImplementation(() => mockResendInstance);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send a confirmation email', async () => {
    const subject = 'Welcome to oneTodo! Confirm your email';
    const confirmLink = `${baseUrl}/auth/${route}?token=${token}`;
    const html = `Click <a href="${confirmLink}">here</a> to confirm your email`;

    (sendEmail as jest.Mock).mockResolvedValue({});

    await sendEmailVerification(email, token, route);

    expect(sendEmail).toHaveBeenCalledWith({
      from,
      to: email,
      subject,
      html,
    });
  });

  it('should send a password reset email', async () => {
    const subject = 'Welcome to oneTodo! Reset your password';
    const confirmLink = `${baseUrl}/auth/${route}?token=${token}`;
    const html = `Click <a href="${confirmLink}">here</a> to reset your password`;

    (sendEmail as jest.Mock).mockResolvedValue({});

    await sendEmailVerification(email, token, route, true);

    expect(sendEmail).toHaveBeenCalledWith({
      from,
      to: email,
      subject,
      html,
    });
  });

  it('should send a two-factor authentication email', async () => {
    const subject = 'Welcome to oneTodo! Confirm your email';
    const html = `<p>Your two-factor authentication code is ${token}</p>`;

    (sendEmail as jest.Mock).mockResolvedValue({});

    await sendEmailVerification(email, token, route, false, true);

    expect(sendEmail).toHaveBeenCalledWith({
      from,
      to: email,
      subject,
      html,
    });
  });

  it('should throw an error if sending email fails', async () => {
    const errorMessage = 'Error sending email';
    (sendEmail as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(sendEmailVerification(email, token, route)).rejects.toThrow(errorMessage);
  });
});
