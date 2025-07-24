# **Deployment Architecture**

  * **Frontend Deployment**: The React Native app will be built using **Expo Application Services (EAS) Build** and submitted to the Apple App Store and Google Play Store.
  * **Backend Deployment**: The `backend-api` will be deployed to **Vercel**. Each commit to the `main` branch will trigger a production deployment via GitHub Actions.
  * **CI/CD Pipeline**: A `deploy.yml` file in GitHub Actions will run tests, linting, and then trigger both the `vercel --prod` command and the AWS CDK deployment for backend resources.

-----
