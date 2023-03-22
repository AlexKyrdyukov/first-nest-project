import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679516596365 implements MigrationInterface {
    name = 'sync1679516596365'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "salt" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "salt"
        `);
    }

}
