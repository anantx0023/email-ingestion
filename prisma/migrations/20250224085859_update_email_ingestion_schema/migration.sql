/*
  Warnings:

  - You are about to drop the `emailIngestionConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "EmailIngestionConfig" ADD COLUMN     "lastChecked" TIMESTAMP(3);

-- DropTable
DROP TABLE "emailIngestionConfig";
