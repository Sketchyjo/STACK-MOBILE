/**
 * Test script for ThirdWeb wallet creation
 * 
 * This script tests the wallet creation functionality directly
 * using the updated authentication method.
 */

import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

async function testWalletCreation() {
  console.log('Testing ThirdWeb wallet creation...');
  
  // Log environment variables (without sensitive values)
  console.log('Environment variables:');
  console.log('- THIRDWEB_ENGINE_URL:', process.env.THIRDWEB_ENGINE_URL);
  console.log('- THIRDWEB_CLIENT_ID:', process.env.THIRDWEB_CLIENT_ID ? '[Set]' : '[Not Set]');
  console.log('- THIRDWEB_SECRET_KEY:', process.env.THIRDWEB_SECRET_KEY ? '[Set]' : '[Not Set]');
  
  try {
    // Verify required environment variables
    if (!process.env.THIRDWEB_SECRET_KEY) {
      throw new Error('THIRDWEB_SECRET_KEY environment variable is required');
    }

    if (!process.env.THIRDWEB_ENGINE_URL) {
      throw new Error('THIRDWEB_ENGINE_URL environment variable is required');
    }

    if (!process.env.THIRDWEB_CLIENT_ID) {
      throw new Error('THIRDWEB_CLIENT_ID environment variable is required');
    }
    
    console.log('\nSending request to create wallet...');
    
    // Make the API request with x-secret-key header
    const response = await axios.post(
      `${process.env.THIRDWEB_ENGINE_URL}/v1/accounts`,
      {
        type: 'local',
        label: 'Test Wallet',
      },
      {
        headers: {
          'x-secret-key': process.env.THIRDWEB_SECRET_KEY,
          'Content-Type': 'application/json',
          'x-client-id': process.env.THIRDWEB_CLIENT_ID,
        },
      }
    );
    
    console.log('\nWallet created successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('\nError creating wallet:');
    if (axios.isAxiosError(error)) {
      console.error('Status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request headers:', error.config?.headers);
      console.error('Request data:', error.config?.data);
    } else {
      console.error(error);
    }
    throw error;
  }
}

// Run the test
testWalletCreation()
  .then(() => {
    console.log('\nTest completed successfully!');
    process.exit(0);
  })
  .catch(() => {
    console.error('\nTest failed!');
    process.exit(1);
  });