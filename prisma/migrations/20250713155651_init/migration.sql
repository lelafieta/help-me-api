-- CreateTable
CREATE TABLE "_BlogToProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_BlogToProfile_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_BlogToProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_blogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "description" TEXT,
    "userId" INTEGER,
    "ongId" INTEGER,
    "title" TEXT,
    "image" TEXT,
    CONSTRAINT "blogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "blogs_ongId_fkey" FOREIGN KEY ("ongId") REFERENCES "ongs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_blogs" ("createdAt", "description", "id", "image", "ongId", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "image", "ongId", "title", "updatedAt", "userId" FROM "blogs";
DROP TABLE "blogs";
ALTER TABLE "new_blogs" RENAME TO "blogs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_BlogToProfile_AB_unique" ON "_BlogToProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_BlogToProfile_B_index" ON "_BlogToProfile"("B");
