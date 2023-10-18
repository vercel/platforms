/*
  Warnings:

  - You are about to drop the column `applicationId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ApplicationAnswers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `formId` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_answersId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_roleId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationAnswers" DROP CONSTRAINT "ApplicationAnswers_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationAnswers" DROP CONSTRAINT "ApplicationAnswers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_applicationId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "applicationId",
ADD COLUMN     "formId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "formId" TEXT,
ADD COLUMN     "requiresForm" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TicketTier" ADD COLUMN     "formId" TEXT;

-- DropTable
DROP TABLE "Application";

-- DropTable
DROP TABLE "ApplicationAnswers";

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "validTo" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTier" ADD CONSTRAINT "TicketTier_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_answersId_fkey" FOREIGN KEY ("answersId") REFERENCES "FormResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponse" ADD CONSTRAINT "FormResponse_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
