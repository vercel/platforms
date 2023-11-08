/*
  Warnings:

  - A unique constraint covering the columns `[userId,formId]` on the table `FormResponse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FormResponse_userId_formId_key" ON "FormResponse"("userId", "formId");
