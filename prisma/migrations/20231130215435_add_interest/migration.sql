-- CreateEnum
CREATE TYPE "EmailSubscriberInterest" AS ENUM ('JOIN', 'FOUND');

-- AlterTable
ALTER TABLE "EmailSubscriber" ADD COLUMN     "indicatedInterest" "EmailSubscriberInterest" NOT NULL DEFAULT 'JOIN';
