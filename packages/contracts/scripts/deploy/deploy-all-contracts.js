const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Comprehensive deployment script for all Stack Mobile contracts
 * Deploys to Etherlink testnet with proper configuration and verification
 */
async function main() {
  console.log("🚀 Starting deployment of all Stack Mobile contracts to Etherlink testnet...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "XTZ");
  
  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️  Warning: Low balance. Make sure you have enough XTZ for deployment.");
  }

  console.log("\n" + "=".repeat(60));
  console.log("DEPLOYMENT CONFIGURATION");
  console.log("=".repeat(60));

  // Deployment configuration
  const config = {
    stackToken: {
      name: "StackToken",
      symbol: "STACK",
      royaltyBps: 500, // 5%
    },
    microLoan: {
      platformFeeRate: 100, // 1%
      liquidationThreshold: 8000, // 80%
      gracePeriod: 7 * 24 * 60 * 60, // 7 days in seconds
    },
    xpReward: {
      name: "Stack XP Rewards",
      symbol: "STACKXP",
      royaltyBps: 250, // 2.5%
      maxLevel: 100,
      baseXPPerLevel: 1000,
    }
  };

  console.log("Stack Token Config:", config.stackToken);
  console.log("Micro Loan Config:", config.microLoan);
  console.log("XP Reward Config:", config.xpReward);

  const deployedContracts = {};
  const deploymentResults = [];

  try {
    console.log("\n" + "=".repeat(60));
    console.log("1. DEPLOYING STACK TOKEN CONTRACT");
    console.log("=".repeat(60));

    // Deploy StackToken
    const StackToken = await ethers.getContractFactory("StackToken");
    console.log("📦 Deploying StackToken...");
    
    const stackToken = await StackToken.deploy(
      deployer.address, // defaultAdmin
      config.stackToken.name,
      config.stackToken.symbol,
      deployer.address, // royaltyRecipient
      config.stackToken.royaltyBps
    );

    await stackToken.waitForDeployment();
    const stackTokenAddress = await stackToken.getAddress();
    deployedContracts.stackToken = stackTokenAddress;

    console.log("✅ StackToken deployed successfully!");
    console.log("📍 Contract Address:", stackTokenAddress);
    console.log("🔗 Explorer URL: https://testnet.explorer.etherlink.com/address/" + stackTokenAddress);

    // Verify StackToken deployment
    console.log("🔍 Verifying StackToken deployment...");
    const tokenName = await stackToken.name();
    const tokenSymbol = await stackToken.symbol();
    console.log("- Name:", tokenName);
    console.log("- Symbol:", tokenSymbol);

    deploymentResults.push({
      contract: "StackToken",
      address: stackTokenAddress,
      status: "success",
      gasUsed: "estimated"
    });

    console.log("\n" + "=".repeat(60));
    console.log("2. DEPLOYING MICRO LOAN CONTRACT");
    console.log("=".repeat(60));

    // Deploy MicroLoan
    const MicroLoan = await ethers.getContractFactory("MicroLoan");
    console.log("📦 Deploying MicroLoan...");
    
    const microLoan = await MicroLoan.deploy(
      deployer.address, // defaultAdmin
      deployer.address  // feeRecipient
    );

    await microLoan.waitForDeployment();
    const microLoanAddress = await microLoan.getAddress();
    deployedContracts.microLoan = microLoanAddress;

    console.log("✅ MicroLoan deployed successfully!");
    console.log("📍 Contract Address:", microLoanAddress);
    console.log("🔗 Explorer URL: https://testnet.explorer.etherlink.com/address/" + microLoanAddress);

    // Verify MicroLoan deployment
    console.log("🔍 Verifying MicroLoan deployment...");
    const platformFeeRate = await microLoan.platformFeeRate();
    const liquidationThreshold = await microLoan.liquidationThreshold();
    console.log("- Platform Fee Rate:", platformFeeRate.toString(), "basis points");
    console.log("- Liquidation Threshold:", liquidationThreshold.toString(), "basis points");

    deploymentResults.push({
      contract: "MicroLoan",
      address: microLoanAddress,
      status: "success",
      gasUsed: "estimated"
    });

    console.log("\n" + "=".repeat(60));
    console.log("3. DEPLOYING XP REWARD CONTRACT");
    console.log("=".repeat(60));

    // Deploy XPReward
    const XPReward = await ethers.getContractFactory("XPReward");
    console.log("📦 Deploying XPReward...");
    
    const xpReward = await XPReward.deploy(
      deployer.address, // defaultAdmin
      config.xpReward.name,
      config.xpReward.symbol,
      deployer.address, // royaltyRecipient
      config.xpReward.royaltyBps,
      stackTokenAddress // rewardToken (use StackToken as reward)
    );

    await xpReward.waitForDeployment();
    const xpRewardAddress = await xpReward.getAddress();
    deployedContracts.xpReward = xpRewardAddress;

    console.log("✅ XPReward deployed successfully!");
    console.log("📍 Contract Address:", xpRewardAddress);
    console.log("🔗 Explorer URL: https://testnet.explorer.etherlink.com/address/" + xpRewardAddress);

    // Verify XPReward deployment
    console.log("🔍 Verifying XPReward deployment...");
    const xpName = await xpReward.name();
    const xpSymbol = await xpReward.symbol();
    const maxLevel = await xpReward.maxLevel();
    console.log("- Name:", xpName);
    console.log("- Symbol:", xpSymbol);
    console.log("- Max Level:", maxLevel.toString());

    deploymentResults.push({
      contract: "XPReward",
      address: xpRewardAddress,
      status: "success",
      gasUsed: "estimated"
    });

    console.log("\n" + "=".repeat(60));
    console.log("4. SETTING UP CONTRACT INTEGRATIONS");
    console.log("=".repeat(60));

    // Grant roles and setup integrations
    console.log("🔧 Setting up contract integrations...");

    // Grant XP_MANAGER_ROLE to MicroLoan contract in XPReward
    const XP_MANAGER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("XP_MANAGER_ROLE"));
    console.log("- Granting XP_MANAGER_ROLE to MicroLoan contract...");
    await xpReward.grantRole(XP_MANAGER_ROLE, microLoanAddress);

    // Grant MINTER_ROLE to XPReward contract in StackToken for rewards
    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
    console.log("- Granting MINTER_ROLE to XPReward contract...");
    await stackToken.grantRole(MINTER_ROLE, xpRewardAddress);

    console.log("✅ Contract integrations setup complete!");

    console.log("\n" + "=".repeat(60));
    console.log("5. DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));

    console.log("🎉 All contracts deployed successfully!\n");

    console.table(deploymentResults);

    console.log("\n📋 Contract Addresses:");
    console.log("- StackToken:", deployedContracts.stackToken);
    console.log("- MicroLoan:", deployedContracts.microLoan);
    console.log("- XPReward:", deployedContracts.xpReward);

    console.log("\n🔗 Explorer Links:");
    console.log("- StackToken: https://testnet.explorer.etherlink.com/address/" + deployedContracts.stackToken);
    console.log("- MicroLoan: https://testnet.explorer.etherlink.com/address/" + deployedContracts.microLoan);
    console.log("- XPReward: https://testnet.explorer.etherlink.com/address/" + deployedContracts.xpReward);

    // Save deployment info to file
    const deploymentInfo = {
      network: "etherlinkTestnet",
      chainId: 128123,
      deployer: deployer.address,
      deploymentTime: new Date().toISOString(),
      contracts: deployedContracts,
      configuration: config,
      explorerBaseUrl: "https://testnet.explorer.etherlink.com/address/"
    };

    const deploymentPath = path.join(__dirname, "../..", "deployments");
    if (!fs.existsSync(deploymentPath)) {
      fs.mkdirSync(deploymentPath, { recursive: true });
    }

    const deploymentFile = path.join(deploymentPath, "etherlink-testnet.json");
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

    console.log("\n💾 Deployment info saved to:", deploymentFile);

    console.log("\n" + "=".repeat(60));
    console.log("6. POST-DEPLOYMENT VERIFICATION");
    console.log("=".repeat(60));

    // Perform additional verification
    console.log("🔍 Performing post-deployment verification...");

    // Check role assignments
    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
    
    console.log("- Checking StackToken roles...");
    const stackTokenAdminRole = await stackToken.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    const stackTokenMinterRole = await stackToken.hasRole(MINTER_ROLE, deployer.address);
    console.log("  Admin role:", stackTokenAdminRole ? "✅" : "❌");
    console.log("  Minter role:", stackTokenMinterRole ? "✅" : "❌");

    console.log("- Checking MicroLoan roles...");
    const microLoanAdminRole = await microLoan.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    const LENDER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("LENDER_ROLE"));
    const microLoanLenderRole = await microLoan.hasRole(LENDER_ROLE, deployer.address);
    console.log("  Admin role:", microLoanAdminRole ? "✅" : "❌");
    console.log("  Lender role:", microLoanLenderRole ? "✅" : "❌");

    console.log("- Checking XPReward roles...");
    const xpRewardAdminRole = await xpReward.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    const xpRewardManagerRole = await xpReward.hasRole(XP_MANAGER_ROLE, deployer.address);
    console.log("  Admin role:", xpRewardAdminRole ? "✅" : "❌");
    console.log("  XP Manager role:", xpRewardManagerRole ? "✅" : "❌");

    console.log("\n✨ Deployment and verification completed successfully!");
    console.log("🚀 Your Stack Mobile contracts are ready for use on Etherlink testnet!");

    return deployedContracts;

  } catch (error) {
    console.error("\n❌ Deployment failed:", error);
    
    // Save partial deployment info if any contracts were deployed
    if (Object.keys(deployedContracts).length > 0) {
      const partialDeploymentInfo = {
        network: "etherlinkTestnet",
        chainId: 128123,
        deployer: deployer.address,
        deploymentTime: new Date().toISOString(),
        contracts: deployedContracts,
        status: "partial_failure",
        error: error.message
      };

      const deploymentPath = path.join(__dirname, "../..", "deployments");
      if (!fs.existsSync(deploymentPath)) {
        fs.mkdirSync(deploymentPath, { recursive: true });
      }

      const partialDeploymentFile = path.join(deploymentPath, "etherlink-testnet-partial.json");
      fs.writeFileSync(partialDeploymentFile, JSON.stringify(partialDeploymentInfo, null, 2));
      
      console.log("💾 Partial deployment info saved to:", partialDeploymentFile);
    }

    throw error;
  }
}

// Helper function to estimate gas costs
async function estimateGasCosts() {
  console.log("⛽ Estimating gas costs...");
  
  const gasPrice = await ethers.provider.getGasPrice();
  console.log("Current gas price:", ethers.formatUnits(gasPrice, "gwei"), "gwei");
  
  // Rough estimates for contract deployments
  const estimates = {
    StackToken: ethers.parseUnits("2000000", "wei") * gasPrice,
    MicroLoan: ethers.parseUnits("3000000", "wei") * gasPrice,
    XPReward: ethers.parseUnits("4000000", "wei") * gasPrice
  };
  
  const totalEstimate = estimates.StackToken + estimates.MicroLoan + estimates.XPReward;
  
  console.log("Estimated deployment costs:");
  console.log("- StackToken:", ethers.formatEther(estimates.StackToken), "XTZ");
  console.log("- MicroLoan:", ethers.formatEther(estimates.MicroLoan), "XTZ");
  console.log("- XPReward:", ethers.formatEther(estimates.XPReward), "XTZ");
  console.log("- Total:", ethers.formatEther(totalEstimate), "XTZ");
  
  return totalEstimate;
}

// Execute deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Deployment script failed:", error);
      process.exit(1);
    });
}

module.exports = { main, estimateGasCosts };