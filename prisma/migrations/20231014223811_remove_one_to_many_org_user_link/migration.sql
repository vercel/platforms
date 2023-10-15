/*
  Warnings:

  - You are about to drop the column `userId` on the `Organization` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_userId_fkey";

-- DropIndex
DROP INDEX "Organization_userId_idx";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "userId";
