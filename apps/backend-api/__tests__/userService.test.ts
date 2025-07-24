import {
  createUser,
  findUserByWalletAddress,
  findUserByEmail,
  updateUser,
  getOrCreateUser,
  getUserStats,
} from '../src/services/userService';
import { prisma } from '@stack/shared-types';

// Test data
const testWalletAddress = '0x1234567890123456789012345678901234567890';
const testWalletAddress2 = '0x0987654321098765432109876543210987654321';
const testUserData = {
  walletAddress: testWalletAddress,
  displayName: 'Test User',
  email: 'test@example.com',
  bio: 'Test user bio',
};

describe('User Service', () => {
  beforeAll(async () => {
    // Clean up test data before running tests
    await prisma.user.deleteMany({
      where: {
        walletAddress: {
          in: [testWalletAddress, testWalletAddress2],
        },
      },
    });
  });

  afterAll(async () => {
    // Clean up test data after running tests
    await prisma.user.deleteMany({
      where: {
        walletAddress: {
          in: [testWalletAddress, testWalletAddress2],
        },
      },
    });
    await prisma.$disconnect();
  });

  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      // Use a different wallet address for this test to avoid conflicts
      const createTestWalletAddress = '0x1111111111111111111111111111111111111111';
      const createTestUserData = {
        ...testUserData,
        walletAddress: createTestWalletAddress,
      };

      // Clean up if exists
      const existingUser = await findUserByWalletAddress(createTestWalletAddress);
      if (existingUser) {
        await prisma.user.delete({
          where: { walletAddress: existingUser.walletAddress },
        });
      }

      const user = await createUser(createTestUserData);

      expect(user).toHaveProperty('id');
      expect(user?.walletAddress.toLowerCase()).toBe(createTestWalletAddress.toLowerCase());
      expect(user).toHaveProperty('displayName', createTestUserData.displayName);
      expect(user).toHaveProperty('email', createTestUserData.email);
      expect(user).toHaveProperty('bio', createTestUserData.bio);
      expect(user).toHaveProperty('isCurator', false);
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');

      // Clean up
      await prisma.user.delete({
        where: { walletAddress: createTestWalletAddress },
      });
    });

    it('should create a user with only wallet address and displayName', async () => {
      const minimalData = {
        walletAddress: testWalletAddress2,
        displayName: 'Minimal User',
      };

      const user = await createUser(minimalData);

      expect(user).toHaveProperty('walletAddress', testWalletAddress2);
      expect(user).toHaveProperty('displayName', 'Minimal User');
      expect(user.email).toBeNull();
      expect(user.bio).toBeNull();
      expect(user).toHaveProperty('isCurator', false);
    });

    it('should throw error for duplicate wallet address', async () => {
      // Ensure the main test user exists first by checking if it exists
      const existingUser = await findUserByWalletAddress(testWalletAddress);
      if (!existingUser) {
        await createUser(testUserData);
      }
      
      // Try to create another user with the same wallet address
      await expect(createUser(testUserData)).rejects.toThrow();
    });

    it('should throw error for invalid email format', async () => {
      const invalidData = {
        walletAddress: '0x1111111111111111111111111111111111111111',
        email: 'invalid-email',
      };

      await expect(createUser(invalidData)).rejects.toThrow();
    });
  });

  describe('findUserByWalletAddress', () => {
    beforeAll(async () => {
      // Ensure the main test user exists for these tests
      await getOrCreateUser(testWalletAddress);
    });

    it('should find existing user by wallet address', async () => {
      const user = await findUserByWalletAddress(testWalletAddress);

      expect(user).not.toBeNull();
      expect(user?.walletAddress.toLowerCase()).toBe(testWalletAddress.toLowerCase());
      // Note: These values may have been updated by previous tests
      expect(user).toHaveProperty('displayName');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('bio');
    });

    it('should return null for non-existent wallet address', async () => {
      const nonExistentAddress = '0x9999999999999999999999999999999999999999';
      const user = await findUserByWalletAddress(nonExistentAddress);

      expect(user).toBeNull();
    });

    it('should handle case-insensitive wallet address lookup', async () => {
      const upperCaseAddress = testWalletAddress.toUpperCase();
      const user = await findUserByWalletAddress(upperCaseAddress);

      expect(user).not.toBeNull();
      expect(user?.walletAddress.toLowerCase()).toBe(testWalletAddress.toLowerCase());
    });
  });

  describe('findUserByEmail', () => {
    beforeAll(async () => {
      // Ensure the user exists and has an email for these tests
      await getOrCreateUser(testWalletAddress);
      await updateUser(testWalletAddress, {
        email: testUserData.email,
      });
    });

    it('should find existing user by email', async () => {
      // Get the current user to see what email they have after updates
      const currentUser = await findUserByWalletAddress(testWalletAddress);
      const currentEmail = currentUser?.email || testUserData.email;
      
      const user = await findUserByEmail(currentEmail);

      expect(user).not.toBeNull();
      expect(user).toHaveProperty('email', currentEmail);
      expect(user?.walletAddress.toLowerCase()).toBe(testWalletAddress.toLowerCase());
    });

    it('should return null for non-existent email', async () => {
      const nonExistentEmail = 'nonexistent@example.com';
      const user = await findUserByEmail(nonExistentEmail);

      expect(user).toBeNull();
    });

    it('should handle case-insensitive email lookup', async () => {
      // Get the current user to see what email they have after updates
      const currentUser = await findUserByWalletAddress(testWalletAddress);
      const currentEmail = currentUser?.email || testUserData.email;
      
      const upperCaseEmail = currentEmail.toUpperCase();
      const user = await findUserByEmail(upperCaseEmail);

      expect(user).not.toBeNull();
      expect(user?.email?.toLowerCase()).toBe(currentEmail.toLowerCase());
    });
  });

  describe('updateUser', () => {
    it('should update user data successfully', async () => {
      // Ensure user exists first
      await getOrCreateUser(testWalletAddress);
      
      const updateData = {
        displayName: 'Updated User',
        email: 'updated@example.com',
        bio: 'Updated bio',
      };

      const updatedUser = await updateUser(testWalletAddress, updateData);

      expect(updatedUser).toHaveProperty('displayName', updateData.displayName);
      expect(updatedUser).toHaveProperty('email', updateData.email);
      expect(updatedUser).toHaveProperty('bio', updateData.bio);
      expect(updatedUser.walletAddress.toLowerCase()).toBe(testWalletAddress.toLowerCase());
    });

    it('should update only provided fields', async () => {
      // Ensure user exists first and get current state
      const currentUser = await getOrCreateUser(testWalletAddress);
      
      // First do a full update to set known values
      const fullUpdateData = {
        displayName: 'Full Update User',
        email: 'full-update@example.com',
        bio: 'Full update bio',
      };
      await updateUser(testWalletAddress, fullUpdateData);
      
      // Now do a partial update
      const partialUpdateData = {
        displayName: 'Partial Update',
      };

      const updatedUser = await updateUser(testWalletAddress, partialUpdateData);

      expect(updatedUser).toHaveProperty('displayName', partialUpdateData.displayName);
      expect(updatedUser).toHaveProperty('email', fullUpdateData.email); // Should keep previous email
      expect(updatedUser).toHaveProperty('bio', fullUpdateData.bio); // Should keep previous bio
    });

    it('should throw error for non-existent user', async () => {
      const nonExistentAddress = '0x9999999999999999999999999999999999999999';
      const updateData = {
        displayName: 'Should Fail',
      };

      await expect(updateUser(nonExistentAddress, updateData)).rejects.toThrow();
    });

    it('should validate email format during update', async () => {
      const updateData = {
        email: 'invalid-email-format',
      };

      await expect(updateUser(testWalletAddress, updateData)).rejects.toThrow();
    });
  });

  describe('getOrCreateUser', () => {
    it('should return existing user if found', async () => {
      const user = await getOrCreateUser(testWalletAddress);

      expect(user).toHaveProperty('walletAddress');
      expect(user.walletAddress.toLowerCase()).toBe(testWalletAddress.toLowerCase());
      expect(user).toHaveProperty('displayName'); // Display name may vary based on test order
    });

    it('should create new user if not found', async () => {
      const newWalletAddress = '0x2222222222222222222222222222222222222222';
      const user = await getOrCreateUser(newWalletAddress);

      expect(user).toHaveProperty('walletAddress', newWalletAddress);
      expect(user).toHaveProperty('displayName');
      expect(user.email).toBeNull();
      expect(user.bio).toBeNull();

      // Clean up
      await prisma.user.delete({
        where: { walletAddress: newWalletAddress },
      });
    });

    it('should handle case-insensitive wallet address', async () => {
      const upperCaseAddress = testWalletAddress.toUpperCase();
      const user = await getOrCreateUser(upperCaseAddress);

      expect(user).toHaveProperty('walletAddress');
      expect(user.walletAddress.toLowerCase()).toBe(testWalletAddress.toLowerCase());
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics for existing user', async () => {
      const stats = await getUserStats(testWalletAddress);

      expect(stats).toHaveProperty('portfolioCount');
      expect(stats).toHaveProperty('totalInvestments');
      expect(stats).toHaveProperty('memberSince');
      expect(typeof stats.portfolioCount).toBe('number');
      expect(typeof stats.totalInvestments).toBe('number');
      expect(stats.memberSince).toBeInstanceOf(Date);
    });

    it('should throw error for non-existent user', async () => {
      const nonExistentAddress = '0x9999999999999999999999999999999999999999';

      await expect(getUserStats(nonExistentAddress)).rejects.toThrow();
    });

    it('should handle user with no portfolios', async () => {
      const stats = await getUserStats(testWalletAddress);

      // Since we haven't created any portfolios, count should be 0
      expect(stats.portfolioCount).toBe(0);
      expect(stats.totalInvestments).toBe(0);
    });
  });

  describe('Input Validation', () => {
    it('should validate wallet address format', async () => {
      const invalidAddress = 'not-a-wallet-address';

      await expect(createUser({ 
        walletAddress: invalidAddress,
        displayName: 'Test User'
      })).rejects.toThrow();
    });

    it('should validate email format', async () => {
      const invalidData = {
        walletAddress: '0x3333333333333333333333333333333333333333',
        displayName: 'Test User',
        email: 'not-an-email',
      };

      await expect(createUser(invalidData)).rejects.toThrow();
    });

    it('should handle empty strings', async () => {
      const invalidData = {
        walletAddress: '',
        displayName: '',
        email: '',
      };

      await expect(createUser(invalidData)).rejects.toThrow();
    });

    it('should handle null values appropriately', async () => {
      const dataWithNulls = {
        walletAddress: '0x4444444444444444444444444444444444444444',
        displayName: 'Test User',
        email: null,
        bio: null,
      };

      const user = await createUser(dataWithNulls);

      expect(user).toHaveProperty('walletAddress', dataWithNulls.walletAddress);
      expect(user).toHaveProperty('displayName', dataWithNulls.displayName);
      expect(user.email).toBeNull();
      expect(user.bio).toBeNull();

      // Clean up
      await prisma.user.delete({
        where: { walletAddress: dataWithNulls.walletAddress },
      });
    });
  });
});