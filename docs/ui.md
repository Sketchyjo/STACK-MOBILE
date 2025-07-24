# **STACK UI/UX Specification**

### **Introduction**

This document defines the user experience goals, information architecture, user flows, and visual design specifications for STACK's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

#### **Overall UX Goals & Principles**

##### **Target User Personas**

Based on the PRD, our primary user is the:

* **Gen Z "Digital Native" (ages 18-25):** Tech-savvy, active on social media, values authenticity and community. Is comfortable with Web3 concepts but may be intimidated by traditional finance.

##### **Usability Goals**

* **Ease of Learning:** A new user should be able to sign up and make their first "Power Up" investment in under 3 minutes.
* **Efficiency of Use:** Frequent actions like investing and checking progress should be achievable in just a few taps.
* **Error Prevention:** The interface must be clear and provide confirmations for critical actions like spending or cashing out.
* **Engagement:** The experience should feel rewarding and motivating, encouraging users to build consistent financial habits.

##### **Design Principles**

1. **Clarity Over Cleverness:** Prioritize clear, simple language and visuals over complex financial jargon or overly innovative (but confusing) interactions.
2. **Gamified Feedback:** Every core action should have a satisfying and immediate response that makes progress feel tangible and rewarding.
3. **Progressive Disclosure:** Show users only what they need at any given moment. Keep the core interface simple, allowing users to explore more advanced features as they gain confidence.

### **Information Architecture (IA)**

#### **Site Map / Screen Inventory**

This diagram shows the high-level relationship between the main screens of the application.

Code snippet

graph TD
    subgraph Onboarding Flow
        O1\[Sign Up / Login\] \--\> O2\[Wallet Creation\] \--\> O3\[Onboarding Steps\] \--\> O4\[Receive Starter Slice\] \--\> A\[Dashboard\]
    end

    subgraph Main App Navigation
        A\[Dashboard / 'For You' Feed\] \--\> B\[Basket Detail View\]
        A \--\> C\[Curator Profile View\]

        D\[Portfolio\] \--\> B

        F\[Card Hub\] \--\> G\[Micro-loan Hub\]
        F \--\> H\[Transaction History\]

        I\[Quests / Battle Pass\]

        J\[Profile & Settings\]
    end

#### **Navigation Structure**

* **Primary Navigation:** A persistent bottom tab bar will be used for main navigation, providing immediate access to the core sections of the app. The proposed tabs are: **Dashboard**, **Portfolio**, **Card**, **Quests**, and **Profile**.
* **Secondary Navigation:** Secondary navigation will be contextual, following standard mobile patterns. For example, tapping a "Basket" on the Dashboard will navigate the user forward to the "Basket Detail View," which will have a back button in the header to return.
* **Breadcrumbs:** Traditional breadcrumbs are not used in mobile app navigation. Clear screen titles will provide context for the user's location within the app.

### **User Flows**

#### **First Investment (Onboarding to 'Power Up')**

* **User Goal:** For a new user to seamlessly create an account, get onboarded, and successfully make their first investment in a 'Basket'.
* **Entry Points:** App Store download, promotional link.
* **Success Criteria:** User has an account, a wallet, has received their 'starter slice', and has successfully invested their own funds into a Basket.

##### **Flow Diagram**

Code snippet

graph TD
    A\[App Launch\] \--\> B{Has Account?};
    B \--\>|No| C\[Sign Up\];
    B \--\>|Yes| D\[Login\];
    C \--\> E\[Onboarding Flow & Wallet Creation\];
    E \--\> F\[Receive 'Free Starter Slice'\];
    F \--\> G\[Dashboard / 'For You' Feed\];
    D \--\> G;
    G \--\> H\[Taps on a 'Basket'\];
    H \--\> I\[Basket Detail View\];
    I \--\> J\[Taps 'Power Up'\];
    J \--\> K\[Enter Amount Modal\];
    K \--\> L{Confirm Investment?};
    L \--\>|Yes| M\[Process Payment & Blockchain Tx\];
    M \--\> N\[Show Success Confirmation\];
    L \--\>|No| I;
    N \--\> G;

##### **Edge Cases & Error Handling:**

* User sign-up fails (e.g., email already exists).
* User quits the onboarding flow midway through.
* "Power Up" payment method is declined.
* Blockchain transaction is slow or fails.
* User has insufficient funds for the desired investment.

#### **Using the Card & "Round-up" Feature**

* **User Goal:** For an active user to make a real-world purchase with their virtual card and see their spare change automatically invested.
* **Entry Points:** User decides to make a purchase online or in-store (tap-to-pay) using their STACK virtual card details.
* **Success Criteria:** A purchase is successfully made, the transaction is recorded, and the 'round-up' amount is correctly calculated and invested into the user's designated Basket.

##### **Flow Diagram**

Code snippet

sequenceDiagram
    participant User
    participant Mobile App
    participant Payment Network
    participant STACK Backend

    User-\>\>Mobile App: Accesses Virtual Card details
    User-\>\>Payment Network: Makes a purchase (e.g., $4.30)
    Payment Network-\>\>STACK Backend: Authorize transaction for $4.30
    STACK Backend--\>\>Payment Network: Approve (if funds exist)
    Payment Network--\>\>User: Purchase successful
    STACK Backend-\>\>STACK Backend: Record transaction & calculate Round-up ($0.70)
    STACK Backend-\>\>Mobile App: Push notification: "Purchase of $4.30 complete"
    Note over STACK Backend: At a set interval (e.g., end of day)...
    STACK Backend-\>\>STACK Backend: Invest accumulated Round-ups ($0.70) into user's Basket
    STACK Backend-\>\>Mobile App: Push notification: "You just invested $0.70 from your spare change\!"

##### **Edge Cases & Error Handling:**

* User has insufficient funds on the card for the purchase.
* The card is declined by the merchant or payment network.
* The "Round-up" feature is disabled by the user (the system should simply skip the round-up calculation).
* The automated investment of the round-up amount fails (system should retry).

#### **Investing in a Community-Created Basket**

* **User Goal:** For a user to discover a Basket created by a Community Curator, review the curator's profile and strategy, and successfully invest in it.
* **Entry Points:** The "For You" Feed, a dedicated "Community" or "Explore" section, or a direct link to a Curator's profile.
* **Success Criteria:** The user successfully invests in a Basket created by another user, and the curator is correctly credited for the investment.

##### **Flow Diagram**

Code snippet

graph TD
    A\[Dashboard / 'For You' Feed\] \--\> B\[Taps on a Community Basket\];
    B \--\> C\[Community Basket Detail View\];
    subgraph C
        direction LR
        C1\[Basket Info & Performance\]
        C2\[Assets in Basket\]
        C3\["Curator Profile Snippet (Name, Photo, Risk Score)"\]
    end
    C \--\> D{View Curator's Full Profile?};
    D \--\>|Yes| E\[Community Curator Profile Page\];
    E \--\> C;
    D \--\>|No| F\[Taps 'Power Up'\];
    C \--\> F;
    F \--\> G\[Enter Amount & Confirm\];
    G \--\> H\[Investment Successful\];
    H \--\> A;

##### **Edge Cases & Error Handling:**

* The curator de-lists or modifies the basket while a user is viewing it.
* A curator's basket falls outside of a user's stated risk tolerance.
* An asset within the community basket has been de-listed from the platform.

### **Wireframes & Mockups**

**Primary Design Files:** \[Placeholder Link to Figma Project\]

#### **Key Screen Layouts**

##### **Dashboard / 'For You' Feed**

* **Purpose:** To provide the user with a personalized and dynamic entry point to the app, encouraging discovery and giving them a quick, clear overview of their portfolio's status.
* **Key Elements:**
  * A prominent, simple portfolio balance summary at the top.
  * The main body of the screen will be the scrollable, personalized "For You" feed.
  * Feed items will include: suggested 'Baskets', new 'Quests' from the battle pass, and content from 'Community Curators'.
  * A floating action button or an easily accessible icon for the AI Expert.
* **Interaction Notes:** The feed should support infinite scroll. Tapping any item in the feed will navigate the user to its respective detail screen.

##### **Basket Detail View**

* **Purpose:** To provide a user with all the necessary information to make an informed and confident decision about investing in a specific 'Basket'.
* **Key Elements:**
  * A clear header displaying the Basket's name and icon.
  * A short, descriptive paragraph explaining the Basket's theme, strategy, and risk level (e.g., "Medium Volatility").
  * A simple, non-technical performance chart (e.g., a clean line graph).
  * A list of the individual assets contained within the Basket, showing each asset's logo, name, and percentage allocation.
  * A prominent and engaging "Power Up" button to initiate an investment.
  * **For Community Baskets:** A clearly visible section showing the curator's name, profile picture, and a link to their full profile.
* **Interaction Notes:** Tapping the "Power Up" button will launch a simple modal for the user to enter their desired investment amount.

##### **Quest / Battle Pass Screen**

* **Purpose:** To provide a clear, engaging, and motivating interface for users to track their progress, complete challenges, and claim rewards, reinforcing positive financial habits.
* **Key Elements:**
  * A visual progression tracker at the top (e.g., a progress bar with numbered tiers) to show the user's current level in the "season" or battle pass.
  * A section for "Active Quests," showing a list of challenges the user is currently working on (e.g., "Power Up $10 this week," "Set up Round-ups," "Explore a Community Basket").
  * A section for "Completed Quests" or a "Claim Rewards" area where users can see what they've earned.
  * A clear display of potential rewards for upcoming tiers or quests to incentivize continued engagement.
* **Interaction Notes:** Tapping on a quest could show more detail or provide a shortcut to the relevant part of the app (e.g., tapping the "Set up Round-ups" quest takes the user to the Card Hub). Claiming rewards should be accompanied by a satisfying animation and confirmation.

##### **Card & Spending Hub**

* **Purpose:** To give the user a clear and simple interface to manage their virtual debit card, track their spending, and control their automated investment features like 'Round-ups'.
* **Key Elements:**
  * A visual representation of the user's virtual debit card, with an option to securely view the full card number, expiry, and CVV.
  * A clear display of the "Spendable Balance" (funds available from loans or cashed-out investments).
  * A simple toggle switch to enable or disable the "Round-up" feature.
  * A display showing the total amount accumulated in "Round-ups" since the last investment.
  * A list of recent transactions made with the card.
  * A clear entry point or button to navigate to the "Micro-loan Hub."
* **Interaction Notes:** Accessing full card details should require biometric or PIN authentication for security. The transaction list should be scrollable and tappable to see more detail.

### **Component Library / Design System**

Design System Approach:
For STACK, we will create a custom, lightweight component library. While using a pre-built library can be faster, building our own will give us complete control over the unique, gamified look and feel that is central to our brand. This ensures every button, card, and interaction feels like it belongs to STACK and aligns with the visual direction from the reference images.

#### **Core Components**

##### **Button**

* **Purpose:** To be used for all primary and secondary user actions (e.g., 'Power Up', 'Confirm', 'See All').
* **Variants:**
  * **Primary:** High-emphasis actions (lime green background).
  * **Secondary:** Medium-emphasis actions (e.g., blue background or outlined).
  * **Text/Link:** Low-emphasis navigation or minor actions.
* **States:** The button must have clear visual states for Default, Hover, Pressed, Disabled, and Loading.

##### **Info Card**

* **Purpose:** To display distinct, self-contained blocks of information, such as the portfolio balance, individual assets in a list, or active quests.
* **Variants:**
  * **Primary Metric Card:** For displaying large, key numbers like the 'Total Value' or 'Available for Withdrawal'.
  * **List Item Card:** A smaller, horizontal card used for items in a list, like the assets in the 'Your Investments' section.
  * **Quest Card:** A variant designed to display gamified information, progress, and a 'Claim' button.
* **States:** Cards will have a 'Default' state and a 'Tappable' state (with visual feedback like a highlight or shadow lift on press) for cards that navigate to a detail view.

##### **Bottom Tab Bar**

* **Purpose:** To provide persistent, top-level navigation, allowing users to switch between the main sections of the app (e.g., Home, Portfolio, Statistics, Settings).
* **Variants:** N/A. There will be one standard tab bar for the application.
* **States:** Each tab icon will have two states: **Active** (to indicate the user's current screen) and **Inactive**.
* **Usage Guidelines:** The tab bar should contain 4-5 items only, corresponding to the primary sections identified in the Information Architecture. It should be visible on all top-level screens.

## Foundational Components

In addition to the core components, the following foundational elements are required to construct the screens and experiences described in this document.

## Form & Input Components

### Input Field
A standardized text input for forms and modals, such as the "Enter Amount Modal" for investments. Must support labels, placeholders, and validation states.

### Toggle Switch
An on/off switch, required for enabling/disabling features like the "Round-up" setting in the Card Hub.

## Layout & Navigation Components

### Screen Header
A consistent header for secondary screens that displays the screen title and a contextual back button.

### Modal
A component for displaying content over the current screen, required for the "Power Up" flow and other confirmation dialogues.

### Floating Action Button (FAB)
A circular button that floats above the UI, intended for the AI Expert feature on the Dashboard.

## Data Display Components

### Chart / Graph
A simple, non-technical line graph component to visualize historical performance in the Basket Detail View.

### Progress Bar
A visual element to show progress, required for the Battle Pass progression tracker on the Quest screen.

### Icon
A dedicated component to consistently render icons from our selected library, adhering to the minimalist, outlined style.

### List & List Item
A generic list container and item component for displaying simple, scrollable data like transaction history or the assets within a Basket.

### **Branding & Style Guide**

Visual Identity:
The overall visual identity will be modern, clean, and high-contrast, designed to appeal to a Gen Z audience. It uses a dark-mode-first aesthetic with vibrant accent colors to create a user-friendly and engaging experience, as established by the provided reference images.

#### **Color Palette**

The color scheme is taken directly from your reference designs.

| Color Type | Hex Code | Usage |
| :---- | :---- | :---- |
| Primary | \#5852FF | Primary calls-to-action, interactive elements, highlights. |
| Accent | \#B9FF4B | Secondary calls-to-action (e.g., 'Top Up', 'Withdraw' buttons), positive financial indicators. |
| Neutral (Light) | \#EAE2FF | Backgrounds for cards and secondary page areas. |
| Neutral (Dark) | \#000000 (approx.) | Main app background (dark mode). |
| Text | \#FFFFFF (approx.) | Primary text color for use on dark backgrounds. |

#### **Typography**

The font families are selected from your reference designs to ensure a modern, legible type system.

* **Primary Font (for headings):** MD Nichrome
* **Secondary Font (for body text & UI):** Gilroy

##### **Proposed Type Scale**

This is a standard, accessible type scale that aligns with the visual hierarchy in the reference designs.

| Element | Size (approx.) | Weight |
| :---- | :---- | :---- |
| H1 (e.g., Total Value) | 36px | Bold |
| H2 (e.g., Screen Titles) | 24px | Bold |
| H3 (e.g., Card Titles) | 18px | Semibold |
| Body (e.g., descriptions) | 16px | Regular |
| Small (e.g., labels) | 14px | Regular |

#### **Iconography**

Based on the reference designs, we will use a clean, minimalist, and lightweight outlined icon style for all in-app icons, including the bottom tab bar.

#### **Spacing & Layout**

The design will use a consistent spacing scale (based on an 8px grid) to ensure a clean, uncluttered layout with generous whitespace. All components will be aligned to a grid system for visual consistency.

### **Accessibility Requirements**

#### **Compliance Target**

* **Standard:** WCAG 2.1 Level AA. This is the globally recognized standard for creating accessible digital products.

#### **Key Requirements**

Based on the WCAG AA standard, our development will adhere to the following:

* **Visual:**
  * **Color Contrast:** Text and interactive elements must have a contrast ratio of at least 4.5:1 against their background.
  * **Focus Indicators:** All interactive elements must have a clear and visible focus state.
  * **Text Sizing:** Users must be able to resize text up to 200% without loss of content or functionality.
* **Interaction:**
  * **Keyboard Navigation:** All functionality must be operable through a keyboard interface.
  * **Screen Reader Support:** The app will be built to be compatible with native mobile screen readers (VoiceOver for iOS and TalkBack for Android).
  * **Touch Targets:** All interactive targets must be at least 44x44 pixels.
* **Content:**
  * **Alternative Text:** All meaningful images and icons must have descriptive alternative text.
  * **Heading Structure:** Content will be organized with a logical heading structure.
  * **Form Labels:** All form inputs will have clear, programmatically associated labels.

#### **Testing Strategy**

* We will use a combination of automated checks during development and regular manual testing with screen readers and keyboard-only navigation to ensure compliance.

### **Responsiveness Strategy**

#### **Target Device Classes**

Our primary focus is a best-in-class phone experience. However, the app must adapt gracefully to provide a quality experience on tablets as well.

| Device Class | Key Considerations |
| :---- | :---- |
| **Phones** | The primary target. Layouts must be fluid and optimized for portrait orientation to accommodate the wide variety of phone screen sizes. |
| **Tablets** | The app must support both portrait and landscape orientations. Layouts should intelligently use the extra screen space. |

#### **Adaptation Patterns**

* **Layout Changes:** On phones, we will primarily use single-column, scrollable layouts. On tablets, these layouts will adapt to use multiple columns where it enhances the experience.
* **Navigation Changes:** The bottom tab bar will remain the primary navigation on all devices.
* **Content Priority:** The visual hierarchy of information will be consistent across all devices.
* **Interaction Changes:** All touch targets will be appropriately sized for both phone and tablet use.

### **Animation & Micro-interactions**

#### **Motion Principles**

* **Purposeful:** All animations must have a clear purpose, such as providing feedback or guiding the user's focus.
* **Responsive:** Interactions should have immediate physical feedback.
* **Engaging & Rewarding:** Key moments, like completing a quest or a "Power Up," should be celebrated with satisfying, game-like animations.
* **Performant:** Animations must be smooth and lightweight, never causing the app to feel slow or laggy.

#### **Key Animations**

* **'Power Up' Confirmation:** A rewarding animation will provide positive reinforcement upon successful investment.
* **Quest Completion:** Completing a quest or leveling up will trigger a celebratory animation.
* **Screen Transitions:** Navigating between screens will use standard native transitions.
* **Loading States:** We will use subtle, branded shimmer or pulsing animations on skeleton layouts.

### **Performance Considerations**

#### **Performance Goals**

* **Interaction Response:** User input must provide visual feedback in under 100ms.
* **Screen Transitions:** All screen transitions should complete in under 300ms.
* **Animation FPS:** All animations must maintain a consistent 60 frames per second (FPS).

#### **Design Strategies**

* **Optimized Assets:** Using modern, compressed image formats and vector graphics.
* **Lazy Loading:** Content that is not immediately visible will be loaded on demand.
* **Skeleton Screens:** Using skeleton screens will improve the *perceived* performance while data is being fetched.

### **Next Steps**

#### **Immediate Actions**

1. Review and finalize this UI/UX Specification document with all stakeholders.
2. Begin creating high-fidelity visual designs in the chosen design tool (e.g., Figma) based on this specification.
3. Proceed to the **Architecture** phase by engaging Winston, the Architect (🏗️).

#### **Design Handoff Checklist**

* \[x\] All user flows documented
* \[x\] Component inventory complete
* \[x\] Accessibility requirements defined
* \[x\] Responsive strategy clear
* \[x\] Brand guidelines incorporated
* \[x\] Performance goals established
