import express from 'express';
import { AIService, ChatMessage } from '../services/aiService';
import { prisma } from '@stack/shared-types';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/ai/chat
 * Chat with the AI financial expert
 */
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { messages } = req.body;
    const walletAddress = req.user?.address;

    if (!walletAddress) {
      return res.status(401).json({
        error: 'User authentication required'
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Messages array is required'
      });
    }

    // Validate message format
    const validMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    // Get AI response
    const response = await AIService.chatWithExpert(validMessages);

    res.json({
      message: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({
      error: 'Failed to process chat message'
    });
  }
});

/**
 * GET /api/ai/tips
 * Get personalized expert tips for the user
 */
router.get('/tips', authenticateToken, async (req, res) => {
  try {
    const walletAddress = req.user?.address;
    const limit = parseInt(req.query.limit as string) || 5;

    if (!walletAddress) {
      return res.status(401).json({
        error: 'User authentication required'
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const tips = await AIService.getPersonalizedTips(user.id, limit);

    res.json({
      tips,
      count: tips.length
    });
  } catch (error) {
    console.error('Error getting personalized tips:', error);
    res.status(500).json({
      error: 'Failed to get personalized tips'
    });
  }
});

/**
 * POST /api/ai/tips/:tipId/interaction
 * Record user interaction with a tip
 */
router.post('/tips/:tipId/interaction', authenticateToken, async (req, res) => {
  try {
    const { tipId } = req.params;
    const walletAddress = req.user?.address;
    const { action, wasHelpful } = req.body;

    if (!walletAddress) {
      return res.status(401).json({
        error: 'User authentication required'
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Find or create interaction record
    let interaction = await prisma.userTipInteraction.findUnique({
      where: {
        userId_tipId: {
          userId: user.id,
          tipId
        }
      }
    });

    if (!interaction) {
      interaction = await prisma.userTipInteraction.create({
        data: {
          userId: user.id,
          tipId,
          wasShown: action === 'shown',
          wasRead: action === 'read',
          wasHelpful: wasHelpful,
          shownAt: action === 'shown' ? new Date() : undefined,
          readAt: action === 'read' ? new Date() : undefined,
          feedbackAt: wasHelpful !== undefined ? new Date() : undefined,
        }
      });
    } else {
      // Update existing interaction
      const updateData: any = {};
      
      if (action === 'shown' && !interaction.wasShown) {
        updateData.wasShown = true;
        updateData.shownAt = new Date();
      }
      
      if (action === 'read' && !interaction.wasRead) {
        updateData.wasRead = true;
        updateData.readAt = new Date();
      }
      
      if (wasHelpful !== undefined) {
        updateData.wasHelpful = wasHelpful;
        updateData.feedbackAt = new Date();
      }

      if (Object.keys(updateData).length > 0) {
        interaction = await prisma.userTipInteraction.update({
          where: {
            userId_tipId: {
              userId: user.id,
              tipId
            }
          },
          data: updateData
        });
      }
    }

    res.json({
      success: true,
      interaction
    });
  } catch (error) {
    console.error('Error recording tip interaction:', error);
    res.status(500).json({
      error: 'Failed to record tip interaction'
    });
  }
});

/**
 * POST /api/ai/generate-tips
 * Generate new AI tips (admin endpoint)
 */
router.post('/generate-tips', async (req, res) => {
  try {
    const { count = 10, adminKey } = req.body;

    // Simple admin key check (in production, use proper admin authentication)
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        error: 'Unauthorized'
      });
    }

    await AIService.createAndSaveExpertTips(count);

    res.json({
      success: true,
      message: `Generated ${count} new expert tips`
    });
  } catch (error) {
    console.error('Error generating tips:', error);
    res.status(500).json({
      error: 'Failed to generate tips'
    });
  }
});

/**
 * GET /api/ai/tips/:tipId
 * Get detailed information about a specific tip
 */
router.get('/tips/:tipId', authenticateToken, async (req, res) => {
  try {
    const { tipId } = req.params;
    const walletAddress = req.user?.address;

    if (!walletAddress) {
      return res.status(401).json({
        error: 'User authentication required'
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { walletAddress }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Get the tip with user interaction data
    const tip = await prisma.expertTip.findUnique({
      where: { id: tipId },
      include: {
        userInteractions: {
          where: { userId: user.id },
          select: {
            wasShown: true,
            wasRead: true,
            wasHelpful: true,
            shownAt: true,
            readAt: true,
            feedbackAt: true
          }
        },
        _count: {
          select: {
            userInteractions: {
              where: { wasHelpful: true }
            }
          }
        }
      }
    });

    if (!tip) {
      return res.status(404).json({
        error: 'Tip not found'
      });
    }

    // Calculate read time based on content length (average reading speed: 200 words per minute)
    const wordCount = tip.content.split(' ').length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    // Get related tips from the same category
    const relatedTips = await prisma.expertTip.findMany({
      where: {
        category: tip.category,
        id: { not: tipId },
        isActive: true
      },
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true
      },
      take: 3,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const userInteraction = tip.userInteractions[0] || null;

    res.json({
      id: tip.id,
      title: tip.title,
      content: tip.content,
      category: tip.category,
      triggerEvent: tip.triggerEvent,
      readTime,
      createdAt: tip.createdAt,
      updatedAt: tip.updatedAt,
      userInteraction: userInteraction ? {
        wasShown: userInteraction.wasShown,
        wasRead: userInteraction.wasRead,
        wasHelpful: userInteraction.wasHelpful,
        shownAt: userInteraction.shownAt,
        readAt: userInteraction.readAt,
        feedbackAt: userInteraction.feedbackAt
      } : null,
      helpfulCount: tip._count.userInteractions,
      relatedTips: relatedTips.map(relatedTip => ({
        id: relatedTip.id,
        title: relatedTip.title,
        category: relatedTip.category,
        createdAt: relatedTip.createdAt
      }))
    });
  } catch (error) {
    console.error('Error getting tip detail:', error);
    res.status(500).json({
      error: 'Failed to get tip detail'
    });
  }
});

/**
 * GET /api/ai/tips/all
 * Get all expert tips (admin endpoint)
 */
router.get('/tips/all', async (req, res) => {
  try {
    const { adminKey } = req.query;

    // Simple admin key check
    if (adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({
        error: 'Unauthorized'
      });
    }

    const tips = await prisma.expertTip.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            userInteractions: true
          }
        }
      }
    });

    res.json({
      tips,
      count: tips.length
    });
  } catch (error) {
    console.error('Error getting all tips:', error);
    res.status(500).json({
      error: 'Failed to get tips'
    });
  }
});

export { router as aiRouter };