/*
  Warnings:

  - You are about to drop the column `end_time` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `person` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `roles` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_people_id_fk";

-- DropIndex
DROP INDEX "roles_person_priority_start_time_index";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "end_time",
DROP COLUMN "person",
DROP COLUMN "priority",
DROP COLUMN "start_time",
ADD COLUMN     "description" VARCHAR(1000);

-- CreateTable
CREATE TABLE "people_roles" (
    "id" BIGSERIAL NOT NULL,
    "person" BIGINT NOT NULL,
    "role" BIGINT NOT NULL,
    "start_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(6),

    CONSTRAINT "people_roles_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "people_roles_person_index" ON "people_roles"("person", "start_time");

-- CreateIndex
CREATE INDEX "roles_name_index" ON "roles"("name");

-- AddForeignKey
ALTER TABLE "people_roles" ADD CONSTRAINT "people_roles_people_id_fk" FOREIGN KEY ("person") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_roles" ADD CONSTRAINT "people_roles_roles_id_fk" FOREIGN KEY ("role") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
