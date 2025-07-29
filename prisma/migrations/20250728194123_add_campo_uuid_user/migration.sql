/*
  Warnings:

  - The primary key for the `blogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `campaign_comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `campaign_contributors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `campaign_documents` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `campaign_midias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `campaign_updates` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `campaigns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `communities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `banner` on the `communities` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `communities` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `communities` table. All the data in the column will be lost.
  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `feed_comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `feed_likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `feed_views` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `feeds` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ongs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `payments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `campaignQtd` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `donationQtd` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user_fcm_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `communities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `communities` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `communities` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `communityId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "community_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    CONSTRAINT "community_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "community_members_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityId" TEXT NOT NULL,
    "uploaderId" TEXT NOT NULL,
    CONSTRAINT "resources_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "resources_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" TEXT,
    "communityId" TEXT,
    "ongId" TEXT,
    CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "posts_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "posts_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "chat_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "chat_members_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" TEXT NOT NULL,
    "chatRoomId" TEXT NOT NULL,
    CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "messages_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "chat_rooms" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_CategoryToCommunity" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CategoryToCommunity_A_fkey" FOREIGN KEY ("A") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CategoryToCommunity_B_fkey" FOREIGN KEY ("B") REFERENCES "communities" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new__CampaignCommentToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CampaignCommentToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_comments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignCommentToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CampaignCommentToProfile" ("A", "B") SELECT "A", "B" FROM "_CampaignCommentToProfile";
DROP TABLE "_CampaignCommentToProfile";
ALTER TABLE "new__CampaignCommentToProfile" RENAME TO "_CampaignCommentToProfile";
CREATE UNIQUE INDEX "_CampaignCommentToProfile_AB_unique" ON "_CampaignCommentToProfile"("A", "B");
CREATE INDEX "_CampaignCommentToProfile_B_index" ON "_CampaignCommentToProfile"("B");
CREATE TABLE "new__CampaignContributorToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CampaignContributorToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_contributors" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignContributorToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CampaignContributorToProfile" ("A", "B") SELECT "A", "B" FROM "_CampaignContributorToProfile";
DROP TABLE "_CampaignContributorToProfile";
ALTER TABLE "new__CampaignContributorToProfile" RENAME TO "_CampaignContributorToProfile";
CREATE UNIQUE INDEX "_CampaignContributorToProfile_AB_unique" ON "_CampaignContributorToProfile"("A", "B");
CREATE INDEX "_CampaignContributorToProfile_B_index" ON "_CampaignContributorToProfile"("B");
CREATE TABLE "new__CampaignDocumentToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CampaignDocumentToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignDocumentToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CampaignDocumentToProfile" ("A", "B") SELECT "A", "B" FROM "_CampaignDocumentToProfile";
DROP TABLE "_CampaignDocumentToProfile";
ALTER TABLE "new__CampaignDocumentToProfile" RENAME TO "_CampaignDocumentToProfile";
CREATE UNIQUE INDEX "_CampaignDocumentToProfile_AB_unique" ON "_CampaignDocumentToProfile"("A", "B");
CREATE INDEX "_CampaignDocumentToProfile_B_index" ON "_CampaignDocumentToProfile"("B");
CREATE TABLE "new__CampaignMidiaToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CampaignMidiaToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_midias" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignMidiaToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CampaignMidiaToProfile" ("A", "B") SELECT "A", "B" FROM "_CampaignMidiaToProfile";
DROP TABLE "_CampaignMidiaToProfile";
ALTER TABLE "new__CampaignMidiaToProfile" RENAME TO "_CampaignMidiaToProfile";
CREATE UNIQUE INDEX "_CampaignMidiaToProfile_AB_unique" ON "_CampaignMidiaToProfile"("A", "B");
CREATE INDEX "_CampaignMidiaToProfile_B_index" ON "_CampaignMidiaToProfile"("B");
CREATE TABLE "new__CampaignUpdateToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CampaignUpdateToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "campaign_updates" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CampaignUpdateToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CampaignUpdateToProfile" ("A", "B") SELECT "A", "B" FROM "_CampaignUpdateToProfile";
DROP TABLE "_CampaignUpdateToProfile";
ALTER TABLE "new__CampaignUpdateToProfile" RENAME TO "_CampaignUpdateToProfile";
CREATE UNIQUE INDEX "_CampaignUpdateToProfile_AB_unique" ON "_CampaignUpdateToProfile"("A", "B");
CREATE INDEX "_CampaignUpdateToProfile_B_index" ON "_CampaignUpdateToProfile"("B");
CREATE TABLE "new__CommunityToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CommunityToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "communities" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CommunityToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__CommunityToProfile" ("A", "B") SELECT "A", "B" FROM "_CommunityToProfile";
DROP TABLE "_CommunityToProfile";
ALTER TABLE "new__CommunityToProfile" RENAME TO "_CommunityToProfile";
CREATE UNIQUE INDEX "_CommunityToProfile_AB_unique" ON "_CommunityToProfile"("A", "B");
CREATE INDEX "_CommunityToProfile_B_index" ON "_CommunityToProfile"("B");
CREATE TABLE "new__EventToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EventToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__EventToProfile" ("A", "B") SELECT "A", "B" FROM "_EventToProfile";
DROP TABLE "_EventToProfile";
ALTER TABLE "new__EventToProfile" RENAME TO "_EventToProfile";
CREATE UNIQUE INDEX "_EventToProfile_AB_unique" ON "_EventToProfile"("A", "B");
CREATE INDEX "_EventToProfile_B_index" ON "_EventToProfile"("B");
CREATE TABLE "new__FeedToProfile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FeedToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "feeds" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FeedToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__FeedToProfile" ("A", "B") SELECT "A", "B" FROM "_FeedToProfile";
DROP TABLE "_FeedToProfile";
ALTER TABLE "new__FeedToProfile" RENAME TO "_FeedToProfile";
CREATE UNIQUE INDEX "_FeedToProfile_AB_unique" ON "_FeedToProfile"("A", "B");
CREATE INDEX "_FeedToProfile_B_index" ON "_FeedToProfile"("B");
CREATE TABLE "new_blogs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "description" TEXT,
    "userId" TEXT,
    "ongId" TEXT,
    "title" TEXT,
    "image" TEXT,
    CONSTRAINT "blogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "blogs_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_blogs" ("createdAt", "description", "id", "image", "ongId", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "image", "ongId", "title", "updatedAt", "userId" FROM "blogs";
DROP TABLE "blogs";
ALTER TABLE "new_blogs" RENAME TO "blogs";
CREATE TABLE "new_campaign_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" TEXT,
    "campaignId" TEXT,
    "description" TEXT,
    CONSTRAINT "campaign_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_comments_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_comments" ("campaignId", "createdAt", "description", "id", "updatedAt", "userId") SELECT "campaignId", "createdAt", "description", "id", "updatedAt", "userId" FROM "campaign_comments";
DROP TABLE "campaign_comments";
ALTER TABLE "new_campaign_comments" RENAME TO "campaign_comments";
CREATE TABLE "new_campaign_contributors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "campaignId" TEXT,
    "userId" TEXT,
    "money" DECIMAL DEFAULT 0,
    "isAnonymous" BOOLEAN DEFAULT false,
    CONSTRAINT "campaign_contributors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_contributors_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_contributors" ("campaignId", "createdAt", "id", "isAnonymous", "money", "updatedAt", "userId") SELECT "campaignId", "createdAt", "id", "isAnonymous", "money", "updatedAt", "userId" FROM "campaign_contributors";
DROP TABLE "campaign_contributors";
ALTER TABLE "new_campaign_contributors" RENAME TO "campaign_contributors";
CREATE TABLE "new_campaign_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "documentPath" TEXT,
    "updatedAt" DATETIME,
    "campaignId" TEXT,
    "userId" TEXT,
    "isApproved" BOOLEAN DEFAULT false,
    CONSTRAINT "campaign_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_documents_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_documents" ("campaignId", "createdAt", "documentPath", "id", "isApproved", "updatedAt", "userId") SELECT "campaignId", "createdAt", "documentPath", "id", "isApproved", "updatedAt", "userId" FROM "campaign_documents";
DROP TABLE "campaign_documents";
ALTER TABLE "new_campaign_documents" RENAME TO "campaign_documents";
CREATE TABLE "new_campaign_midias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" TEXT,
    "campaignId" TEXT,
    "midiaUrl" TEXT,
    "midiaType" TEXT NOT NULL DEFAULT 'image',
    CONSTRAINT "campaign_midias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_midias_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_midias" ("campaignId", "createdAt", "id", "midiaType", "midiaUrl", "updatedAt", "userId") SELECT "campaignId", "createdAt", "id", "midiaType", "midiaUrl", "updatedAt", "userId" FROM "campaign_midias";
DROP TABLE "campaign_midias";
ALTER TABLE "new_campaign_midias" RENAME TO "campaign_midias";
CREATE TABLE "new_campaign_updates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "title" TEXT,
    "description" TEXT,
    "campaignId" TEXT,
    "userId" TEXT,
    CONSTRAINT "campaign_updates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaign_updates_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaign_updates" ("campaignId", "createdAt", "description", "id", "title", "updatedAt", "userId") SELECT "campaignId", "createdAt", "description", "id", "title", "updatedAt", "userId" FROM "campaign_updates";
DROP TABLE "campaign_updates";
ALTER TABLE "new_campaign_updates" RENAME TO "campaign_updates";
CREATE TABLE "new_campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "categoryId" TEXT,
    "description" TEXT,
    "fundraisingGoal" REAL,
    "fundsRaised" REAL,
    "imageCoverUrl" TEXT,
    "institution" TEXT,
    "location" TEXT,
    "numberOfContributions" INTEGER,
    "ongId" TEXT,
    "phoneNumber" TEXT,
    "endDate" DATETIME,
    "title" TEXT,
    "userId" TEXT,
    "startDate" DATETIME,
    "isActivate" BOOLEAN DEFAULT true,
    "beneficiaryName" TEXT,
    "campaignType" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'AOA',
    "birth" DATETIME,
    "status" TEXT DEFAULT 'active',
    CONSTRAINT "campaigns_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaigns_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "campaigns_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_campaigns" ("beneficiaryName", "birth", "campaignType", "categoryId", "createdAt", "currency", "description", "endDate", "fundraisingGoal", "fundsRaised", "id", "imageCoverUrl", "institution", "isActivate", "location", "numberOfContributions", "ongId", "phoneNumber", "startDate", "status", "title", "updatedAt", "userId") SELECT "beneficiaryName", "birth", "campaignType", "categoryId", "createdAt", "currency", "description", "endDate", "fundraisingGoal", "fundsRaised", "id", "imageCoverUrl", "institution", "isActivate", "location", "numberOfContributions", "ongId", "phoneNumber", "startDate", "status", "title", "updatedAt", "userId" FROM "campaigns";
DROP TABLE "campaigns";
ALTER TABLE "new_campaigns" RENAME TO "campaigns";
CREATE TABLE "new_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_categories" ("createdAt", "description", "id", "name") SELECT "createdAt", "description", "id", "name" FROM "categories";
DROP TABLE "categories";
ALTER TABLE "new_categories" RENAME TO "categories";
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE TABLE "new_communities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "imageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "communities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_communities" ("createdAt", "description", "id", "name") SELECT "createdAt", "description", "id", "name" FROM "communities";
DROP TABLE "communities";
ALTER TABLE "new_communities" RENAME TO "communities";
CREATE TABLE "new_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ongId" TEXT,
    "userId" TEXT,
    "title" TEXT,
    "location" TEXT,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "description" TEXT,
    "backgroundImageUrl" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "communityId" TEXT NOT NULL,
    CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "events_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "events_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_events" ("backgroundImageUrl", "createdAt", "description", "endDate", "id", "latitude", "location", "longitude", "ongId", "startDate", "title", "updatedAt", "userId") SELECT "backgroundImageUrl", "createdAt", "description", "endDate", "id", "latitude", "location", "longitude", "ongId", "startDate", "title", "updatedAt", "userId" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE TABLE "new_favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "itemId" TEXT NOT NULL,
    "itemType" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_favorites" ("createdAt", "id", "itemId", "itemType", "updatedAt", "userId") SELECT "createdAt", "id", "itemId", "itemType", "updatedAt", "userId" FROM "favorites";
DROP TABLE "favorites";
ALTER TABLE "new_favorites" RENAME TO "favorites";
CREATE TABLE "new_feed_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" TEXT,
    "feedId" TEXT,
    "description" TEXT,
    CONSTRAINT "feed_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feed_comments_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "feeds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_feed_comments" ("createdAt", "description", "feedId", "id", "updatedAt", "userId") SELECT "createdAt", "description", "feedId", "id", "updatedAt", "userId" FROM "feed_comments";
DROP TABLE "feed_comments";
ALTER TABLE "new_feed_comments" RENAME TO "feed_comments";
CREATE TABLE "new_feed_likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" TEXT,
    "feedId" TEXT,
    "description" TEXT,
    CONSTRAINT "feed_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feed_likes_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "feeds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_feed_likes" ("createdAt", "description", "feedId", "id", "updatedAt", "userId") SELECT "createdAt", "description", "feedId", "id", "updatedAt", "userId" FROM "feed_likes";
DROP TABLE "feed_likes";
ALTER TABLE "new_feed_likes" RENAME TO "feed_likes";
CREATE TABLE "new_feed_views" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "userId" TEXT,
    "feedId" TEXT,
    "description" TEXT,
    CONSTRAINT "feed_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feed_views_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "feeds" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_feed_views" ("createdAt", "description", "feedId", "id", "updatedAt", "userId") SELECT "createdAt", "description", "feedId", "id", "updatedAt", "userId" FROM "feed_views";
DROP TABLE "feed_views";
ALTER TABLE "new_feed_views" RENAME TO "feed_views";
CREATE TABLE "new_feeds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "description" TEXT,
    "userId" TEXT,
    "ongId" TEXT,
    "title" TEXT,
    "image" TEXT,
    CONSTRAINT "feeds_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feeds_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_feeds" ("createdAt", "description", "id", "image", "ongId", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "image", "ongId", "title", "updatedAt", "userId" FROM "feeds";
DROP TABLE "feeds";
ALTER TABLE "new_feeds" RENAME TO "feeds";
CREATE TABLE "new_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "isRead" BOOLEAN DEFAULT false,
    "imageUrl" TEXT,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("createdAt", "id", "imageUrl", "isRead", "message", "title", "type", "userId") SELECT "createdAt", "id", "imageUrl", "isRead", "message", "title", "type", "userId" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE TABLE "new_ongs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "about" TEXT,
    "bio" TEXT,
    "coverImageUrl" TEXT,
    "isVerified" BOOLEAN DEFAULT false,
    "mission" TEXT,
    "name" TEXT,
    "phoneNumber" TEXT,
    "profileImageUrl" TEXT,
    "servicesNumber" INTEGER DEFAULT 0,
    "supportsNumber" INTEGER DEFAULT 0,
    "userId" TEXT,
    "vision" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "email" TEXT,
    "website" TEXT,
    CONSTRAINT "ongs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ongs" ("about", "bio", "coverImageUrl", "createdAt", "email", "id", "isVerified", "mission", "name", "phoneNumber", "profileImageUrl", "servicesNumber", "status", "supportsNumber", "updatedAt", "userId", "vision", "website") SELECT "about", "bio", "coverImageUrl", "createdAt", "email", "id", "isVerified", "mission", "name", "phoneNumber", "profileImageUrl", "servicesNumber", "status", "supportsNumber", "updatedAt", "userId", "vision", "website" FROM "ongs";
DROP TABLE "ongs";
ALTER TABLE "new_ongs" RENAME TO "ongs";
CREATE TABLE "new_ongs_documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "ongId" TEXT,
    "statutes_constitutive_act" TEXT NOT NULL,
    "declaration_good_standing" TEXT NOT NULL,
    "minutes_constitutive_assembly" TEXT NOT NULL,
    "publicDeed" TEXT NOT NULL,
    "registrationCertificate" TEXT,
    "nif" TEXT NOT NULL,
    "biRepresentative" TEXT NOT NULL,
    "status" TEXT DEFAULT 'pending',
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "ongs_documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ongs_documents_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ongs_documents" ("biRepresentative", "createdAt", "declaration_good_standing", "id", "minutes_constitutive_assembly", "nif", "ongId", "publicDeed", "registrationCertificate", "status", "statutes_constitutive_act", "updatedAt", "userId") SELECT "biRepresentative", "createdAt", "declaration_good_standing", "id", "minutes_constitutive_assembly", "nif", "ongId", "publicDeed", "registrationCertificate", "status", "statutes_constitutive_act", "updatedAt", "userId" FROM "ongs_documents";
DROP TABLE "ongs_documents";
ALTER TABLE "new_ongs_documents" RENAME TO "ongs_documents";
CREATE TABLE "new_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT,
    "signature" TEXT,
    "identifier" TEXT,
    "paymentTrx" TEXT,
    "amount" DECIMAL DEFAULT 0,
    "paymentType" TEXT,
    "currency" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_payments" ("amount", "createdAt", "currency", "id", "identifier", "paymentTrx", "paymentType", "signature", "status") SELECT "amount", "createdAt", "currency", "id", "identifier", "paymentTrx", "paymentType", "signature", "status" FROM "payments";
DROP TABLE "payments";
ALTER TABLE "new_payments" RENAME TO "payments";
CREATE TABLE "new_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT,
    "email" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "location" TEXT,
    "latitude" DECIMAL,
    "longitude" DECIMAL,
    "isVerified" BOOLEAN DEFAULT false,
    "role" TEXT,
    "donationQtd" INTEGER DEFAULT 0,
    "campaignQtd" INTEGER DEFAULT 0,
    "lastName" TEXT,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profiles" ("avatarUrl", "bio", "campaignQtd", "createdAt", "donationQtd", "email", "firstName", "fullName", "id", "isVerified", "lastName", "latitude", "location", "longitude", "phoneNumber", "role", "updatedAt") SELECT "avatarUrl", "bio", "campaignQtd", "createdAt", "donationQtd", "email", "firstName", "fullName", "id", "isVerified", "lastName", "latitude", "location", "longitude", "phoneNumber", "role", "updatedAt" FROM "profiles";
DROP TABLE "profiles";
ALTER TABLE "new_profiles" RENAME TO "profiles";
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
CREATE TABLE "new_user_fcm_tokens" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "fcmToken" TEXT NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_fcm_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_fcm_tokens" ("createdAt", "fcmToken", "id", "userId") SELECT "createdAt", "fcmToken", "id", "userId" FROM "user_fcm_tokens";
DROP TABLE "user_fcm_tokens";
ALTER TABLE "new_user_fcm_tokens" RENAME TO "user_fcm_tokens";
CREATE UNIQUE INDEX "user_fcm_tokens_fcmToken_key" ON "user_fcm_tokens"("fcmToken");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "phone" TEXT,
    "fullName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "role" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "emailConfirmedAt" DATETIME,
    "phoneConfirmedAt" DATETIME,
    "lastSignInAt" DATETIME,
    "isSuperAdmin" BOOLEAN,
    "password" TEXT NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "emailConfirmedAt", "id", "isSuperAdmin", "lastSignInAt", "password", "phone", "phoneConfirmedAt", "role", "updatedAt") SELECT "createdAt", "email", "emailConfirmedAt", "id", "isSuperAdmin", "lastSignInAt", "password", "phone", "phoneConfirmedAt", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "community_members_userId_communityId_key" ON "community_members"("userId", "communityId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_members_userId_chatRoomId_key" ON "chat_members"("userId", "chatRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToCommunity_AB_unique" ON "_CategoryToCommunity"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToCommunity_B_index" ON "_CategoryToCommunity"("B");
