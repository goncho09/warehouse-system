/*
  Warnings:

  - The primary key for the `CNT` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CNT` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[code]` on the table `CNT` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `CNT` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `cntId` on the `CNTItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cntId` on the `Entry` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "CNTItem" DROP CONSTRAINT "CNTItem_cntId_fkey";

-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_cntId_fkey";

-- AlterTable
ALTER TABLE "CNT" DROP CONSTRAINT "CNT_pkey",
ADD COLUMN     "code" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CNT_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CNTItem" DROP COLUMN "cntId",
ADD COLUMN     "cntId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "cntId",
ADD COLUMN     "cntId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CNT_code_key" ON "CNT"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CNTItem_cntId_productId_key" ON "CNTItem"("cntId", "productId");

-- CreateIndex
CREATE INDEX "Entry_cntId_idx" ON "Entry"("cntId");

-- AddForeignKey
ALTER TABLE "CNTItem" ADD CONSTRAINT "CNTItem_cntId_fkey" FOREIGN KEY ("cntId") REFERENCES "CNT"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_cntId_fkey" FOREIGN KEY ("cntId") REFERENCES "CNT"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
