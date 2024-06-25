import { generateVerificationToken } from '@/lib/tokens';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { db } from '@/lib/db';

jest.mock('@/data/verification-token');
jest.mock('@/lib/db', () => {
  const mockPrismaClient = {
    verificationToken: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    db: mockPrismaClient,
  };
});

describe('generateVerificationToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
