/*
  Warnings:

  - You are about to drop the column `status` on the `PickTask` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "PickTask_status_idx";

-- AlterTable
ALTER TABLE "PickTask" DROP COLUMN "status";

-- DropEnum
DROP TYPE "PickTaskStatus";
