import { AIService } from '../services/aiService';

async function generateInitialTips() {
  console.log('🤖 Starting AI tip generation...');
  
  try {
    // Generate 10 initial tips to avoid rate limiting
    await AIService.createAndSaveExpertTips(10);
    
    console.log('🎉 AI tip generation completed!');
  } catch (error) {
    console.error('💥 Error generating AI tips:', error);
  }
}

generateInitialTips();