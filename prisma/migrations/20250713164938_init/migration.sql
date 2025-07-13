/*
  Warnings:

  - You are about to drop the `_BlogToProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_BlogToProfile_B_index";

-- DropIndex
DROP INDEX "_BlogToProfile_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_BlogToProfile";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "feed_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER,
    "feedId" INTEGER,
    "description" TEXT,
    CONSTRAINT "feed_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feed_comments_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "feeds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "feed_likes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER,
    "feedId" INTEGER,
    "description" TEXT,
    CONSTRAINT "feed_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feed_likes_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "feeds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "feed_views" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER,
    "feedId" INTEGER,
    "description" TEXT,
    CONSTRAINT "feed_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feed_views_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "feeds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CampaignCommentToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CampaignCommentToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignCommentToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CampaignContributorToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CampaignContributorToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_contributors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignContributorToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CampaignDocumentToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CampaignDocumentToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignDocumentToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CampaignMidiaToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CampaignMidiaToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_midias" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignMidiaToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CampaignUpdateToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CampaignUpdateToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_updates" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignUpdateToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CommunityToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CommunityToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "communities" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CommunityToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EventToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EventToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FeedToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_FeedToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "feeds" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FeedToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_campaign_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER,
    "campaignId" INTEGER,
    "description" TEXT,
    CONSTRAINT "campaign_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_comments_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_comments" ("campaignId", "createdAt", "description", "id", "updatedAt", "userId") SELECT "campaignId", "createdAt", "description", "id", "updatedAt", "userId" FROM "campaign_comments";
DROP TABLE "campaign_comments";
ALTER TABLE "new_campaign_comments" RENAME TO "campaign_comments";
CREATE TABLE "new_campaign_contributors" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "campaignId" INTEGER,
    "userId" INTEGER,
    "money" DECIMAL DEFAULT 0,
    "isAnonymous" BOOLEAN DEFAULT false,
    CONSTRAINT "campaign_contributors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_contributors_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_contributors" ("campaignId", "createdAt", "id", "isAnonymous", "money", "updatedAt", "userId") SELECT "campaignId", "createdAt", "id", "isAnonymous", "money", "updatedAt", "userId" FROM "campaign_contributors";
DROP TABLE "campaign_contributors";
ALTER TABLE "new_campaign_contributors" RENAME TO "campaign_contributors";
CREATE TABLE "new_campaign_documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentPath" TEXT,
    "updatedAt" DATETIME,
    "campaignId" INTEGER,
    "userId" INTEGER,
    "isApproved" BOOLEAN DEFAULT false,
    CONSTRAINT "campaign_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_documents_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_documents" ("campaignId", "createdAt", "documentPath", "id", "isApproved", "updatedAt", "userId") SELECT "campaignId", "createdAt", "documentPath", "id", "isApproved", "updatedAt", "userId" FROM "campaign_documents";
DROP TABLE "campaign_documents";
ALTER TABLE "new_campaign_documents" RENAME TO "campaign_documents";
CREATE TABLE "new_campaign_midias" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" INTEGER,
    "campaignId" INTEGER,
    "midiaUrl" TEXT,
    "midiaType" TEXT NOT NULL DEFAULT 'image',
    CONSTRAINT "campaign_midias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_midias_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_midias" ("campaignId", "createdAt", "id", "midiaType", "midiaUrl", "updatedAt", "userId") SELECT "campaignId", "createdAt", "id", "midiaType", "midiaUrl", "updatedAt", "userId" FROM "campaign_midias";
DROP TABLE "campaign_midias";
ALTER TABLE "new_campaign_midias" RENAME TO "campaign_midias";
CREATE TABLE "new_campaign_updates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "title" TEXT,
    "description" TEXT,
    "campaignId" INTEGER,
    "userId" INTEGER,
    CONSTRAINT "campaign_updates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_updates_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_updates" ("campaignId", "createdAt", "description", "id", "title", "updatedAt", "userId") SELECT "campaignId", "createdAt", "description", "id", "title", "updatedAt", "userId" FROM "campaign_updates";
DROP TABLE "campaign_updates";
ALTER TABLE "new_campaign_updates" RENAME TO "campaign_updates";
CREATE TABLE "new_communities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,
    "banner" TEXT,
    CONSTRAINT "communities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_communities" ("banner", "createdAt", "description", "id", "image", "name", "userId") SELECT "banner", "createdAt", "description", "id", "image", "name", "userId" FROM "communities";
DROP TABLE "communities";
ALTER TABLE "new_communities" RENAME TO "communities";
CREATE TABLE "new_events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ongId" INTEGER,
    "userId" INTEGER,
    "title" TEXT,
    "location" TEXT,
    "description" TEXT,
    "backgroundImageUrl" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "events_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_events" ("backgroundImageUrl", "createdAt", "description", "endDate", "id", "location", "ongId", "startDate", "title", "updatedAt", "userId") SELECT "backgroundImageUrl", "createdAt", "description", "endDate", "id", "location", "ongId", "startDate", "title", "updatedAt", "userId" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE TABLE "new_feeds" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "description" TEXT,
    "userId" INTEGER,
    "ongId" INTEGER,
    "title" TEXT,
    "image" TEXT,
    CONSTRAINT "feeds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feeds_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_feeds" ("createdAt", "description", "id", "image", "ongId", "userId") SELECT "createdAt", "description", "id", "image", "ongId", "userId" FROM "feeds";
DROP TABLE "feeds";
ALTER TABLE "new_feeds" RENAME TO "feeds";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignCommentToProfile_AB_unique" ON "_CampaignCommentToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignCommentToProfile_B_index" ON "_CampaignCommentToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignContributorToProfile_AB_unique" ON "_CampaignContributorToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignContributorToProfile_B_index" ON "_CampaignContributorToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignDocumentToProfile_AB_unique" ON "_CampaignDocumentToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignDocumentToProfile_B_index" ON "_CampaignDocumentToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignMidiaToProfile_AB_unique" ON "_CampaignMidiaToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignMidiaToProfile_B_index" ON "_CampaignMidiaToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CampaignUpdateToProfile_AB_unique" ON "_CampaignUpdateToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CampaignUpdateToProfile_B_index" ON "_CampaignUpdateToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CommunityToProfile_AB_unique" ON "_CommunityToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_CommunityToProfile_B_index" ON "_CommunityToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToProfile_AB_unique" ON "_EventToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToProfile_B_index" ON "_EventToProfile"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_FeedToProfile_AB_unique" ON "_FeedToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_FeedToProfile_B_index" ON "_FeedToProfile"("B");
