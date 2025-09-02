import { Router, Request, Response } from 'express';
import { zeroGService } from '../services/zeroGService.js';
import { authenticateToken } from '../middleware/auth.js';
import multer from 'multer';
import { z } from 'zod';

// Extend Request interface for file uploads
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Validation schemas
const storeMetadataSchema = z.object({
  basketId: z.string().min(1),
  metadata: z.object({
    name: z.string(),
    description: z.string().optional(),
    assets: z.array(z.object({
      symbol: z.string(),
      allocation: z.number(),
      price: z.number().optional(),
    })),
    performance: z.object({
      totalReturn: z.number().optional(),
      volatility: z.number().optional(),
      sharpeRatio: z.number().optional(),
    }).optional(),
    riskMetrics: z.object({
      riskLevel: z.enum(['low', 'medium', 'high']),
      maxDrawdown: z.number().optional(),
      beta: z.number().optional(),
    }).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  }),
});

const kvStoreSchema = z.object({
  streamId: z.string().min(1),
  key: z.string().min(1),
  value: z.string().min(1),
});

const kvGetSchema = z.object({
  streamId: z.string().min(1),
  key: z.string().min(1),
});

/**
 * @route GET /api/v1/0g/status
 * @desc Get 0G network status and health
 * @access Public
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const result = await zeroGService.getNetworkStatus();
    
    if (result.success) {
      res.json({
        success: true,
        data: result.status,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('0G status endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route POST /api/v1/0g/upload
 * @desc Upload file to 0G decentralized storage
 * @access Private
 */
router.post('/upload', authenticateToken, upload.single('file'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided',
      });
    }

    const result = await zeroGService.uploadBuffer(
      req.file.buffer,
      req.file.originalname
    );
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          rootHash: result.rootHash,
          txHash: result.txHash,
          filename: req.file.originalname,
          size: req.file.size,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('0G upload endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route GET /api/v1/0g/download/:rootHash
 * @desc Download file from 0G storage
 * @access Private
 */
router.get('/download/:rootHash', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { rootHash } = req.params;
    const { withProof } = req.query;
    
    if (!rootHash) {
      return res.status(400).json({
        success: false,
        error: 'Root hash is required',
      });
    }

    const tempPath = `/tmp/download_${rootHash}_${Date.now()}`;
    const result = await zeroGService.downloadFile(
      rootHash,
      tempPath,
      withProof === 'true'
    );
    
    if (result.success) {
      // Send file and clean up
      res.download(tempPath, (err) => {
        if (err) {
          console.error('File download error:', err);
        }
        // Clean up temp file
        const fs = require('fs');
        try {
          fs.unlinkSync(tempPath);
        } catch (cleanupError) {
          console.warn('Failed to cleanup download temp file:', cleanupError);
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('0G download endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route POST /api/v1/0g/kv/store
 * @desc Store key-value data in 0G KV store
 * @access Private
 */
router.post('/kv/store', authenticateToken, async (req: Request, res: Response) => {
  try {
    const validation = kvStoreSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validation.error.errors,
      });
    }

    const { streamId, key, value } = validation.data;
    const result = await zeroGService.storeKeyValue(streamId, key, value);
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          txHash: result.txHash,
          streamId,
          key,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('0G KV store endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route GET /api/v1/0g/kv/:streamId/:key
 * @desc Get value from 0G KV store
 * @access Private
 */
router.get('/kv/:streamId/:key', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { streamId, key } = req.params;
    
    if (!streamId || !key) {
      return res.status(400).json({
        success: false,
        error: 'Stream ID and key are required',
      });
    }

    const result = await zeroGService.getValue(streamId, key);
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          streamId,
          key,
          value: result.value,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('0G KV get endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route POST /api/v1/0g/baskets/metadata
 * @desc Store basket metadata in 0G storage
 * @access Private
 */
router.post('/baskets/metadata', authenticateToken, async (req: Request, res: Response) => {
  try {
    const validation = storeMetadataSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid metadata format',
        details: validation.error.errors,
      });
    }

    const { basketId, metadata } = validation.data;
    
    // Add timestamp to metadata
    const enrichedMetadata = {
      ...metadata,
      updatedAt: new Date().toISOString(),
      storedIn0G: true,
    };
    
    const result = await zeroGService.storeBasketMetadata(basketId, enrichedMetadata);
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          basketId,
          rootHash: result.rootHash,
          metadata: enrichedMetadata,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('0G basket metadata store endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * @route GET /api/v1/0g/baskets/:basketId/metadata
 * @desc Get basket metadata from 0G storage
 * @access Private
 */
router.get('/baskets/:basketId/metadata', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { basketId } = req.params;
    
    if (!basketId) {
      return res.status(400).json({
        success: false,
        error: 'Basket ID is required',
      });
    }

    const result = await zeroGService.getBasketMetadata(basketId);
    
    if (result.success) {
      res.json({
        success: true,
        data: {
          basketId,
          metadata: result.metadata,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('0G basket metadata get endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;