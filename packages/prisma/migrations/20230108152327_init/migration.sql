-- CreateTable
CREATE TABLE "access_logs" (
    "user" INTEGER NOT NULL,
    "service" VARCHAR(100) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(60),
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "access_logs_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_logs" (
    "id" BIGSERIAL NOT NULL,
    "message" VARCHAR(300) NOT NULL,
    "severity" VARCHAR(8) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_logs_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" BIGSERIAL NOT NULL,
    "tag" INTEGER,
    "name" VARCHAR(150) NOT NULL,
    "last_known_location" VARCHAR(100),
    "last_known_handler" INTEGER,
    "is_lost" BOOLEAN NOT NULL DEFAULT false,
    "notes" VARCHAR(500),
    "purchase_price" INTEGER,
    "purchase_location" VARCHAR(1000),
    "purchase_date" DATE,
    "model_number" VARCHAR(100),
    "serial_number" VARCHAR(100),
    "parent" BIGINT,

    CONSTRAINT "assets_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" BIGSERIAL NOT NULL,
    "user" BIGINT,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modification_type" VARCHAR(20) NOT NULL,
    "modified_table" VARCHAR(50),
    "modified_field" VARCHAR(50) NOT NULL,
    "previous_value" TEXT,
    "comment" VARCHAR(200),
    "metadata" JSON,

    CONSTRAINT "audit_logs_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" BIGSERIAL NOT NULL,
    "posted_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "author" BIGINT NOT NULL,
    "author_display_name" VARCHAR(100),
    "title" VARCHAR(150) NOT NULL,

    CONSTRAINT "blog_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "parent" BIGINT,

    CONSTRAINT "categories_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" BIGSERIAL NOT NULL,
    "email" VARCHAR(300) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "additional_data" JSON,

    CONSTRAINT "contact_submissions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submission_assignees" (
    "submission" BIGINT NOT NULL,
    "user" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "contact_submission_assignees_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credits" (
    "production" BIGINT NOT NULL,
    "person" BIGINT NOT NULL,
    "title" VARCHAR(100),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "credits_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "parent" BIGINT,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "groups_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_permissions" (
    "id" BIGSERIAL NOT NULL,
    "group" BIGINT NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(300)[],
    "fields" VARCHAR(100)[],
    "conditions" JSON,
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "reason" VARCHAR(300),

    CONSTRAINT "group_permissions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(200),
    "path" VARCHAR(1000) NOT NULL,

    CONSTRAINT "images_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "pronouns" VARCHAR(20),
    "graduation" DATE,
    "start" DATE NOT NULL,
    "end" DATE,
    "description" TEXT,

    CONSTRAINT "people_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people_images" (
    "image" BIGINT NOT NULL,
    "person" BIGINT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "people_images_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productions" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(6),
    "end_time" TIMESTAMP(6),
    "is_live" BOOLEAN NOT NULL DEFAULT true,
    "category" BIGINT,
    "closet_location" VARCHAR(100),
    "event_location" VARCHAR(100),
    "team_notes" TEXT,
    "discord_server" CHAR(18),
    "discord_channel" CHAR(18),
    "thumbnail" BIGINT,
    "closet_time" TIMESTAMP(6),

    CONSTRAINT "productions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_images" (
    "production" BIGINT NOT NULL,
    "image" BIGINT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "production_images_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_rsvps" (
    "production" BIGINT NOT NULL,
    "user" BIGINT NOT NULL,
    "will_attend" VARCHAR(5),
    "notes" TEXT,
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "production_rsvps_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_tags" (
    "production" BIGINT NOT NULL,
    "tag" VARCHAR(50) NOT NULL,
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "production_tags_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_videos" (
    "production" BIGINT NOT NULL,
    "video" BIGINT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "production_videos_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redirects" (
    "key" VARCHAR(100) NOT NULL,
    "location" VARCHAR(3000) NOT NULL,
    "expires" TIMESTAMP(6),
    "id" BIGSERIAL NOT NULL,

    CONSTRAINT "redirects_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" BIGSERIAL NOT NULL,
    "person" BIGINT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "start_time" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(6),
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "roles_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "username" VARCHAR(8) NOT NULL,
    "mail" VARCHAR(300) NOT NULL,
    "person" BIGINT,
    "discord" CHAR(18),
    "password" VARCHAR(300),
    "joined" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_groups" (
    "id" BIGSERIAL NOT NULL,
    "user" BIGINT NOT NULL,
    "group" BIGINT NOT NULL,

    CONSTRAINT "user_groups_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" BIGSERIAL NOT NULL,
    "user" BIGINT NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "subject" VARCHAR(300)[],
    "fields" VARCHAR(100)[],
    "conditions" JSON,
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "reason" VARCHAR(300),

    CONSTRAINT "user_permissions_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "format" VARCHAR(32) NOT NULL,
    "metadata" JSON,

    CONSTRAINT "videos_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "votes" (
    "id" BIGSERIAL NOT NULL,
    "question" VARCHAR(200) NOT NULL,
    "options" VARCHAR(200)[],
    "expires" TIMESTAMP(6),
    "description" TEXT,

    CONSTRAINT "votes_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote_responses" (
    "vote" BIGINT NOT NULL,
    "user" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" BIGSERIAL NOT NULL,
    "selection" VARCHAR(200) NOT NULL,

    CONSTRAINT "vote_responses_pk" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "access_logs_for_service_index" ON "access_logs"("user", "service");

-- CreateIndex
CREATE INDEX "access_logs_ip_index" ON "access_logs"("ip");

-- CreateIndex
CREATE INDEX "access_logs_service_index" ON "access_logs"("service");

-- CreateIndex
CREATE INDEX "alert_logs_severity_timestamp_index" ON "alert_logs"("severity", "timestamp");

-- CreateIndex
CREATE INDEX "assets_is_lost_tag_index" ON "assets"("is_lost", "tag");

-- CreateIndex
CREATE INDEX "assets_last_known_handler_tag_index" ON "assets"("last_known_handler", "tag");

-- CreateIndex
CREATE INDEX "assets_last_known_location_tag_index" ON "assets"("last_known_location", "tag");

-- CreateIndex
CREATE INDEX "assets_name_tag_index" ON "assets"("name", "tag");

-- CreateIndex
CREATE INDEX "assets_tag_index" ON "assets"("tag");

-- CreateIndex
CREATE INDEX "audit_logs_mtable_mf_mtype_index" ON "audit_logs"("modified_table", "modified_field", "modification_type");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_index" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE INDEX "blog_author_posted_at_index" ON "blog_posts"("author", "posted_at");

-- CreateIndex
CREATE INDEX "blog_posted_at_index" ON "blog_posts"("posted_at");

-- CreateIndex
CREATE INDEX "blog_title_index" ON "blog_posts"("title");

-- CreateIndex
CREATE INDEX "categories_priority_name_index" ON "categories"("priority", "name");

-- CreateIndex
CREATE UNIQUE INDEX "contact_submissions_id_uindex" ON "contact_submissions"("id");

-- CreateIndex
CREATE INDEX "contact_submissions_email_timestamp_index" ON "contact_submissions"("email", "timestamp");

-- CreateIndex
CREATE INDEX "contact_submissions_timestamp_index" ON "contact_submissions"("timestamp");

-- CreateIndex
CREATE INDEX "contact_submission_assignees_user_index" ON "contact_submission_assignees"("user");

-- CreateIndex
CREATE UNIQUE INDEX "contact_submission_assignees_pk_2" ON "contact_submission_assignees"("user", "submission");

-- CreateIndex
CREATE INDEX "credits_person_production_index" ON "credits"("person", "production");

-- CreateIndex
CREATE INDEX "credits_production_priority_title_index" ON "credits"("production", "priority", "title");

-- CreateIndex
CREATE UNIQUE INDEX "credits_pk_2" ON "credits"("production", "person");

-- CreateIndex
CREATE INDEX "groups_name_index" ON "groups"("name");

-- CreateIndex
CREATE INDEX "groups_priority_name_id_index" ON "groups"("priority", "name", "id");

-- CreateIndex
CREATE INDEX "group_permissions_group_subject_action_index" ON "group_permissions"("group", "subject", "action");

-- CreateIndex
CREATE UNIQUE INDEX "images_id_uindex" ON "images"("id");

-- CreateIndex
CREATE UNIQUE INDEX "people_id_uindex" ON "people"("id");

-- CreateIndex
CREATE INDEX "people_images_person_index" ON "people_images"("person");

-- CreateIndex
CREATE UNIQUE INDEX "people_images_pk_2" ON "people_images"("image", "person");

-- CreateIndex
CREATE INDEX "productions_category_start_time_name_index" ON "productions"("category", "start_time", "name");

-- CreateIndex
CREATE INDEX "productions_is_live_start_time_index" ON "productions"("is_live", "start_time");

-- CreateIndex
CREATE INDEX "productions_name_index" ON "productions"("name");

-- CreateIndex
CREATE INDEX "productions_start_time_name_index" ON "productions"("start_time", "name");

-- CreateIndex
CREATE INDEX "production_images_production_priority_index" ON "production_images"("production", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "production_images_pk_2" ON "production_images"("production", "image");

-- CreateIndex
CREATE INDEX "production_rsvps_user_will_attend_index" ON "production_rsvps"("user", "will_attend");

-- CreateIndex
CREATE UNIQUE INDEX "production_rsvps_pk_2" ON "production_rsvps"("production", "user");

-- CreateIndex
CREATE INDEX "production_tags_tag_index" ON "production_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "production_tags_pk_2" ON "production_tags"("production", "tag");

-- CreateIndex
CREATE INDEX "production_videos_production_priority_index" ON "production_videos"("production", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "production_videos_pk_2" ON "production_videos"("production", "video");

-- CreateIndex
CREATE UNIQUE INDEX "redirects_pk_2" ON "redirects"("key");

-- CreateIndex
CREATE INDEX "redirects_expires_index" ON "redirects"("expires");

-- CreateIndex
CREATE INDEX "roles_person_priority_start_time_index" ON "roles"("person", "priority", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_uindex" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_mail_uindex" ON "users"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "users_discord_uindex" ON "users"("discord");

-- CreateIndex
CREATE UNIQUE INDEX "user_groups_pk_2" ON "user_groups"("user", "group");

-- CreateIndex
CREATE INDEX "user_permissions_user_subject_action_index" ON "user_permissions"("user", "subject", "action");

-- CreateIndex
CREATE INDEX "votes_expires_index" ON "votes"("expires");

-- CreateIndex
CREATE INDEX "vote_responses_user_index" ON "vote_responses"("user");

-- CreateIndex
CREATE UNIQUE INDEX "vote_responses_pk_2" ON "vote_responses"("vote", "user");

-- AddForeignKey
ALTER TABLE "access_logs" ADD CONSTRAINT "access_logs_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_assets_id_fk" FOREIGN KEY ("parent") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_users_id_fk" FOREIGN KEY ("last_known_handler") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_people_id_fk" FOREIGN KEY ("author") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_categories_id_fk" FOREIGN KEY ("parent") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_submission_assignees" ADD CONSTRAINT "contact_submission_assignees_contact_submissions_id_fk" FOREIGN KEY ("submission") REFERENCES "contact_submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_submission_assignees" ADD CONSTRAINT "contact_submission_assignees_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_people_id_fk" FOREIGN KEY ("person") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_productions_id_fk" FOREIGN KEY ("production") REFERENCES "productions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_groups_id_fk" FOREIGN KEY ("parent") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_permissions" ADD CONSTRAINT "group_permissions_groups_id_fk" FOREIGN KEY ("group") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_images" ADD CONSTRAINT "people_images_images_id_fk" FOREIGN KEY ("image") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people_images" ADD CONSTRAINT "people_images_people_id_fk" FOREIGN KEY ("person") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productions" ADD CONSTRAINT "productions_categories_id_fk" FOREIGN KEY ("category") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productions" ADD CONSTRAINT "productions_images_id_fk" FOREIGN KEY ("thumbnail") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_images" ADD CONSTRAINT "production_images_images_id_fk" FOREIGN KEY ("image") REFERENCES "images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_images" ADD CONSTRAINT "production_images_productions_id_fk" FOREIGN KEY ("production") REFERENCES "productions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_rsvps" ADD CONSTRAINT "production_rsvps_productions_id_fk" FOREIGN KEY ("production") REFERENCES "productions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_rsvps" ADD CONSTRAINT "production_rsvps_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_tags" ADD CONSTRAINT "production_tags_productions_id_fk" FOREIGN KEY ("production") REFERENCES "productions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_videos" ADD CONSTRAINT "production_videos_productions_id_fk" FOREIGN KEY ("production") REFERENCES "productions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "production_videos" ADD CONSTRAINT "production_videos_videos_id_fk" FOREIGN KEY ("video") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_people_id_fk" FOREIGN KEY ("person") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_people_id_fk" FOREIGN KEY ("person") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_groups_id_fk" FOREIGN KEY ("group") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_groups" ADD CONSTRAINT "user_groups_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_responses" ADD CONSTRAINT "vote_responses_users_id_fk" FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote_responses" ADD CONSTRAINT "vote_responses_votes_id_fk" FOREIGN KEY ("vote") REFERENCES "votes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
