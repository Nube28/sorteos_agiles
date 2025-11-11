-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ORGANIZADOR', 'CLIENTE');

-- CreateTable
CREATE TABLE "Numero" (
    "id" SERIAL NOT NULL,
    "posicion" INTEGER NOT NULL,
    "fechaApartado" TIMESTAMP(3) NOT NULL,
    "sorteoId" INTEGER NOT NULL,
    "clienteId" INTEGER,
    "pagosId" INTEGER,

    CONSTRAINT "Numero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sorteo" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "urlImg" TEXT,
    "descripcion" TEXT NOT NULL,
    "premio" TEXT NOT NULL,
    "cantidadNumeros" INTEGER NOT NULL,
    "periodoInicioVenta" TIMESTAMP(3) NOT NULL,
    "periodoFinVenta" TIMESTAMP(3) NOT NULL,
    "costo" DOUBLE PRECISION NOT NULL,
    "fechaSorteo" TIMESTAMP(3) NOT NULL,
    "tiempoLimitePago" INTEGER NOT NULL,
    "numerosDisponibles" INTEGER NOT NULL,
    "organizadorId" INTEGER NOT NULL,

    CONSTRAINT "Sorteo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "contrasenia" TEXT NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organizador" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Organizador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagos" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "urlComprobante" TEXT NOT NULL,

    CONSTRAINT "Pagos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Numero_sorteoId_posicion_key" ON "Numero"("sorteoId", "posicion");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombreUsuario_key" ON "Usuario"("nombreUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "Organizador_usuarioId_key" ON "Organizador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_usuarioId_key" ON "Cliente"("usuarioId");

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
