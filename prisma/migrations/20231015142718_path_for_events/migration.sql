/*
  Warnings:

  - Added the required column `path` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "path" TEXT NOT NULL,
ALTER COLUMN "name" SET NOT NULL;
