-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'User',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VulnerabilityGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "VulnerabilityGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vulnerability" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vulnerabilityGroupId" INTEGER,

    CONSTRAINT "Vulnerability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageField" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ImageField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ImageField_productId_key" ON "ImageField"("productId");

-- AddForeignKey
ALTER TABLE "Vulnerability" ADD CONSTRAINT "Vulnerability_vulnerabilityGroupId_fkey" FOREIGN KEY ("vulnerabilityGroupId") REFERENCES "VulnerabilityGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageField" ADD CONSTRAINT "ImageField_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
