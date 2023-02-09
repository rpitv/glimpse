/*
  Warnings:

  - You are about to drop the column `action` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `field` on the `audit_logs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "audit_logs_mtable_mf_mtype_index";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "action",
DROP COLUMN "field",
ADD COLUMN     "identifier" INTEGER,
ADD COLUMN     "message" VARCHAR(300),
ADD COLUMN     "prev_value" JSON;

-- CreateIndex
CREATE INDEX "audit_logs_mtable_mf_mtype_index" ON "audit_logs"("subject");
