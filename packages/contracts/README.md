# Stack Mobile Smart Contracts

A comprehensive suite of smart contracts for the Stack Mobile platform, featuring micro-loans, XP rewards, and NFT achievements on the Etherlink testnet.

## 📋 Overview

This project contains three main smart contracts:

1. **StackToken** - ERC-1155 token for fractional asset management
2. **MicroLoan** - Decentralized micro-lending platform with collateral management
3. **XPReward** - ERC-721 based XP and achievement system with NFT rewards

## 🏗️ Architecture

### StackToken Contract
- **Type**: ERC-1155 Multi-Token Standard
- **Purpose**: Manages fractional asset tokens
- **Features**: 
  - Role-based minting (MINTER_ROLE)
  - Batch operations support
  - Royalty management

### MicroLoan Contract
- **Type**: Custom lending protocol
- **Purpose**: Facilitates micro-loans with collateral
- **Features**:
  - Collateral-backed loans
  - Flexible repayment terms
  - Automated liquidation
  - Lender pool management
  - Platform fee collection

### XPReward Contract
- **Type**: ERC-721 NFT with gamification
- **Purpose**: Manages user XP, levels, and achievements
- **Features**:
  - XP tracking and level progression
  - Achievement system
  - NFT reward minting
  - Activity streaks
  - Dynamic metadata

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Hardhat development environment

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
PRIVATE_KEY=your_private_key_here
ETHERLINK_RPC_URL=https://node.ghostnet.etherlink.com
```

### Compilation

```bash
npm run build
```

### Testing

```bash
npm test
```

## 📦 Deployment

### Deploy Individual Contracts

Deploy StackToken:
```bash
npm run deploy:etherlink
```

Deploy MicroLoan:
```bash
npm run deploy:microloan
```

Deploy XPReward:
```bash
npm run deploy:xpreward
```

### Deploy All Contracts

Deploy all contracts with proper integration:
```bash
npm run deploy:all
```

This will:
1. Deploy all three contracts
2. Set up role permissions
3. Configure contract integrations
4. Save deployment information

## 🔧 Contract Details

### MicroLoan Contract

#### Key Functions
- `requestLoan()` - Request a new loan with collateral
- `approveLoan()` - Lender approves a loan request
- `repayLoan()` - Borrower repays loan (partial or full)
- `liquidateLoan()` - Liquidate overdue loans
- `createLenderPool()` - Create lending pools

#### Roles
- `DEFAULT_ADMIN_ROLE` - Contract administration
- `LENDER_ROLE` - Can approve loans and create pools
- `LIQUIDATOR_ROLE` - Can liquidate overdue loans

#### Parameters
- Platform fee: 2.5% (250 basis points)
- Liquidation threshold: 110% (11000 basis points)
- Grace period: 7 days (604800 seconds)

### XPReward Contract

#### Key Functions
- `awardXP()` - Award XP for activities
- `unlockAchievement()` - Unlock user achievements
- `mintNFTReward()` - Mint NFT rewards
- `createAchievement()` - Create new achievements
- `createNFTTier()` - Create new NFT reward tiers

#### Roles
- `DEFAULT_ADMIN_ROLE` - Contract administration
- `XP_MANAGER_ROLE` - Can award XP and manage user progress
- `ACHIEVEMENT_MANAGER_ROLE` - Can create achievements and NFT tiers

#### XP Activities
- Loan completion: 100 XP
- Successful lending: 50 XP
- Referrals: 25 XP
- Daily login: 10 XP

## 🌐 Network Configuration

### Etherlink Testnet
- **Chain ID**: 128123
- **RPC URL**: https://node.ghostnet.etherlink.com
- **Explorer**: https://testnet.explorer.etherlink.com
- **Currency**: XTZ (Tezos)

## 📊 Contract Interactions

### Integration Flow

1. **User Registration**: XPReward contract tracks user profiles
2. **Loan Process**: 
   - User requests loan via MicroLoan
   - Upon successful repayment, XP is awarded
   - Achievements unlock based on activity
3. **Rewards**: NFT rewards minted through StackToken integration

### Role Management

The deployment script automatically sets up the following integrations:
- MicroLoan gets `XP_MANAGER_ROLE` in XPReward
- XPReward gets `MINTER_ROLE` in StackToken

## 🔐 Security Features

- **Access Control**: Role-based permissions using OpenZeppelin
- **Reentrancy Protection**: Guards against reentrancy attacks
- **Safe Math**: Built-in overflow protection
- **Emergency Functions**: Admin emergency withdrawal capabilities
- **Collateral Management**: Secure collateral handling with liquidation

## 📈 Gas Optimization

- Efficient struct packing
- Batch operations support
- Optimized storage patterns
- Minimal external calls

## 🧪 Testing

The contracts include comprehensive test suites covering:
- Core functionality
- Edge cases
- Security scenarios
- Integration testing
- Gas usage optimization

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For questions and support, please open an issue in the repository.

---

Built with ❤️ for the Stack Mobile ecosystem
