-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'FROZEN');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CARD_PURCHASE', 'INVESTMENT', 'WITHDRAWAL', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'FEE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('ACTIVE', 'REPAID', 'IN_DEFAULT', 'LIQUIDATED');

-- CreateEnum
CREATE TYPE "QuestType" AS ENUM ('INVESTMENT_AMOUNT', 'INVESTMENT_COUNT', 'CARD_USAGE', 'SOCIAL_ACTION', 'STREAK');

-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('XP', 'BONUS_INVESTMENT', 'COSMETIC', 'DISCOUNT');

-- CreateEnum
CREATE TYPE "TipCategory" AS ENUM ('INVESTMENT_STRATEGY', 'MARKET_INSIGHT', 'FINANCIAL_EDUCATION', 'PLATFORM_FEATURE');

-- CreateEnum
CREATE TYPE "TriggerEvent" AS ENUM ('POST_INVESTMENT', 'MARKET_MOVEMENT', 'QUEST_COMPLETION', 'WEEKLY_SUMMARY');

-- CreateEnum
CREATE TYPE "FeedItemType" AS ENUM ('BASKET_RECOMMENDATION', 'QUEST_SUGGESTION', 'CURATOR_HIGHLIGHT', 'MARKET_UPDATE');

-- CreateEnum
CREATE TYPE "ScheduleFrequency" AS ENUM ('WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "AutoInvestmentType" AS ENUM ('PAYDAY', 'ROUNDUP', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "AutoInvestmentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INVESTMENT_SUCCESS', 'QUEST_COMPLETED', 'MARKET_UPDATE', 'SYSTEM_ALERT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "walletAddress" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "isCurator" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "totalValue" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_holdings" (
    "id" TEXT NOT NULL,
    "unitsOwned" DECIMAL(18,8) NOT NULL,
    "totalAmountInvested" DECIMAL(18,8) NOT NULL,
    "currentValue" DECIMAL(18,8) NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "basketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolio_holdings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "baskets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "iconUrl" TEXT,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "assets" JSONB NOT NULL,
    "isCommunity" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "curatorId" TEXT,

    CONSTRAINT "baskets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "virtual_cards" (
    "id" TEXT NOT NULL,
    "spendableBalance" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "cardProcessorToken" TEXT NOT NULL,
    "status" "CardStatus" NOT NULL DEFAULT 'ACTIVE',
    "roundUpSettings" JSONB NOT NULL,
    "spendingLimits" JSONB NOT NULL,
    "securitySettings" JSONB NOT NULL,
    "notificationSettings" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "virtual_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "principalAmount" DECIMAL(18,8) NOT NULL,
    "outstandingBalance" DECIMAL(18,8) NOT NULL,
    "interestRate" DECIMAL(5,4) NOT NULL,
    "status" "LoanStatus" NOT NULL DEFAULT 'ACTIVE',
    "collateral" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "QuestType" NOT NULL,
    "targetValue" DECIMAL(18,8),
    "targetCount" INTEGER,
    "rewardType" "RewardType" NOT NULL,
    "rewardValue" DECIMAL(18,8),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_quests" (
    "id" TEXT NOT NULL,
    "progress" DECIMAL(18,8) NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "claimedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "questId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_quests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "battle_passes" (
    "id" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tiers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "battle_passes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_battle_passes" (
    "id" TEXT NOT NULL,
    "currentXP" INTEGER NOT NULL DEFAULT 0,
    "currentTier" INTEGER NOT NULL DEFAULT 1,
    "claimedTiers" JSONB NOT NULL DEFAULT '[]',
    "userId" TEXT NOT NULL,
    "battlePassId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_battle_passes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_tips" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "TipCategory" NOT NULL,
    "triggerEvent" "TriggerEvent" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expert_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tip_interactions" (
    "id" TEXT NOT NULL,
    "wasShown" BOOLEAN NOT NULL DEFAULT false,
    "wasRead" BOOLEAN NOT NULL DEFAULT false,
    "wasHelpful" BOOLEAN,
    "shownAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "feedbackAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "tipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_tip_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "riskTolerance" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "investmentGoals" JSONB NOT NULL,
    "interests" JSONB NOT NULL,
    "notificationSettings" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_items" (
    "id" TEXT NOT NULL,
    "type" "FeedItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "targetId" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feed_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feed_interactions" (
    "id" TEXT NOT NULL,
    "wasShown" BOOLEAN NOT NULL DEFAULT false,
    "wasClicked" BOOLEAN NOT NULL DEFAULT false,
    "wasInvested" BOOLEAN NOT NULL DEFAULT false,
    "shownAt" TIMESTAMP(3),
    "clickedAt" TIMESTAMP(3),
    "investedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "feedItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_feed_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_schedules" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "frequency" "ScheduleFrequency" NOT NULL,
    "dayOfWeek" INTEGER,
    "dayOfMonth" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "nextRunDate" TIMESTAMP(3) NOT NULL,
    "lastRunDate" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "basketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investment_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auto_investments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(18,8) NOT NULL,
    "type" "AutoInvestmentType" NOT NULL,
    "status" "AutoInvestmentStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "executedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "userId" TEXT NOT NULL,
    "basketId" TEXT NOT NULL,
    "scheduleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auto_investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "portfolios_userId_key" ON "portfolios"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "portfolio_holdings_portfolioId_basketId_key" ON "portfolio_holdings"("portfolioId", "basketId");

-- CreateIndex
CREATE UNIQUE INDEX "virtual_cards_cardProcessorToken_key" ON "virtual_cards"("cardProcessorToken");

-- CreateIndex
CREATE UNIQUE INDEX "virtual_cards_userId_key" ON "virtual_cards"("userId");

-- CreateIndex
CREATE INDEX "transactions_userId_createdAt_idx" ON "transactions"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "transactions_type_status_idx" ON "transactions"("type", "status");

-- CreateIndex
CREATE INDEX "loans_userId_status_idx" ON "loans"("userId", "status");

-- CreateIndex
CREATE INDEX "quests_isActive_type_idx" ON "quests"("isActive", "type");

-- CreateIndex
CREATE INDEX "user_quests_userId_isCompleted_idx" ON "user_quests"("userId", "isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "user_quests_userId_questId_key" ON "user_quests"("userId", "questId");

-- CreateIndex
CREATE UNIQUE INDEX "battle_passes_season_key" ON "battle_passes"("season");

-- CreateIndex
CREATE INDEX "battle_passes_isActive_startDate_endDate_idx" ON "battle_passes"("isActive", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "user_battle_passes_userId_currentXP_idx" ON "user_battle_passes"("userId", "currentXP");

-- CreateIndex
CREATE UNIQUE INDEX "user_battle_passes_userId_battlePassId_key" ON "user_battle_passes"("userId", "battlePassId");

-- CreateIndex
CREATE INDEX "expert_tips_isActive_category_idx" ON "expert_tips"("isActive", "category");

-- CreateIndex
CREATE INDEX "expert_tips_triggerEvent_idx" ON "expert_tips"("triggerEvent");

-- CreateIndex
CREATE INDEX "user_tip_interactions_userId_wasShown_idx" ON "user_tip_interactions"("userId", "wasShown");

-- CreateIndex
CREATE UNIQUE INDEX "user_tip_interactions_userId_tipId_key" ON "user_tip_interactions"("userId", "tipId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- CreateIndex
CREATE INDEX "feed_items_isActive_priority_idx" ON "feed_items"("isActive", "priority");

-- CreateIndex
CREATE INDEX "feed_items_type_targetId_idx" ON "feed_items"("type", "targetId");

-- CreateIndex
CREATE INDEX "user_feed_interactions_userId_wasShown_idx" ON "user_feed_interactions"("userId", "wasShown");

-- CreateIndex
CREATE UNIQUE INDEX "user_feed_interactions_userId_feedItemId_key" ON "user_feed_interactions"("userId", "feedItemId");

-- CreateIndex
CREATE INDEX "investment_schedules_isActive_nextRunDate_idx" ON "investment_schedules"("isActive", "nextRunDate");

-- CreateIndex
CREATE INDEX "investment_schedules_userId_isActive_idx" ON "investment_schedules"("userId", "isActive");

-- CreateIndex
CREATE INDEX "auto_investments_status_scheduledFor_idx" ON "auto_investments"("status", "scheduledFor");

-- CreateIndex
CREATE INDEX "auto_investments_userId_status_idx" ON "auto_investments"("userId", "status");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_type_createdAt_idx" ON "notifications"("type", "createdAt");

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_holdings" ADD CONSTRAINT "portfolio_holdings_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_holdings" ADD CONSTRAINT "portfolio_holdings_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "baskets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "baskets" ADD CONSTRAINT "baskets_curatorId_fkey" FOREIGN KEY ("curatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "virtual_cards" ADD CONSTRAINT "virtual_cards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quests" ADD CONSTRAINT "user_quests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_quests" ADD CONSTRAINT "user_quests_questId_fkey" FOREIGN KEY ("questId") REFERENCES "quests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_battle_passes" ADD CONSTRAINT "user_battle_passes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_battle_passes" ADD CONSTRAINT "user_battle_passes_battlePassId_fkey" FOREIGN KEY ("battlePassId") REFERENCES "battle_passes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tip_interactions" ADD CONSTRAINT "user_tip_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tip_interactions" ADD CONSTRAINT "user_tip_interactions_tipId_fkey" FOREIGN KEY ("tipId") REFERENCES "expert_tips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feed_interactions" ADD CONSTRAINT "user_feed_interactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feed_interactions" ADD CONSTRAINT "user_feed_interactions_feedItemId_fkey" FOREIGN KEY ("feedItemId") REFERENCES "feed_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_schedules" ADD CONSTRAINT "investment_schedules_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investment_schedules" ADD CONSTRAINT "investment_schedules_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "baskets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_investments" ADD CONSTRAINT "auto_investments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_investments" ADD CONSTRAINT "auto_investments_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "baskets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_investments" ADD CONSTRAINT "auto_investments_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "investment_schedules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
