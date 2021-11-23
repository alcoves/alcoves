-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "harbourId" TEXT NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Harbour" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,

    CONSTRAINT "Harbour_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_harbourId_fkey" FOREIGN KEY ("harbourId") REFERENCES "Harbour"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
