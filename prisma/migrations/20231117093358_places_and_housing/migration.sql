-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "address" JSONB NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "geoJSON" JSONB,
    "googlePlaceId" TEXT,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccommodationUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "rooms" INTEGER,
    "placeId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "AccommodationUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccommodationAvailability" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "accommodationUnitId" TEXT NOT NULL,

    CONSTRAINT "AccommodationAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "accommodationUnitId" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccommodationUnit" ADD CONSTRAINT "AccommodationUnit_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationUnit" ADD CONSTRAINT "AccommodationUnit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "AccommodationUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccommodationAvailability" ADD CONSTRAINT "AccommodationAvailability_accommodationUnitId_fkey" FOREIGN KEY ("accommodationUnitId") REFERENCES "AccommodationUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_accommodationUnitId_fkey" FOREIGN KEY ("accommodationUnitId") REFERENCES "AccommodationUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
