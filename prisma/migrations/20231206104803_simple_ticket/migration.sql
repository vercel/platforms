/*
  Warnings:

  - You are about to drop the column `validFrom` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `issued` on the `TicketTier` table. All the data in the column will be lost.
  - Added the required column `deployedAddress` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "validFrom",
DROP COLUMN "validTo";

-- AlterTable
ALTER TABLE "TicketTier" DROP COLUMN "issued",
ADD COLUMN     "validFrom" TIMESTAMP(3),
ADD COLUMN     "validTo" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
