-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "storageBucket" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);
