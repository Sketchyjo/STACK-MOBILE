// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@thirdweb-dev/contracts/base/ERC1155Base.sol';
import '@thirdweb-dev/contracts/extension/Permissions.sol';

/**
 * @title StackToken
 * @dev ERC-1155 smart contract for fractional asset ownership
 * Allows trusted admin to mint fractional tokens representing ownership to user wallet addresses
 */
contract StackToken is ERC1155Base, Permissions {
  // Events
  event FractionalAssetMinted(
    address indexed to,
    uint256 indexed tokenId,
    uint256 amount,
    string assetMetadata
  );

  event BatchFractionalAssetMinted(
    address indexed to,
    uint256[] tokenIds,
    uint256[] amounts,
    string[] assetMetadata
  );

  // Admin role for minting permissions
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');

  // Mapping to store asset metadata URIs
  mapping(uint256 => string) private _tokenURIs;

  // Counter for token IDs
  uint256 private _currentTokenId;

  constructor(
    address _defaultAdmin,
    string memory _name,
    string memory _symbol,
    address _royaltyRecipient,
    uint128 _royaltyBps
  ) ERC1155Base(_defaultAdmin, _name, _symbol, _royaltyRecipient, _royaltyBps) {
    // Grant admin role to the deployer
    _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
    _setupRole(MINTER_ROLE, _defaultAdmin);

    // Initialize token ID counter
    _currentTokenId = 1;
  }

  /**
   * @dev Mint fractional asset tokens to a specific address
   * @param to Address to mint tokens to
   * @param amount Amount of tokens to mint
   * @param tokenURI Metadata URI for the token
   */
  function mintFractionalAsset(
    address to,
    uint256 amount,
    string memory tokenURI
  ) external onlyRole(MINTER_ROLE) {
    require(to != address(0), 'Cannot mint to zero address');
    require(amount > 0, 'Amount must be greater than zero');
    require(bytes(tokenURI).length > 0, 'URI cannot be empty');

    uint256 tokenId = nextTokenIdToMint();
    _setTokenURI(tokenId, tokenURI);
    _mint(to, tokenId, amount, '');
    nextTokenIdToMint_ += 1;

    emit FractionalAssetMinted(to, tokenId, amount, tokenURI);
  }

  /**
   * @dev Batch mint fractional asset tokens
   * @param to Address to mint tokens to
   * @param amounts Array of amounts to mint
   * @param tokenURIs Array of metadata URIs
   */
  function batchMintFractionalAsset(
    address to,
    uint256[] memory amounts,
    string[] memory tokenURIs
  ) external onlyRole(MINTER_ROLE) {
    require(to != address(0), 'Cannot mint to zero address');
    require(amounts.length > 0, 'Must mint at least one token');
    require(amounts.length == tokenURIs.length, 'Arrays length mismatch');

    uint256[] memory tokenIds = new uint256[](amounts.length);
    uint256 startTokenId = nextTokenIdToMint();

    for (uint256 i = 0; i < amounts.length; i++) {
      require(amounts[i] > 0, 'Amount must be greater than zero');
      require(bytes(tokenURIs[i]).length > 0, 'URI cannot be empty');

      tokenIds[i] = startTokenId + i;
      _setTokenURI(tokenIds[i], tokenURIs[i]);
    }

    _mintBatch(to, tokenIds, amounts, '');
    nextTokenIdToMint_ += amounts.length;

    emit BatchFractionalAssetMinted(to, tokenIds, amounts, tokenURIs);
  }

  /**
   * @dev Check if a token exists
   * @param tokenId The token ID to check
   */
  function _exists(uint256 tokenId) internal view returns (bool) {
    return tokenId < nextTokenIdToMint();
  }

  /**
   * @dev Get the current token ID that will be minted next
   */
  function getCurrentTokenId() external view returns (uint256) {
    return nextTokenIdToMint();
  }

  /**
   * @dev Get token balances for multiple token IDs for a specific account
   * @param account The account to query
   * @param tokenIds Array of token IDs to query
   * @return Array of token balances
   */
  function getTokenBalances(
    address account,
    uint256[] memory tokenIds
  ) external view returns (uint256[] memory) {
    address[] memory accounts = new address[](tokenIds.length);
    for (uint256 i = 0; i < tokenIds.length; i++) {
      accounts[i] = account;
    }
    return balanceOfBatch(accounts, tokenIds);
  }
}
