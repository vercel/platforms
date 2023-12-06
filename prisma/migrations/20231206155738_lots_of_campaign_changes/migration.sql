/*
  Warnings:

  - You are about to drop the column `creatorEthAddress` on the `Campaign` table. All the data in the column will be lost.
  - The `threshold` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[name,organizationId]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eth_address]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sponsorEthAddress` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Campaign" DROP CONSTRAINT "Campaign_organizationId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "creatorEthAddress",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "deployed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deployedAddress" TEXT,
ADD COLUMN     "sponsorEthAddress" TEXT NOT NULL,
ADD COLUMN     "timeDeployed" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "threshold",
ADD COLUMN     "threshold" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "CampaignContribution" (
    "id" TEXT NOT NULL,
    "senderEthAddress" TEXT NOT NULL,
    "campaignId" TEXT,

    CONSTRAINT "CampaignContribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_organizationId_key" ON "Campaign"("name", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_eth_address_key" ON "User"("eth_address");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignContribution" ADD CONSTRAINT "CampaignContribution_senderEthAddress_fkey" FOREIGN KEY ("senderEthAddress") REFERENCES "User"("eth_address") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignContribution" ADD CONSTRAINT "CampaignContribution_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
