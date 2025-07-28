require('@nomicfoundation/hardhat-ethers');
require('@nomicfoundation/hardhat-chai-matchers');
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    CitreaTestnet: {
      url: 'https://rpc.testnet.citrea.xyz',
      chainId: 5115,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contract',
    tests: './test',
  },
  solidity: {
    version: '0.8.23',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
