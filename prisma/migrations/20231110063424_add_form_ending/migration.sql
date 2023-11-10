-- AlterTable
ALTER TABLE "Form" ADD COLUMN     "endingDescription" TEXT,
ADD COLUMN     "endingTitle" TEXT NOT NULL DEFAULT 'Succesfully submitted response';
