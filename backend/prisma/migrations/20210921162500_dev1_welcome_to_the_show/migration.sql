-- CreateTable
CREATE TABLE "Campaign" (
    "campaignId" SERIAL NOT NULL,
    "campaignOwnerId" INTEGER NOT NULL,
    "campaignName" TEXT NOT NULL,
    "campaignDescription" TEXT NOT NULL,
    "campaignPictureURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("campaignId")
);

-- CreateTable
CREATE TABLE "Donation" (
    "donationId" SERIAL NOT NULL,
    "donorUserId" INTEGER NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "donationAmount" DECIMAL(65,30) NOT NULL,
    "donationNote" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("donationId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "profilePictureURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_campaignOwnerId_fkey" FOREIGN KEY ("campaignOwnerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_donorUserId_fkey" FOREIGN KEY ("donorUserId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
