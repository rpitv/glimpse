/*
  Warnings:

  - You are about to drop the column `prev_value` on the `audit_logs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "prev_value",
ADD COLUMN     "new_value" JSON,
ADD COLUMN     "old_value" JSON;
