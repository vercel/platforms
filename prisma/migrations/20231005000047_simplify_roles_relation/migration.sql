/*
  Warnings:

  - You are about to drop the column `ethereumAddress` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `OrganizationRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrganizationUserRole` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `organizationId` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrganizationRole" DROP CONSTRAINT "OrganizationRole_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationUserRole" DROP CONSTRAINT "OrganizationUserRole_organizationRoleId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationUserRole" DROP CONSTRAINT "OrganizationUserRole_userId_fkey";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "ethereumAddress" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ethereumAddress";

-- DropTable
DROP TABLE "OrganizationRole";

-- DropTable
DROP TABLE "OrganizationUserRole";

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
