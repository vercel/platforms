/*
  Warnings:

  - You are about to drop the `Answers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,tierId]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tierId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_answersId_fkey";

-- DropForeignKey
ALTER TABLE "Answers" DROP CONSTRAINT "Answers_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "Answers" DROP CONSTRAINT "Answers_userId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_roleId_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_roleId_eventId_fkey";

-- DropIndex
DROP INDEX "Ticket_userId_roleId_eventId_key";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "tierId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Answers";

-- CreateTable
CREATE TABLE "TicketTier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "TicketTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationAnswers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TicketTier_eventId_idx" ON "TicketTier"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_userId_tierId_key" ON "Ticket"("userId", "tierId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "TicketTier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTier" ADD CONSTRAINT "TicketTier_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTier" ADD CONSTRAINT "TicketTier_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_answersId_fkey" FOREIGN KEY ("answersId") REFERENCES "ApplicationAnswers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationAnswers" ADD CONSTRAINT "ApplicationAnswers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationAnswers" ADD CONSTRAINT "ApplicationAnswers_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
