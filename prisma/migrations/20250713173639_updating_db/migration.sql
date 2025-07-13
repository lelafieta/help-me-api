/*
  Warnings:

  - You are about to drop the column `isUrgent` on the `campaigns` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `campaigns` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN "latitude" DECIMAL;
ALTER TABLE "events" ADD COLUMN "longitude" DECIMAL;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_campaigns" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "categoryId" INTEGER,
    "description" TEXT,
    "fundraisingGoal" REAL,
    "fundsRaised" REAL,
    "imageCoverUrl" TEXT,
    "institution" TEXT,
    "location" TEXT,
    "numberOfContributions" INTEGER,
    "ongId" INTEGER,
    "phoneNumber" TEXT,
    "endDate" DATETIME,
    "title" TEXT,
    "userId" INTEGER,
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
CREATE TABLE "new_profiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT,
    "email" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "location" TEXT,
    "latitude" DECIMAL NOT NULL,
    "longitude" DECIMAL NOT NULL,
    "isVerified" BOOLEAN DEFAULT false,
    "role" TEXT,
    "donationQtd" BIGINT DEFAULT 0,
    "campaignQtd" BIGINT DEFAULT 0,
    "lastName" TEXT,
    "fullName" TEXT,
    "phoneNumber" TEXT,
    CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_profiles" ("avatarUrl", "bio", "campaignQtd", "createdAt", "donationQtd", "email", "firstName", "fullName", "id", "isVerified", "lastName", "location", "phoneNumber", "role", "updatedAt") SELECT "avatarUrl", "bio", "campaignQtd", "createdAt", "donationQtd", "email", "firstName", "fullName", "id", "isVerified", "lastName", "location", "phoneNumber", "role", "updatedAt" FROM "profiles";
DROP TABLE "profiles";
ALTER TABLE "new_profiles" RENAME TO "profiles";
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
