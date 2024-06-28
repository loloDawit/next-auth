import { db } from '@/lib/db';
import { getTwoFactorConfirmationById } from '@/data/two-factor-confirmation';

jest.mock('@/lib/db', () => ({
  db: {
    twoFactorConfirmation: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Two Factor Confirmation Retrieval', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the two factor confirmation if found by id', async () => {
    const id = 'confirmation-id';
    const confirmationData = {
      id,
      // Add other properties here
    };
    (db.twoFactorConfirmation.findUnique as jest.Mock).mockResolvedValue(confirmationData);

    const result = await getTwoFactorConfirmationById(id);

    expect(db.twoFactorConfirmation.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toEqual(confirmationData);
  });

  it('should return null if no two factor confirmation is found by id', async () => {
    const id = 'confirmation-id';
    (db.twoFactorConfirmation.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await getTwoFactorConfirmationById(id);

    expect(db.twoFactorConfirmation.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toBeNull();
  });

  it('should return null if an error occurs', async () => {
    const id = 'confirmation-id';
    (db.twoFactorConfirmation.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

    const result = await getTwoFactorConfirmationById(id);

    expect(db.twoFactorConfirmation.findUnique).toHaveBeenCalledWith({
      where: { id },
    });
    expect(result).toBeNull();
  });
});
