/*
  Warnings:

  - You are about to drop the column `validFrom` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `Form` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Form` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Form" DROP COLUMN "validFrom",
DROP COLUMN "validTo",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "organizationId" TEXT NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
