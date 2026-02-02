import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_card_block_cards_size" AS ENUM('spanable', 'vertical', 'horizontal');
  CREATE TYPE "public"."enum__pages_v_blocks_card_block_cards_size" AS ENUM('spanable', 'vertical', 'horizontal');
  ALTER TABLE "pages_blocks_card_block_cards" ADD COLUMN "size" "enum_pages_blocks_card_block_cards_size" DEFAULT 'spanable';
  ALTER TABLE "_pages_v_blocks_card_block_cards" ADD COLUMN "size" "enum__pages_v_blocks_card_block_cards_size" DEFAULT 'spanable';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_card_block_cards" DROP COLUMN "size";
  ALTER TABLE "_pages_v_blocks_card_block_cards" DROP COLUMN "size";
  DROP TYPE "public"."enum_pages_blocks_card_block_cards_size";
  DROP TYPE "public"."enum__pages_v_blocks_card_block_cards_size";`)
}
