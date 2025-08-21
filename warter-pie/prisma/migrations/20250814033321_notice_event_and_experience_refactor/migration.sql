-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "ownerUserId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "headcount" INTEGER NOT NULL,
    "applyStartAt" TIMESTAMP(3) NOT NULL,
    "applyEndAt" TIMESTAMP(3) NOT NULL,
    "contentDueAt" TIMESTAMP(3) NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "rewardType" TEXT,
    "rewardAmount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dataType" INTEGER,
    "productOfferType" INTEGER,
    "experienceMission" TEXT,
    "offerContent" TEXT,
    "charge" INTEGER,
    "presidentImage" TEXT,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_images" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_profiles" (
    "campaignId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "managerCallNum" TEXT,
    "address" TEXT NOT NULL,
    "detailAddress" TEXT,
    "category" TEXT,
    "productUrl" TEXT,

    CONSTRAINT "campaign_profiles_pkey" PRIMARY KEY ("campaignId")
);

-- CreateTable
CREATE TABLE "campaign_timings" (
    "campaignId" INTEGER NOT NULL,
    "memberAnnouncementDate" TIMESTAMP(3),
    "experienceStartAt" TIMESTAMP(3),
    "experienceEndAt" TIMESTAMP(3),
    "reviewEndAt" TIMESTAMP(3),

    CONSTRAINT "campaign_timings_pkey" PRIMARY KEY ("campaignId")
);

-- CreateTable
CREATE TABLE "campaign_visit_rules" (
    "campaignId" INTEGER NOT NULL,
    "possibleTimeStart" TEXT,
    "possibleTimeEnd" TEXT,
    "possibleVisitNow" BOOLEAN NOT NULL DEFAULT false,
    "noticesToVisit" TEXT,

    CONSTRAINT "campaign_visit_rules_pkey" PRIMARY KEY ("campaignId")
);

-- CreateTable
CREATE TABLE "campaign_channels" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "channel" INTEGER NOT NULL,

    CONSTRAINT "campaign_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_visit_weekdays" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "weekday" INTEGER NOT NULL,

    CONSTRAINT "campaign_visit_weekdays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_keywords" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "campaign_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notices" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice_images" (
    "id" SERIAL NOT NULL,
    "noticeId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "notice_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_images" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "event_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_applications" (
    "id" SERIAL NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "influencerUserId" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "pitchText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_submissions" (
    "id" SERIAL NOT NULL,
    "applicationId" INTEGER NOT NULL,
    "urls" TEXT[],
    "note" TEXT,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaign_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaign_channels_campaignId_channel_key" ON "campaign_channels"("campaignId", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_visit_weekdays_campaignId_weekday_key" ON "campaign_visit_weekdays"("campaignId", "weekday");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_keywords_campaignId_keyword_key" ON "campaign_keywords"("campaignId", "keyword");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_applications_campaignId_influencerUserId_key" ON "campaign_applications"("campaignId", "influencerUserId");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_images" ADD CONSTRAINT "campaign_images_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_profiles" ADD CONSTRAINT "campaign_profiles_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_timings" ADD CONSTRAINT "campaign_timings_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_visit_rules" ADD CONSTRAINT "campaign_visit_rules_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_channels" ADD CONSTRAINT "campaign_channels_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_visit_weekdays" ADD CONSTRAINT "campaign_visit_weekdays_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_keywords" ADD CONSTRAINT "campaign_keywords_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice_images" ADD CONSTRAINT "notice_images_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "notices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_images" ADD CONSTRAINT "event_images_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_applications" ADD CONSTRAINT "campaign_applications_influencerUserId_fkey" FOREIGN KEY ("influencerUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_submissions" ADD CONSTRAINT "campaign_submissions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "campaign_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
