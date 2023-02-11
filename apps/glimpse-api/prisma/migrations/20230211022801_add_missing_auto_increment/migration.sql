-- AlterTable
CREATE SEQUENCE votes_id_seq;
ALTER TABLE "votes" ALTER COLUMN "id" SET DEFAULT nextval('votes_id_seq');
ALTER SEQUENCE votes_id_seq OWNED BY "votes"."id";
