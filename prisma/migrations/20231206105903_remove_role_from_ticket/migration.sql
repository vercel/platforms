/*
  Warnings:

  - You are about to drop the column `roleId` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_roleId_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "roleId";
