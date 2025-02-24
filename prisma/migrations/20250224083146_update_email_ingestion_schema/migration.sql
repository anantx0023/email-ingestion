/*
  Warnings:

  - The primary key for the `EmailAttachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `configId` on the `EmailAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `fileName` on the `EmailAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `EmailAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `EmailAttachment` table. All the data in the column will be lost.
  - The primary key for the `EmailIngestionConfig` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `lastChecked` on the `EmailIngestionConfig` table. All the data in the column will be lost.
  - Added the required column `attachmentFileName` to the `EmailAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateReceived` to the `EmailAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailConfigId` to the `EmailAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromAddress` to the `EmailAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `EmailAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `EmailAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EmailAttachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `connectionType` to the `EmailIngestionConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `EmailIngestionConfig` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EmailAttachment" DROP CONSTRAINT "EmailAttachment_configId_fkey";

-- AlterTable
ALTER TABLE "EmailAttachment" DROP CONSTRAINT "EmailAttachment_pkey",
DROP COLUMN "configId",
DROP COLUMN "fileName",
DROP COLUMN "filePath",
DROP COLUMN "processedAt",
ADD COLUMN     "attachmentFileName" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateReceived" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "emailConfigId" TEXT NOT NULL,
ADD COLUMN     "fromAddress" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EmailAttachment_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EmailAttachment_id_seq";

-- AlterTable
ALTER TABLE "EmailIngestionConfig" DROP CONSTRAINT "EmailIngestionConfig_pkey",
DROP COLUMN "lastChecked",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "connectionType" TEXT NOT NULL,
ADD COLUMN     "host" TEXT,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "port" INTEGER,
ADD COLUMN     "useSSL" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "username" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EmailIngestionConfig_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EmailIngestionConfig_id_seq";

-- AddForeignKey
ALTER TABLE "EmailAttachment" ADD CONSTRAINT "EmailAttachment_emailConfigId_fkey" FOREIGN KEY ("emailConfigId") REFERENCES "EmailIngestionConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
