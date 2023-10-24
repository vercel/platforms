/*
  Warnings:

  - The values [TEXT,NUMBER,BOOLEAN,DATE_TIME,DATE_RANGE,RANGE] on the enum `QuestionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionType_new" AS ENUM ('SHORT_TEXT', 'LONG_TEXT', 'SELECT', 'MULTI_SELECT', 'Boolean');
ALTER TABLE "Question" ALTER COLUMN "type" TYPE "QuestionType_new" USING ("type"::text::"QuestionType_new");
ALTER TYPE "QuestionType" RENAME TO "QuestionType_old";
ALTER TYPE "QuestionType_new" RENAME TO "QuestionType";
DROP TYPE "QuestionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "required" BOOLEAN NOT NULL DEFAULT true;
