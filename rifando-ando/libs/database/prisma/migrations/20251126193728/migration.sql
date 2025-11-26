/*
  Warnings:

  - You are about to drop the column `email` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Usuario_email_key";

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "email";
