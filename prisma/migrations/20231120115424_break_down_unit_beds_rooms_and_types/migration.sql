/*
  Warnings:

  - You are about to drop the column `beds` on the `AccommodationUnit` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `AccommodationUnit` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `AccommodationUnit` table. All the data in the column will be lost.
  - You are about to drop the column `rooms` on the `AccommodationUnit` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `AccommodationUnit` table. All the data in the column will be lost.
  - Added the required column `accommodationTypeId` to the `AccommodationUnit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accomodationTypeId` to the `AccommodationUnit` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccommodationBedType" AS ENUM ('SINGLE', 'DOUBLE', 'QUEEN', 'KING');

-- DropForeignKey
ALTER TABLE "AccommodationUnit" DROP CONSTRAINT "AccommodationUnit_parentId_fkey";

-- DropForeignKey
ALTER TABLE "AccommodationUnit" DROP CONSTRAINT "AccommodationUnit_placeId_fkey";

-- AlterTable
ALTER TABLE "AccommodationUnit" DROP COLUMN "beds",
DROP COLUMN "capacity",
DROP COLUMN "parentId",
DROP COLUMN "rooms",
DROP COLUMN "type",
ADD COLUMN     "accommodationTypeId" TEXT NOT NULL,
ADD COLUMN     "accomodationTypeId" TEXT NOT NULL,
ALTER COLUMN "placeId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "AccommodationType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "AccommodationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccommodationRoom" (
    "id" TEXT NOT NULL,
    "accommodationTypeId" TEXT NOT NULL,

    CONSTRAINT "AccommodationRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccommodationBed" (
    "id" TEXT NOT NULL,
    "bedType" "AccommodationBedType" NOT NULL,
    "accommodationRoomId" TEXT NOT NULL,

    CONSTRAINT "AccommodationBed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccommodationUnit" ADD CONSTRAINT "AccommodationUnit_accommodationTypeId_fkey" FOREIGN KEY ("accommodationTypeId") REFERENCES "AccommodationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationUnit" ADD CONSTRAINT "AccommodationUnit_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationType" ADD CONSTRAINT "AccommodationType_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationRoom" ADD CONSTRAINT "AccommodationRoom_accommodationTypeId_fkey" FOREIGN KEY ("accommodationTypeId") REFERENCES "AccommodationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationBed" ADD CONSTRAINT "AccommodationBed_accommodationRoomId_fkey" FOREIGN KEY ("accommodationRoomId") REFERENCES "AccommodationRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
