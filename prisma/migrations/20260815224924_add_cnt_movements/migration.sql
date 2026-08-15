-- CreateTable
CREATE TABLE "CNTMovement" (
    "id" SERIAL NOT NULL,
    "cntId" INTEGER NOT NULL,
    "fromLocationCode" TEXT,
    "toLocationCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CNTMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CNTMovement_cntId_idx" ON "CNTMovement"("cntId");

-- AddForeignKey
ALTER TABLE "CNTMovement" ADD CONSTRAINT "CNTMovement_cntId_fkey" FOREIGN KEY ("cntId") REFERENCES "CNT"("id") ON DELETE CASCADE ON UPDATE CASCADE;
