-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_fertilizerId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_fertilizerId_fkey" FOREIGN KEY ("fertilizerId") REFERENCES "public"."Fertilizer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
