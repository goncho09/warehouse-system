-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('FOOD', 'NO_FOOD', 'CONGELADO', 'REFRIGERADO');

-- CreateEnum
CREATE TYPE "CNTStatus" AS ENUM ('ACTIVO', 'FINALIZADO');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('PICKING', 'EN_PUERTA', 'FLOTANTE', 'AVERIAS');

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "barCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "unitsPerDisplay" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "code" TEXT NOT NULL,
    "type" "LocationType" NOT NULL,
    "chamber" TEXT,
    "row" TEXT,
    "position" TEXT,
    "height" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CNT" (
    "id" TEXT NOT NULL,
    "status" "CNTStatus" NOT NULL DEFAULT 'ACTIVO',
    "locationCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CNT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CNTItem" (
    "id" SERIAL NOT NULL,
    "cntId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "lot" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CNTItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "cntId" TEXT NOT NULL,
    "lot" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_productId_key" ON "Product"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barCode_key" ON "Product"("barCode");

-- CreateIndex
CREATE INDEX "CNTItem_productId_idx" ON "CNTItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "CNTItem_cntId_productId_key" ON "CNTItem"("cntId", "productId");

-- CreateIndex
CREATE INDEX "Entry_productId_idx" ON "Entry"("productId");

-- CreateIndex
CREATE INDEX "Entry_cntId_idx" ON "Entry"("cntId");

-- AddForeignKey
ALTER TABLE "CNT" ADD CONSTRAINT "CNT_locationCode_fkey" FOREIGN KEY ("locationCode") REFERENCES "Location"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CNTItem" ADD CONSTRAINT "CNTItem_cntId_fkey" FOREIGN KEY ("cntId") REFERENCES "CNT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CNTItem" ADD CONSTRAINT "CNTItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_cntId_fkey" FOREIGN KEY ("cntId") REFERENCES "CNT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
