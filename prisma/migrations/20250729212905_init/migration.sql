/*
  Warnings:

  - Made the column `itemType` on table `favorites` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `favorites` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `favorites` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "communityId" TEXT,
    CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "events_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "events_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_events" ("backgroundImageUrl", "communityId", "createdAt", "description", "endDate", "id", "latitude", "location", "longitude", "ongId", "startDate", "title", "updatedAt", "userId") SELECT "backgroundImageUrl", "communityId", "createdAt", "description", "endDate", "id", "latitude", "location", "longitude", "ongId", "startDate", "title", "updatedAt", "userId" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
CREATE TABLE "new_favorites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_favorites" ("createdAt", "id", "itemId", "itemType", "updatedAt", "userId") SELECT coalesce("createdAt", CURRENT_TIMESTAMP) AS "createdAt", "id", "itemId", "itemType", "updatedAt", "userId" FROM "favorites";
DROP TABLE "favorites";
ALTER TABLE "new_favorites" RENAME TO "favorites";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
