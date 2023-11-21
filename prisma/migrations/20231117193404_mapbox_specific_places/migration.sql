-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "googleAddress" JSONB,
ADD COLUMN     "mapboxAddress" JSONB,
ADD COLUMN     "mapboxPlaceId" TEXT;
