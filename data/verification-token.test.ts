import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from '@/data/verification-token';
import { db } from '@/lib/db';

jest.mock('@/lib/db', () => ({
  db: {
    verificationToken: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

describe('Verification Token Retrieval Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVerificationTokenByEmail', () => {
    it('should return the verification token if found by email', async () => {
      const email = 'test@example.com';
      const tokenData = {
        id: 'token-id',
        email,
        token: 'some-token',
        expiresAt: new Date(),
      };

      (db.verificationToken.findFirst as jest.Mock).mockResolvedValue(tokenData);

      const result = await getVerificationTokenByEmail(email);

      expect(db.verificationToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(tokenData);
    });

    it('should return null if no token is found by email', async () => {
      const email = 'test@example.com';

      (db.verificationToken.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await getVerificationTokenByEmail(email);

      expect(db.verificationToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const email = 'test@example.com';

      (db.verificationToken.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await getVerificationTokenByEmail(email);

      expect(db.verificationToken.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('getVerificationTokenByToken', () => {
    it('should return the verification token if found by token', async () => {
      const token = 'some-token';
      const tokenData = {
        id: 'token-id',
        email: 'test@example.com',
        token,
        expiresAt: new Date(),
      };

      (db.verificationToken.findUnique as jest.Mock).mockResolvedValue(tokenData);

      const result = await getVerificationTokenByToken(token);

      expect(db.verificationToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toEqual(tokenData);
    });

    it('should return null if no token is found by token', async () => {
      const token = 'some-token';

      (db.verificationToken.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getVerificationTokenByToken(token);

      expect(db.verificationToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const token = 'some-token';

      (db.verificationToken.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await getVerificationTokenByToken(token);

      expect(db.verificationToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });
      expect(result).toBeNull();
    });
  });
});

// describe('getVerificationTokenByEmail', () => {
//   it('should retrieve the verification token associated with the given email', async () => {
//     // Arrange
//     const email = 'test@example.com';
//     const expectedToken = { token: 'abc123', email: 'test@example.com' };
//     db.verificationToken.findFirst.mockResolvedValue(expectedToken);

//     // Act
//     const result = await getVerificationTokenByEmail(email);

//     // Assert
//     expect(result).toEqual(expectedToken);
//     expect(db.verificationToken.findFirst).toHaveBeenCalledWith({
//       where: { email },
//     });
//   });

//   it('should return null if the verification token is not found', async () => {
//     // Arrange
//     const email = 'test@example.com';
//     db.verificationToken.findFirst.mockResolvedValue(null);

//     // Act
//     const result = await getVerificationTokenByEmail(email);

//     // Assert
//     expect(result).toBeNull();
//     expect(db.verificationToken.findFirst).toHaveBeenCalledWith({
//       where: { email },
//     });
//   });

//   it('should return null if an error occurs', async () => {
//     // Arrange
//     const email = 'test@example.com';
//     const errorMessage = 'Database error';
//     db.verificationToken.findFirst.mockRejectedValue(new Error(errorMessage));

//     // Act
//     const result = await getVerificationTokenByEmail(email);

//     // Assert
//     expect(result).toBeNull();
//     expect(db.verificationToken.findFirst).toHaveBeenCalledWith({
//       where: { email },
//     });
//   });
// });

// describe('getVerificationTokenByToken', () => {
//   it('should retrieve the verification token associated with the given token', async () => {
//     // Arrange
//     const token = 'abc123';
//     const expectedToken = { token: 'abc123', email: 'test@example.com' };
//     db.verificationToken.findUnique.mockResolvedValue(expectedToken);

//     // Act
//     const result = await getVerificationTokenByToken(token);

//     // Assert
//     expect(result).toEqual(expectedToken);
//     expect(db.verificationToken.findUnique).toHaveBeenCalledWith({
//       where: { token },
//     });
//   });

//   it('should return null if the verification token is not found', async () => {
//     // Arrange
//     const token = 'abc123';
//     db.verificationToken.findUnique.mockResolvedValue(null);

//     // Act
//     const result = await getVerificationTokenByToken(token);

//     // Assert
//     expect(result).toBeNull();
//     expect(db.verificationToken.findUnique).toHaveBeenCalledWith({
//       where: { token },
//     });
//   });

//   it('should return null if an error occurs', async () => {
//     // Arrange
//     const token = 'abc123';
//     const errorMessage = 'Database error';
//     db.verificationToken.findUnique.mockRejectedValue(new Error(errorMessage));

//     // Act
//     const result = await getVerificationTokenByToken(token);

//     // Assert
//     expect(result).toBeNull();
//     expect(db.verificationToken.findUnique).toHaveBeenCalledWith({
//       where: { token },
//     });
//   });
// });
