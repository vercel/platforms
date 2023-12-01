/*
  Warnings:

  - You are about to drop the column `currency` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "currency",
DROP COLUMN "roleId";
