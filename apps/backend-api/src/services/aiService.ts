import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@stack/shared-types';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AITipRequest {
  category: 'INVESTMENT_STRATEGY' | 'MARKET_INSIGHT' | 'FINANCIAL_EDUCATION' | 'PLATFORM_FEATURE';
  context?: string;
  userProfile?: {
    riskTolerance: string;
    investmentGoals: string[];
    interests: string[];
  };
}

export class AIService {
  private static readonly FINANCIAL_EXPERT_PERSONA = `
    You are Marcus Sterling, a seasoned financial advisor with over 15 years of experience in investment management and financial planning.

    Your personality:
    - Knowledgeable yet approachable
    - Patient and educational in your explanations
    - Conservative but open to modern investment strategies
    - Always emphasize risk management and diversification
    - Use real-world examples and analogies to explain complex concepts
    - Maintain a professional but friendly tone

    Your expertise includes:
    - Portfolio diversification strategies
    - Risk assessment and management
    - Market analysis and trends
    - Investment baskets and ETFs
    - Long-term wealth building
    - Financial education for beginners

    Always provide actionable advice while reminding users to consider their personal financial situation and risk tolerance.
    Keep responses concise but informative, typically 2-4 sentences unless more detail is specifically requested.
  `;

  /**
   * Generate AI-powered financial tips for the feed
   */
  static async generateFinancialTip(request: AITipRequest): Promise<string> {
    try {
      const contextPrompt = `${this.FINANCIAL_EXPERT_PERSONA}\n\n${this.buildTipPrompt(request)}`;

      const result = await model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

      return text || "Unable to generate tip at this time.";
    } catch (error) {
      console.error('Error generating AI tip:', error);
      throw new Error('Failed to generate financial tip');
    }
  }

  /**
   * Handle chat conversation with the AI financial expert
   */
  static async chatWithExpert(messages: ChatMessage[]): Promise<string> {
    try {
      const systemPrompt = this.FINANCIAL_EXPERT_PERSONA + `

          Additional context: You are chatting with a user through the STACK mobile investment app.
          The app allows users to invest in curated baskets of stocks and crypto.
          Users can also complete quests to earn rewards and track their investment journey.

          Be helpful, educational, and encourage smart investing practices.
          `;
      
      const conversationHistory = messages.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      const fullPrompt = `${systemPrompt}\n\nConversation:\n${conversationHistory}\n\nAssistant:`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return text || "I'm sorry, I couldn't process your message right now.";
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw new Error('Failed to process chat message');
    }
  }

  /**
   * Create and save AI-generated expert tips to the database
   */
  static async createAndSaveExpertTips(count: number = 10): Promise<void> {
    const tipCategories = ['INVESTMENT_STRATEGY', 'MARKET_INSIGHT', 'FINANCIAL_EDUCATION', 'PLATFORM_FEATURE'] as const;
    const triggerEvents = ['POST_INVESTMENT', 'MARKET_MOVEMENT', 'QUEST_COMPLETION', 'WEEKLY_SUMMARY'] as const;

    for (let i = 0; i < count; i++) {
      try {
        const category = tipCategories[Math.floor(Math.random() * tipCategories.length)];
        const triggerEvent = triggerEvents[Math.floor(Math.random() * triggerEvents.length)];

        const tipContent = await this.generateFinancialTip({ category });

        // Generate a title based on the content
        const titlePrompt = `Generate a single, short, engaging title (max 60 characters) for this financial tip. Return ONLY the title, no explanations or options: "${tipContent}"`;
        const titleResult = await model.generateContent(titlePrompt);
        const titleResponse = await titleResult.response;
        const titleText = titleResponse.text();

        // Extract the first line and clean it up
        const title = titleText?.split('\n')[0]
          .replace(/^\*\*?|\*\*?$/g, '') // Remove markdown bold
          .replace(/^[\*\-\•]\s*/, '') // Remove bullet points
          .replace(/"/g, '') // Remove quotes
          .trim() || `Financial Tip #${i + 1}`;

        await prisma.expertTip.create({
          data: {
            title: title.substring(0, 60),
            content: tipContent,
            category,
            triggerEvent,
            isActive: true,
          },
        });

        console.log(`✅ Created expert tip: ${title}`);

        // Add delay to prevent rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`❌ Failed to create tip ${i + 1}:`, error);
      }
    }
  }

  /**
   * Get personalized tips based on user profile
   */
  static async getPersonalizedTips(userId: string, limit: number = 5): Promise<any[]> {
    try {
      // Get user preferences
      const userPreferences = await prisma.userPreference.findUnique({
        where: { userId },
      });

      // Get tips that haven't been shown to the user recently
      const tips = await prisma.expertTip.findMany({
        where: {
          isActive: true,
          userInteractions: {
            none: {
              userId,
              wasShown: true,
              shownAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
              },
            },
          },
        },
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return tips;
    } catch (error) {
      console.error('Error getting personalized tips:', error);
      return [];
    }
  }

  private static buildTipPrompt(request: AITipRequest): string {
    let prompt = `Generate a helpful financial tip for the category: ${request.category.replace('_', ' ').toLowerCase()}.`;

    if (request.context) {
      prompt += ` Context: ${request.context}`;
    }

    if (request.userProfile) {
      prompt += ` User profile - Risk tolerance: ${request.userProfile.riskTolerance}, Goals: ${request.userProfile.investmentGoals.join(', ')}, Interests: ${request.userProfile.interests.join(', ')}.`;
    }

    prompt += ` The tip should be practical, actionable, and suitable for users of an investment app that offers curated stock and crypto baskets.`;

    return prompt;
  }
}

export default AIService;
