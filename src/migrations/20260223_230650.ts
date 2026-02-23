import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
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

    ALTER TABLE "pages_hero_links" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_pages_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
    DROP TABLE "pages_hero_links" CASCADE;
    DROP TABLE "_pages_v_version_hero_links" CASCADE;

    -- 1. Convert to text
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'homeHero'::text;

    -- 2. FIX: Map old values (lowImpact, mediumImpact, highImpact) to a valid new value ('homeHero')
    UPDATE "pages" SET "hero_type" = 'homeHero' WHERE "hero_type" IN ('lowImpact', 'mediumImpact', 'highImpact');

    -- 3. Proceed with Enum creation and conversion
    DROP TYPE "public"."enum_pages_hero_type";
    CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'homeHero', 'slidingHero');
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'homeHero'::"public"."enum_pages_hero_type";
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";

    -- 4. Do the same for the Versions table
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'homeHero'::text;

    -- 5. FIX: Update version table values
    UPDATE "_pages_v" SET "version_hero_type" = 'homeHero' WHERE "version_hero_type" IN ('lowImpact', 'mediumImpact', 'highImpact');

    -- 6. Continue versions conversion
    DROP TYPE "public"."enum__pages_v_version_hero_type";
    CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'homeHero', 'slidingHero');
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'homeHero'::"public"."enum__pages_v_version_hero_type";
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";

    ALTER TABLE "pages_hero_slides" ADD CONSTRAINT "pages_hero_slides_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_hero_slides" ADD CONSTRAINT "pages_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_pages_v_version_hero_slides" ADD CONSTRAINT "_pages_v_version_hero_slides_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_pages_v_version_hero_slides" ADD CONSTRAINT "_pages_v_version_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "pages_hero_slides_order_idx" ON "pages_hero_slides" USING btree ("_order");
    CREATE INDEX "pages_hero_slides_parent_id_idx" ON "pages_hero_slides" USING btree ("_parent_id");
    CREATE INDEX "pages_hero_slides_media_idx" ON "pages_hero_slides" USING btree ("media_id");
    CREATE INDEX "_pages_v_version_hero_slides_order_idx" ON "_pages_v_version_hero_slides" USING btree ("_order");
    CREATE INDEX "_pages_v_version_hero_slides_parent_id_idx" ON "_pages_v_version_hero_slides" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_version_hero_slides_media_idx" ON "_pages_v_version_hero_slides" USING btree ("media_id");
    DROP TYPE "public"."enum_pages_hero_links_link_type";
    DROP TYPE "public"."enum_pages_hero_links_link_appearance";
    DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
    DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'secondary', 'primary', 'outline');
    CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
    CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'secondary', 'primary', 'outline');
    CREATE TABLE "pages_hero_links" (
                                      "_order" integer NOT NULL,
                                      "_parent_id" integer NOT NULL,
                                      "id" varchar PRIMARY KEY NOT NULL,
                                      "link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
                                      "link_new_tab" boolean,
                                      "link_url" varchar DEFAULT '#',
                                      "link_label" varchar,
                                      "link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
    );

    CREATE TABLE "_pages_v_version_hero_links" (
                                                 "_order" integer NOT NULL,
                                                 "_parent_id" integer NOT NULL,
                                                 "id" serial PRIMARY KEY NOT NULL,
                                                 "link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
                                                 "link_new_tab" boolean,
                                                 "link_url" varchar DEFAULT '#',
                                                 "link_label" varchar,
                                                 "link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
                                                 "_uuid" varchar
    );

    ALTER TABLE "pages_hero_slides" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_pages_v_version_hero_slides" DISABLE ROW LEVEL SECURITY;
    DROP TABLE "pages_hero_slides" CASCADE;
    DROP TABLE "_pages_v_version_hero_slides" CASCADE;
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE text;
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::text;
    DROP TYPE "public"."enum_pages_hero_type";
    CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'homeHero', 'mediumImpact', 'lowImpact');
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DEFAULT 'lowImpact'::"public"."enum_pages_hero_type";
    ALTER TABLE "pages" ALTER COLUMN "hero_type" SET DATA TYPE "public"."enum_pages_hero_type" USING "hero_type"::"public"."enum_pages_hero_type";
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE text;
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::text;
    DROP TYPE "public"."enum__pages_v_version_hero_type";
    CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'homeHero', 'mediumImpact', 'lowImpact');
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DEFAULT 'lowImpact'::"public"."enum__pages_v_version_hero_type";
    ALTER TABLE "_pages_v" ALTER COLUMN "version_hero_type" SET DATA TYPE "public"."enum__pages_v_version_hero_type" USING "version_hero_type"::"public"."enum__pages_v_version_hero_type";
    ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
    CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
    CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
    CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");`)
}
