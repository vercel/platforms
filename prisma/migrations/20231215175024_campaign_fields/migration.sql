-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "formId" TEXT,
ADD COLUMN     "requireApproval" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "CampaignTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER,
    "formId" TEXT,
    "price" INTEGER,
    "currency" TEXT,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "CampaignTier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CampaignTier" ADD CONSTRAINT "CampaignTier_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignTier" ADD CONSTRAINT "CampaignTier_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;
