/**
 * ThirdWeb Engine Wallet API Examples
 * 
 * This file contains examples of how to interact with ThirdWeb Engine's wallet API
 * using axios for HTTP requests.
 */

const axios = require('axios').default;

// Environment variables (in a real application, these would be loaded from .env)
const THIRDWEB_SECRET_KEY = 'bkn-DIfzX2ePx3w2ima_NJQz4J6IWK-UnHkPOoIwJd4XQMtsfq6BU7UNUrRLcA3DfUjRR8eOILpKWR9IVB9Fgw';
const THIRDWEB_CLIENT_ID = '15234c3d7199bb407101f995acc9a51d';
const THIRDWEB_ENGINE_URL = 'https://engine.thirdweb.com';

/**
 * Create a new wallet
 */
async function createWallet(label = 'Example Wallet') {
  const options = {
    method: 'POST',
    url: `${THIRDWEB_ENGINE_URL}/v1/accounts`,
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': THIRDWEB_CLIENT_ID,
      'x-secret-key': THIRDWEB_SECRET_KEY
    },
    data: {
      type: 'local',  // Using local wallet type
      label: label
    }
  };

  try {
    const { data } = await axios.request(options);
    console.log('Wallet created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating wallet:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * List all wallets
 */
async function listWallets(page = 1, limit = 100) {
  const options = {
    method: 'GET',
    url: `${THIRDWEB_ENGINE_URL}/v1/accounts?page=${page}&limit=${limit}`,
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': THIRDWEB_CLIENT_ID,
      'x-secret-key': THIRDWEB_SECRET_KEY
    }
  };

  try {
    const { data } = await axios.request(options);
    console.log('Wallets retrieved successfully:', data);
    return data;
  } catch (error) {
    console.error('Error listing wallets:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get a specific wallet by address
 * Note: ThirdWeb Engine doesn't have a direct endpoint to get a wallet by address,
 * so we list all wallets and filter for the one we want
 */
async function getWalletByAddress(address) {
  try {
    const walletsData = await listWallets();
    const wallets = walletsData?.result?.accounts || [];
    
    const wallet = wallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    
    if (!wallet) {
      throw new Error(`Wallet with address ${address} not found`);
    }
    
    return wallet;
  } catch (error) {
    console.error('Error getting wallet:', error);
    throw error;
  }
}

// Example usage
async function runExamples() {
  try {
    // Create a new wallet
    console.log('Creating a new wallet...');
    const newWallet = await createWallet('Test Wallet');
    
    // List all wallets
    console.log('\nListing all wallets...');
    const wallets = await listWallets();
    
    // Get a specific wallet by address (if we created one)
    if (newWallet?.result?.address) {
      console.log(`\nGetting wallet with address ${newWallet.result.address}...`);
      const wallet = await getWalletByAddress(newWallet.result.address);
      console.log('Found wallet:', wallet);
    }
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Uncomment to run the examples
// runExamples();

module.exports = {
  createWallet,
  listWallets,
  getWalletByAddress
};