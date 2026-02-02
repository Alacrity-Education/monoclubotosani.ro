import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  -- 1. Fix Enums safely. 
  -- We removed "BEFORE 'outline'" because 'outline' might not exist yet.
  -- We also explicitly add 'outline' to be safe.

  -- Hero Links
  ALTER TYPE "public"."enum_pages_hero_links_link_appearance" ADD VALUE IF NOT EXISTS 'secondary';
  ALTER TYPE "public"."enum_pages_hero_links_link_appearance" ADD VALUE IF NOT EXISTS 'primary';
  ALTER TYPE "public"."enum_pages_hero_links_link_appearance" ADD VALUE IF NOT EXISTS 'outline';

  -- Content Columns
  ALTER TYPE "public"."enum_pages_blocks_content_columns_link_appearance" ADD VALUE IF NOT EXISTS 'secondary';
  ALTER TYPE "public"."enum_pages_blocks_content_columns_link_appearance" ADD VALUE IF NOT EXISTS 'primary';
  ALTER TYPE "public"."enum_pages_blocks_content_columns_link_appearance" ADD VALUE IF NOT EXISTS 'outline';

  -- Version Hero Links
  ALTER TYPE "public"."enum__pages_v_version_hero_links_link_appearance" ADD VALUE IF NOT EXISTS 'secondary';
  ALTER TYPE "public"."enum__pages_v_version_hero_links_link_appearance" ADD VALUE IF NOT EXISTS 'primary';
  ALTER TYPE "public"."enum__pages_v_version_hero_links_link_appearance" ADD VALUE IF NOT EXISTS 'outline';

  -- Version Content Columns
  ALTER TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" ADD VALUE IF NOT EXISTS 'secondary';
  ALTER TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" ADD VALUE IF NOT EXISTS 'primary';
  ALTER TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" ADD VALUE IF NOT EXISTS 'outline';

  -- 2. Update Tables (CTA Links and Image Content Cells)

  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('outline', 'secondary', 'default');
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_blocks_cta_links_link_appearance";
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_blocks_cta_links_link_appearance" USING "link_appearance"::"public"."enum_pages_blocks_cta_links_link_appearance";

  ALTER TABLE "pages_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_image_content_cells_links_link_appearance";
  CREATE TYPE "public"."enum_pages_blocks_image_content_cells_links_link_appearance" AS ENUM('default', 'secondary');
  ALTER TABLE "pages_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_blocks_image_content_cells_links_link_appearance";
  ALTER TABLE "pages_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_blocks_image_content_cells_links_link_appearance" USING "link_appearance"::"public"."enum_pages_blocks_image_content_cells_links_link_appearance";

  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('outline', 'secondary', 'default');
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_cta_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" USING "link_appearance"::"public"."enum__pages_v_blocks_cta_links_link_appearance";

  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_appearance";
  CREATE TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_appearance" AS ENUM('default', 'secondary');
  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_image_content_cells_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_appearance" USING "link_appearance"::"public"."enum__pages_v_blocks_image_content_cells_links_link_appearance";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_hero_links_link_appearance";
  ALTER TABLE "pages_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_hero_links_link_appearance" USING "link_appearance"::"public"."enum_pages_hero_links_link_appearance";
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_blocks_cta_links_link_appearance";
  ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_blocks_cta_links_link_appearance" USING "link_appearance"::"public"."enum_pages_blocks_cta_links_link_appearance";
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_appearance";
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_blocks_content_columns_link_appearance";
  ALTER TABLE "pages_blocks_content_columns" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_blocks_content_columns_link_appearance" USING "link_appearance"::"public"."enum_pages_blocks_content_columns_link_appearance";
  ALTER TABLE "pages_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "pages_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum_pages_blocks_image_content_cells_links_link_appearance";
  CREATE TYPE "public"."enum_pages_blocks_image_content_cells_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "pages_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum_pages_blocks_image_content_cells_links_link_appearance";
  ALTER TABLE "pages_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum_pages_blocks_image_content_cells_links_link_appearance" USING "link_appearance"::"public"."enum_pages_blocks_image_content_cells_links_link_appearance";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_version_hero_links_link_appearance";
  ALTER TABLE "_pages_v_version_hero_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_version_hero_links_link_appearance" USING "link_appearance"::"public"."enum__pages_v_version_hero_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance";
  CREATE TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_cta_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_blocks_cta_links_link_appearance" USING "link_appearance"::"public"."enum__pages_v_blocks_cta_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance";
  CREATE TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_content_columns_link_appearance";
  ALTER TABLE "_pages_v_blocks_content_columns" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_blocks_content_columns_link_appearance" USING "link_appearance"::"public"."enum__pages_v_blocks_content_columns_link_appearance";
  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DATA TYPE text;
  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::text;
  DROP TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_appearance";
  CREATE TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_appearance" AS ENUM('default', 'outline');
  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default'::"public"."enum__pages_v_blocks_image_content_cells_links_link_appearance";
  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ALTER COLUMN "link_appearance" SET DATA TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_appearance" USING "link_appearance"::"public"."enum__pages_v_blocks_image_content_cells_links_link_appearance";`)
}
