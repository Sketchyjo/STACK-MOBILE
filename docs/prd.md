# **STACK Product Requirements Document (PRD)**

## **Goals and Background Context**

### **Goals**

* To make investing accessible and simple for Gen Z by removing traditional jargon and high capital requirements.
* To create an engaging and habit-forming experience by integrating gamification and community-driven social features.
* To automate the investment process by seamlessly linking it to users' daily spending and income habits.
* To empower users with immediate liquidity and real-world utility for their digital assets.
* To provide personalized, AI-driven guidance that builds user confidence and financial literacy.

### **Background Context**

Gen Z represents a digitally-native generation that is largely underserved by traditional financial platforms. They often find the world of investing to be complex, intimidating, and misaligned with their social and community-driven values, creating a significant barrier to early wealth creation.

STACK addresses this gap by creating a Web3-native financial platform that leverages familiar, engaging concepts from gaming (quests, rewards) and social media (community curation, personalization). By integrating investing into daily life through features like a virtual debit card and automated round-ups, STACK transforms it from a daunting task into an intuitive and automated habit.

### **Change Log**

| Date | Version | Description | Author |
| :---- | :---- | :---- | :---- |
| 2025-07-20 | 1.0 | Initial draft based on approved Project Brief. | John (PM) |

## **Requirements**

### **Functional**

* **FR1:** The system shall display assets using simple logos and brand names instead of financial tickers.
* **FR2:** The user interface shall use engaging action words like "Power Up" and "Cash Out" for investment and withdrawal actions.
* **FR3:** The system's AI Expert shall provide a personalized, contextual tip to the user immediately following an investment action.
* **FR4:** The system shall include a gamified progression system, such as a "battle pass" or quest log, to reward user engagement and financial habits.
* **FR5:** The system shall present a personalized, algorithmically-curated "For You" feed of investment opportunities to the user.
* **FR6:** Users shall be able to invest in curated, theme-based "Baskets" of assets.
* **FR7:** The system shall allow users to automatically invest the spare change from purchases by rounding up transactions made with their virtual debit card.
* **FR8:** The system shall provide a mechanism for qualified users to create, share, and manage their own "Baskets" as Community Curators.
* **FR9:** Users shall be able to request and receive micro-loans using their investment portfolio as collateral.
* **FR10:** The system shall allow users to set up automated investments that coincide with their payday.
* **FR11:** The system shall provide new users with a small, free "starter slice" of an asset to encourage discovery and onboarding.

### **Non-Functional**

* **NFR1:** All user-facing actions must provide immediate sensory feedback, ensuring the experience feels fast, clear, and responsive.
* **NFR2:** The platform must be built on and integrate with the Etherlink blockchain ecosystem.
* **NFR3:** The user onboarding process and all core workflows must be designed for low cognitive load, prioritizing simplicity and clarity.
* **NFR4:** As a financial application, the system must implement robust security measures to protect user funds, data, and digital identity.
* **NFR5:** The application must be designed with a mobile-first approach, ensuring a fully responsive and optimized experience on mobile devices.

## **User Interface Design Goals**

### **Overall UX Vision**

The user experience will feel less like a traditional finance app and more like a modern social or gaming application. The vision is to create an interface that is visually engaging, builds confidence through radical clarity, and feels empowering. Every interaction should be simple, provide immediate feedback, and reinforce our core principles of hope, identity, and participation.

### **Key Interaction Paradigms**

* **Gamified Actions:** Core investment actions ("Power Up") will be treated as rewarding moments with satisfying visual and haptic feedback.
* **Personalized Discovery:** The primary method for discovering new investment opportunities will be through a "For You" algorithmic feed, not complex search tools or screeners.
* **Social & Identity Driven:** The interface will prominently feature "Community Curators" and allow users to visually showcase their portfolio as a "social badge" of their identity.
* **Automated & Passive:** Key features like "Round-ups" and "Payday Investing" will be "set and forget," with a simple and clear interface for managing these automations.

### **Core Screens and Views**

This is a conceptual list of the primary areas needed to fulfill the product's requirements:

* **Onboarding:** A guided setup that introduces the "free starter slice" and core concepts.
* **Dashboard / "For You" Feed:** The main screen for discovery and a simple overview of the user's portfolio.
* **Basket Detail View:** An exploratory screen to see the contents and philosophy behind a curated "Basket."
* **Quest / Battle Pass Screen:** A dedicated area to track gamified progress, streaks, and claim rewards.
* **Card & Spending Hub:** A screen to manage the virtual debit card, view transactions, and configure the "Round-up" feature.
* **Micro-loan Hub:** A simple interface to manage portfolio collateral and loan status.
* **AI Expert Interface:** A conversational or integrated UI to interact with the AI for personalized tips and education.

### **Accessibility**

* **Standard:** WCAG AA

### **Branding**

* **Status:** To be defined. A visual identity needs to be established that resonates with Gen Z—likely modern, clean, dark-mode friendly, and potentially with customizable themes or elements (like the card skins).

### **Target Device and Platforms**

* **Platform:** Native Mobile App (iOS & Android)

## **Technical Assumptions**

### **Repository Structure: Monorepo**

* **Assumption:** We will use a Monorepo to manage the codebase. This will include packages for the mobile app, backend services, and smart contracts.
* **Rationale:** With a cross-platform mobile app, a shared backend, and smart contracts, a monorepo will make it significantly easier to share code (like data types and API clients), manage dependencies, and streamline the build process across the entire platform.

### **Service Architecture: Serverless**

* **Assumption:** The backend will be built using a Serverless architecture (e.g., cloud functions for API endpoints).
* **Rationale:** This approach is highly scalable, cost-effective (pay-per-use), and reduces infrastructure management overhead, making it an excellent fit for an MVP.

### **Testing Requirements: Full Testing Pyramid**

* **Assumption:** We will enforce a comprehensive testing strategy that includes Unit, Integration, and End-to-End (E2E) tests.
* **Rationale:** For a financial application handling user funds, security and reliability are non-negotiable. A full testing pyramid is the industry best practice to ensure the application is robust and functions as expected.

### **Additional Technical Assumptions and Requests**

* **Primary Blockchain:** All on-chain activities will be built for the Etherlink blockchain ecosystem.
* **Mobile Framework:** The mobile app will be built using a cross-platform framework, **React Native**, to prioritize development speed for the MVP while delivering a high-quality experience on both iOS and Android.

## **Epic List**

* **Epic 1: Foundation & User Onboarding**
  * **Goal:** To establish the core technical foundation of the application, including user accounts and the smart contract setup, while onboarding new users with an engaging, low-friction experience that includes their "free starter slice."
* **Epic 2: The Core Investment Experience**
  * **Goal:** To implement the primary investment loop, allowing users to simply and intuitively invest in curated "Baskets" and receive immediate, personalized feedback from the AI Expert.
* **Epic 3: Gamification & Automated Investing**
  * **Goal:** To drive long-term user engagement and habit formation by introducing the gamified "battle pass" system, the personalized "For You" feed, and powerful automated investment features like "Round-ups" and "Payday Investing."
* **Epic 4: Ecosystem & Advanced Utility**
  * **Goal:** To expand the platform's utility and create a community-driven ecosystem by enabling users to become "Community Curators" and leverage their assets to secure micro-loans.

## **Epic Details**

### **Epic 1: Foundation & User Onboarding**

**Expanded Goal:** This epic lays the essential groundwork for the entire STACK platform. It focuses on creating a secure and scalable project structure, setting up the core Web3 components using Thirdweb, and designing a seamless onboarding flow that immediately engages new users by giving them their first taste of ownership.

---

#### **Story 1.1: Project Scaffolding & Core Dependencies**

* **As a** Developer,
* **I want** a clean monorepo structure with all core dependencies and tooling installed,
* **so that** I can begin building features in a consistent and secure environment.

**Acceptance Criteria:**

1. A monorepo is initialized with packages for contracts, backend-api, and mobile-app.
2. Core dependencies for React Native, Etherlink integration using the **Thirdweb SDK**, and the Serverless backend are installed and configured.
3. Linters, formatters (e.g., ESLint, Prettier), and testing frameworks (e.g., Jest) are configured at the root level.
4. A basic "hello world" test passes in each package, proving the setup is correct.

---

#### **Story 1.2: Basic Smart Contract for Asset Ownership**

* **As a** Developer,
* **I want** a basic smart contract deployed on the Etherlink testnet that can track fractional ownership of assets,
* **so that** we have a foundational on-chain component to build upon.

**Acceptance Criteria:**

1. A simple smart contract (e.g., following ERC-1155 standard) is created in the contracts package.
2. The contract includes functions for a trusted admin to mint fractional tokens representing ownership to a user's wallet address.
3. The contract is deployed to an Etherlink testnet **using the Thirdweb platform/CLI**.
4. The ownership balance of any fractional asset for any wallet address can be queried from the contract **via the Thirdweb SDK**.

#### **Story 1.2a: Database Schema Initialization**

* **As a** Developer,
* **I want** the initial database schema to be created and version-controlled,
* **so that** backend services have a stable and ready database to connect to for all subsequent features.

**Acceptance Criteria:**

1.  The Prisma schema defined in the architecture document is finalized and committed.
2.  A database migration is generated from the Prisma schema.
3.  A script exists to apply the migration, creating all necessary tables and relationships in a development database.
4.  The backend services can successfully connect to the initialized database without errors.

---

#### **Story 1.3: User Sign-Up and Wallet Creation**

* **As a** new user,
* **I want** to easily sign up for a STACK account and have a secure wallet automatically created for me,
* **so that** I can start my investment journey without understanding complex crypto concepts.

**Acceptance Criteria:**

1. A user can sign up for an account using a simple method (e.g., social login or email/password).
2. Upon sign-up, a new, secure in-app wallet is generated and associated with their user account **using the Thirdweb SDK**.
3. The user is successfully authenticated, and a session token is returned to the client.
4. The user's new wallet address is securely stored and is not exposed to the client unless necessary.

---

#### **Story 1.4: Virtual Debit Card Issuance**

* **As a** new user,
* **I want** a virtual debit card to be instantly issued upon account creation,
* **so that** I can see the connection between my investments and real-world spending from day one.

**Acceptance Criteria:**

1. A unique virtual debit card number, CVV, and expiry date are generated and associated with the user's account.
2. The card is initially in an inactive state with a zero balance.
3. The card details are securely stored and can be retrieved for display to the authenticated user within the app.

---

#### **Story 1.5: Onboarding Flow & Free Starter Slice**

* **As a** new user,
* **I want** to go through a simple onboarding flow and receive a "free starter slice" of a pre-determined asset,
* **so that** I feel immediately welcomed and can experience ownership without any risk.

**Acceptance Criteria:**

1. After sign-up, the user is presented with a simple, multi-step onboarding UI that explains the app's core concepts.
2. Upon completing the onboarding flow, the backend uses the **Thirdweb SDK** to trigger the smart contract to mint a small, pre-defined fractional asset to the user's wallet.
3. The mobile app displays a confirmation/celebration message that the user has received their "starter slice."
4. A basic portfolio screen exists where the user can see their first asset.

## **Epic 2: Foundational UI Scaffolding `(New)`**

**Expanded Goal:** This new epic focuses on rapidly building the application's primary navigational structure. By the end of this epic, a developer will be able to launch the app, log in, and navigate to every main tab screen. Each screen will be a basic scaffold, ready for its detailed feature implementation in subsequent epics.

---

##### **Story 2.1: Implement Main Tab Bar Navigation**
* **As a** User,
* **I want** a persistent bottom tab bar with the main app sections,
* **so that** I can easily navigate to the core areas of the application at any time.

**Acceptance Criteria:**
1.  A bottom tab bar is visible on all top-level screens after login.
2.  The tab bar contains five icons: Dashboard, Portfolio, Card, Quests, and Profile.
3.  Tapping on each icon navigates to its corresponding placeholder screen.
4.  The active tab is visually highlighted.

---

##### **Story 2.2: Create Dashboard Screen Scaffold**
* **As a** Developer,
* **I want** a basic scaffold for the Dashboard screen,
* **so that** we have a foundational component to build the "For You" feed and portfolio summary upon.

**Acceptance Criteria:**
1.  A `DashboardScreen` component is created and linked to the Dashboard tab.
2.  The screen displays a static title, "Dashboard / For You".
3.  The screen includes placeholder sections for "Portfolio Summary" and "Feed Items".

---

##### **Story 2.3: Create Portfolio Screen Scaffold**
* **As a** Developer,
* **I want** a basic scaffold for the Portfolio screen,
* **so that** we can later populate it with the user's detailed holdings.

**Acceptance Criteria:**
1.  A `PortfolioScreen` component is created and linked to the Portfolio tab.
2.  The screen displays a static title, "My Portfolio".
3.  The screen includes a placeholder for the "Total Value" and a "Holdings List".

---

##### **Story 2.4: Create Card Hub Screen Scaffold**
* **As a** Developer,
* **I want** a basic scaffold for the Card Hub screen,
* **so that** we can later add the virtual card details, transaction history, and settings.

**Acceptance Criteria:**
1.  A `CardHubScreen` component is created and linked to the Card tab.
2.  The screen displays a static title, "Card & Spending".
3.  The screen includes placeholder elements for the "Virtual Card", "Spendable Balance", and "Recent Transactions".

---

##### **Story 2.5: Create Quests Screen Scaffold**
* **As a** Developer,
* **I want** a basic scaffold for the Quests screen,
* **so that** we can later build the full Battle Pass and quest tracking interface.

**Acceptance Criteria:**
1.  A `QuestsScreen` component is created and linked to the Quests tab.
2.  The screen displays a static title, "Quests & Rewards".
3.  The screen includes placeholders for the "Battle Pass Progress Bar" and an "Active Quests List".

---

##### **Story 2.6: Create Profile Screen Scaffold**
* **As a** Developer,
* **I want** a basic scaffold for the Profile & Settings screen,
* **so that** users have a designated area for account management.

**Acceptance Criteria:**
1.  A `ProfileScreen` component is created and linked to the Profile tab.
2.  The screen displays a static title, "Profile & Settings".
3.  The screen includes placeholder entry points for "Edit Profile", "Security", and "Logout".

---
---

## **Epic 3: Core Investment & Portfolio Flow `(New)`**

**Expanded Goal:** This epic delivers the heart of the STACK experience. It builds on the user's foundation from Epic 1 and the UI scaffolds from Epic 2 to introduce the core investment loop, focusing on simplicity and engagement. By the end of this epic, users will be able to discover, invest in, and get feedback on curated "Baskets" using a clear, intuitive, and jargon-free interface.

---

##### **Story 3.1: Display Curated Investment Baskets**
* **As a** user,
* **I want** to see a list of curated "Baskets" with clear, visual information,
* **so that** I can easily browse and understand my investment options.

**Acceptance Criteria:**
1.  The mobile app fetches and displays a list of available "Baskets" from the backend.
2.  Each "Basket" in the list is displayed with its name, a descriptive icon or logo, and a simple performance indicator (e.g., "+5% this week").
3.  The display uses simple names and logos, not financial tickers, for all assets.
4.  Tapping on a "Basket" navigates the user to a dedicated "Basket Detail View".

---

##### **Story 3.2: View Basket Details**
* **As a** user,
* **I want** to view the detailed contents and philosophy of a specific "Basket,"
* **so that** I can make an informed decision before investing.

**Acceptance Criteria:**
1.  The "Basket Detail View" displays the Basket's name, a short description, and its risk level (e.g., Low, Medium, High).
2.  The screen lists all the individual assets contained within the "Basket," showing each with its logo and percentage allocation.
3.  A simple, non-technical chart visualizes the "Basket's" historical performance.
4.  The view includes a clear "Power Up" button to initiate an investment.

---

##### **Story 3.3: Invest in a Basket ("Power Up")**
* **As a** user,
* **I want** a simple, fast way to invest a specific amount of money into a "Basket,"
* **so that** the process feels effortless and encouraging.

**Acceptance Criteria:**
1.  On the "Basket Detail View," the user can tap the "Power Up" button.
2.  A simple modal or screen appears allowing the user to input a dollar amount (minimum $1).
3.  Upon confirmation, the backend processes the investment, triggering the necessary smart contract interaction via the Thirdweb SDK.
4.  The user's portfolio is updated to reflect their new fractional ownership of the "Basket".
5.  The user receives a clear, immediate confirmation message upon a successful transaction.

---

##### **Story 3.4: Receive AI Tip Post-Investment**
* **As a** user,
* **I want** to receive a simple, personalized tip from the AI Expert immediately after I make an investment,
* **so that** I can learn and feel more confident about my financial decisions.

**Acceptance Criteria:**
1.  Immediately following a successful "Power Up" action, the UI displays a message from the AI Expert.
2.  The tip is contextual to the "Basket" the user just invested in (e.g., "Great choice! The 'Gamer Basket' often sees activity around major game releases...").
3.  The AI tip is delivered in a non-intrusive way (e.g., a toast notification or a chat bubble).
4.  The tip is saved to a user's notification or message history for later review.

---
---

## **Epic 4: Gamification & Automated Investing `(Formerly Epic 3)`**

**Expanded Goal:** This epic focuses on making investing a sticky, effortless, and deeply personalized habit. It builds on the core investment loop by introducing a powerful gamification layer to drive engagement and two automated investing features to promote consistent, passive wealth creation. By the end of this epic, STACK will transform from a tool a user *can* use into a system that works *for* them.

---

##### **Story 4.1: Configure "Round-up" Investing**
* **As a** user,
* **I want** to set up the "round-up" feature by linking it to my virtual debit card,
* **so that** my spare change is automatically invested whenever I spend.

**Acceptance Criteria:**
1.  An interface exists within the app for a user to enable or disable the "Round-up" feature.
2.  When enabled, all transactions on the user's STACK virtual debit card are rounded up to the nearest dollar.
3.  The accumulated spare change is automatically invested into a user's pre-selected default "Basket" at a set interval (e.g., once a day or once it hits a $5 threshold).
4.  The user can view a clear history of all their "round-up" investments.

---

##### **Story 4.2: Configure "Payday" Investing**
* **As a** user,
* **I want** to schedule automatic investments to coincide with my payday,
* **so that** I can consistently invest without having to think about it.

**Acceptance Criteria:**
1.  A section in the app allows the user to schedule recurring investments.
2.  The user can select the investment amount, the target "Basket," and a frequency (e.g., weekly, bi-weekly, monthly on a specific date).
3.  The system successfully and automatically executes the scheduled investment on the chosen date.
4.  The user can easily pause, edit, or cancel their "Payday Investing" plan at any time.

---

##### **Story 4.3: "Battle Pass" & Quest System**
* **As a** user,
* **I want** to see a "battle pass" or quest log with challenges and rewards,
* **so that** I feel motivated and guided on my investment journey.

**Acceptance Criteria:**
1.  A "Quests" or "Battle Pass" screen is available in the app.
2.  The screen displays a list of available quests with clear objectives (e.g., "Power Up for the first time," "Set up Round-ups," "Invest in 3 different Baskets").
3.  The system accurately tracks the user's progress toward completing each quest.
4.  Upon completing a quest, the user receives a notification and a tangible reward (e.g., XP, a small bonus investment, a cosmetic item).

---

##### **Story 4.4: "For You" Algorithmic Feed**
* **As a** user,
* **I want** to see a personalized "For You" feed of investment opportunities,
* **so that** I can discover new Baskets and quests that are relevant to my interests and behavior.

**Acceptance Criteria:**
1.  The app's main dashboard features a dynamic, scrollable, personalized feed.
2.  The feed contains a mix of content, including suggested "Baskets," new quests from the "Battle Pass," and potentially content from "Community Curators".
3.  A backend algorithm uses the user's investment history, stated interests, and in-app behavior to tailor the content of the feed.
4.  All content in the feed includes clear calls-to-action (e.g., "Invest in this Basket," "Start this Quest").

---
---

## **Epic 5: Ecosystem & Advanced Utility `(Formerly Epic 4)`**

**Expanded Goal:** This epic evolves STACK from a personal investment tool into a true community-driven ecosystem with advanced financial utility. It introduces the "Community Curator" program, creating a social marketplace for investment strategies, and unlocks the value of users' portfolios by allowing them to be used as collateral for micro-loans.

---

##### **Story 5.1: Community Curator Application & Profile**
* **As a** successful user,
* **I want** to apply to become a "Community Curator" and set up a public profile,
* **so that** I can share my investment strategies with the community.

**Acceptance Criteria:**
1.  Users can access an application form within the app to become a "Community Curator".
2.  The application is only available to users who meet pre-defined criteria (e.g., minimum portfolio value, time on platform, performance history).
3.  Once approved by the system, a user can set up their public curator profile, including a name, bio, and investment philosophy.
4.  The curator's profile page is publicly viewable by other users.

---

##### **Story 5.2: Curate and Publish Baskets**
* **As a** Community Curator,
* **I want** to create, name, and publish my own "Baskets" of assets,
* **so that** other users can discover and invest in my strategies.

**Acceptance Criteria:**
1.  An approved curator has access to a "Basket" creation tool.
2.  The curator can select assets and define their percentage allocations within the new "Basket".
3.  The curator can add a name, description, and icon for their "Basket".
4.  The curator can publish the "Basket," making it visible in the discovery sections of the app for other users.
5.  The system is able to track the performance of community-created "Baskets" and attribute a small, transparent fee to the curator.

---

##### **Story 5.3: View Portfolio as Collateral**
* **As a** user with a portfolio,
* **I want** to see how much I can borrow against my assets,
* **so that** I understand my options for a micro-loan.

**Acceptance Criteria:**
1.  A "Loans" section in the app displays the user's current total portfolio value.
2.  The system calculates and clearly displays the maximum loan amount available based on a set loan-to-value (LTV) ratio (e.g., 40% of portfolio value).
3.  The current interest rate and basic loan terms are clearly displayed to the user.

---

##### **Story 5.4: Request and Receive a Micro-Loan**
* **As a** user,
* **I want** to easily request a loan against my portfolio and have the funds instantly available on my virtual debit card,
* **so that** I can access liquidity without selling my assets.

**Acceptance Criteria:**
1.  The user can request a loan up to their maximum available amount through a simple interface.
2.  Upon confirming the loan terms, the user's portfolio assets are programmatically marked as collateral.
3.  The loan amount is instantly credited to the user's STACK virtual debit card, making the funds available to spend.
4.  The user's "Loans" dashboard is updated to show the outstanding balance, interest accrued, and repayment schedule.
5.  A basic automated system is in place to notify users if their collateral value drops near a liquidation threshold.

## **Out of Scope for MVP**

To ensure a focused and timely delivery of the core product, the following features and capabilities are explicitly **out of scope** for the initial MVP launch. They may be considered for future releases.

* **Advanced Social Features:** Direct messaging between users, following/follower feeds beyond the curator model, and social leaderboards.
* **Multiple Fiat On-Ramps:** The MVP will focus on a single, streamlined method for funding. Integration with multiple payment processors (e.g., Plaid, Stripe Direct) will be a post-MVP consideration.
* **Web-Based Application:** The initial launch is exclusively a native mobile app for iOS and Android. A desktop or web-based version is not in scope.
* **Advanced Curator Analytics:** While curators can create and publish baskets, a detailed analytics and performance dashboard for curators will be developed post-MVP.
* **Expanded Asset Classes:** The MVP will launch with a curated selection of assets. Support for stocks, ETFs, or other traditional financial instruments is not included.
* **Internationalization (i18n):** The application will launch with English as the only supported language.

## **Post-MVP Vision**

The long-term vision for STACK is to become the definitive social-financial platform for the next generation of investors. While the MVP focuses on establishing the core loop of investing, gamification, and utility, future phases will expand the ecosystem's depth and reach.

* **Phase 2: Deepening the Social Ecosystem:**
    * Introduce advanced social features, including user-to-user messaging and investment activity feeds.
    * Develop sophisticated dashboards and tools for Community Curators to grow their audience.
    * Launch community events, competitions, and leaderboards to drive engagement.
* **Phase 3: Expanding Financial Utility:**
    * Integrate additional fiat on-ramps and off-ramps to simplify cash flow.
    * Explore offering a wider range of asset classes, including traditional equities.
    * Develop more sophisticated AI-driven portfolio analysis and personalized financial planning tools.
* **Phase 4: Platform Expansion:**
    * Develop a companion web application to provide a rich, desktop-based experience.
    * Explore international expansion, including multi-language and multi-currency support.
