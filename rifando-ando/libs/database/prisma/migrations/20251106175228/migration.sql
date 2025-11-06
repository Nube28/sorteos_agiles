/*
  Warnings:

  - Changed the type of `tiempoLimitePago` on the `Sorteo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "public"."Numero_posicion_key";

-- AlterTable
ALTER TABLE "Sorteo" DROP COLUMN "tiempoLimitePago",
ADD COLUMN     "tiempoLimitePago" INTEGER NOT NULL;
