/*
  Warnings:

  - The `dataOfBirth` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "dataOfBirth",
ADD COLUMN     "dataOfBirth" TIMESTAMP(3);
