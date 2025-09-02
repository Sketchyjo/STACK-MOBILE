import { Indexer, ZgFile, Batcher, KvClient, getFlowContract } from '@0glabs/0g-ts-sdk';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// 0G Network Configuration
const ZG_CONFIG = {
  evmRpc: process.env.ZG_EVM_RPC || 'https://evmrpc-testnet.0g.ai',
  indexerRpc: process.env.ZG_INDEXER_RPC || 'https://indexer-storage-testnet-turbo.0g.ai',
  kvClientAddr: process.env.ZG_KV_CLIENT_ADDR || 'http://3.101.147.150:6789',
  privateKey: process.env.ZG_PRIVATE_KEY || '',
  flowContractAddress: process.env.ZG_FLOW_CONTRACT_ADDRESS || ''
};

// Validate configuration
if (!ZG_CONFIG.privateKey) {
  console.warn('ZG_PRIVATE_KEY not set. 0G storage operations will be limited.');
}

/**
 * 0G Network Service for decentralized storage and AI inference
 */
export class ZeroGService {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet | null = null;
  private indexer: Indexer;
  private kvClient: KvClient;
  private flowContract: any;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(ZG_CONFIG.evmRpc);
    
    if (ZG_CONFIG.privateKey) {
      this.signer = new ethers.Wallet(ZG_CONFIG.privateKey, this.provider);
    }
    
    this.indexer = new Indexer(ZG_CONFIG.indexerRpc);
    this.kvClient = new KvClient(ZG_CONFIG.kvClientAddr);
    
    // Initialize flow contract if address is provided
    if (ZG_CONFIG.flowContractAddress) {
      this.flowContract = getFlowContract(ZG_CONFIG.flowContractAddress, this.signer || this.provider);
    }
  }

  /**
   * Upload file to 0G decentralized storage
   */
  async uploadFile(filePath: string): Promise<{ success: boolean; rootHash?: string; txHash?: string; error?: string }> {
    try {
      if (!this.signer) {
        throw new Error('Signer not available. Please set ZG_PRIVATE_KEY.');
      }

      const file = await ZgFile.fromFilePath(filePath);
      const [tree, treeErr] = await file.merkleTree();
      
      if (treeErr) {
        await file.close();
        throw new Error(`Failed to create merkle tree: ${treeErr}`);
      }

      const rootHash = tree.rootHash();
      console.log('File Root Hash:', rootHash);

      // Upload to 0G storage
      const [tx, uploadErr] = await this.indexer.upload(file, ZG_CONFIG.evmRpc, this.signer);
      
      await file.close();
      
      if (uploadErr) {
        throw new Error(`Upload failed: ${uploadErr}`);
      }

      return {
        success: true,
        rootHash,
        txHash: tx
      };
    } catch (error) {
      console.error('0G file upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown upload error'
      };
    }
  }

  /**
   * Upload data from buffer to 0G storage
   */
  async uploadBuffer(buffer: Buffer, filename: string): Promise<{ success: boolean; rootHash?: string; txHash?: string; error?: string }> {
    try {
      if (!this.signer) {
        throw new Error('Signer not available. Please set ZG_PRIVATE_KEY.');
      }

      // Create temporary file from buffer
      const tempPath = `/tmp/${filename}_${Date.now()}`;
      const fs = await import('fs');
      fs.writeFileSync(tempPath, buffer);

      const result = await this.uploadFile(tempPath);
      
      // Clean up temporary file
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', cleanupError);
      }

      return result;
    } catch (error) {
      console.error('0G buffer upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown buffer upload error'
      };
    }
  }

  /**
   * Download file from 0G storage
   */
  async downloadFile(rootHash: string, outputPath: string, withProof: boolean = false): Promise<{ success: boolean; error?: string }> {
    try {
      const err = await this.indexer.download(rootHash, outputPath, withProof);
      
      if (err) {
        throw new Error(`Download failed: ${err}`);
      }

      return { success: true };
    } catch (error) {
      console.error('0G file download error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown download error'
      };
    }
  }

  /**
   * Store key-value data in 0G KV store
   */
  async storeKeyValue(streamId: string, key: string, value: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.signer || !this.flowContract) {
        throw new Error('Signer and flow contract required for KV operations.');
      }

      const [nodes, nodesErr] = await this.indexer.selectNodes(1);
      if (nodesErr) {
        throw new Error(`Failed to select nodes: ${nodesErr}`);
      }

      const batcher = new Batcher(1, nodes, this.flowContract, ZG_CONFIG.evmRpc);
      
      const keyBytes = Uint8Array.from(Buffer.from(key, 'utf-8'));
      const valueBytes = Uint8Array.from(Buffer.from(value, 'utf-8'));
      
      batcher.streamDataBuilder.set(streamId, keyBytes, valueBytes);
      
      const [tx, execErr] = await batcher.exec();
      
      if (execErr) {
        throw new Error(`Batcher execution failed: ${execErr}`);
      }

      return {
        success: true,
        txHash: tx
      };
    } catch (error) {
      console.error('0G KV store error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown KV store error'
      };
    }
  }

  /**
   * Retrieve value from 0G KV store
   */
  async getValue(streamId: string, key: string): Promise<{ success: boolean; value?: string; error?: string }> {
    try {
      const encodedKey = ethers.encodeBase64(Buffer.from(key, 'utf-8'));
      const value = await this.kvClient.getValue(streamId, encodedKey);
      
      return {
        success: true,
        value: value || undefined
      };
    } catch (error) {
      console.error('0G KV get error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown KV get error'
      };
    }
  }

  /**
   * Store basket metadata in 0G storage
   */
  async storeBasketMetadata(basketId: string, metadata: any): Promise<{ success: boolean; rootHash?: string; error?: string }> {
    try {
      const metadataJson = JSON.stringify(metadata, null, 2);
      const buffer = Buffer.from(metadataJson, 'utf-8');
      
      const result = await this.uploadBuffer(buffer, `basket_${basketId}_metadata.json`);
      
      if (result.success && result.rootHash) {
        // Also store in KV for quick access
        await this.storeKeyValue('baskets', `metadata_${basketId}`, result.rootHash);
      }
      
      return result;
    } catch (error) {
      console.error('0G basket metadata store error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown metadata store error'
      };
    }
  }

  /**
   * Retrieve basket metadata from 0G storage
   */
  async getBasketMetadata(basketId: string): Promise<{ success: boolean; metadata?: any; error?: string }> {
    try {
      // First try to get from KV store
      const kvResult = await this.getValue('baskets', `metadata_${basketId}`);
      
      if (!kvResult.success || !kvResult.value) {
        return {
          success: false,
          error: 'Basket metadata not found in 0G storage'
        };
      }
      
      // Download the actual metadata file
      const tempPath = `/tmp/basket_${basketId}_${Date.now()}.json`;
      const downloadResult = await this.downloadFile(kvResult.value, tempPath);
      
      if (!downloadResult.success) {
        return {
          success: false,
          error: downloadResult.error
        };
      }
      
      // Read and parse the metadata
      const fs = await import('fs');
      const metadataJson = fs.readFileSync(tempPath, 'utf-8');
      const metadata = JSON.parse(metadataJson);
      
      // Clean up temp file
      try {
        fs.unlinkSync(tempPath);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp metadata file:', cleanupError);
      }
      
      return {
        success: true,
        metadata
      };
    } catch (error) {
      console.error('0G basket metadata get error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown metadata get error'
      };
    }
  }

  /**
   * Get network status and health
   */
  async getNetworkStatus(): Promise<{ success: boolean; status?: any; error?: string }> {
    try {
      // Check provider connection
      const blockNumber = await this.provider.getBlockNumber();
      
      const status = {
        connected: true,
        blockNumber,
        network: await this.provider.getNetwork(),
        signerAvailable: !!this.signer,
        flowContractAvailable: !!this.flowContract,
        timestamp: new Date().toISOString()
      };
      
      return {
        success: true,
        status
      };
    } catch (error) {
      console.error('0G network status error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown network status error'
      };
    }
  }
}

// Export singleton instance
export const zeroGService = new ZeroGService();

// Export types for use in other modules
export interface ZGUploadResult {
  success: boolean;
  rootHash?: string;
  txHash?: string;
  error?: string;
}

export interface ZGDownloadResult {
  success: boolean;
  error?: string;
}

export interface ZGKVResult {
  success: boolean;
  value?: string;
  txHash?: string;
  error?: string;
}