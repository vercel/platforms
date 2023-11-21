/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `AccommodationAvailability` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "QuestionType" ADD VALUE 'LINK';

-- AlterTable
ALTER TABLE "AccommodationAvailability" DROP COLUMN "isAvailable";
