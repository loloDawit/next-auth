import { Resend } from 'resend';
import sendEmail, { resend } from './send-email';

jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  };
});

describe('sendEmail', () => {
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = resend.emails.send as jest.Mock;
    jest.clearAllMocks();
  });

  const emailParams = {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Test Subject',
    html: '<p>Test Email</p>',
  };

  it('should send an email successfully', async () => {
    mockSend.mockResolvedValue({});

    const response = await sendEmail(emailParams);

    expect(mockSend).toHaveBeenCalledWith(emailParams);
    expect(response).toEqual({});
  });

  it('should throw an error if sending email fails', async () => {
    const errorMessage = 'Error sending email';
    mockSend.mockRejectedValue(new Error(errorMessage));

    console.error = jest.fn();

    await expect(sendEmail(emailParams)).rejects.toThrow(errorMessage);
    expect(mockSend).toHaveBeenCalledWith(emailParams);
  });
});
