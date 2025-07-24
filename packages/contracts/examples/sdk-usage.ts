import { createStackTokenSDK, isValidAddress, formatBalance } from "../src/sdk/StackTokenSDK";

/**
 * Example usage of StackTokenSDK
 * This file demonstrates how to use the SDK to interact with deployed StackToken contracts
 */

// Example contract address (replace with actual deployed address)
const CONTRACT_ADDRESS = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";

// Example wallet addresses
const WALLET_ADDRESS_1 = "0x1234567890123456789012345678901234567890";
const WALLET_ADDRESS_2 = "0x0987654321098765432109876543210987654321";

async function main() {
  console.log("🚀 StackToken SDK Example Usage\n");

  // Create SDK instance
  const sdk = createStackTokenSDK(CONTRACT_ADDRESS);

  try {
    // Initialize the SDK
    console.log("📡 Initializing SDK...");
    await sdk.initialize();
    console.log("✅ SDK initialized successfully\n");

    // Get contract information
    console.log("📋 Contract Information:");
    const contractInfo = await sdk.getContractInfo();
    console.log(`  Name: ${contractInfo.name}`);
    console.log(`  Symbol: ${contractInfo.symbol}`);
    console.log(`  Address: ${contractInfo.address}\n`);

    // Get current token ID
    const currentTokenId = await sdk.getCurrentTokenId();
    console.log(`🔢 Current Token ID: ${currentTokenId}\n`);

    // Example 1: Get single token balance
    console.log("💰 Example 1: Single Token Balance Query");
    if (isValidAddress(WALLET_ADDRESS_1)) {
      const balance = await sdk.getTokenBalance(WALLET_ADDRESS_1, 0);
      console.log(`  Wallet: ${WALLET_ADDRESS_1}`);
      console.log(`  Token ID 0 Balance: ${formatBalance(balance)}\n`);
    } else {
      console.log("  ❌ Invalid wallet address provided\n");
    }

    // Example 2: Get multiple token balances
    console.log("📊 Example 2: Multiple Token Balances");
    const tokenIds = [0, 1, 2, 3, 4];
    const multipleBalances = await sdk.getMultipleTokenBalances(WALLET_ADDRESS_1, tokenIds);
    console.log(`  Wallet: ${WALLET_ADDRESS_1}`);
    multipleBalances.forEach(({ tokenId, balance }) => {
      console.log(`  Token ID ${tokenId}: ${formatBalance(balance)}`);
    });
    console.log();

    // Example 3: Get all non-zero token balances
    console.log("🎯 Example 3: All Non-Zero Token Balances");
    const allBalances = await sdk.getAllTokenBalances(WALLET_ADDRESS_1);
    console.log(`  Wallet: ${WALLET_ADDRESS_1}`);
    if (allBalances.length > 0) {
      allBalances.forEach(({ tokenId, balance }) => {
        console.log(`  Token ID ${tokenId}: ${formatBalance(balance)}`);
      });
    } else {
      console.log("  No tokens found for this wallet");
    }
    console.log();

    // Example 4: Check if wallet has any tokens
    console.log("🔍 Example 4: Check Token Ownership");
    const hasTokens1 = await sdk.hasAnyTokens(WALLET_ADDRESS_1);
    const hasTokens2 = await sdk.hasAnyTokens(WALLET_ADDRESS_2);
    console.log(`  ${WALLET_ADDRESS_1} has tokens: ${hasTokens1 ? "✅ Yes" : "❌ No"}`);
    console.log(`  ${WALLET_ADDRESS_2} has tokens: ${hasTokens2 ? "✅ Yes" : "❌ No"}\n`);

    // Example 5: Get token metadata
    console.log("🏷️  Example 5: Token Metadata");
    try {
      const tokenURI = await sdk.getTokenURI(0);
      console.log(`  Token ID 0 URI: ${tokenURI}`);

      const totalSupply = await sdk.getTotalSupply(0);
      console.log(`  Token ID 0 Total Supply: ${formatBalance(totalSupply)}\n`);
    } catch (error) {
      console.log("  Token ID 0 does not exist yet\n");
    }

    // Example 6: Batch operations for multiple wallets
    console.log("🔄 Example 6: Batch Operations");
    const wallets = [WALLET_ADDRESS_1, WALLET_ADDRESS_2];
    const tokenId = 0;

    console.log(`  Checking Token ID ${tokenId} balances for multiple wallets:`);
    for (const wallet of wallets) {
      try {
        const balance = await sdk.getTokenBalance(wallet, tokenId);
        console.log(`    ${wallet}: ${formatBalance(balance)}`);
      } catch (error: any) {
        console.log(`    ${wallet}: Error - ${error.message}`);
      }
    }
    console.log();

    // Example 7: Utility function demonstrations
    console.log("🛠️  Example 7: Utility Functions");
    console.log("  Address Validation:");
    const testAddresses = [
      "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", // Valid
      "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b", // Invalid (too short)
      "not-an-address", // Invalid
      "", // Empty
    ];

    testAddresses.forEach(addr => {
      const isValid = isValidAddress(addr);
      console.log(`    ${addr || "(empty)"}: ${isValid ? "✅ Valid" : "❌ Invalid"}`);
    });

    console.log("\n  Balance Formatting:");
    const testBalances = [
      { balance: "1000000000000000000", decimals: 18, label: "1 ETH (18 decimals)" },
      { balance: "500000000000000000", decimals: 18, label: "0.5 ETH (18 decimals)" },
      { balance: "100", decimals: 0, label: "100 NFTs (0 decimals)" },
      { balance: "1500", decimals: 2, label: "15.00 tokens (2 decimals)" },
    ];

    testBalances.forEach(({ balance, decimals, label }) => {
      const formatted = formatBalance(balance, decimals);
      console.log(`    ${label}: ${formatted}`);
    });

  } catch (error: any) {
    console.error("❌ Error occurred:", error.message);
    console.error("Full error:", error);
  }
}

/**
 * Example for read-only operations (no private key needed)
 */
async function readOnlyExample() {
  console.log("\n📖 Read-Only SDK Example\n");

  const sdk = createStackTokenSDK(CONTRACT_ADDRESS);

  try {
    await sdk.initialize();

    // These operations don't require a private key
    const contractInfo = await sdk.getContractInfo();
    console.log("Contract Info:", contractInfo);

    const currentTokenId = await sdk.getCurrentTokenId();
    console.log("Current Token ID:", currentTokenId);

  } catch (error: any) {
    console.error("Read-only example error:", error.message);
  }
}

/**
 * Example for operations that might require authentication (with private key)
 */
async function authenticatedExample() {
  console.log("\n🔐 Authenticated SDK Example\n");

  // Note: In production, never hardcode private keys
  // Use environment variables or secure key management
  const PRIVATE_KEY = process.env.PRIVATE_KEY;

  if (!PRIVATE_KEY) {
    console.log("⚠️  No private key provided. Skipping authenticated example.");
    return;
  }

  const sdk = createStackTokenSDK(CONTRACT_ADDRESS, PRIVATE_KEY);

  try {
    await sdk.initialize();
    console.log("✅ Authenticated SDK initialized");

    // With authentication, you could perform write operations
    // (though this example only shows read operations)
    const contractInfo = await sdk.getContractInfo();
    console.log("Contract accessible with authentication:", contractInfo.name);

  } catch (error: any) {
    console.error("Authenticated example error:", error.message);
  }
}

// Run examples
if (require.main === module) {
  main()
    .then(() => readOnlyExample())
    .then(() => authenticatedExample())
    .then(() => {
      console.log("\n🎉 All examples completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Example execution failed:", error);
      process.exit(1);
    });
}

export { main, readOnlyExample, authenticatedExample };
