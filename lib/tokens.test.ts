import {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
} from '@/lib/tokens';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { db } from '@/lib/db';

jest.mock('@/data/verification-token');
jest.mock('@/data/password-reset-token');
jest.mock('@/data/two-factor-token');

jest.mock('@/lib/db', () => {
  const mockPrismaClient = {
    verificationToken: {
      create: jest.fn(),
      delete: jest.fn(),
    },
    passwordResetToken: {
      create: jest.fn(),
      delete: jest.fn(),
    },
    twoFactorToken: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    db: mockPrismaClient,
  };
});

describe('Token Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateVerificationToken', () => {
    it('should generate a new verification token', async () => {
      const email = 'test@example.com';
      const token = 'generated-token';
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

      // Mock the getVerificationTokenByEmail function to return null (no existing token)
      (getVerificationTokenByEmail as jest.Mock).mockResolvedValue(null);

      // Mock the db.verificationToken.create function to return the generated token
      (db.verificationToken.create as jest.Mock).mockResolvedValue({
        email,
        token,
        expiresAt: expect.any(Date),
      });

      const result = await generateVerificationToken(email);

      expect(getVerificationTokenByEmail).toHaveBeenCalledWith(email);
      expect(db.verificationToken.delete).not.toHaveBeenCalled();
      expect(db.verificationToken.create).toHaveBeenCalledWith({
        data: {
          email,
          token: expect.any(String),
          expiresAt: expect.any(Date),
        },
      });
      expect(result).toEqual({
        email,
        token: expect.any(String),
        expiresAt: expect.any(Date),
      });
    });

    it('should delete existing token and generate a new verification token', async () => {
      const email = 'test@example.com';
      const token = 'generated-token';
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
      const existingToken = {
        id: 'existing-token-id',
        email,
        token: 'existing-token',
        expiresAt: new Date(),
      };

      // Mock the getVerificationTokenByEmail function to return the existing token
      (getVerificationTokenByEmail as jest.Mock).mockResolvedValue(existingToken);

      // Mock the db.verificationToken.create function to return the generated token
      (db.verificationToken.create as jest.Mock).mockResolvedValue({
        email,
        token,
        expiresAt: expect.any(Date),
      });

      const result = await generateVerificationToken(email);

      expect(getVerificationTokenByEmail).toHaveBeenCalledWith(email);
      expect(db.verificationToken.delete).toHaveBeenCalledWith({
        where: { id: existingToken.id },
      });
      expect(db.verificationToken.create).toHaveBeenCalledWith({
        data: {
          email,
          token: expect.any(String),
          expiresAt: expect.any(Date),
        },
      });
      expect(result).toEqual({
        email,
        token: expect.any(String),
        expiresAt: expect.any(Date),
      });
    });
  });

  describe('generatePasswordResetToken', () => {
    it('should generate a new token and save it if no existing token', async () => {
      const email = 'test@example.com';
      const token = 'new-token-value';

      (getPasswordResetTokenByEmail as jest.Mock).mockResolvedValue(null);

      const tokenData = {
        email,
        token,
        expiresAt: expect.any(Date),
      };
      (db.passwordResetToken.create as jest.Mock).mockResolvedValue(tokenData);

      const result = await generatePasswordResetToken(email);

      expect(getPasswordResetTokenByEmail).toHaveBeenCalledWith(email);
      expect(db.passwordResetToken.delete).not.toHaveBeenCalled();
      expect(db.passwordResetToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email,
          token: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
      expect(result).toEqual(tokenData);
    });

    it('should delete the existing token and generate a new one', async () => {
      const email = 'test@example.com';
      const token = 'new-token-value';
      const existingToken = {
        id: 'existing-token-id',
        email,
        token: 'existing-token',
      };

      (getPasswordResetTokenByEmail as jest.Mock).mockResolvedValue(existingToken);

      const tokenData = {
        email,
        token,
        expiresAt: expect.any(Date),
      };
      (db.passwordResetToken.create as jest.Mock).mockResolvedValue(tokenData);

      const result = await generatePasswordResetToken(email);

      expect(getPasswordResetTokenByEmail).toHaveBeenCalledWith(email);
      expect(db.passwordResetToken.delete).toHaveBeenCalledWith({
        where: { id: existingToken.id },
      });
      expect(db.passwordResetToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email,
          token: expect.any(String),
        }),
      });
      expect(result).toEqual(tokenData);
    });

    it('should handle errors gracefully', async () => {
      const email = 'test@example.com';
      const token = 'new-token-value';

      (getPasswordResetTokenByEmail as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(generatePasswordResetToken(email)).rejects.toThrow('DB error');
    });
  });

  describe('generateTwoFactorToken', () => {
    it('should generate a new token and save it if no existing token', async () => {
      const email = 'test@example.com';
      const token = 'new-token-value';

      (getTwoFactorTokenByEmail as jest.Mock).mockResolvedValue(null);

      const tokenData = {
        email,
        token,
        expiresAt: expect.any(Date),
      };
      (db.twoFactorToken.create as jest.Mock).mockResolvedValue(tokenData);

      const result = await generateTwoFactorToken(email);

      expect(getTwoFactorTokenByEmail).toHaveBeenCalledWith(email);
      expect(db.twoFactorToken.delete).not.toHaveBeenCalled();
      expect(db.twoFactorToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email,
          token: expect.any(String),
          expiresAt: expect.any(Date),
        }),
      });
      expect(result).toEqual(tokenData);
    });

    it('should delete the existing token and generate a new one', async () => {
      const email = 'test@example.com';
      const token = 'new-token-value';
      const existingToken = {
        id: 'existing-token-id',
        email,
        token: 'existing-token',
      };

      (getTwoFactorTokenByEmail as jest.Mock).mockResolvedValue(existingToken);

      const tokenData = {
        email,
        token,
        expiresAt: expect.any(Date),
      };
      (db.twoFactorToken.create as jest.Mock).mockResolvedValue(tokenData);

      const result = await generateTwoFactorToken(email);

      expect(getTwoFactorTokenByEmail).toHaveBeenCalledWith(email);
      expect(db.twoFactorToken.delete).toHaveBeenCalledWith({
        where: { id: existingToken.id },
      });
      expect(db.twoFactorToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email,
          token: expect.any(String),
        }),
      });
      expect(result).toEqual(tokenData);
    });

    it('should handle errors gracefully', async () => {
      const email = 'test@example.com';
      const token = 'new-token-value';

      (getTwoFactorTokenByEmail as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(generateTwoFactorToken(email)).rejects.toThrow('DB error');
    });
  });
});
