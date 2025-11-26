/*
  Warnings:

  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Numero` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Organizador` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Pagos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Sorteo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Cliente" DROP CONSTRAINT "Cliente_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Numero" DROP CONSTRAINT "Numero_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Numero" DROP CONSTRAINT "Numero_pagosId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Numero" DROP CONSTRAINT "Numero_sorteoId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Organizador" DROP CONSTRAINT "Organizador_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pagos" DROP CONSTRAINT "Pagos_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sorteo" DROP CONSTRAINT "Sorteo_organizadorId_fkey";

-- AlterTable
ALTER TABLE "Cliente" DROP CONSTRAINT "Cliente_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuarioId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Cliente_id_seq";

-- AlterTable
ALTER TABLE "Numero" DROP CONSTRAINT "Numero_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "sorteoId" SET DATA TYPE TEXT,
ALTER COLUMN "clienteId" SET DATA TYPE TEXT,
ALTER COLUMN "pagosId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Numero_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Numero_id_seq";

-- AlterTable
ALTER TABLE "Organizador" DROP CONSTRAINT "Organizador_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuarioId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Organizador_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Organizador_id_seq";

-- AlterTable
ALTER TABLE "Pagos" DROP CONSTRAINT "Pagos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "usuarioId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Pagos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Pagos_id_seq";

-- AlterTable
ALTER TABLE "Sorteo" DROP CONSTRAINT "Sorteo_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "organizadorId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Sorteo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Sorteo_id_seq";

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ADD COLUMN     "email" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Usuario_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Numero" ADD CONSTRAINT "Numero_sorteoId_fkey" FOREIGN KEY ("sorteoId") REFERENCES "Sorteo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Numero" ADD CONSTRAINT "Numero_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Numero" ADD CONSTRAINT "Numero_pagosId_fkey" FOREIGN KEY ("pagosId") REFERENCES "Pagos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sorteo" ADD CONSTRAINT "Sorteo_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "Organizador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organizador" ADD CONSTRAINT "Organizador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagos" ADD CONSTRAINT "Pagos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
