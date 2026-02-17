-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "graduationYear" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "message" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
