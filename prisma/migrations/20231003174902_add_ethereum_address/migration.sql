-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "siteId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ethereumAddress" TEXT;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
