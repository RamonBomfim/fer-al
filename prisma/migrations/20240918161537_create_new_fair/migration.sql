-- CreateEnum
CREATE TYPE "ProductTypes" AS ENUM ('FOOD', 'FRUITS', 'OTHERS');

-- CreateTable
CREATE TABLE "Fair" (
    "id" SERIAL NOT NULL,
    "organizerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "productTypes" "ProductTypes" NOT NULL,

    CONSTRAINT "Fair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FairVendors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FairVendors_AB_unique" ON "_FairVendors"("A", "B");

-- CreateIndex
CREATE INDEX "_FairVendors_B_index" ON "_FairVendors"("B");

-- AddForeignKey
ALTER TABLE "Fair" ADD CONSTRAINT "Fair_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FairVendors" ADD CONSTRAINT "_FairVendors_A_fkey" FOREIGN KEY ("A") REFERENCES "Fair"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FairVendors" ADD CONSTRAINT "_FairVendors_B_fkey" FOREIGN KEY ("B") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
