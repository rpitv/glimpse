/*
  Warnings:

  - You are about to drop the `contact_submission_assignees` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "contact_submission_assignees" DROP CONSTRAINT "contact_submission_assignees_contact_submissions_id_fk";

-- DropForeignKey
ALTER TABLE "contact_submission_assignees" DROP CONSTRAINT "contact_submission_assignees_users_id_fk";

-- DropTable
DROP TABLE "contact_submission_assignees";
