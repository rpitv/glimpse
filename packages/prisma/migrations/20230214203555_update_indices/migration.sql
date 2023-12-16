-- DropForeignKey
ALTER TABLE "access_logs" DROP CONSTRAINT "access_logs_users_id_fk";

-- DropForeignKey
ALTER TABLE "assets" DROP CONSTRAINT "assets_users_id_fk";

-- DropForeignKey
ALTER TABLE "people" DROP CONSTRAINT "people_images_id_fk";

-- DropIndex
DROP INDEX "access_logs_for_service_index";

-- DropIndex
DROP INDEX "access_logs_ip_index";

-- DropIndex
DROP INDEX "access_logs_service_index";

-- DropIndex
DROP INDEX "assets_is_lost_tag_index";

-- DropIndex
DROP INDEX "audit_logs_mtable_mf_mtype_index";

-- DropIndex
DROP INDEX "blog_title_index";

-- DropIndex
DROP INDEX "groups_priority_name_id_index";

-- DropIndex
DROP INDEX "vote_responses_user_index";

-- AlterTable
ALTER TABLE "access_logs" ALTER COLUMN "user" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "assets" ALTER COLUMN "last_known_handler" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "people" ALTER COLUMN "profile_picture" SET DATA TYPE BIGINT;

-- CreateIndex
CREATE INDEX "access_logs_userId_timestamp_index" ON "access_logs"("user", "timestamp");

-- CreateIndex
CREATE INDEX "access_logs_timestamp_index" ON "access_logs"("timestamp");

-- CreateIndex
CREATE INDEX "alert_logs_timestamp_index" ON "alert_logs"("timestamp");

-- CreateIndex
CREATE INDEX "assets_purchase_price_tag_index" ON "assets"("purchase_price", "tag");

-- CreateIndex
CREATE INDEX "assets_purchase_date_tag_index" ON "assets"("purchase_date", "tag");

-- CreateIndex
CREATE INDEX "audit_logs_userId_timestamp_index" ON "audit_logs"("user", "timestamp");

-- CreateIndex
CREATE INDEX "blog_posts_author_display_name_posted_at_index" ON "blog_posts"("author_display_name", "posted_at");

-- CreateIndex
CREATE INDEX "blog_posts_title_posted_at_index" ON "blog_posts"("title", "posted_at");

-- CreateIndex
CREATE INDEX "categories_parent_name_index" ON "categories"("parent", "name");

-- CreateIndex
CREATE INDEX "categories_name_index" ON "categories"("name");

-- CreateIndex
CREATE INDEX "contact_submissions_name_timestamp_index" ON "contact_submissions"("name", "timestamp");

-- CreateIndex
CREATE INDEX "contact_submissions_subject_timestamp_index" ON "contact_submissions"("subject", "timestamp");

-- CreateIndex
CREATE INDEX "contact_submissions_resolved_timestamp_index" ON "contact_submissions"("resolved", "timestamp");

-- CreateIndex
CREATE INDEX "group_permissions_group_action_subject_index" ON "group_permissions"("group", "action", "subject");

-- CreateIndex
CREATE INDEX "group_permissions_group_inverted_subject_action_index" ON "group_permissions"("group", "inverted", "subject", "action");

-- CreateIndex
CREATE INDEX "group_permissions_group_inverted_action_subject_index" ON "group_permissions"("group", "inverted", "action", "subject");

-- CreateIndex
CREATE INDEX "groups_parent_priority_name_index" ON "groups"("parent", "priority", "name");

-- CreateIndex
CREATE INDEX "groups_priority_name_index" ON "groups"("priority", "name");

-- CreateIndex
CREATE INDEX "groups_parent_name_index" ON "groups"("parent", "name");

-- CreateIndex
CREATE INDEX "images_name_index" ON "images"("name");

-- CreateIndex
CREATE INDEX "images_path_index" ON "images"("path");

-- CreateIndex
CREATE INDEX "people_graduation_name_index" ON "people"("graduation", "name");

-- CreateIndex
CREATE INDEX "people_name_index" ON "people"("name");

-- CreateIndex
CREATE INDEX "people_roles_role_start_time_index" ON "people_roles"("role", "start_time");

-- CreateIndex
CREATE INDEX "people_roles_start_time_index" ON "people_roles"("start_time");

-- CreateIndex
CREATE INDEX "production_images_production_image_priority_index" ON "production_images"("production", "image", "priority");

-- CreateIndex
CREATE INDEX "production_images_image_production_priority_index" ON "production_images"("image", "production", "priority");

-- CreateIndex
CREATE INDEX "production_rsvps_production_user_will_attend_index" ON "production_rsvps"("production", "user", "will_attend");

-- CreateIndex
CREATE INDEX "production_rsvps_production_will_attend_index" ON "production_rsvps"("production", "will_attend");

-- CreateIndex
CREATE INDEX "production_videos_production_video_priority_index" ON "production_videos"("production", "video", "priority");

-- CreateIndex
CREATE INDEX "production_videos_video_production_priority_index" ON "production_videos"("video", "production", "priority");

-- CreateIndex
CREATE INDEX "redirects_key_expires_index" ON "redirects"("key", "expires");

-- CreateIndex
CREATE INDEX "redirects_location_index" ON "redirects"("location");

-- CreateIndex
CREATE INDEX "user_groups_group_user_index" ON "user_groups"("group", "user");

-- CreateIndex
CREATE INDEX "user_permissions_user_action_subject_index" ON "user_permissions"("user", "action", "subject");

-- CreateIndex
CREATE INDEX "user_permissions_user_inverted_subject_action_index" ON "user_permissions"("user", "inverted", "subject", "action");

-- CreateIndex
CREATE INDEX "user_permissions_user_inverted_action_subject_index" ON "user_permissions"("user", "inverted", "action", "subject");

-- CreateIndex
CREATE INDEX "users_person_index" ON "users"("person");

-- CreateIndex
CREATE INDEX "users_joined_index" ON "users"("joined");

-- CreateIndex
CREATE INDEX "videos_name_index" ON "videos"("name");

-- CreateIndex
CREATE INDEX "videos_format_index" ON "videos"("format");

-- CreateIndex
CREATE INDEX "vote_responses_vote_user_timestamp_index" ON "vote_responses"("vote", "user", "timestamp");

-- CreateIndex
CREATE INDEX "vote_responses_vote_timestamp_index" ON "vote_responses"("vote", "timestamp");

-- CreateIndex
CREATE INDEX "vote_responses_user_vote_timestamp_index" ON "vote_responses"("user", "vote", "timestamp");

-- CreateIndex
CREATE INDEX "vote_responses_user_timestamp_index" ON "vote_responses"("user", "timestamp");

-- CreateIndex
CREATE INDEX "vote_responses_timestamp_index" ON "vote_responses"("timestamp");

-- CreateIndex
CREATE INDEX "votes_question_index" ON "votes"("question", "expires");

-- AddForeignKey
ALTER TABLE "access_logs" ADD CONSTRAINT "access_logs_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_users_id_fk" FOREIGN KEY ("last_known_handler") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_images_id_fk" FOREIGN KEY ("profile_picture") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "blog_author_posted_at_index" RENAME TO "blog_posts_author_posted_at_index";

-- RenameIndex
ALTER INDEX "blog_posted_at_index" RENAME TO "blog_posts_posted_at_index";

-- RenameIndex
ALTER INDEX "people_roles_person_index" RENAME TO "people_roles_person_start_time_index";
