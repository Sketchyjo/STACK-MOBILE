# **Epic Details**

## **Epic 1: Foundation & User Onboarding**

**Expanded Goal:** This epic lays the essential groundwork for the entire STACK platform. It focuses on creating a secure and scalable project structure, setting up the core Web3 components using Thirdweb, and designing a seamless onboarding flow that immediately engages new users by giving them their first taste of ownership.

---

### **Story 1.1: Project Scaffolding & Core Dependencies**

- **As a** Developer,
- **I want** a clean monorepo structure with all core dependencies and tooling installed,
- **so that** I can begin building features in a consistent and secure environment.

**Acceptance Criteria:**

1. A monorepo is initialized with packages for contracts, backend-api, and mobile-app.
2. Core dependencies for React Native, Etherlink integration using the **Thirdweb SDK**, and the Serverless backend are installed and configured.
3. Linters, formatters (e.g., ESLint, Prettier), and testing frameworks (e.g., Jest) are configured at the root level.
4. A basic "hello world" test passes in each package, proving the setup is correct.

---

### **Story 1.2: Basic Smart Contract for Asset Ownership**

- **As a** Developer,
- **I want** a basic smart contract deployed on the Etherlink testnet that can track fractional ownership of assets,
- **so that** we have a foundational on-chain component to build upon.

**Acceptance Criteria:**

1. A simple smart contract (e.g., following ERC-1155 standard) is created in the contracts package.
2. The contract includes functions for a trusted admin to mint fractional tokens representing ownership to a user's wallet address.
3. The contract is deployed to an Etherlink testnet **using the Thirdweb platform/CLI**.
4. The ownership balance of any fractional asset for any wallet address can be queried from the contract **via the Thirdweb SDK**.

### **Story 1.2a: Database Schema Initialization**

- **As a** Developer,
- **I want** the initial database schema to be created and version-controlled,
- **so that** backend services have a stable and ready database to connect to for all subsequent features.

**Acceptance Criteria:**

1.  The Prisma schema defined in the architecture document is finalized and committed.
2.  A database migration is generated from the Prisma schema.
3.  A script exists to apply the migration, creating all necessary tables and relationships in a development database.
4.  The backend services can successfully connect to the initialized database without errors.

---

### **Story 1.3: User Sign-Up and Wallet Creation**

- **As a** new user,
- **I want** to easily sign up for a STACK account and have a secure wallet automatically created for me,
- **so that** I can start my investment journey without understanding complex crypto concepts.

**Acceptance Criteria:**

1. A user can sign up for an account using a simple method (e.g., social login or email/password).
2. Upon sign-up, a new, secure in-app wallet is generated and associated with their user account **using the Thirdweb SDK**.
3. The user is successfully authenticated, and a session token is returned to the client.
4. The user's new wallet address is securely stored and is not exposed to the client unless necessary.

---

### **Story 1.4: Component-First Development Setup**

- **As a** Developer,
- **I want** to establish a component-first development approach,
- **so that** all required UI components are built before constructing complete screens.

**Acceptance Criteria:**

1. A component library structure is established within the mobile app codebase.
2. Core UI components are identified and listed based on the design specifications.
3. A storybook or similar component documentation system is set up.
4. Development guidelines document the component-first approach, requiring all components to be built and tested before screen assembly.

---

### **Story 1.5: Onboarding Flow & Free Starter Slice**

- **As a** new user,
- **I want** to go through a simple onboarding flow and receive a "free starter slice" of a pre-determined asset,
- **so that** I feel immediately welcomed and can experience ownership without any risk.

**Acceptance Criteria:**

1. After sign-up, the user is presented with a simple, multi-step onboarding UI that explains the app's core concepts.
2. Upon completing the onboarding flow, the backend uses the **Thirdweb SDK** to trigger the smart contract to mint a small, pre-defined fractional asset to the user's wallet.
3. The mobile app displays a confirmation/celebration message that the user has received their "starter slice."
4. A basic portfolio screen exists where the user can see their first asset.

## **Epic 2: The Core Investment Experience**

**Expanded Goal:** This epic delivers the heart of the STACK experience. It builds on the user's foundation from Epic 1 to introduce the core investment loop, focusing on simplicity and engagement. By the end of this epic, users will be able to discover, invest in, and get feedback on curated "Baskets" using a clear, intuitive, and jargon-free interface.

---

### **Story 2.1: Display Curated Investment Baskets**

- **As a** user,
- **I want** to see a list of curated "Baskets" with clear, visual information,
- **so that** I can easily browse and understand my investment options.

**Acceptance Criteria:**

1. The mobile app fetches and displays a list of available "Baskets" from the backend.
2. Each "Basket" in the list is displayed with its name, a descriptive icon or logo, and a simple performance indicator (e.g., "+5% this week").
3. The display uses simple names and logos, not financial tickers, for all assets.
4. Tapping on a "Basket" navigates the user to a dedicated "Basket Detail View."

---

### **Story 2.2: View Basket Details**

- **As a** user,
- **I want** to view the detailed contents and philosophy of a specific "Basket,"
- **so that** I can make an informed decision before investing.

**Acceptance Criteria:**

1. The "Basket Detail View" displays the Basket's name, a short description, and its risk level (e.g., Low, Medium, High).
2. The screen lists all the individual assets contained within the "Basket," showing each with its logo and percentage allocation.
3. A simple, non-technical chart visualizes the "Basket's" historical performance.
4. The view includes a clear "Power Up" button to initiate an investment.

---

### **Story 2.3: Invest in a Basket ("Power Up")**

- **As a** user,
- **I want** a simple, fast way to invest a specific amount of money into a "Basket,"
- **so that** the process feels effortless and encouraging.

**Acceptance Criteria:**

1. On the "Basket Detail View," the user can tap the "Power Up" button.
2. A simple modal or screen appears allowing the user to input a dollar amount (minimum $1).
3. Upon confirmation, the backend processes the investment, triggering the necessary smart contract interaction via the Thirdweb SDK.
4. The user's portfolio is updated to reflect their new fractional ownership of the "Basket."
5. The user receives a clear, immediate confirmation message upon a successful transaction.

---

### **Story 2.4: Receive AI Tip Post-Investment**

- **As a** user,
- **I want** to receive a simple, personalized tip from the AI Expert immediately after I make an investment,
- **so that** I can learn and feel more confident about my financial decisions.

**Acceptance Criteria:**

1. Immediately following a successful "Power Up" action, the UI displays a message from the AI Expert.
2. The tip is contextual to the "Basket" the user just invested in (e.g., "Great choice\! The 'Gamer Basket' often sees activity around major game releases...").
3. The AI tip is delivered in a non-intrusive way (e.g., a toast notification or a chat bubble).
4. The tip is saved to a user's notification or message history for later review.

## **Epic 3: Gamification & Automated Investing**

**Expanded Goal:** This epic focuses on making investing a sticky, effortless, and deeply personalized habit. It builds on the core investment loop by introducing a powerful gamification layer to drive engagement and two automated investing features to promote consistent, passive wealth creation. By the end of this epic, STACK will transform from a tool a user _can_ use into a system that works _for_ them.

---

### **Story 3.1: Configure "Round-up" Investing**

- **As a** user with a virtual debit card,
- **I want** to set up the "round-up" feature for my card,
- **so that** my spare change is automatically invested whenever I spend.

**Acceptance Criteria:**

1. An interface exists within the card section of the app for a user to enable or disable the "Round-up" feature.
2. The feature is only available to users who have requested and received their virtual debit card.
3. When enabled, all transactions on the user's STACK virtual debit card are rounded up to the nearest dollar.
4. The accumulated spare change is automatically invested into a user's pre-selected default "Basket" at a set interval (e.g., once a day or once it hits a $5 threshold).
5. The user can view a clear history of all their "round-up" investments.

---

### **Story 3.2: Configure "Payday" Investing**

- **As a** user,
- **I want** to schedule automatic investments to coincide with my payday,
- **so that** I can consistently invest without having to think about it.

**Acceptance Criteria:**

1. A section in the app allows the user to schedule recurring investments.
2. The user can select the investment amount, the target "Basket," and a frequency (e.g., weekly, bi-weekly, monthly on a specific date).
3. The system successfully and automatically executes the scheduled investment on the chosen date.
4. The user can easily pause, edit, or cancel their "Payday Investing" plan at any time.

---

### **Story 3.3: "Battle Pass" & Quest System**

- **As a** user,
- **I want** to see a "battle pass" or quest log with challenges and rewards,
- **so that** I feel motivated and guided on my investment journey.

**Acceptance Criteria:**

1. A "Quests" or "Battle Pass" screen is available in the app.
2. The screen displays a list of available quests with clear objectives (e.g., "Power Up for the first time," "Set up Round-ups," "Invest in 3 different Baskets").
3. The system accurately tracks the user's progress toward completing each quest.
4. Upon completing a quest, the user receives a notification and a tangible reward (e.g., XP, a small bonus investment, a cosmetic item).

---

### **Story 3.4: "For You" Algorithmic Feed**

- **As a** user,
- **I want** to see a personalized "For You" feed of investment opportunities,
- **so that** I can discover new Baskets and quests that are relevant to my interests and behavior.

**Acceptance Criteria:**

1. The app's main dashboard features a dynamic, scrollable, personalized feed.
2. The feed contains a mix of content, including suggested "Baskets," new quests from the "Battle Pass," and potentially content from "Community Curators."
3. A backend algorithm uses the user's investment history, stated interests, and in-app behavior to tailor the content of the feed.
4. All content in the feed includes clear calls-to-action (e.g., "Invest in this Basket," "Start this Quest").

---

### **Story 3.5: Virtual Debit Card Issuance**

- **As a** user who has completed onboarding,
- **I want** to request a virtual debit card from the card section of the app,
- **so that** I can connect my investments with real-world spending when I'm ready.

**Acceptance Criteria:**

1. The card section of the app includes a clear option to request a virtual debit card.
2. Upon request, a unique virtual debit card number, CVV, and expiry date are generated and associated with the user's account.
3. The card is initially in an inactive state with a zero balance.
4. The card details are securely stored and can be retrieved for display to the authenticated user within the card section of the app.
5. The user can only access this feature after completing the onboarding process.

## **Epic 4: Ecosystem & Advanced Utility**

**Expanded Goal:** This epic evolves STACK from a personal investment tool into a true community-driven ecosystem with advanced financial utility. It introduces the "Community Curator" program, creating a social marketplace for investment strategies, and unlocks the value of users' portfolios by allowing them to be used as collateral for micro-loans.

---

### **Story 4.1: Community Curator Application & Profile**

- **As a** successful user,
- **I want** to apply to become a "Community Curator" and set up a public profile,
- **so that** I can share my investment strategies with the community.

**Acceptance Criteria:**

1. Users can access an application form within the app to become a "Community Curator."
2. The application is only available to users who meet pre-defined criteria (e.g., minimum portfolio value, time on platform, performance history).
3. Once approved by the system, a user can set up their public curator profile, including a name, bio, and investment philosophy.
4. The curator's profile page is publicly viewable by other users.

---

### **Story 4.2: Curate and Publish Baskets**

- **As a** Community Curator,
- **I want** to create, name, and publish my own "Baskets" of assets,
- **so that** other users can discover and invest in my strategies.

**Acceptance Criteria:**

1. An approved curator has access to a "Basket" creation tool.
2. The curator can select assets and define their percentage allocations within the new "Basket."
3. The curator can add a name, description, and icon for their "Basket."
4. The curator can publish the "Basket," making it visible in the discovery sections of the app for other users.
5. The system is able to track the performance of community-created "Baskets" and attribute a small, transparent fee to the curator.

---

### **Story 4.3: View Portfolio as Collateral**

- **As a** user with a portfolio,
- **I want** to see how much I can borrow against my assets,
- **so that** I understand my options for a micro-loan.

**Acceptance Criteria:**

1. A "Loans" section in the app displays the user's current total portfolio value.
2. The system calculates and clearly displays the maximum loan amount available based on a set loan-to-value (LTV) ratio (e.g., 40% of portfolio value).
3. The current interest rate and basic loan terms are clearly displayed to the user.

---

### **Story 4.4: Request and Receive a Micro-Loan**

- **As a** user with a virtual debit card,
- **I want** to easily request a loan against my portfolio and have the funds instantly available on my virtual debit card,
- **so that** I can access liquidity without selling my assets.

**Acceptance Criteria:**

1. The user can request a loan up to their maximum available amount through a simple interface.
2. The loan feature is only available to users who have requested and received their virtual debit card.
3. Upon confirming the loan terms, the user's portfolio assets are programmatically marked as collateral.
4. The loan amount is instantly credited to the user's STACK virtual debit card, making the funds available to spend.
5. The user's "Loans" dashboard is updated to show the outstanding balance, interest accrued, and repayment schedule.
6. A basic automated system is in place to notify users if their collateral value drops near a liquidation threshold.
