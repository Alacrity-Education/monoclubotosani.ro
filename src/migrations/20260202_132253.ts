import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_image_content_cells_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_image_content_cells_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TABLE "pages_blocks_image_content_cells_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_image_content_cells_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar DEFAULT '#',
  	"link_label" varchar,
  	"link_appearance" "enum_pages_blocks_image_content_cells_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "_pages_v_blocks_image_content_cells_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_blocks_image_content_cells_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar DEFAULT '#',
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_blocks_image_content_cells_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_image_content_cells_links" ADD CONSTRAINT "pages_blocks_image_content_cells_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_image_content_cells"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image_content_cells_links" ADD CONSTRAINT "_pages_v_blocks_image_content_cells_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_image_content_cells"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_image_content_cells_links_order_idx" ON "pages_blocks_image_content_cells_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_content_cells_links_parent_id_idx" ON "pages_blocks_image_content_cells_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_content_cells_links_order_idx" ON "_pages_v_blocks_image_content_cells_links" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_content_cells_links_parent_id_idx" ON "_pages_v_blocks_image_content_cells_links" USING btree ("_parent_id");
  ALTER TABLE "pages_blocks_image_content_cells" DROP COLUMN "cta_text";
  ALTER TABLE "pages_blocks_image_content_cells" DROP COLUMN "cta_href";
  ALTER TABLE "_pages_v_blocks_image_content_cells" DROP COLUMN "cta_text";
  ALTER TABLE "_pages_v_blocks_image_content_cells" DROP COLUMN "cta_href";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_image_content_cells_links" CASCADE;
  DROP TABLE "_pages_v_blocks_image_content_cells_links" CASCADE;
  ALTER TABLE "pages_blocks_image_content_cells" ADD COLUMN "cta_text" varchar;
  ALTER TABLE "pages_blocks_image_content_cells" ADD COLUMN "cta_href" varchar;
  ALTER TABLE "_pages_v_blocks_image_content_cells" ADD COLUMN "cta_text" varchar;
  ALTER TABLE "_pages_v_blocks_image_content_cells" ADD COLUMN "cta_href" varchar;
  DROP TYPE "public"."enum_pages_blocks_image_content_cells_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_image_content_cells_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_type";
  DROP TYPE "public"."enum__pages_v_blocks_image_content_cells_links_link_appearance";`)
}
