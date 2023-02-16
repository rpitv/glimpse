/*
  Warnings:

  - You are about to drop the column `modification_type` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `modified_field` on the `audit_logs` table. All the data in the column will be lost.
  - You are about to drop the column `modified_table` on the `audit_logs` table. All the data in the column will be lost.
  - Added the required column `action` to the `audit_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `field` to the `audit_logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "audit_logs_mtable_mf_mtype_index";

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "modification_type",
DROP COLUMN "modified_field",
DROP COLUMN "modified_table",
ADD COLUMN     "action" VARCHAR(20) NOT NULL,
ADD COLUMN     "field" VARCHAR(50) NOT NULL,
ADD COLUMN     "subject" VARCHAR(50);

-- CreateIndex
CREATE INDEX "audit_logs_mtable_mf_mtype_index" ON "audit_logs"("subject", "field", "action");
