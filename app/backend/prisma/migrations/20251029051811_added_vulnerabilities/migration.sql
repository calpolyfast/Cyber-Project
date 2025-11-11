/*
  Warnings:

  - Added the required column `vulnerabilityGroupId` to the `Vulnerability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vulnerability" ADD COLUMN     "vulnerabilityGroupId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "VulnerabilityGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VulnerabilityGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vulnerability" ADD CONSTRAINT "Vulnerability_vulnerabilityGroupId_fkey" FOREIGN KEY ("vulnerabilityGroupId") REFERENCES "VulnerabilityGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
