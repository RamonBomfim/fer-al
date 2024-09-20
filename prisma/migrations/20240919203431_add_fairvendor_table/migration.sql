/*
  Warnings:

  - You are about to drop the `_FairVendors` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FairVendors" DROP CONSTRAINT "_FairVendors_A_fkey";

-- DropForeignKey
ALTER TABLE "_FairVendors" DROP CONSTRAINT "_FairVendors_B_fkey";

-- DropTable
DROP TABLE "_FairVendors";

-- CreateTable
CREATE TABLE "FairVendor" (
    "fairId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "FairVendor_pkey" PRIMARY KEY ("fairId","vendorId")
);

-- AddForeignKey
ALTER TABLE "FairVendor" ADD CONSTRAINT "FairVendor_fairId_fkey" FOREIGN KEY ("fairId") REFERENCES "Fair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FairVendor" ADD CONSTRAINT "FairVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
