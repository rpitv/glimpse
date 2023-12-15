/*
  Warnings:

  - You are about to drop the column `is_live` on the `productions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "productions_is_live_start_time_index";

-- AlterTable
ALTER TABLE "productions" DROP COLUMN "is_live";
