/*
  Warnings:

  - You are about to drop the column `fullName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - The `sessionFacebook` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sessionGoogle` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `firstName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "fullName",
DROP COLUMN "role",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "habeas_data" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastName" TEXT NOT NULL,
DROP COLUMN "sessionFacebook",
ADD COLUMN     "sessionFacebook" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "sessionGoogle",
ADD COLUMN     "sessionGoogle" BOOLEAN NOT NULL DEFAULT false;
