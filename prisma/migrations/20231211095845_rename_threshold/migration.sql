/*
  Warnings:

  - You are about to drop the column `threshold` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" RENAME COLUMN "threshold" TO "thresholdWei";