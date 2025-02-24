-- CreateTable
CREATE TABLE "emailIngestionConfig" (
    "id" SERIAL NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "lastChecked" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "connectionType" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "host" TEXT,
    "port" INTEGER,
    "useSSL" BOOLEAN,

    CONSTRAINT "emailIngestionConfig_pkey" PRIMARY KEY ("id")
);
