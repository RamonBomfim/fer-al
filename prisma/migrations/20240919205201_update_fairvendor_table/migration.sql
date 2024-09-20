-- DropForeignKey
ALTER TABLE "FairVendor" DROP CONSTRAINT "FairVendor_vendorId_fkey";

-- AddForeignKey
ALTER TABLE "FairVendor" ADD CONSTRAINT "FairVendor_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
