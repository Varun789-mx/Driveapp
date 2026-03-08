/*
  Warnings:

  - You are about to drop the column `clicks` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "clicks",
ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0;
