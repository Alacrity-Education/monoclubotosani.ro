import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'outline';
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'outline';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default';
  ALTER TABLE "_pages_v_blocks_cta_links" ALTER COLUMN "link_appearance" SET DEFAULT 'default';`)
}
