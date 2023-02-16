-- AlterTable
ALTER TABLE "people" ADD COLUMN     "profile_picture" INTEGER;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_images_id_fk" FOREIGN KEY ("profile_picture") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;
