-- CreateTable
CREATE TABLE "Thought" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "sameCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipHash" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Same" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "thoughtId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Same_thoughtId_fkey" FOREIGN KEY ("thoughtId") REFERENCES "Thought" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Same_thoughtId_ipHash_key" ON "Same"("thoughtId", "ipHash");
