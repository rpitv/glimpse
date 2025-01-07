/*
  Warnings:

  - You are about to drop the column `discord_channel` on the `productions` table. All the data in the column will be lost.
  - You are about to drop the column `discord_server` on the `productions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "productions" DROP COLUMN "discord_channel",
DROP COLUMN "discord_server",
ADD COLUMN     "discord_data" JSON,
ADD COLUMN     "use_discord" BOOLEAN NOT NULL DEFAULT false;
