/*
  Warnings:

  - You are about to drop the column `motorcycleId` on the `work_orders` table. All the data in the column will be lost.
  - You are about to drop the `motorcycles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `vehicleId` to the `work_orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOTORCYCLE', 'CAR');

-- DropForeignKey
ALTER TABLE "motorcycles" DROP CONSTRAINT "motorcycles_customerId_fkey";

-- DropForeignKey
ALTER TABLE "work_orders" DROP CONSTRAINT "work_orders_motorcycleId_fkey";

-- AlterTable
ALTER TABLE "work_orders" DROP COLUMN "motorcycleId",
ADD COLUMN     "vehicleId" TEXT NOT NULL;

-- DropTable
DROP TABLE "motorcycles";

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "plate" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL DEFAULT 'MOTORCYCLE',
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
