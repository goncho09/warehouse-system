/*
  Warnings:

  - A unique constraint covering the columns `[destination,category,departureDate]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `category` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FOOD', 'NO_FOOD', 'CONGELADO', 'REFRIGERADO');

-- DropIndex
DROP INDEX "Order_destination_departureDate_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "category" "Category" NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL;

-- DropEnum
DROP TYPE "ProductCategory";

-- CreateIndex
CREATE UNIQUE INDEX "Order_destination_category_departureDate_key" ON "Order"("destination", "category", "departureDate");
