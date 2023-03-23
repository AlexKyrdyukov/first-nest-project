import { MigrationInterface, QueryRunner } from "typeorm";

export class sync1679576037462 implements MigrationInterface {
    name = 'sync1679576037462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "post" (
                "postId" SERIAL NOT NULL,
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "content" character varying NOT NULL,
                "authorUserId" integer,
                CONSTRAINT "PK_9b3ab408235ba7d60345a84f994" PRIMARY KEY ("postId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "comment" (
                "commentId" SERIAL NOT NULL,
                "createdDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedDate" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedDate" TIMESTAMP,
                "content" character varying NOT NULL,
                "authorUserId" integer,
                "postPostId" integer,
                CONSTRAINT "PK_1b03586f7af11eac99f4fdbf012" PRIMARY KEY ("commentId")
            )
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
            ALTER TABLE "comment"
            ADD CONSTRAINT "FK_58c08bd38052e10706d3b4ae89a" FOREIGN KEY ("postPostId") REFERENCES "post"("postId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_58c08bd38052e10706d3b4ae89a"
        `);
        await queryRunner.query(`
            ALTER TABLE "comment" DROP CONSTRAINT "FK_4281174f108641dbdbe8ec124c2"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP CONSTRAINT "FK_e98ab4feed338171694c77fdcbd"
        `);
        await queryRunner.query(`
            DROP TABLE "comment"
        `);
        await queryRunner.query(`
            DROP TABLE "post"
        `);
    }

}
