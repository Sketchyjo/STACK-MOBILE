<img width="1024" height="1536" alt="Poster Design Concepts Jul 27 2025" src="https://github.com/user-attachments/assets/b6d951bd-57bc-4dd5-b31e-e63471647071" />

# **STACK - Decentralized Investment Platform**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo%20SDK%2053-61DAFB.svg)](https://expo.dev/)
[![Blockchain](https://img.shields.io/badge/Blockchain-Etherlink%20Testnet-purple.svg)](https://etherlink.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## **Executive Summary**

STACK is a gamified, Web3-native investment platform designed for the Gen Z demographic. The core problem STACK solves is that traditional investing is often perceived as complex, intimidating, and misaligned with the social and community-driven values of young, digitally-native users. The proposed solution is an intuitive, mobile-first application that transforms investing into an automated and engaging habit through features like a virtual debit card with automated "Round-ups," a gamified "battle pass" system, and community-curated investment "Baskets".

## **🏗️ Project Architecture**

### **Tech Stack Overview**

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | React Native (Expo) | SDK 53+ | Cross-platform mobile app |
| **Styling** | NativeWind | 4.0+ | Utility-first CSS for React Native |
| **State Management** | Zustand | 4.5+ | Global state management |
| **Backend** | Express.js + TypeScript | 4.18+ | Serverless API functions |
| **Database** | Amazon Aurora Serverless | PostgreSQL 15+ | Primary relational database |
| **ORM** | Prisma | 5.10+ | Type-safe database client |
| **Authentication** | Thirdweb Auth | Latest | Web3-native authentication |
| **Blockchain** | Etherlink Testnet | - | Smart contract deployment |
| **Smart Contracts** | Solidity + Thirdweb SDK | Latest | DeFi functionality |
| **Testing** | Jest + Playwright | 29.7+ | Unit, integration & E2E testing |
| **Build System** | Turborepo | 1.12+ | Monorepo build orchestration |
| **Deployment** | Vercel + AWS | - | Serverless deployment |

### **Monorepo Structure**

```
STACK-MOBILE/
├── apps/
│   ├── mobile-app/          # React Native mobile application
│   │   ├── app/            # Expo Router pages
│   │   ├── components/     # Reusable UI components
│   │   ├── store/          # Zustand state management
│   │   ├── lib/            # Utility functions
│   │   └── types/          # TypeScript type definitions
│   └── backend-api/        # Express.js serverless API
│       ├── src/
│       │   ├── routes/     # API route handlers
│       │   ├── services/   # Business logic services
│       │   ├── middleware/ # Express middleware
│       │   └── lib/        # Database & utilities
│       └── prisma/         # Database schema & migrations
├── packages/
│   ├── shared-types/       # Shared TypeScript types
│   ├── ui-library/         # Shared UI components
│   ├── contracts/          # Smart contracts & deployment
│   │   ├── contract/       # Solidity smart contracts
│   │   ├── scripts/        # Deployment scripts
│   │   └── test/           # Contract tests
│   └── eslint-config/      # Shared ESLint configuration
├── docs/                   # Project documentation
│   ├── architecture/       # Technical architecture docs
│   ├── prd/               # Product requirements
│   └── ui/                # UI/UX documentation
└── web-bundles/           # AI agent configurations
```

## **🔗 Smart Contracts**

### **Contract Architecture**

STACK utilizes three core smart contracts deployed on the Etherlink testnet:

#### **1. StackToken (ERC-1155)**
- **Purpose**: Manages fractional asset ownership
- **Features**: 
  - Role-based minting permissions
  - Batch operations support
  - Royalty management
  - Metadata URI storage

#### **2. MicroLoan Contract**
- **Purpose**: Facilitates micro-loans with collateral
- **Features**:
  - Collateral-backed lending
  - Flexible repayment terms
  - Automated liquidation (110% threshold)
  - Lender pool management
  - Platform fee collection (2.5%)

#### **3. XPReward (ERC-721)**
- **Purpose**: Gamification system with NFT rewards
- **Features**:
  - XP tracking and level progression
  - Achievement system
  - NFT reward minting
  - Activity streaks
  - Dynamic metadata

### **Blockchain Configuration**

```javascript
// Etherlink Testnet Configuration
{
  chainId: 128123,
  rpcUrl: "https://node.ghostnet.etherlink.com",
  explorer: "https://testnet.explorer.etherlink.com",
  currency: "XTZ",
  faucet: "https://faucet.etherlink.com/"
}
```

### **Contract Deployment**

```bash
# Deploy all contracts
npm run deploy:all

# Deploy individual contracts
npm run deploy:etherlink      # StackToken
npm run deploy:microloan      # MicroLoan
npm run deploy:xpreward       # XPReward
```

## **🚀 Getting Started**

### **Prerequisites**

- Node.js 18.0.0+
- pnpm 8.0.0+
- Expo CLI
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/STACK-MOBILE.git
   cd STACK-MOBILE
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp apps/backend-api/.env.example apps/backend-api/.env
   cp apps/mobile-app/.env.example apps/mobile-app/.env
   cp packages/contracts/.env.example packages/contracts/.env
   ```

4. **Configure environment variables**
   ```bash
   # Backend API (.env)
   DATABASE_URL="postgresql://..."
   THIRDWEB_SECRET_KEY="your_thirdweb_secret"
   
   # Mobile App (.env)
   EXPO_PUBLIC_API_URL="http://localhost:3000"
   EXPO_PUBLIC_THIRDWEB_CLIENT_ID="your_client_id"
   
   # Smart Contracts (.env)
   PRIVATE_KEY="your_private_key_without_0x"
   THIRDWEB_SECRET_KEY="your_thirdweb_secret"
   ```

### **Development Commands**

```bash
# Start all development servers
pnpm dev

# Start individual services
pnpm --filter mobile-app dev      # Mobile app
pnpm --filter backend-api dev     # Backend API
pnpm --filter contracts test      # Smart contract tests

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

### **Mobile App Development**

```bash
cd apps/mobile-app

# Start Expo development server
pnpm start

# Run on iOS simulator
pnpm ios

# Run on Android emulator
pnpm android

# Build for production
pnpm build:prod
```

## **📱 Key Features**

### **Core Investment Experience**
- **Power Up Investments**: Simple one-tap investing in curated "Baskets"
- **Automated Round-ups**: Invest spare change from virtual debit card purchases
- **Payday Investing**: Scheduled automatic investments
- **AI Expert Tips**: Personalized investment guidance

### **Gamification System**
- **Battle Pass**: Seasonal progression system with rewards
- **Quest System**: Daily and weekly challenges
- **XP & Levels**: Experience points for financial activities
- **NFT Achievements**: Collectible rewards for milestones

### **Social & Community**
- **Community Curators**: User-generated investment baskets
- **For You Feed**: Personalized discovery algorithm
- **Social Investing**: Follow and learn from other investors

### **DeFi Integration**
- **Micro-loans**: Borrow against portfolio collateral
- **Yield Farming**: Automated yield optimization
- **Cross-chain Assets**: Multi-blockchain asset support

## **🧪 Testing Strategy**

### **Testing Pyramid**

```bash
# Unit Tests
pnpm test:unit

# Integration Tests  
pnpm test:integration

# End-to-End Tests
pnpm test:e2e

# Smart Contract Tests
pnpm --filter contracts test
```

### **Test Coverage**
- **Frontend**: Jest + React Native Testing Library
- **Backend**: Jest + Supertest
- **Smart Contracts**: Hardhat + Chai
- **E2E**: Playwright

## **🚀 Deployment**

### **Mobile App Deployment**

```bash
# Build for app stores
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### **Backend Deployment**

```bash
# Deploy to Vercel
vercel deploy

# Deploy to production
vercel --prod
```

### **Smart Contract Deployment**

```bash
# Deploy to Etherlink testnet
pnpm --filter contracts deploy:all

# Verify contracts
pnpm --filter contracts verify
```

## **📊 Database Schema**

The application uses PostgreSQL with Prisma ORM. Key entities include:

- **Users**: Authentication and profile management
- **Portfolios**: Investment holdings and performance
- **Baskets**: Curated investment collections
- **Transactions**: Investment and trading history
- **Loans**: Micro-lending records
- **Gamification**: XP, achievements, and battle pass progress

```bash
# Database operations
pnpm --filter backend-api db:generate  # Generate Prisma client
pnpm --filter backend-api db:push      # Push schema changes
pnpm --filter backend-api db:migrate   # Run migrations
pnpm --filter backend-api db:studio    # Open Prisma Studio
```

## **Problem Statement**

Gen Z represents a large, digitally-native generation that is significantly underserved by traditional financial platforms. These platforms often present a high barrier to entry through complex financial jargon, high capital requirements, and user experiences that lack the engagement and social integration this demographic expects. This intimidation factor creates a major obstacle to early wealth creation for an entire generation. Existing solutions fail to connect with Gen Z's values of authenticity, community, and digital identity.

## **🎯 Proposed Solution**

STACK will be a Web3-native financial platform that reframes investing through the familiar and engaging concepts of gaming and social media. By integrating investing into daily life via a virtual debit card and features like automated "Round-ups" and "Payday" investments, STACK converts it from a daunting task into an automated habit. The platform will feature curated, theme-based "Baskets" of assets, a gamified progression system with quests and rewards, a personalized "For You" feed for discovering opportunities, and an AI Expert to provide guidance.

## **👥 Target Users**

* **Primary User Segment: Gen Z "Digital Native" (ages 18-25)**
    * **Profile:** Tech-savvy, highly active on social media, and values authenticity and community in their digital experiences.
    * **Needs & Pains:** They are comfortable with Web3 concepts but are often intimidated by the complexity of traditional finance. They seek low-friction, mobile-first experiences that are both engaging and easy to understand.

## **📈 Goals & Success Metrics**

### **Business Objectives**
* To make investing accessible and simple for Gen Z.
* To create an engaging and habit-forming user experience.
* To automate the investment process by linking it to daily spending habits.

### **User Success Metrics**
* A new user can successfully sign up and make their first "Power Up" investment in under 3 minutes.
* Frequent actions, such as investing and checking progress, are achievable in just a few taps.

### **Key Performance Indicators (KPIs)**
* Daily Active Users (DAU)
* User Retention Rate
* Volume of "Power Up" investments
* Total value invested via "Round-ups"
* Quest completion rate

## **🎯 MVP Scope**

### **Core Features (Must Have)**
* **User Onboarding:** A seamless sign-up process that includes automatic and secure wallet creation and the distribution of a "free starter slice" to new users.
* **Core Investment Experience:** The ability for users to discover and invest in curated "Baskets" using a simple "Power Up" action, followed by a personalized tip from an AI Expert.
* **Automated Investing:** "Round-up" feature to invest spare change from virtual debit card purchases and a "Payday" feature for scheduled investments.
* **Gamification:** A "Battle Pass" and quest system to reward users for building positive financial habits.
* **Personalized Discovery:** A "For You" algorithmic feed to discover relevant Baskets and quests.
* **Ecosystem & Utility:** A program for users to become "Community Curators" and the ability for users to take out micro-loans against their portfolio collateral.

### **Out of Scope for MVP**
* Advanced social features (e.g., direct messaging, follower feeds).
* Integration with multiple fiat on-ramps (e.g., Plaid, Stripe Direct).
* A web-based or desktop application.
* Advanced analytics dashboards for Community Curators.
* Support for traditional asset classes like stocks and ETFs.
* Internationalization (multi-language/currency support).

## **🚀 Post-MVP Vision**
* **Phase 2: Deepening the Social Ecosystem:** Introduce advanced social features, curator tools, and community events.
* **Phase 3: Expanding Financial Utility:** Integrate additional on-ramps, explore new asset classes, and enhance AI-driven financial planning.
* **Phase 4: Platform Expansion:** Develop a companion web application and pursue international expansion.

## **⚙️ Technical Considerations**
* **Platform Requirements:** The application must be a native mobile app for iOS & Android, designed with a mobile-first approach.
* **Technology Preferences:**
    * **Frontend:** React Native.
    * **Backend:** Serverless architecture.
    * **Database:** Amazon Aurora Serverless (PostgreSQL).
    * **Blockchain:** Must be built on the citrea ecosystem using the Thirdweb SDK.
* **Architecture Considerations:**
    * **Repository:** A Monorepo structure will be used to manage all code.
    * **Testing:** A full testing pyramid (Unit, Integration, E2E) is required.

## **🔒 Constraints & Assumptions**
### **Constraints**
* The platform must be built on and integrate with the Citrea blockchain ecosystem.
* The user interface must comply with WCAG 2.1 Level AA accessibility standards.

### **Key Assumptions**
* The target Gen Z audience will be receptive to the gamified, Web3-based approach to investing.
* Automating micro-investments through daily habits will be a key driver for user retention.
* The community curation model will foster trust and drive engagement on the platform.

## **⚠️ Risks & Open Questions**
### **Key Risks**
* **Regulatory Risk:** The crypto-finance space is subject to evolving regulations.
* **Market Adoption Risk:** The novel approach may face challenges in gaining initial user trust compared to traditional platforms.
* **Technical Risk:** The performance of the underlying blockchain could impact user experience.
* **Security Risk:** As a financial application, the platform is a high-value target and requires robust security measures.

### **Open Questions**
* What is the specific business model and revenue generation strategy (e.g., fees, interest)?
* What are the detailed criteria and approval process for becoming a Community Curator?
* What is the go-to-market strategy for acquiring the first cohort of users?

## **🤝 Contributing**

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## **📄 License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## **📞 Support & Community**

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/STACK-MOBILE/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/STACK-MOBILE/discussions)
- **Discord**: [Join our Discord](https://discord.gg/stack-community)
- **Twitter**: [@StackInvest](https://twitter.com/StackInvest)

## **🙏 Acknowledgments**

- Built with [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/)
- Smart contracts powered by [Thirdweb](https://thirdweb.com/)
- Deployed on [Etherlink](https://etherlink.com/) blockchain
- UI components from [NativeWind](https://nativewind.dev/)
- Database management with [Prisma](https://prisma.io/)

---

**Made with ❤️ for the next generation of investors**
