import { db } from '@/lib/db';
import { getTwoFactorTokenByEmail, getTwoFactorTokenByToken } from '@/data/two-factor-token';

jest.mock('@/lib/db', () => ({
  db: {
    twoFactorToken: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Two-Factor Token Retrieval Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTwoFactorTokenByEmail', () => {
    it('should return the token if found by email', async () => {
      const email = 'test@example.com';
      const tokenData = {
        id: 'token-id',
        email,
        token: 'token-value',
      };
      (db.twoFactorToken.findFirst as jest.Mock).mockResolvedValue(tokenData);

      const result = await getTwoFactorTokenByEmail(email);

      expect(db.twoFactorToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(tokenData);
    });

    it('should return null if no token is found by email', async () => {
      const email = 'test@example.com';
      (db.twoFactorToken.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getTwoFactorTokenByEmail(email);

      expect(db.twoFactorToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const email = 'test@example.com';
      (db.twoFactorToken.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await getTwoFactorTokenByEmail(email);

      expect(db.twoFactorToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('getTwoFactorTokenByToken', () => {
    it('should return the token if found by token', async () => {
      const token = 'token-value';
      const tokenData = {
        id: 'token-id',
        email: 'test@example.com',
        token,
      };
      (db.twoFactorToken.findUnique as jest.Mock).mockResolvedValue(tokenData);

      const result = await getTwoFactorTokenByToken(token);

      expect(db.twoFactorToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toEqual(tokenData);
    });

    it('should return null if no token is found by token', async () => {
      const token = 'token-value';
      (db.twoFactorToken.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getTwoFactorTokenByToken(token);

      expect(db.twoFactorToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const token = 'token-value';
      (db.twoFactorToken.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await getTwoFactorTokenByToken(token);

      expect(db.twoFactorToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toBeNull();
    });
  });
});
