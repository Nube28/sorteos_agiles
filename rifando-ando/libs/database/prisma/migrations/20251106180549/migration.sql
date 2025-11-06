/*
  Warnings:

  - Added the required column `cantidadNumeros` to the `Sorteo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `Sorteo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sorteo" ADD COLUMN     "cantidadNumeros" INTEGER NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL;
