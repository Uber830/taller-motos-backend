-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "phoneNumber" TEXT DEFAULT '';
