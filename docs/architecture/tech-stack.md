# **Tech Stack**

### **Technology Stack Table**

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Language** | TypeScript | 5.4+ | Primary language for the mobile app | Provides strong typing to reduce bugs and improve developer experience. |
| **Frontend Framework**| Expo (React Native) | SDK 51+ | Core framework for building the iOS & Android app | Fulfills the PRD requirement for a cross-platform mobile framework. |
| **Navigation** | Expo Router | 3.0+ | File-based routing for the mobile app | Provides a modern, file-system based routing solution with type safety and excellent DX. |
| **Styling** | NativeWind | 4.0+ | Utility-first CSS for React Native | Allows for rapid styling using Tailwind CSS conventions. |
| **State Management** | Zustand | 4.5+ | Global state management | A simple, lightweight, and powerful alternative to Redux, ideal for an MVP. |
| **Backend Language** | TypeScript | 5.4+ | Primary language for the serverless backend | Maintains language consistency across the monorepo for shared code and types. |
| **Backend Framework**| Express.js | 4.18+ | API framework for serverless functions | Lightweight, unopinionated, and the industry standard for building Node.js APIs. |
| **API Style** | REST API | N/A | API communication standard | The most widely understood and supported standard for client-server communication. |
| **Database** | Amazon Aurora Serverless | v2 (PostgreSQL 15+) | Primary relational database | Provides a scalable, serverless SQL database that is a natural fit for our relational data model. |
| **ORM** | Prisma | 5.10+ | Type-safe database client | Offers an excellent developer experience and type safety when interacting with our PostgreSQL database. |
| **Authentication** | Thirdweb Auth | Latest | User authentication and wallet management | Web3-native solution that simplifies wallet-based login and session management. |
| **Blockchain SDK** | Thirdweb SDK | Latest | Interacting with Etherlink smart contracts | Simplifies all blockchain interactions, aligning with PRD requirements. |
| **Frontend Testing**| Jest & RNTL | 29.7+ | Unit & component testing for the mobile app | The standard testing stack for React Native. |
| **Backend Testing** | Jest & Supertest | 29.7+ | Unit & integration testing for the API | Standard tools for testing Node.js services. |
| **E2E Testing** | Playwright | 1.44+ | End-to-end testing across the application | A modern, powerful tool for automating real user scenarios. |
| **Build & Deploy** | EAS Build & Vercel | Latest | Building the mobile app & deploying the API | EAS is Expo's cloud build service. Vercel provides seamless deployment for the API gateway. |
| **CI/CD** | GitHub Actions | N/A | Continuous Integration & Deployment pipeline | Tightly integrated with GitHub, perfect for automating tests and deployments. |
| **Error Tracking** | Sentry | Latest | Frontend and backend error monitoring | Provides real-time error tracking and performance monitoring. |
| **Infrastructure** | AWS CDK | 2.140+ | Infrastructure as Code for AWS resources | Allows us to define our AWS infrastructure (Aurora, RDS Proxy, Lambda) using TypeScript. |

-----
