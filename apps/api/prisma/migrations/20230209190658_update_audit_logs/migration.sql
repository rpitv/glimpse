/*
  Warnings:

  - You are about to drop the column `comment` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `previous_value` on the `audit_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "comment",
DROP COLUMN "metadata",
DROP COLUMN "previous_value";
