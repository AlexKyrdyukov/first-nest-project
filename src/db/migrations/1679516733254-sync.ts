import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679516733254 implements MigrationInterface {
    name = 'sync1679516733254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "salt"
            SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "salt" DROP NOT NULL
        `);
    }

}
