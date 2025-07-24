import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Etherlink } from "@thirdweb-dev/chains";

/**
 * Configuration for Etherlink testnet
 */
const ETHERLINK_TESTNET_CONFIG = {
  chainId: 128123,
  rpc: ["https://128123.rpc.thirdweb.com"],
  name: "Etherlink Testnet",
  chain: "etherlink-testnet",
  nativeCurrency: {
    name: "Tezos",
    symbol: "XTZ",
    decimals: 18,
  },
  explorers: [
    {
      name: "Etherlink Testnet Explorer",
      url: "https://testnet.explorer.etherlink.com",
      standard: "EIP3091",
    },
  ],
  testnet: true,
};

/**
 * StackToken SDK utility class for interacting with the deployed contract
 */
export class StackTokenSDK {
  private sdk: ThirdwebSDK;
  private contractAddress: string;
  private contract: any;

  constructor(contractAddress: string, privateKey?: string) {
    this.contractAddress = contractAddress;

    // Initialize SDK with Etherlink testnet
    this.sdk = new ThirdwebSDK(ETHERLINK_TESTNET_CONFIG, {
      secretKey: privateKey,
    });
  }

  /**
   * Initialize the contract instance
   */
  async initialize() {
    try {
      this.contract = await this.sdk.getContract(this.contractAddress);
      return this.contract;
    } catch (error: any) {
      throw new Error(`Failed to initialize contract: ${error.message}`);
    }
  }

  /**
   * Get the balance of a specific token for a wallet address
   * @param walletAddress - The wallet address to query
   * @param tokenId - The token ID to query
   * @returns Promise<string> - The balance as a string
   */
  async getTokenBalance(walletAddress: string, tokenId: number): Promise<string> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const balance = await this.contract.erc1155.balanceOf(walletAddress, tokenId);
      return balance.toString();
    } catch (error: any) {
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }

  /**
   * Get balances for multiple tokens for a single wallet address
   * @param walletAddress - The wallet address to query
   * @param tokenIds - Array of token IDs to query
   * @returns Promise<{tokenId: number, balance: string}[]> - Array of token balances
   */
  async getMultipleTokenBalances(
    walletAddress: string,
    tokenIds: number[]
  ): Promise<{tokenId: number, balance: string}[]> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const balances = await Promise.all(
        tokenIds.map(async (tokenId) => {
          const balance = await this.contract.erc1155.balanceOf(walletAddress, tokenId);
          return {
            tokenId,
            balance: balance.toString()
          };
        })
      );
      return balances;
    } catch (error: any) {
      throw new Error(`Failed to get multiple token balances: ${error.message}`);
    }
  }

  /**
   * Get all token balances for a wallet address (for existing tokens)
   * @param walletAddress - The wallet address to query
   * @param maxTokenId - Maximum token ID to check (optional, defaults to current token ID)
   * @returns Promise<{tokenId: number, balance: string}[]> - Array of non-zero token balances
   */
  async getAllTokenBalances(
    walletAddress: string,
    maxTokenId?: number
  ): Promise<{tokenId: number, balance: string}[]> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      // Get current token ID if maxTokenId not provided
      const currentTokenId = maxTokenId || await this.getCurrentTokenId();

      const tokenIds = Array.from({ length: currentTokenId }, (_, i) => i);
      const allBalances = await this.getMultipleTokenBalances(walletAddress, tokenIds);

      // Filter out zero balances
      return allBalances.filter(item => item.balance !== "0");
    } catch (error: any) {
      throw new Error(`Failed to get all token balances: ${error.message}`);
    }
  }

  /**
   * Get the current token ID (next token to be minted)
   * @returns Promise<number> - The current token ID
   */
  async getCurrentTokenId(): Promise<number> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const tokenId = await this.contract.call("getCurrentTokenId");
      return parseInt(tokenId.toString());
    } catch (error: any) {
      throw new Error(`Failed to get current token ID: ${error.message}`);
    }
  }

  /**
   * Get token metadata URI
   * @param tokenId - The token ID to query
   * @returns Promise<string> - The metadata URI
   */
  async getTokenURI(tokenId: number): Promise<string> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const uri = await this.contract.erc1155.uri(tokenId);
      return uri;
    } catch (error: any) {
      throw new Error(`Failed to get token URI: ${error.message}`);
    }
  }

  /**
   * Get contract information
   * @returns Promise<{name: string, symbol: string, address: string}> - Contract details
   */
  async getContractInfo(): Promise<{name: string, symbol: string, address: string}> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const name = await this.contract.call("name");
      const symbol = await this.contract.call("symbol");

      return {
        name,
        symbol,
        address: this.contractAddress
      };
    } catch (error: any) {
      throw new Error(`Failed to get contract info: ${error.message}`);
    }
  }

  /**
   * Check if a wallet has any tokens
   * @param walletAddress - The wallet address to check
   * @returns Promise<boolean> - True if wallet has any tokens
   */
  async hasAnyTokens(walletAddress: string): Promise<boolean> {
    try {
      const balances = await this.getAllTokenBalances(walletAddress);
      return balances.length > 0;
    } catch (error: any) {
      throw new Error(`Failed to check if wallet has tokens: ${error.message}`);
    }
  }

  /**
   * Get total supply of a specific token
   * @param tokenId - The token ID to query
   * @returns Promise<string> - The total supply as a string
   */
  async getTotalSupply(tokenId: number): Promise<string> {
    if (!this.contract) {
      await this.initialize();
    }

    try {
      const supply = await this.contract.erc1155.totalSupply(tokenId);
      return supply.toString();
    } catch (error: any) {
      throw new Error(`Failed to get total supply: ${error.message}`);
    }
  }
}

/**
 * Factory function to create a StackTokenSDK instance
 * @param contractAddress - The deployed contract address
 * @param privateKey - Optional private key for write operations
 * @returns StackTokenSDK instance
 */
export function createStackTokenSDK(contractAddress: string, privateKey?: string): StackTokenSDK {
  return new StackTokenSDK(contractAddress, privateKey);
}

/**
 * Utility function to validate wallet address format
 * @param address - The address to validate
 * @returns boolean - True if valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Utility function to format balance for display
 * @param balance - The balance as a string
 * @param decimals - Number of decimal places (default: 0 for NFTs)
 * @returns string - Formatted balance
 */
export function formatBalance(balance: string, decimals: number = 0): string {
  const num = parseFloat(balance);
  return decimals > 0 ? (num / Math.pow(10, decimals)).toFixed(decimals) : num.toString();
}
