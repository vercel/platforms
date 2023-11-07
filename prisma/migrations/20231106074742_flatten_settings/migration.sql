/*
  Warnings:

  - You are about to drop the column `settings` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "settings",
ADD COLUMN     "fromDate" TIMESTAMP(3),
ADD COLUMN     "max" INTEGER,
ADD COLUMN     "min" INTEGER,
ADD COLUMN     "toDate" TIMESTAMP(3),
ADD COLUMN     "variants" JSONB;
