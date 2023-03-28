import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1680004068347 implements MigrationInterface {
    name = 'sync1680004068347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "userId" SERIAL NOT NULL,
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "password" character varying NOT NULL,
                "fullName" character varying,
                "email" character varying NOT NULL,
                "avatar" character varying,
                "addressAddresId" integer,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "REL_ec491d739e6314f51b3f0d0ef7" UNIQUE ("addressAddresId"),
                CONSTRAINT "PK_d72ea127f30e21753c9e229891e" PRIMARY KEY ("userId")
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
            ALTER TABLE "post"
            ADD CONSTRAINT "FK_e98ab4feed338171694c77fdcbd" FOREIGN KEY ("authorUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_4281174f108641dbdbe8ec124c2" FOREIGN KEY ("authorUserId") REFERENCES "user"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "FK_ec491d739e6314f51b3f0d0ef72" FOREIGN KEY ("addressAddresId") REFERENCES "address"("addresId") ON DELETE NO ACTION ON UPDATE NO ACTION
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
            ALTER TABLE "user" DROP CONSTRAINT "FK_ec491d739e6314f51b3f0d0ef72"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_4281174f108641dbdbe8ec124c2"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_e98ab4feed338171694c77fdcbd"
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
            DROP TABLE "user"
        `);
    }

}
