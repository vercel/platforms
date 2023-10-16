/*
  Warnings:

  - A unique constraint covering the columns `[path]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Event_path_key" ON "Event"("path");
