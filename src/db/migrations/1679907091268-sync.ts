import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679907091268 implements MigrationInterface {
    name = 'sync1679907091268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "role"
            ALTER COLUMN "name"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "role"
            ADD CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "role" DROP CONSTRAINT "UQ_ae4578dcaed5adff96595e61660"
        `);
        await queryRunner.query(`
            ALTER TABLE "role"
            ALTER COLUMN "name" DROP NOT NULL
        `);
    }

}
