-- DropForeignKey
ALTER TABLE "CNT" DROP CONSTRAINT "CNT_locationCode_fkey";

-- AlterTable
ALTER TABLE "CNT" ALTER COLUMN "locationCode" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CNT" ADD CONSTRAINT "CNT_locationCode_fkey" FOREIGN KEY ("locationCode") REFERENCES "Location"("code") ON DELETE SET NULL ON UPDATE CASCADE;
