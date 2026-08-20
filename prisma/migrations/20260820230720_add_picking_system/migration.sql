/*
  Warnings:

  - You are about to drop the `CNTLock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LocationLock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CNTLock" DROP CONSTRAINT "CNTLock_cntId_fkey";

-- DropForeignKey
ALTER TABLE "CNTLock" DROP CONSTRAINT "CNTLock_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "LocationLock" DROP CONSTRAINT "LocationLock_orderId_fkey";

-- DropForeignKey
ALTER TABLE "LocationLock" DROP CONSTRAINT "LocationLock_sessionId_fkey";

-- AlterTable
ALTER TABLE "CNT" ADD COLUMN     "blockedBySessionId" INTEGER;

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "blockedBySessionId" INTEGER,
ADD COLUMN     "blockedOrderId" INTEGER;

-- DropTable
DROP TABLE "CNTLock";

-- DropTable
DROP TABLE "LocationLock";

-- CreateIndex
CREATE INDEX "CNT_blockedBySessionId_idx" ON "CNT"("blockedBySessionId");

-- CreateIndex
CREATE INDEX "Location_blockedOrderId_idx" ON "Location"("blockedOrderId");

-- CreateIndex
CREATE INDEX "Location_blockedBySessionId_idx" ON "Location"("blockedBySessionId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_blockedOrderId_fkey" FOREIGN KEY ("blockedOrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_blockedBySessionId_fkey" FOREIGN KEY ("blockedBySessionId") REFERENCES "PickingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CNT" ADD CONSTRAINT "CNT_blockedBySessionId_fkey" FOREIGN KEY ("blockedBySessionId") REFERENCES "PickingSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
