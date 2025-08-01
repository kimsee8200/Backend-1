-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('INFLUENCER', 'BRAND_MANAGER', 'MARKETING_AGENCY');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "name" TEXT NOT NULL,
    "userType" "UserType" NOT NULL DEFAULT 'INFLUENCER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "youtubeUrl" TEXT,
    "blogUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "influencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_managers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "youtubeUrl" TEXT,
    "blogUrl" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "businessRegistrationNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "detailedAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketing_agencies" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "businessRegistrationNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "detailedAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketing_agencies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "influencers_userId_key" ON "influencers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "brand_managers_userId_key" ON "brand_managers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "marketing_agencies_userId_key" ON "marketing_agencies"("userId");

-- AddForeignKey
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_managers" ADD CONSTRAINT "brand_managers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketing_agencies" ADD CONSTRAINT "marketing_agencies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
