const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StackToken Balance Query Functionality", function () {
  let stackToken;
  let owner;
  let user1;
  let user2;
  let contractAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy StackToken contract
    const StackTokenFactory = await ethers.getContractFactory("StackToken");
    stackToken = await StackTokenFactory.deploy(
      owner.address, // defaultAdmin
      "STACK Token", // name
      "STACK", // symbol
      owner.address, // royaltyRecipient
      500 // royaltyBps (5%)
    );
    await stackToken.waitForDeployment();
    contractAddress = await stackToken.getAddress();
  });

  describe("Balance Query Functions", function () {
    beforeEach(async function () {
      // Mint some tokens for testing
      await stackToken.mintFractionalAsset(
        user1.address,
        100,
        "https://example.com/token/0"
      );
      await stackToken.mintFractionalAsset(
        user1.address,
        200,
        "https://example.com/token/1"
      );
      await stackToken.mintFractionalAsset(
        user2.address,
        150,
        "https://example.com/token/2"
      );
    });

    it("Should query single token balance correctly", async function () {
      const balance = await stackToken.balanceOf(user1.address, 0);
      expect(balance.toString()).to.equal("100");
    });

    it("Should return 0 for non-existent token", async function () {
      const balance = await stackToken.balanceOf(user1.address, 999);
      expect(balance.toString()).to.equal("0");
    });

    it("Should query multiple token balances using balanceOfBatch", async function () {
      const addresses = [user1.address, user1.address, user2.address];
      const tokenIds = [0, 1, 2];
      
      const balances = await stackToken.balanceOfBatch(addresses, tokenIds);
      
      expect(balances[0].toString()).to.equal("100"); // user1 token 0
      expect(balances[1].toString()).to.equal("200"); // user1 token 1
      expect(balances[2].toString()).to.equal("150"); // user2 token 2
    });

    it("Should get current token ID", async function () {
      const currentTokenId = await stackToken.getCurrentTokenId();
      expect(currentTokenId.toString()).to.equal("3"); // Should be 3 after minting 3 tokens
    });

    it("Should get token URI", async function () {
      const uri = await stackToken.uri(0);
      expect(uri).to.equal("https://example.com/token/0");
    });

    it("Should get total supply of token", async function () {
      const supply = await stackToken.totalSupply(0);
      expect(supply.toString()).to.equal("100");
    });

    it("Should check if address has any tokens", async function () {
      // Check user1 who has tokens
      const balance0 = await stackToken.balanceOf(user1.address, 0);
      const balance1 = await stackToken.balanceOf(user1.address, 1);
      const hasTokens = balance0 > 0 || balance1 > 0;
      expect(hasTokens).to.be.true;

      // Check owner who has no tokens
      const ownerBalance0 = await stackToken.balanceOf(owner.address, 0);
      const ownerBalance1 = await stackToken.balanceOf(owner.address, 1);
      const ownerHasTokens = ownerBalance0 > 0 || ownerBalance1 > 0;
      expect(ownerHasTokens).to.be.false;
    });
  });

  describe("Utility Functions", function () {
    it("Should validate Ethereum addresses", function () {
      // Valid addresses
      expect(isValidAddress("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6")).to.be.true;
      expect(isValidAddress("0x0000000000000000000000000000000000000000")).to.be.true;
      
      // Invalid addresses
      expect(isValidAddress("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b")).to.be.false; // Too short
      expect(isValidAddress("742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6")).to.be.false; // No 0x prefix
      expect(isValidAddress("0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8bG")).to.be.false; // Invalid character
      expect(isValidAddress("")).to.be.false; // Empty string
      expect(isValidAddress("not-an-address")).to.be.false; // Random string
    });

    it("Should format balance correctly", function () {
      expect(formatBalance("100")).to.equal("100");
      expect(formatBalance("0")).to.equal("0");
      expect(formatBalance("1000000")).to.equal("1000000");
      
      // With decimals
      expect(formatBalance("1000000000000000000", 18)).to.equal("1.000000000000000000");
      expect(formatBalance("500000000000000000", 18)).to.equal("0.500000000000000000");
      expect(formatBalance("1500", 2)).to.equal("15.00");
    });
  });

  describe("Contract Information", function () {
    it("Should get contract name and symbol", async function () {
      const name = await stackToken.name();
      const symbol = await stackToken.symbol();
      
      expect(name).to.equal("STACK Token");
      expect(symbol).to.equal("STACK");
    });

    it("Should support ERC1155 interface", async function () {
      const supportsERC1155 = await stackToken.supportsInterface("0xd9b67a26");
      expect(supportsERC1155).to.be.true;
    });
  });

  describe("Batch Operations", function () {
    beforeEach(async function () {
      // Mint tokens for batch testing
      await stackToken.mintFractionalAsset(
        user1.address,
        100,
        "https://example.com/token/0"
      );
      await stackToken.mintFractionalAsset(
        user1.address,
        200,
        "https://example.com/token/1"
      );
      await stackToken.mintFractionalAsset(
        user2.address,
        150,
        "https://example.com/token/2"
      );
    });

    it("Should handle batch balance queries", async function () {
      // Query balances for the tokens minted in beforeEach
      // user1 has token 0 (100) and token 1 (200)
      // user2 has token 2 (150)
      const addresses = [user1.address, user1.address, user2.address];
      const tokenIds = [0, 1, 2];
      const balances = await stackToken.balanceOfBatch(addresses, tokenIds);
      
      expect(balances[0].toString()).to.equal("100"); // user1 token 0
      expect(balances[1].toString()).to.equal("200"); // user1 token 1
      expect(balances[2].toString()).to.equal("150"); // user2 token 2
    });

    it("Should handle mixed balance queries", async function () {
      // Test querying balances where some users don't have certain tokens
      const addresses = [user1.address, user2.address, user1.address, user2.address];
      const tokenIds = [0, 0, 2, 1];
      const balances = await stackToken.balanceOfBatch(addresses, tokenIds);
      
      expect(balances[0].toString()).to.equal("100"); // user1 has token 0
      expect(balances[1].toString()).to.equal("0");   // user2 doesn't have token 0
      expect(balances[2].toString()).to.equal("0");   // user1 doesn't have token 2
      expect(balances[3].toString()).to.equal("0");   // user2 doesn't have token 1
    });
  });
});

// Utility functions for testing
function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function formatBalance(balance, decimals = 0) {
  const num = parseFloat(balance);
  return decimals > 0 ? (num / Math.pow(10, decimals)).toFixed(decimals) : num.toString();
}