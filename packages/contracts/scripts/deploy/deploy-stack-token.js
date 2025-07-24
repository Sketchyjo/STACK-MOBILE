const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying StackToken contract to Etherlink testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "XTZ");

  // Deploy the contract
  const StackToken = await ethers.getContractFactory("StackToken");
  
  // Constructor parameters
  const defaultAdmin = deployer.address;
  const name = "StackToken";
  const symbol = "STACK";
  const royaltyRecipient = deployer.address;
  const royaltyBps = 500; // 5%

  console.log("Deploying with parameters:");
  console.log("- Default Admin:", defaultAdmin);
  console.log("- Name:", name);
  console.log("- Symbol:", symbol);
  console.log("- Royalty Recipient:", royaltyRecipient);
  console.log("- Royalty BPS:", royaltyBps);

  const stackToken = await StackToken.deploy(
    defaultAdmin,
    name,
    symbol,
    royaltyRecipient,
    royaltyBps
  );

  await stackToken.waitForDeployment();
  const contractAddress = await stackToken.getAddress();

  console.log("✅ StackToken deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Explorer URL: https://testnet.explorer.etherlink.com/address/" + contractAddress);
  
  // Verify deployment by checking contract details
  console.log("\n🔍 Verifying deployment...");
  const contractName = await stackToken.name();
  const contractSymbol = await stackToken.symbol();
  const currentTokenId = await stackToken.getCurrentTokenId();
  
  console.log("- Contract Name:", contractName);
  console.log("- Contract Symbol:", contractSymbol);
  console.log("- Current Token ID:", currentTokenId.toString());
  
  // Check admin roles
  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  
  const hasAdminRole = await stackToken.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
  const hasMinterRole = await stackToken.hasRole(MINTER_ROLE, deployer.address);
  
  console.log("- Has Admin Role:", hasAdminRole);
  console.log("- Has Minter Role:", hasMinterRole);
  
  console.log("\n✨ Deployment completed successfully!");
  
  return {
    contractAddress,
    deployer: deployer.address,
    network: "etherlinkTestnet"
  };
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment failed:", error);
      process.exit(1);
    });
}

module.exports = main;