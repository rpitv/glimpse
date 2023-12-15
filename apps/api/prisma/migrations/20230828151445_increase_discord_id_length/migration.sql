-- AlterTable
ALTER TABLE "productions" ALTER COLUMN "discord_server" SET DATA TYPE CHAR(21),
ALTER COLUMN "discord_channel" SET DATA TYPE CHAR(21),
ALTER COLUMN "discord_unvolunteer_message" SET DATA TYPE CHAR(21),
ALTER COLUMN "discord_volunteer_message" SET DATA TYPE CHAR(21);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "discord" SET DATA TYPE CHAR(21);
