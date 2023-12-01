/*
  Warnings:

  - Added the required column `amountPaid` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "amountPaid" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ALTER COLUMN "validFrom" DROP NOT NULL,
ALTER COLUMN "validTo" DROP NOT NULL;
