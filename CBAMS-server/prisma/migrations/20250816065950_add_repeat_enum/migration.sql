/*
  Warnings:

  - The `repeat` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."RepeatType" AS ENUM ('NONE', 'DAILY', 'WEEKLY');

-- AlterTable
ALTER TABLE "public"."Schedule" DROP COLUMN "repeat",
ADD COLUMN     "repeat" "public"."RepeatType" NOT NULL DEFAULT 'NONE';
