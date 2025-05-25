-- AlterTable
ALTER TABLE "users" ADD COLUMN     "sessionFacebook" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sessionGoogle" INTEGER NOT NULL DEFAULT 0;
