<img width="1024" height="1536" alt="Poster Design Concepts Jul 27 2025" src="https://github.com/user-attachments/assets/b6d951bd-57bc-4dd5-b31e-e63471647071" />

# **Project Brief: STACK**

## **Executive Summary**

This document outlines the project brief for STACK, a gamified, Web3-native investment platform designed for the Gen Z demographic. The core problem STACK solves is that traditional investing is often perceived as complex, intimidating, and misaligned with the social and community-driven values of young, digitally-native users. The proposed solution is an intuitive, mobile-first application that transforms investing into an automated and engaging habit through features like a virtual debit card with automated "Round-ups," a gamified "battle pass" system, and community-curated investment "Baskets".

## **Problem Statement**

Gen Z represents a large, digitally-native generation that is significantly underserved by traditional financial platforms. These platforms often present a high barrier to entry through complex financial jargon, high capital requirements, and user experiences that lack the engagement and social integration this demographic expects. This intimidation factor creates a major obstacle to early wealth creation for an entire generation. Existing solutions fail to connect with Gen Z's values of authenticity, community, and digital identity.

## **Proposed Solution**

STACK will be a Web3-native financial platform that reframes investing through the familiar and engaging concepts of gaming and social media. By integrating investing into daily life via a virtual debit card and features like automated "Round-ups" and "Payday" investments, STACK converts it from a daunting task into an automated habit. The platform will feature curated, theme-based "Baskets" of assets, a gamified progression system with quests and rewards, a personalized "For You" feed for discovering opportunities, and an AI Expert to provide guidance.

## **Target Users**

* **Primary User Segment: Gen Z "Digital Native" (ages 18-25)**
    * **Profile:** Tech-savvy, highly active on social media, and values authenticity and community in their digital experiences.
    * **Needs & Pains:** They are comfortable with Web3 concepts but are often intimidated by the complexity of traditional finance. They seek low-friction, mobile-first experiences that are both engaging and easy to understand.

## **Goals & Success Metrics**

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

## **MVP Scope**

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

## **Post-MVP Vision**
* **Phase 2: Deepening the Social Ecosystem:** Introduce advanced social features, curator tools, and community events.
* **Phase 3: Expanding Financial Utility:** Integrate additional on-ramps, explore new asset classes, and enhance AI-driven financial planning.
* **Phase 4: Platform Expansion:** Develop a companion web application and pursue international expansion.

## **Technical Considerations**
* **Platform Requirements:** The application must be a native mobile app for iOS & Android, designed with a mobile-first approach.
* **Technology Preferences:**
    * **Frontend:** React Native.
    * **Backend:** Serverless architecture.
    * **Database:** Amazon Aurora Serverless (PostgreSQL).
    * **Blockchain:** Must be built on the citrea ecosystem using the Thirdweb SDK.
* **Architecture Considerations:**
    * **Repository:** A Monorepo structure will be used to manage all code.
    * **Testing:** A full testing pyramid (Unit, Integration, E2E) is required.

## **Constraints & Assumptions**
### **Constraints**
* The platform must be built on and integrate with the Citrea blockchain ecosystem.
* The user interface must comply with WCAG 2.1 Level AA accessibility standards.

### **Key Assumptions**
* The target Gen Z audience will be receptive to the gamified, Web3-based approach to investing.
* Automating micro-investments through daily habits will be a key driver for user retention.
* The community curation model will foster trust and drive engagement on the platform.

## **Risks & Open Questions**
### **Key Risks**
* **Regulatory Risk:** The crypto-finance space is subject to evolving regulations.
* **Market Adoption Risk:** The novel approach may face challenges in gaining initial user trust compared to traditional platforms.
* **Technical Risk:** The performance of the underlying blockchain could impact user experience.
* **Security Risk:** As a financial application, the platform is a high-value target and requires robust security measures.

### **Open Questions**
* What is the specific business model and revenue generation strategy (e.g., fees, interest)?
* What are the detailed criteria and approval process for becoming a Community Curator?
* What is the go-to-market strategy for acquiring the first cohort of users?
