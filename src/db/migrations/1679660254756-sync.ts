import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679660254756 implements MigrationInterface {
    name = 'sync1679660254756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "address"
            ADD "createdDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "address"
            ADD "updatedDate" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "address"
            ADD "deletedDate" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "address" DROP COLUMN "deletedDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "address" DROP COLUMN "updatedDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "address" DROP COLUMN "createdDate"
        `);
    }

}
