const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MicroLoan contract to Etherlink testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "XTZ");

  // Deploy the contract
  const MicroLoan = await ethers.getContractFactory("MicroLoan");
  
  // Constructor parameters
  const defaultAdmin = deployer.address;
  const feeRecipient = deployer.address;

  console.log("Deploying with parameters:");
  console.log("- Default Admin:", defaultAdmin);
  console.log("- Fee Recipient:", feeRecipient);

  const microLoan = await MicroLoan.deploy(
    defaultAdmin,
    feeRecipient
  );

  await microLoan.waitForDeployment();
  const contractAddress = await microLoan.getAddress();

  console.log("✅ MicroLoan deployed successfully!");
  console.log("📍 Contract Address:", contractAddress);
  console.log("🔗 Explorer URL: https://testnet.explorer.etherlink.com/address/" + contractAddress);
  
  // Verify deployment by checking contract details
  console.log("\n🔍 Verifying deployment...");
  const platformFeeRate = await microLoan.platformFeeRate();
  const liquidationThreshold = await microLoan.liquidationThreshold();
  const gracePeriod = await microLoan.gracePeriod();
  
  console.log("- Platform Fee Rate:", platformFeeRate.toString(), "basis points");
  console.log("- Liquidation Threshold:", liquidationThreshold.toString(), "basis points");
  console.log("- Grace Period:", gracePeriod.toString(), "seconds");
  
  // Check admin roles
  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const LENDER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("LENDER_ROLE"));
  const LIQUIDATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("LIQUIDATOR_ROLE"));
  
  const hasAdminRole = await microLoan.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
  const hasLenderRole = await microLoan.hasRole(LENDER_ROLE, deployer.address);
  const hasLiquidatorRole = await microLoan.hasRole(LIQUIDATOR_ROLE, deployer.address);
  
  console.log("- Has Admin Role:", hasAdminRole);
  console.log("- Has Lender Role:", hasLenderRole);
  console.log("- Has Liquidator Role:", hasLiquidatorRole);
  
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