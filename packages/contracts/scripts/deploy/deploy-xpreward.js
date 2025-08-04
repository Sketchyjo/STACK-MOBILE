const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying XPReward contract to Etherlink testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "XTZ");

  // Deploy the contract
  const XPReward = await ethers.getContractFactory("XPReward");
  
  // Constructor parameters
  const defaultAdmin = deployer.address;
  const name = "Stack XP Rewards";
  const symbol = "STACKXP";
  const royaltyRecipient = deployer.address;
  const royaltyBps = 250; // 2.5%
  const rewardToken = "0x0000000000000000000000000000000000000000"; // Will be updated after StackToken deployment

  console.log("Deploying with parameters:");
  console.log("- Default Admin:", defaultAdmin);
  console.log("- Name:", name);
  console.log("- Symbol:", symbol);
  console.log("- Royalty Recipient:", royaltyRecipient);
  console.log("- Royalty BPS:", royaltyBps);
  console.log("- Reward Token:", rewardToken);

  const xpReward = await XPReward.deploy(
    defaultAdmin,
    name,
    symbol,
    royaltyRecipient,
    royaltyBps,
    rewardToken
  );

  await xpReward.waitForDeployment();
  const contractAddress = await xpReward.getAddress();

  console.log("✅ XPReward deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Explorer URL: https://testnet.explorer.etherlink.com/address/" + contractAddress);
  
  // Verify deployment by checking contract details
  console.log("\n🔍 Verifying deployment...");
  const contractName = await xpReward.name();
  const contractSymbol = await xpReward.symbol();
  const maxLevel = await xpReward.maxLevel();
  const baseXPPerLevel = await xpReward.baseXPPerLevel();
  
  console.log("- Contract Name:", contractName);
  console.log("- Contract Symbol:", contractSymbol);
  console.log("- Max Level:", maxLevel.toString());
  console.log("- Base XP Per Level:", baseXPPerLevel.toString());
  
  // Check admin roles
  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const XP_MANAGER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("XP_MANAGER_ROLE"));
  const ACHIEVEMENT_MANAGER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ACHIEVEMENT_MANAGER_ROLE"));
  
  const hasAdminRole = await xpReward.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
  const hasXPManagerRole = await xpReward.hasRole(XP_MANAGER_ROLE, deployer.address);
  const hasAchievementManagerRole = await xpReward.hasRole(ACHIEVEMENT_MANAGER_ROLE, deployer.address);
  
  console.log("- Has Admin Role:", hasAdminRole);
  console.log("- Has XP Manager Role:", hasXPManagerRole);
  console.log("- Has Achievement Manager Role:", hasAchievementManagerRole);
  
  console.log("\n✨ Deployment completed successfully!");
  console.log("⚠️  Note: Remember to update the reward token address after deploying StackToken");
  
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