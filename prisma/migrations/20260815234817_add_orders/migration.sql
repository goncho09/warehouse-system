-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADO');

-- CreateEnum
CREATE TYPE "Destination" AS ENUM ('LA_BLANQUEADA', 'CARRASCO_NORTE', 'TRES_CRUCES', 'SAYAGO', 'CIUDAD_DE_LA_COSTA', 'MALVIN_NORTE', 'AGUADA', 'BRAZO_ORIENTAL');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "stoCode" TEXT NOT NULL,
    "preparationCode" TEXT NOT NULL,
    "destination" "Destination" NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDIENTE',
    "departureDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "requestedCount" INTEGER NOT NULL,
    "pickedCount" INTEGER NOT NULL DEFAULT 0,
    "cancelledCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_stoCode_key" ON "Order"("stoCode");

-- CreateIndex
CREATE UNIQUE INDEX "Order_preparationCode_key" ON "Order"("preparationCode");

-- CreateIndex
CREATE INDEX "Order_departureDate_idx" ON "Order"("departureDate");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Order_destination_departureDate_key" ON "Order"("destination", "departureDate");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_productId_key" ON "OrderItem"("orderId", "productId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
