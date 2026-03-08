/*
  Warnings:

  - You are about to drop the column `authorId` on the `Link` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_authorId_fkey";

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "authorId";
