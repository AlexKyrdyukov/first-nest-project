import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679313771676 implements MigrationInterface {
    name = 'sync1679313771676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "avatar" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "avatar"
        `);
    }

}
