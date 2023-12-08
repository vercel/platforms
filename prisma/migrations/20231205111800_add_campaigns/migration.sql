/*
  Warnings:

  - You are about to drop the column `amountPaid` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Made the column `validFrom` on table `Ticket` required. This step will fail if there are existing NULL values in that column.
  - Made the column `validTo` on table `Ticket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "amountPaid",
ADD COLUMN     "roleId" TEXT NOT NULL,
ALTER COLUMN "validFrom" SET NOT NULL,
ALTER COLUMN "validTo" SET NOT NULL;

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "threshold" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorEthAddress" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);
