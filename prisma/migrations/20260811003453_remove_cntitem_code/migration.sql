/*
  Warnings:

  - You are about to drop the column `code` on the `CNTItem` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CNTItem_code_key";

-- AlterTable
ALTER TABLE "CNTItem" DROP COLUMN "code";
