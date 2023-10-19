/*
  Warnings:

  - Added the required column `order` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'SELECT', 'MULTI_SELECT', 'DATE_TIME', 'DATE_RANGE', 'RANGE');

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "order" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "QuestionType" NOT NULL;
