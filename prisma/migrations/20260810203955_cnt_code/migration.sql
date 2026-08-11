/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `CNTItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `CNTItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CNTItem" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CNTItem_code_key" ON "CNTItem"("code");
