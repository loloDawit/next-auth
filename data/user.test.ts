import { db } from '@/lib/db';
import { getUserByEmail, getUserById } from '@/data/user';

jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe('User Retrieval Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should return the user if found by email', async () => {
      const email = 'test@example.com';
      const userData = {
        id: 'user-id',
        email,
        name: 'John Doe',
      };
      (db.user.findUnique as jest.Mock).mockResolvedValue(userData);

      const result = await getUserByEmail(email);

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(userData);
    });

    it('should return null if no user is found by email', async () => {
      const email = 'test@example.com';
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserByEmail(email);

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const email = 'test@example.com';
      (db.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await getUserByEmail(email);

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return the user if found by id', async () => {
      const id = 'user-id';
      const userData = {
        id,
        email: 'test@example.com',
        name: 'John Doe',
      };
      (db.user.findUnique as jest.Mock).mockResolvedValue(userData);

      const result = await getUserById(id);

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(userData);
    });

    it('should return null if no user is found by id', async () => {
      const id = 'user-id';
      (db.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getUserById(id);

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toBeNull();
    });

    it('should return null if an error occurs', async () => {
      const id = 'user-id';
      (db.user.findUnique as jest.Mock).mockRejectedValue(new Error('DB error'));

      const result = await getUserById(id);

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toBeNull();
    });
  });
});
