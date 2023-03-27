import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679948170550 implements MigrationInterface {
    name = 'sync1679948170550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "post_categories_category" (
                "postPostId" integer NOT NULL,
                "categoryCategoryId" integer NOT NULL,
                CONSTRAINT "PK_861462d30882a3d9f1f9194ca1b" PRIMARY KEY ("postPostId", "categoryCategoryId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0cc7d5442491fae0211d66b6f2" ON "post_categories_category" ("postPostId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f2be61beba8332601d2eb170af" ON "post_categories_category" ("categoryCategoryId")
        `);
        await queryRunner.query(`
            ALTER TABLE "post_categories_category"
            ADD CONSTRAINT "FK_0cc7d5442491fae0211d66b6f28" FOREIGN KEY ("postPostId") REFERENCES "post"("postId") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "post_categories_category"
            ADD CONSTRAINT "FK_f2be61beba8332601d2eb170af0" FOREIGN KEY ("categoryCategoryId") REFERENCES "category"("categoryId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post_categories_category" DROP CONSTRAINT "FK_f2be61beba8332601d2eb170af0"
        `);
        await queryRunner.query(`
            ALTER TABLE "post_categories_category" DROP CONSTRAINT "FK_0cc7d5442491fae0211d66b6f28"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_f2be61beba8332601d2eb170af"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0cc7d5442491fae0211d66b6f2"
        `);
        await queryRunner.query(`
            DROP TABLE "post_categories_category"
        `);
    }

}
