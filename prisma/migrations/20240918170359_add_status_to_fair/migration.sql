-- CreateEnum
CREATE TYPE "FairStatus" AS ENUM ('CANCELED', 'DELAYED', 'HAPPENED', 'COMING');

-- AlterTable
ALTER TABLE "Fair" ADD COLUMN     "status" "FairStatus" NOT NULL DEFAULT 'COMING';
