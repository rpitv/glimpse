/*
  Warnings:

  - Made the column `is_discord_channel_archived` on table `productions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "productions" ALTER COLUMN "is_discord_channel_archived" SET NOT NULL,
ALTER COLUMN "is_discord_channel_archived" SET DEFAULT false;
