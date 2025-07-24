# **Technical Assumptions**

## **Repository Structure: Monorepo**

* **Assumption:** We will use a Monorepo to manage the codebase. This will include packages for the mobile app, backend services, and smart contracts.
* **Rationale:** With a cross-platform mobile app, a shared backend, and smart contracts, a monorepo will make it significantly easier to share code (like data types and API clients), manage dependencies, and streamline the build process across the entire platform.

## **Service Architecture: Serverless**

* **Assumption:** The backend will be built using a Serverless architecture (e.g., cloud functions for API endpoints).
* **Rationale:** This approach is highly scalable, cost-effective (pay-per-use), and reduces infrastructure management overhead, making it an excellent fit for an MVP.

## **Testing Requirements: Full Testing Pyramid**

* **Assumption:** We will enforce a comprehensive testing strategy that includes Unit, Integration, and End-to-End (E2E) tests.
* **Rationale:** For a financial application handling user funds, security and reliability are non-negotiable. A full testing pyramid is the industry best practice to ensure the application is robust and functions as expected.

## **Additional Technical Assumptions and Requests**

* **Primary Blockchain:** All on-chain activities will be built for the Etherlink blockchain ecosystem.
* **Mobile Framework:** The mobile app will be built using a cross-platform framework, **React Native**, to prioritize development speed for the MVP while delivering a high-quality experience on both iOS and Android.
