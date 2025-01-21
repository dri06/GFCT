-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" REAL NOT NULL,
    "transactionDate" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "responsible" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "receipt" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
