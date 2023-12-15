/*
  Warnings:

  - Added the required column `type` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "contact_submission_type_enum" AS ENUM ('GENERAL', 'PRODUCTION_REQUEST');

-- AlterTable
ALTER TABLE "contact_submissions" ADD COLUMN     "type" "contact_submission_type_enum" NOT NULL;

-- CreateIndex
CREATE INDEX "contact_submissions_type_timestamp_index" ON "contact_submissions"("type", "timestamp");
