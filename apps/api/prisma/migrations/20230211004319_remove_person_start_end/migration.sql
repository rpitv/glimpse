/*
  Warnings:

  - You are about to drop the column `end` on the `people` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `people` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "people" DROP COLUMN "end",
DROP COLUMN "start";
