-- AlterTable
ALTER TABLE "users" ADD COLUMN     "hasStarterInvestment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "starterInvestmentClaimedAt" TIMESTAMP(3);