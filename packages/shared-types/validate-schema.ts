import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function validateSchema() {
  try {
    console.log('🔍 Validating database schema...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test basic queries to validate schema
    const userCount = await prisma.user.count();
    console.log(`📊 Users in database: ${userCount}`);
    
    const basketCount = await prisma.basket.count();
    console.log(`🧺 Baskets in database: ${basketCount}`);
    
    const questCount = await prisma.quest.count();
    console.log(`🎯 Quests in database: ${questCount}`);
    
    console.log('✅ Schema validation completed successfully');
    
  } catch (error) {
    console.error('❌ Schema validation failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

validateSchema();