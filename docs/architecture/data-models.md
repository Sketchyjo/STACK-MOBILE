# **Data Models**

### **Prisma Schema**

This schema will be the single source of truth for our database tables and will automatically generate the TypeScript types used in our code.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// --- DATA MODELS ---

model User {
  id              String    @id @default(cuid())
  email           String?   @unique
  walletAddress   String    @unique
  displayName     String
  avatarUrl       String?
  bio             String?
  isCurator       Boolean   @default(false)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  portfolio       Portfolio?
  virtualCard     VirtualCard?
  loans           Loan[]
  createdBaskets  Basket[]      @relation("CuratedBy")
  transactions    Transaction[]
  // Gamification relationships
  userQuests      UserQuest[]
  battlePassProgress UserBattlePass[]
  // AI Expert relationships
  tipInteractions UserTipInteraction[]
  // Personalization relationships
  preferences     UserPreference?
  feedInteractions UserFeedInteraction[]
  // Automation relationships
  investmentSchedules InvestmentSchedule[]
  autoInvestments AutoInvestment[]
  // Notification relationships
  notifications   Notification[]
}

model Portfolio {
  id          String    @id @default(cuid())
  totalValue  Decimal   @default(0)
  user        User      @relation(fields: [userId], references: [id])
  userId      String    @unique
  holdings    PortfolioHolding[]
}

model PortfolioHolding {
  id                    String    @id @default(cuid())
  unitsOwned            Decimal
  totalAmountInvested   Decimal
  currentValue          Decimal
  portfolio             Portfolio @relation(fields: [portfolioId], references: [id])
  portfolioId           String
  basket                Basket    @relation(fields: [basketId], references: [id])
  basketId              String
  @@unique([portfolioId, basketId])
}

model Basket {
  id            String    @id @default(cuid())
  name          String
  description   String
  iconUrl       String?
  riskLevel     RiskLevel @default(MEDIUM)
  assets        Json
  isCommunity   Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  curator       User?     @relation("CuratedBy", fields: [curatorId], references: [id])
  curatorId     String?
  holdings      PortfolioHolding[]
  // Automation relationships
  schedules     InvestmentSchedule[]
  autoInvestments AutoInvestment[]
}

model VirtualCard {
  id                   String     @id @default(cuid())
  spendableBalance     Decimal    @default(0)
  cardProcessorToken   String     @unique
  status               CardStatus @default(ACTIVE)
  roundUpSettings      Json
  spendingLimits       Json
  securitySettings     Json
  notificationSettings Json
  user                 User       @relation(fields: [userId], references: [id])
  userId               String     @unique
}

model Transaction {
  id          String            @id @default(cuid())
  amount      Decimal
  currency    String            @default("USD")
  type        TransactionType
  status      TransactionStatus @default(PENDING)
  description String
  metadata    Json?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  user        User              @relation(fields: [userId], references: [id])
  userId      String
}

model Loan {
  id                 String      @id @default(cuid())
  principalAmount    Decimal
  outstandingBalance Decimal
  interestRate       Decimal
  status             LoanStatus  @default(ACTIVE)
  collateral         Json
  createdAt          DateTime    @default(now())
  updatedAt          DateTime    @updatedAt
  user               User        @relation(fields: [userId], references: [id])
  userId             String
}

// --- GAMIFICATION MODELS ---

model Quest {
  id              String      @id @default(cuid())
  title           String
  description     String
  type            QuestType
  targetValue     Decimal?
  targetCount     Int?
  rewardType      RewardType
  rewardValue     Decimal?
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  userQuests      UserQuest[]
}

model UserQuest {
  id              String      @id @default(cuid())
  progress        Decimal     @default(0)
  isCompleted     Boolean     @default(false)
  completedAt     DateTime?
  claimedAt       DateTime?
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  quest           Quest       @relation(fields: [questId], references: [id])
  questId         String
  @@unique([userId, questId])
}

model BattlePass {
  id              String      @id @default(cuid())
  season          String
  startDate       DateTime
  endDate         DateTime
  isActive        Boolean     @default(true)
  tiers           Json        // Array of tier definitions with XP requirements and rewards
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  userProgress    UserBattlePass[]
}

model UserBattlePass {
  id              String      @id @default(cuid())
  currentXP       Int         @default(0)
  currentTier     Int         @default(1)
  claimedTiers    Json        @default("[]") // Array of claimed tier numbers
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  battlePass      BattlePass  @relation(fields: [battlePassId], references: [id])
  battlePassId    String
  @@unique([userId, battlePassId])
}

// --- AI EXPERT MODELS ---

model ExpertTip {
  id              String      @id @default(cuid())
  title           String
  content         String
  category        TipCategory
  triggerEvent    TriggerEvent
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  userInteractions UserTipInteraction[]
}

model UserTipInteraction {
  id              String      @id @default(cuid())
  wasShown        Boolean     @default(false)
  wasRead         Boolean     @default(false)
  wasHelpful      Boolean?
  shownAt         DateTime?
  readAt          DateTime?
  feedbackAt      DateTime?
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  tip             ExpertTip   @relation(fields: [tipId], references: [id])
  tipId           String
  @@unique([userId, tipId])
}

// --- PERSONALIZATION MODELS ---

model UserPreference {
  id              String      @id @default(cuid())
  riskTolerance   RiskLevel   @default(MEDIUM)
  investmentGoals Json        // Array of goal types
  interests       Json        // Array of interest categories
  notificationSettings Json
  user            User        @relation(fields: [userId], references: [id])
  userId          String      @unique
}

model FeedItem {
  id              String      @id @default(cuid())
  type            FeedItemType
  title           String
  description     String?
  imageUrl        String?
  targetId        String      // ID of basket, quest, etc.
  priority        Int         @default(0)
  isActive        Boolean     @default(true)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  userInteractions UserFeedInteraction[]
}

model UserFeedInteraction {
  id              String      @id @default(cuid())
  wasShown        Boolean     @default(false)
  wasClicked      Boolean     @default(false)
  wasInvested     Boolean     @default(false)
  shownAt         DateTime?
  clickedAt       DateTime?
  investedAt      DateTime?
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  feedItem        FeedItem    @relation(fields: [feedItemId], references: [id])
  feedItemId      String
  @@unique([userId, feedItemId])
}

// --- AUTOMATION MODELS ---

model InvestmentSchedule {
  id              String      @id @default(cuid())
  amount          Decimal
  frequency       ScheduleFrequency
  dayOfWeek       Int?        // 0-6 for weekly schedules
  dayOfMonth      Int?        // 1-31 for monthly schedules
  isActive        Boolean     @default(true)
  nextRunDate     DateTime
  lastRunDate     DateTime?
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  basket          Basket      @relation(fields: [basketId], references: [id])
  basketId        String
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

model AutoInvestment {
  id              String      @id @default(cuid())
  amount          Decimal
  type            AutoInvestmentType
  status          AutoInvestmentStatus @default(PENDING)
  scheduledFor    DateTime
  executedAt      DateTime?
  failureReason   String?
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  basket          Basket      @relation(fields: [basketId], references: [id])
  basketId        String
  schedule        InvestmentSchedule? @relation(fields: [scheduleId], references: [id])
  scheduleId      String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

// --- NOTIFICATION MODELS ---

model Notification {
  id              String      @id @default(cuid())
  title           String
  message         String
  type            NotificationType
  data            Json?       // Additional data for the notification
  isRead          Boolean     @default(false)
  readAt          DateTime?
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}

enum RiskLevel { LOW, MEDIUM, HIGH }
enum CardStatus { ACTIVE, INACTIVE, FROZEN }
enum TransactionType { CARD_PURCHASE, INVESTMENT, WITHDRAWAL, LOAN_DISBURSEMENT, LOAN_REPAYMENT, FEE }
enum TransactionStatus { PENDING, COMPLETED, FAILED, REVERSED }
enum LoanStatus { ACTIVE, REPAID, IN_DEFAULT, LIQUIDATED }
enum QuestType { INVESTMENT_AMOUNT, INVESTMENT_COUNT, CARD_USAGE, SOCIAL_ACTION, STREAK }
enum RewardType { XP, BONUS_INVESTMENT, COSMETIC, DISCOUNT }
enum TipCategory { INVESTMENT_STRATEGY, MARKET_INSIGHT, FINANCIAL_EDUCATION, PLATFORM_FEATURE }
enum TriggerEvent { POST_INVESTMENT, MARKET_MOVEMENT, QUEST_COMPLETION, WEEKLY_SUMMARY }
enum FeedItemType { BASKET_RECOMMENDATION, QUEST_SUGGESTION, CURATOR_HIGHLIGHT, MARKET_UPDATE }
enum ScheduleFrequency { WEEKLY, BIWEEKLY, MONTHLY }
enum AutoInvestmentType { PAYDAY, ROUNDUP, SCHEDULED }
enum AutoInvestmentStatus { PENDING, COMPLETED, FAILED, CANCELLED }
enum NotificationType { INVESTMENT_SUCCESS, QUEST_COMPLETED, MARKET_UPDATE, SYSTEM_ALERT }
```

-----
