/*
  Warnings:

  - You are about to drop the column `crAtedAt` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `enUate` on the `events` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "events_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_events" ("backgroundImageUrl", "description", "id", "location", "ongId", "startDate", "title", "updatedAt", "userId") SELECT "backgroundImageUrl", "description", "id", "location", "ongId", "startDate", "title", "updatedAt", "userId" FROM "events";
DROP TABLE "events";
ALTER TABLE "new_events" RENAME TO "events";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
