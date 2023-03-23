import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679590043849 implements MigrationInterface {
    name = 'sync1679590043849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "address" (
                "addresId" SERIAL NOT NULL,
                "street" character varying NOT NULL,
                "city" character varying NOT NULL,
                "country" character varying NOT NULL,
                CONSTRAINT "PK_e128cd800a0ebc79a1ee716040e" PRIMARY KEY ("addresId")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "title" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "category" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "addressAddresId" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_ec491d739e6314f51b3f0d0ef72" UNIQUE ("addressAddresId")
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_ec491d739e6314f51b3f0d0ef72" FOREIGN KEY ("addressAddresId") REFERENCES "address"("addresId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "FK_ec491d739e6314f51b3f0d0ef72"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_ec491d739e6314f51b3f0d0ef72"
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "addressAddresId"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "category"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "title"
        `);
        await queryRunner.query(`
            DROP TABLE "address"
        `);
    }

}
