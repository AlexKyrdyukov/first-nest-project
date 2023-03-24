import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679659364073 implements MigrationInterface {
    name = 'sync1679659364073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category" (
                "categoryId" SERIAL NOT NULL,
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_8a300c5ce0f70ed7945e877a537" PRIMARY KEY ("categoryId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "role" (
                "roleId" SERIAL NOT NULL,
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "name" character varying,
                CONSTRAINT "PK_703705ba862c2bb45250962c9e1" PRIMARY KEY ("roleId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user_roles_role" (
                "userUserId" integer NOT NULL,
                "roleRoleId" integer NOT NULL,
                CONSTRAINT "PK_3dc5275c03a2ca0739f9cbd5754" PRIMARY KEY ("userUserId", "roleRoleId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_0bd606ba8531dd93b457b8486d" ON "user_roles_role" ("userUserId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_56f8ede2f2e059d4db74591c53" ON "user_roles_role" ("roleRoleId")
        `);
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "salt"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles_role"
            ADD CONSTRAINT "FK_0bd606ba8531dd93b457b8486d9" FOREIGN KEY ("userUserId") REFERENCES "user"("userId") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles_role"
            ADD CONSTRAINT "FK_56f8ede2f2e059d4db74591c533" FOREIGN KEY ("roleRoleId") REFERENCES "role"("roleId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_56f8ede2f2e059d4db74591c533"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_0bd606ba8531dd93b457b8486d9"
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "salt" character varying NOT NULL
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_56f8ede2f2e059d4db74591c53"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_0bd606ba8531dd93b457b8486d"
        `);
        await queryRunner.query(`
            DROP TABLE "user_roles_role"
        `);
        await queryRunner.query(`
            DROP TABLE "role"
        `);
        await queryRunner.query(`
            DROP TABLE "category"
        `);
    }

}
