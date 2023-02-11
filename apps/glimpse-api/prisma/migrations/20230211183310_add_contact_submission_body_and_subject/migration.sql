/*
  Warnings:

  - Added the required column `body` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `contact_submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contact_submissions" ADD COLUMN     "body" VARCHAR(1000) NOT NULL,
ADD COLUMN     "subject" VARCHAR(100) NOT NULL;
