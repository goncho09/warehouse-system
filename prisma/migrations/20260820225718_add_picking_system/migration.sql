-- CreateEnum
CREATE TYPE "PickingSessionStatus" AS ENUM ('ACTIVA', 'FINALIZADA');

-- CreateEnum
CREATE TYPE "PickTaskStatus" AS ENUM ('PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'PARCIAL', 'ANULADO');

-- CreateTable
CREATE TABLE "PickingSession" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "pickerCode" TEXT NOT NULL,
    "startLocationCode" TEXT,
    "status" "PickingSessionStatus" NOT NULL DEFAULT 'ACTIVA',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),

    CONSTRAINT "PickingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PickTask" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "orderItemId" INTEGER NOT NULL,
    "cntId" INTEGER NOT NULL,
    "locationCode" TEXT NOT NULL,
    "sessionId" INTEGER,
    "plannedCount" INTEGER NOT NULL,
    "pickedCount" INTEGER NOT NULL DEFAULT 0,
    "cancelledCount" INTEGER NOT NULL DEFAULT 0,
    "status" "PickTaskStatus" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "PickTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CNTLock" (
    "id" SERIAL NOT NULL,
    "cntId" INTEGER NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CNTLock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LocationLock" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "locationCode" TEXT NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LocationLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PickingSession_orderId_idx" ON "PickingSession"("orderId");

-- CreateIndex
CREATE INDEX "PickingSession_pickerCode_idx" ON "PickingSession"("pickerCode");

-- CreateIndex
CREATE INDEX "PickingSession_status_idx" ON "PickingSession"("status");

-- CreateIndex
CREATE INDEX "PickTask_orderId_idx" ON "PickTask"("orderId");

-- CreateIndex
CREATE INDEX "PickTask_orderItemId_idx" ON "PickTask"("orderItemId");

-- CreateIndex
CREATE INDEX "PickTask_cntId_idx" ON "PickTask"("cntId");

-- CreateIndex
CREATE INDEX "PickTask_locationCode_idx" ON "PickTask"("locationCode");

-- CreateIndex
CREATE INDEX "PickTask_sessionId_idx" ON "PickTask"("sessionId");

-- CreateIndex
CREATE INDEX "PickTask_status_idx" ON "PickTask"("status");

-- CreateIndex
CREATE UNIQUE INDEX "CNTLock_cntId_key" ON "CNTLock"("cntId");

-- CreateIndex
CREATE INDEX "CNTLock_sessionId_idx" ON "CNTLock"("sessionId");

-- CreateIndex
CREATE INDEX "LocationLock_sessionId_idx" ON "LocationLock"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "LocationLock_orderId_locationCode_key" ON "LocationLock"("orderId", "locationCode");

-- AddForeignKey
ALTER TABLE "PickingSession" ADD CONSTRAINT "PickingSession_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickTask" ADD CONSTRAINT "PickTask_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickTask" ADD CONSTRAINT "PickTask_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickTask" ADD CONSTRAINT "PickTask_cntId_fkey" FOREIGN KEY ("cntId") REFERENCES "CNT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PickTask" ADD CONSTRAINT "PickTask_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PickingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CNTLock" ADD CONSTRAINT "CNTLock_cntId_fkey" FOREIGN KEY ("cntId") REFERENCES "CNT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CNTLock" ADD CONSTRAINT "CNTLock_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PickingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLock" ADD CONSTRAINT "LocationLock_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLock" ADD CONSTRAINT "LocationLock_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "PickingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
