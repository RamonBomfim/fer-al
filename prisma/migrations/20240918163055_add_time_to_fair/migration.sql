/*
  Warnings:

  - Added the required column `time` to the `Fair` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fair" ADD COLUMN     "time" TEXT NOT NULL;
