import dotenv from 'dotenv';
import { createThirdwebClient } from "thirdweb";

// Ensure environment variables are loaded
dotenv.config();

if (!process.env.THIRDWEB_SECRET_KEY) {
  throw new Error("THIRDWEB_SECRET_KEY environment variable is required");
}

export const thirdwebClient = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY,
  clientId: process.env.THIRDWEB_CLIENT_ID
});
