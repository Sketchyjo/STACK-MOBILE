import axios from 'axios';
import { z } from 'zod';

// Validation schemas
const CreateWalletSchema = z.object({
  userId: z.string().optional(),
  label: z.string().optional(),
});

const CreateWalletResponseSchema = z.object({
  result: z.object({
    address: z.string(),
    label: z.string().optional(),
    createdAt: z.string().optional(),
    smartAccountAddress: z.string().optional(),
  }),
});

export interface CreateWalletData {
  userId?: string;
  label?: string;
}

export interface WalletCreationResult {
  address: string;
  label?: string;
  createdAt?: string;
  smartAccountAddress?: string;
}

/**
 * Create a new wallet using Thirdweb Engine
 */
export async function createWallet(userId?: string): Promise<WalletCreationResult> {
  if (!process.env.THIRDWEB_SECRET_KEY) {
    throw new Error('THIRDWEB_SECRET_KEY environment variable is required');
  }

  if (!process.env.THIRDWEB_ENGINE_URL) {
    throw new Error('THIRDWEB_ENGINE_URL environment variable is required');
  }

  if (!process.env.THIRDWEB_CLIENT_ID) {
    throw new Error('THIRDWEB_CLIENT_ID environment variable is required');
  }

  try {
    const response = await axios.post(
      `${process.env.THIRDWEB_ENGINE_URL}/v1/accounts`,
      {
        type: 'local',  // Using local wallet type
        label: `${userId}`
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.THIRDWEB_CLIENT_ID,
          'x-secret-key': process.env.THIRDWEB_SECRET_KEY
        }
      }
    );

    return CreateWalletResponseSchema.parse(response.data).result;
  } catch (error) {
    console.error('Error creating wallet:', error instanceof Error ? error.message : error);
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to create wallet: ${error.response?.data?.message || error.message}`);
    }
    throw new Error('Failed to create wallet');
  }
}

/**
 * Get wallet information by address
 *
 * Note: This function lists all wallets and filters for the requested address
 * since ThirdWeb Engine doesn't provide a direct endpoint to get a single wallet by address
 */
export async function getWalletInfo(address: string): Promise<any> {
  try {
    const engineUrl = process.env.THIRDWEB_ENGINE_URL;
    const secretKey = process.env.THIRDWEB_SECRET_KEY;

    if (!engineUrl || !secretKey) {
      throw new Error('Thirdweb Engine configuration missing');
    }

    // List all wallets and filter for the requested address
    const response = await axios.get(
      `${engineUrl}/v1/accounts`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.THIRDWEB_CLIENT_ID,
          'x-secret-key': secretKey,
        },
      }
    );

    // Find the wallet with the matching address
    const wallets = response.data?.result?.accounts || [];
    const wallet = wallets.find((w: any) => w.address.toLowerCase() === address.toLowerCase());

    if (!wallet) {
      throw new Error(`Wallet with address ${address} not found`);
    }

    return { result: wallet };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Failed to get wallet info: ${message}`);
    }

    throw error;
  }
}

/**
 * List all wallets
 */
export async function listWallets(page: number = 1, limit: number = 100): Promise<any> {
  try {
    const engineUrl = process.env.THIRDWEB_ENGINE_URL;
    const secretKey = process.env.THIRDWEB_SECRET_KEY;

    if (!engineUrl || !secretKey) {
      throw new Error('Thirdweb Engine configuration missing');
    }

    const response = await axios.get(
      `${engineUrl}/v1/accounts?page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.THIRDWEB_CLIENT_ID,
          'x-secret-key': secretKey,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      throw new Error(`Failed to list wallets: ${message}`);
    }

    throw error;
  }
}
