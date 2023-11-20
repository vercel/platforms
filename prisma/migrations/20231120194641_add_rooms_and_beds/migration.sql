/*
  Warnings:

  - You are about to drop the column `accommodationTypeId` on the `AccommodationUnit` table. All the data in the column will be lost.
  - You are about to drop the column `accomodationTypeId` on the `AccommodationUnit` table. All the data in the column will be lost.
  - You are about to drop the `AccommodationBed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccommodationRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AccommodationType` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `AccommodationUnit` table without a default value. This is not possible if the table is not empty.
  - Made the column `placeId` on table `AccommodationUnit` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "BedType" AS ENUM ('SINGLE', 'DOUBLE', 'QUEEN', 'KING');

-- DropForeignKey
ALTER TABLE "AccommodationBed" DROP CONSTRAINT "AccommodationBed_accommodationRoomId_fkey";

-- DropForeignKey
ALTER TABLE "AccommodationRoom" DROP CONSTRAINT "AccommodationRoom_accommodationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "AccommodationType" DROP CONSTRAINT "AccommodationType_placeId_fkey";

-- DropForeignKey
ALTER TABLE "AccommodationUnit" DROP CONSTRAINT "AccommodationUnit_accommodationTypeId_fkey";

-- DropForeignKey
ALTER TABLE "AccommodationUnit" DROP CONSTRAINT "AccommodationUnit_placeId_fkey";

-- AlterTable
ALTER TABLE "AccommodationUnit" DROP COLUMN "accommodationTypeId",
DROP COLUMN "accomodationTypeId",
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "placeId" SET NOT NULL;

-- DropTable
DROP TABLE "AccommodationBed";

-- DropTable
DROP TABLE "AccommodationRoom";

-- DropTable
DROP TABLE "AccommodationType";

-- DropEnum
DROP TYPE "AccommodationBedType";

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "capacity" INTEGER,
    "name" TEXT,
    "description" TEXT,
    "accommodationUnitId" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bed" (
    "id" TEXT NOT NULL,
    "type" "BedType" NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "Bed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccommodationUnit" ADD CONSTRAINT "AccommodationUnit_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationUnit" ADD CONSTRAINT "AccommodationUnit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "AccommodationUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_accommodationUnitId_fkey" FOREIGN KEY ("accommodationUnitId") REFERENCES "AccommodationUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bed" ADD CONSTRAINT "Bed_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
