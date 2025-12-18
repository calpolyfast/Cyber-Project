-- CreateTable
CREATE TABLE "Person" (
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "social" INTEGER NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("social")
);
