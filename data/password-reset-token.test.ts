import { db } from '@/lib/db';
import {
  getPasswordResetTokenByToken,
  getPasswordResetTokenByEmail,
} from '@/data/password-reset-token';

jest.mock('@/lib/db', () => ({
  db: {
    passwordResetToken: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Password Reset Token Retrieval Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPasswordResetTokenByEmail', () => {
    it('should return the token if found by email', async () => {
      const email = 'test@example.com';
      const tokenData = {
        id: 'token-id',
        email,
        token: 'token-value',
      };
      (db.passwordResetToken.findFirst as jest.Mock).mockResolvedValue(tokenData);

      const result = await getPasswordResetTokenByEmail(email);

      expect(db.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(tokenData);
    });

    it('should return null if no token is found by email', async () => {
      const email = 'test@example.com';
      (db.passwordResetToken.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getPasswordResetTokenByEmail(email);

      expect(db.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const email = 'test@example.com';
      (db.passwordResetToken.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await getPasswordResetTokenByEmail(email);

      expect(db.passwordResetToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('getPasswordResetTokenByToken', () => {
    it('should return the token if found by token', async () => {
      const token = 'token-value';
      const tokenData = {
        id: 'token-id',
        email: 'test@example.com',
        token,
      };
      (db.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(tokenData);

      const result = await getPasswordResetTokenByToken(token);

      expect(db.passwordResetToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toEqual(tokenData);
    });

    it('should return null if no token is found by token', async () => {
      const token = 'token-value';
      (db.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getPasswordResetTokenByToken(token);

      expect(db.passwordResetToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const token = 'token-value';
      (db.passwordResetToken.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await getPasswordResetTokenByToken(token);

      expect(db.passwordResetToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toBeNull();
    });
  });
});
