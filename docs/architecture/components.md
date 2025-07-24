# **Components**

  * **Frontend Mobile App**: The Expo (React Native) application providing the complete user interface.
  * **API Gateway**: Vercel Serverless Functions acting as the secure entry point for all client requests.
  * **Authentication Service**: An AWS Lambda function managing user sign-up, login, and session tokens.
  * **Blockchain Service**: An AWS Lambda function that is the sole intermediary with the Thirdweb SDK and Etherlink smart contracts.
  * **Portfolio & Baskets Service**: An AWS Lambda function managing the business logic for investments.
  * **Card & Loan Service**: An AWS Lambda function managing virtual cards, transactions, and loans via the VertoFX API.

-----
