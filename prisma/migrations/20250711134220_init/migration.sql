/*
  Warnings:

  - You are about to alter the column `servicesNumber` on the `ongs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `supportsNumber` on the `ongs` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ongs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "userId" INTEGER,
    "vision" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "email" TEXT,
    "website" TEXT,
    CONSTRAINT "ongs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ongs" ("about", "bio", "coverImageUrl", "createdAt", "email", "id", "isVerified", "mission", "name", "phoneNumber", "profileImageUrl", "servicesNumber", "status", "supportsNumber", "updatedAt", "userId", "vision", "website") SELECT "about", "bio", "coverImageUrl", "createdAt", "email", "id", "isVerified", "mission", "name", "phoneNumber", "profileImageUrl", "servicesNumber", "status", "supportsNumber", "updatedAt", "userId", "vision", "website" FROM "ongs";
DROP TABLE "ongs";
ALTER TABLE "new_ongs" RENAME TO "ongs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
