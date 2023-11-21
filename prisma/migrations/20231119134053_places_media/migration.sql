-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "uri" TEXT NOT NULL,
    "blurhash" TEXT,
    "placeId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;
