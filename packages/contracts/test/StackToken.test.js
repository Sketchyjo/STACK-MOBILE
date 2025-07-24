const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StackToken", function () {
  let stackToken;
  let owner;
  let minter;
  let user1;
  let user2;
  let addrs;

  const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));

  beforeEach(async function () {
    [owner, minter, user1, user2, ...addrs] = await ethers.getSigners();

    const StackToken = await ethers.getContractFactory("StackToken");
    stackToken = await StackToken.deploy(
      owner.address,     // _defaultAdmin
      "StackToken",      // _name
      "STACK",          // _symbol
      owner.address,     // _royaltyRecipient
      500               // _royaltyBps (5%)
    );

    await stackToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should have correct name and symbol", async function () {
      expect(await stackToken.name()).to.equal("StackToken");
      expect(await stackToken.symbol()).to.equal("STACK");
    });

    it("Should set the correct admin role", async function () {
      expect(await stackToken.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should set the correct minter role", async function () {
      expect(await stackToken.hasRole(MINTER_ROLE, owner.address)).to.be.true;
    });

    it("Should initialize token ID counter to 0", async function () {
      expect(await stackToken.getCurrentTokenId()).to.equal(0);
    });
  });

  describe("Access Control", function () {
    it("Should allow admin to grant minter role", async function () {
      await stackToken.grantRole(MINTER_ROLE, minter.address);
      expect(await stackToken.hasRole(MINTER_ROLE, minter.address)).to.be.true;
    });

    it("Should prevent non-admin from granting minter role", async function () {
      await expect(
        stackToken.connect(user1).grantRole(MINTER_ROLE, user2.address)
      ).to.be.reverted;
    });

    it("Should prevent non-minter from minting tokens", async function () {
      await expect(
        stackToken.connect(user1).mintFractionalAsset(
          user2.address,
          100,
          "https://example.com/metadata/1"
        )
      ).to.be.reverted;
    });
  });

  describe("Minting Functionality", function () {
    const METADATA_URI = "https://example.com/metadata/1";
    const MINT_AMOUNT = 1000;

    describe("Single Mint", function () {
      it("Should mint fractional asset to user", async function () {
        const tx = await stackToken.mintFractionalAsset(
          user1.address,
          MINT_AMOUNT,
          METADATA_URI
        );

        const tokenId = 0; // First token should have ID 0

        // Check balance
        expect(await stackToken.balanceOf(user1.address, tokenId)).to.equal(MINT_AMOUNT);
        
        // Check metadata URI
        expect(await stackToken.uri(tokenId)).to.equal(METADATA_URI);
        
        // Check token ID counter incremented
        expect(await stackToken.getCurrentTokenId()).to.equal(1);
      });

      it("Should emit FractionalAssetMinted event", async function () {
        await expect(
          stackToken.mintFractionalAsset(user1.address, MINT_AMOUNT, METADATA_URI)
        ).to.emit(stackToken, "FractionalAssetMinted")
          .withArgs(user1.address, 0, MINT_AMOUNT, METADATA_URI);
      });

      it("Should reject minting to zero address", async function () {
        await expect(
          stackToken.mintFractionalAsset(ethers.ZeroAddress, MINT_AMOUNT, METADATA_URI)
        ).to.be.revertedWith("Cannot mint to zero address");
      });

      it("Should reject minting zero amount", async function () {
        await expect(
          stackToken.mintFractionalAsset(user1.address, 0, METADATA_URI)
        ).to.be.revertedWith("Amount must be greater than zero");
      });

      it("Should reject empty metadata URI", async function () {
        await expect(
          stackToken.mintFractionalAsset(user1.address, MINT_AMOUNT, "")
        ).to.be.revertedWith("URI cannot be empty");
      });
    });

    describe("Batch Mint", function () {
      it("Should batch mint fractional assets with different URIs", async function () {
        const amounts = [100, 200, 300];
        const uris = [
          "https://example.com/metadata/1",
          "https://example.com/metadata/2", 
          "https://example.com/metadata/3"
        ];

        const tx = await stackToken.batchMintFractionalAsset(
          user1.address,
          amounts,
          uris
        );

        // Check balances for each token
        expect(await stackToken.balanceOf(user1.address, 0)).to.equal(100);
        expect(await stackToken.balanceOf(user1.address, 1)).to.equal(200);
        expect(await stackToken.balanceOf(user1.address, 2)).to.equal(300);
        
        // Check metadata URIs
        expect(await stackToken.uri(0)).to.equal(uris[0]);
        expect(await stackToken.uri(1)).to.equal(uris[1]);
        expect(await stackToken.uri(2)).to.equal(uris[2]);
        
        // Check token ID counter incremented
        expect(await stackToken.getCurrentTokenId()).to.equal(3);
      });

      it("Should emit BatchFractionalAssetMinted event", async function () {
        const amounts = [100, 200];
        const uris = ["https://example.com/metadata/1", "https://example.com/metadata/2"];

        await expect(
          stackToken.batchMintFractionalAsset(user1.address, amounts, uris)
        ).to.emit(stackToken, "BatchFractionalAssetMinted");
      });

      it("Should reject minting to zero address", async function () {
        const amounts = [100, 200];
        const uris = ["https://example.com/metadata/1", "https://example.com/metadata/2"];

        await expect(
          stackToken.batchMintFractionalAsset(ethers.ZeroAddress, amounts, uris)
        ).to.be.revertedWith("Cannot mint to zero address");
      });

      it("Should reject mismatched amounts and URIs arrays", async function () {
        const amounts = [100, 200];
        const uris = ["https://example.com/metadata/1"]; // Different length

        await expect(
          stackToken.batchMintFractionalAsset(user1.address, amounts, uris)
        ).to.be.revertedWith("Arrays length mismatch");
      });

      it("Should reject empty arrays", async function () {
        await expect(
          stackToken.batchMintFractionalAsset(user1.address, [], [])
        ).to.be.revertedWith("Must mint at least one token");
      });

      it("Should reject zero amount in amounts array", async function () {
        const amounts = [100, 0];
        const uris = ["https://example.com/metadata/1", "https://example.com/metadata/2"];

        await expect(
          stackToken.batchMintFractionalAsset(user1.address, amounts, uris)
        ).to.be.revertedWith("Amount must be greater than zero");
      });

      it("Should reject empty URI in URIs array", async function () {
        const amounts = [100, 200];
        const uris = ["https://example.com/metadata/1", ""];

        await expect(
          stackToken.batchMintFractionalAsset(user1.address, amounts, uris)
        ).to.be.revertedWith("URI cannot be empty");
      });
    });
  });

  describe("Balance Query Functionality", function () {
    beforeEach(async function () {
      // Mint some tokens for testing
      await stackToken.mintFractionalAsset(
        user1.address,
        1000,
        "https://example.com/metadata/1"
      );
      await stackToken.mintFractionalAsset(
        user1.address,
        500,
        "https://example.com/metadata/2"
      );
      await stackToken.mintFractionalAsset(
        user2.address,
        750,
        "https://example.com/metadata/3"
      );
    });

    it("Should return correct token balance for address", async function () {
      expect(await stackToken.balanceOf(user1.address, 0)).to.equal(1000);
      expect(await stackToken.balanceOf(user1.address, 1)).to.equal(500);
      expect(await stackToken.balanceOf(user2.address, 2)).to.equal(750);
      expect(await stackToken.balanceOf(user2.address, 0)).to.equal(0);
    });

    it("Should return correct balances for multiple tokens", async function () {
      const tokenIds = [0, 1, 2];
      const balances = await stackToken.getTokenBalances(user1.address, tokenIds);
      
      expect(balances[0]).to.equal(1000); // Token 0
      expect(balances[1]).to.equal(500);  // Token 1
      expect(balances[2]).to.equal(0);    // Token 2 (not owned by user1)
    });

    it("Should return zero balance for non-existent token", async function () {
      expect(await stackToken.balanceOf(user1.address, 999)).to.equal(0);
    });
  });

  describe("Metadata Functionality", function () {
    it("Should return correct metadata URI for existing token", async function () {
      const metadataUri = "https://example.com/metadata/special";
      await stackToken.mintFractionalAsset(user1.address, 100, metadataUri);
      
      expect(await stackToken.uri(0)).to.equal(metadataUri);
    });

    it("Should revert when querying URI for non-existent token", async function () {
      await expect(
        stackToken.uri(999)
      ).to.be.reverted;
    });
  });

  describe("ERC-1155 Compliance", function () {
    beforeEach(async function () {
      await stackToken.mintFractionalAsset(
        user1.address,
        1000,
        "https://example.com/metadata/1"
      );
    });

    it("Should support ERC-1155 interface", async function () {
      // ERC-1155 interface ID
      const ERC1155_INTERFACE_ID = "0xd9b67a26";
      expect(await stackToken.supportsInterface(ERC1155_INTERFACE_ID)).to.be.true;
    });

    it("Should allow safe transfer of tokens", async function () {
      await stackToken.connect(user1).safeTransferFrom(
        user1.address,
        user2.address,
        0,
        100,
        "0x"
      );

      expect(await stackToken.balanceOf(user1.address, 0)).to.equal(900);
      expect(await stackToken.balanceOf(user2.address, 0)).to.equal(100);
    });

    it("Should allow batch transfer of tokens", async function () {
      // Mint another token to user1
      await stackToken.mintFractionalAsset(
        user1.address,
        500,
        "https://example.com/metadata/2"
      );

      const tokenIds = [0, 1];
      const amounts = [100, 200];

      await stackToken.connect(user1).safeBatchTransferFrom(
        user1.address,
        user2.address,
        tokenIds,
        amounts,
        "0x"
      );

      expect(await stackToken.balanceOf(user1.address, 0)).to.equal(900);
      expect(await stackToken.balanceOf(user1.address, 1)).to.equal(300);
      expect(await stackToken.balanceOf(user2.address, 0)).to.equal(100);
      expect(await stackToken.balanceOf(user2.address, 1)).to.equal(200);
    });
  });
});
