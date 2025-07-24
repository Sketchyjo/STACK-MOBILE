import {
  UserSchema,
  CreateUserSchema,
  InvestmentSchema,
  CreateInvestmentSchema,
  HealthCheckSchema,
} from '../src/index';

describe('Shared Types Validation', () => {
  describe('UserSchema', () => {
    it('should validate a valid user object', () => {
      const validUser = {
        id: 'user_123',
        address: '0x1234567890abcdef',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      const result = UserSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject invalid user object', () => {
      const invalidUser = {
        id: 'user_123',
        // missing address
        createdAt: 'invalid-date',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      const result = UserSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });

  describe('CreateUserSchema', () => {
    it('should validate create user request', () => {
      const createUser = {
        address: '0x1234567890abcdef',
      };

      const result = CreateUserSchema.safeParse(createUser);
      expect(result.success).toBe(true);
    });

    it('should reject empty address', () => {
      const createUser = {
        address: '',
      };

      const result = CreateUserSchema.safeParse(createUser);
      expect(result.success).toBe(false);
    });
  });

  describe('InvestmentSchema', () => {
    it('should validate a valid investment object', () => {
      const validInvestment = {
        id: 'inv_123',
        userId: 'user_123',
        amount: '1000.50',
        tokenSymbol: 'ETH',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      };

      const result = InvestmentSchema.safeParse(validInvestment);
      expect(result.success).toBe(true);
    });
  });

  describe('HealthCheckSchema', () => {
    it('should validate health check response', () => {
      const healthCheck = {
        status: 'healthy' as const,
        timestamp: '2024-01-01T00:00:00.000Z',
        service: 'STACK Backend API',
        version: '1.0.0',
        environment: 'test',
      };

      const result = HealthCheckSchema.safeParse(healthCheck);
      expect(result.success).toBe(true);
    });

    it('should reject invalid status', () => {
      const healthCheck = {
        status: 'invalid',
        timestamp: '2024-01-01T00:00:00.000Z',
        service: 'STACK Backend API',
        version: '1.0.0',
        environment: 'test',
      };

      const result = HealthCheckSchema.safeParse(healthCheck);
      expect(result.success).toBe(false);
    });
  });
});