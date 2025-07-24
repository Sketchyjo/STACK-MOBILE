# StackToken Deployment Guide

## Overview
This guide covers deploying the StackToken ERC-1155 smart contract to Etherlink testnet using Thirdweb platform.

## Prerequisites

### 1. Environment Setup
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure environment variables in `.env`:
   ```bash
   # Get testnet XTZ from: https://faucet.etherlink.com/
   PRIVATE_KEY=your_private_key_without_0x_prefix
   
   # Get API key from: https://thirdweb.com/dashboard/settings/api-keys
   THIRDWEB_SECRET_KEY=your_thirdweb_secret_key
   ```

### 2. Get Testnet Funds
- Visit [Etherlink Faucet](https://faucet.etherlink.com/) <mcreference link="https://thirdweb.com/etherlink-testnet" index="3">3</mcreference>
- Request testnet XTZ for your wallet address
- Minimum 0.1 XTZ recommended for deployment

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

## Deployment Methods

### Method 1: Using Thirdweb CLI (Recommended)
This method provides a web interface for deployment and automatic verification.

```bash
npm run deploy:thirdweb
```

**Process:**
1. Command opens Thirdweb dashboard in browser
2. Connect your wallet with testnet XTZ
3. Select Etherlink testnet from network dropdown
4. Configure constructor parameters:
   - **Default Admin**: Your wallet address
   - **Name**: "StackToken"
   - **Symbol**: "STACK"
   - **Royalty Recipient**: Your wallet address
   - **Royalty BPS**: 500 (5%)
5. Review and deploy
6. Contract is automatically verified on Etherlink explorer

### Method 2: Using Hardhat Script
Direct deployment using Hardhat with custom script.

```bash
npm run deploy:etherlink
```

**Process:**
1. Deploys using configured private key
2. Outputs contract address and verification details
3. Manual verification required

## Post-Deployment Verification

### 1. Contract Verification
- **Thirdweb Method**: Automatic verification included
- **Manual Method**: Use Etherlink explorer verification tools

### 2. Contract Testing
After deployment, verify contract functionality:

```javascript
// Example verification script
const contractAddress = "0x..."; // Your deployed contract address
const StackToken = await ethers.getContractAt("StackToken", contractAddress);

// Check contract details
console.log("Name:", await StackToken.name());
console.log("Symbol:", await StackToken.symbol());
console.log("Current Token ID:", await StackToken.getCurrentTokenId());
```

### 3. Explorer Links
- **Etherlink Testnet Explorer**: https://testnet.explorer.etherlink.com/
- **Contract URL**: `https://testnet.explorer.etherlink.com/address/{CONTRACT_ADDRESS}`

## Network Configuration

### Etherlink Testnet Details <mcreference link="https://thirdweb.com/etherlink-testnet" index="3">3</mcreference>
- **Chain ID**: 128123
- **RPC URL**: https://128123.rpc.thirdweb.com
- **Currency**: XTZ (Tezos)
- **Explorer**: https://testnet.explorer.etherlink.com

## Troubleshooting

### Common Issues

1. **Insufficient Funds**
   - Ensure wallet has enough XTZ for gas fees
   - Get more from faucet if needed

2. **Private Key Issues**
   - Ensure private key is without "0x" prefix
   - Verify key corresponds to funded wallet

3. **Network Connection**
   - Verify RPC endpoint is accessible
   - Check internet connection

4. **Contract Compilation**
   - Run `npm run build` before deployment
   - Ensure all dependencies are installed

### Support Resources
- **Thirdweb Discord**: https://discord.gg/thirdweb
- **Etherlink Documentation**: https://etherlink.com/docs
- **Tezos Developer Portal**: https://tezos.com/developers

## Security Notes

⚠️ **Important Security Reminders:**
- Never commit `.env` file to version control
- Keep private keys secure and never share them
- Use testnet for development and testing only
- Verify contract addresses before interacting with them

## Next Steps

After successful deployment:
1. Document the contract address in your project
2. Update frontend configuration with contract address
3. Test contract functionality using Thirdweb SDK
4. Implement balance query functionality in your application