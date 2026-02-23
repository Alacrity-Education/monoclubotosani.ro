import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_pages_hero_type" ADD VALUE 'slidingHero';
  ALTER TYPE "public"."enum__pages_v_version_hero_type" ADD VALUE 'slidingHero';
  CREATE TABLE "pages_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtitle" varchar
  );
  
  CREATE TABLE "_pages_v_version_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"title" varchar,
  	"subtitle" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_hero_slides" ADD CONSTRAINT "pages_hero_slides_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_hero_slides" ADD CONSTRAINT "pages_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_slides" ADD CONSTRAINT "_pages_v_version_hero_slides_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_slides" ADD CONSTRAINT "_pages_v_version_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_slides_order_idx" ON "pages_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_hero_slides_parent_id_idx" ON "pages_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_hero_slides_media_idx" ON "pages_hero_slides" USING btree ("media_id");
  CREATE INDEX "_pages_v_version_hero_slides_order_idx" ON "_pages_v_version_hero_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_slides_parent_id_idx" ON "_pages_v_version_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_slides_media_idx" ON "_pages_v_version_hero_slides" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_hero_slides" CASCADE;
  DROP TABLE "_pages_v_version_hero_slides" CASCADE;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'homeHero'::text;
  DROP TYPE "public"."enum_pages_hero_type";
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'homeHero');
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'homeHero'::"public"."enum_pages_hero_type";
  ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'homeHero'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_type";
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'homeHero');
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'homeHero'::"public"."enum__pages_v_version_hero_type";
  ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";`)
}
