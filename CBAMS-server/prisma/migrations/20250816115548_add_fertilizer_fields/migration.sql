/*
  Warnings:

  - You are about to drop the column `price` on the `Fertilizer` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderId_fkey";

-- AlterTable
ALTER TABLE "public"."Fertilizer" DROP COLUMN "price",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "features" TEXT,
ADD COLUMN     "mrp" DOUBLE PRECISION,
ADD COLUMN     "sellingPrice" DOUBLE PRECISION,
ADD COLUMN     "subImages" TEXT[];

-- DropTable
DROP TABLE "public"."Message";
