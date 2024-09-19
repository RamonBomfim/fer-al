/*
  Warnings:

  - The values [FOOD,FRUITS] on the enum `ProductTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductTypes_new" AS ENUM ('ARTESANATO', 'ALIMENTOS', 'MODA', 'EVENTOS_CULTURAIS', 'OTHERS');
ALTER TABLE "Fair" ALTER COLUMN "productTypes" TYPE "ProductTypes_new" USING ("productTypes"::text::"ProductTypes_new");
ALTER TYPE "ProductTypes" RENAME TO "ProductTypes_old";
ALTER TYPE "ProductTypes_new" RENAME TO "ProductTypes";
DROP TYPE "ProductTypes_old";
COMMIT;
