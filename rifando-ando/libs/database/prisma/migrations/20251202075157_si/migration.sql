-- DropForeignKey
ALTER TABLE "public"."Numero" DROP CONSTRAINT "Numero_sorteoId_fkey";

-- AddForeignKey
ALTER TABLE "Numero" ADD CONSTRAINT "Numero_sorteoId_fkey" FOREIGN KEY ("sorteoId") REFERENCES "Sorteo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
