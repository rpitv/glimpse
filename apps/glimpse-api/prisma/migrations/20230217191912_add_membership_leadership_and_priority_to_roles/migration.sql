-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "display_in_leadership" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "display_in_membership" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;
