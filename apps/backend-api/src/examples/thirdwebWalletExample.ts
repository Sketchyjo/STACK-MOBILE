/**
 * ThirdWeb Engine Wallet API Examples
 * 
 * This file contains examples of how to interact with ThirdWeb Engine's wallet API
 * using axios for HTTP requests.
 */

import axios from 'axios';

// Environment variables (in a real application, these would be loaded from .env)
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY || 'your-secret-key';
const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID || 'your-client-id';
const THIRDWEB_ENGINE_URL = process.env.THIRDWEB_ENGINE_URL || 'https://engine.thirdweb.com';

// Types
interface WalletResponse {
  result: {
    address: string;
    label?: string;
    createdAt?: string;
    smartAccountAddress?: string;
  };
}

interface WalletsListResponse {
  result: {
    accounts: Array<{
      address: string;
      label?: string;
      createdAt?: string;
      smartAccountAddress?: string;
    }>;
    pagination: {
      totalCount: number;
      page: number;
      limit: number;
    };
  };
}

/**
 * Create a new wallet
 */
export async function createWallet(label = 'Example Wallet'): Promise<WalletResponse> {
  if (!THIRDWEB_SECRET_KEY || !THIRDWEB_CLIENT_ID || !THIRDWEB_ENGINE_URL) {
    throw new Error('ThirdWeb configuration missing. Check environment variables.');
  }

  try {
    const response = await axios.post<WalletResponse>(
      `${THIRDWEB_ENGINE_URL}/v1/accounts`,
      {
        type: 'local',  // Using local wallet type
        label: label
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': THIRDWEB_CLIENT_ID,
          'x-secret-key': THIRDWEB_SECRET_KEY
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating wallet:', error.response?.data || error.message);
      throw new Error(`Failed to create wallet: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * List all wallets
 */
export async function listWallets(page = 1, limit = 100): Promise<WalletsListResponse> {
  if (!THIRDWEB_SECRET_KEY || !THIRDWEB_CLIENT_ID || !THIRDWEB_ENGINE_URL) {
    throw new Error('ThirdWeb configuration missing. Check environment variables.');
  }

  try {
    const response = await axios.get<WalletsListResponse>(
      `${THIRDWEB_ENGINE_URL}/v1/accounts?page=${page}&limit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': THIRDWEB_CLIENT_ID,
          'x-secret-key': THIRDWEB_SECRET_KEY
        }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error listing wallets:', error.response?.data || error.message);
      throw new Error(`Failed to list wallets: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
}

/**
 * Get a specific wallet by address
 * Note: ThirdWeb Engine doesn't have a direct endpoint to get a wallet by address,
 * so we list all wallets and filter for the one we want
 */
export async function getWalletByAddress(address: string): Promise<WalletResponse['result']> {
  try {
    const walletsData = await listWallets();
    const wallets = walletsData?.result?.accounts || [];
    
    const wallet = wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    
    if (!wallet) {
      throw new Error(`Wallet with address ${address} not found`);
    }
    
    return wallet;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error getting wallet:', error.message);
    } else {
      console.error('Error getting wallet:', error);
    }
    throw error;
  }
}

// Example usage (for testing purposes)
export async function runExamples(): Promise<void> {
  try {
    // Create a new wallet
    console.log('Creating a new wallet...');
    const newWallet = await createWallet('Test Wallet');
    console.log('Wallet created:', newWallet);
    
    // List all wallets
    console.log('\nListing all wallets...');
    const wallets = await listWallets();
    console.log(`Found ${wallets.result.accounts.length} wallets`);
    
    // Get a specific wallet by address (if we created one)
    if (newWallet?.result?.address) {
      console.log(`\nGetting wallet with address ${newWallet.result.address}...`);
      const wallet = await getWalletByAddress(newWallet.result.address);
      console.log('Found wallet:', wallet);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error running examples:', error.message);
    } else {
      console.error('Error running examples:', error);
    }
  }
}