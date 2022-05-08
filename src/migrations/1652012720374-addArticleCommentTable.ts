import {MigrationInterface, QueryRunner} from "typeorm";

export class addArticleCommentTable1652012720374 implements MigrationInterface {
    name = 'addArticleCommentTable1652012720374'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_comments_articles" ("usersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_342becf3ce41060225415e6e505" PRIMARY KEY ("usersId", "articlesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eaefd84dd60514cc6ddeb69e64" ON "users_comments_articles" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c20c015942a9adb7167e9a84ec" ON "users_comments_articles" ("articlesId") `);
        await queryRunner.query(`ALTER TABLE "users_comments_articles" ADD CONSTRAINT "FK_eaefd84dd60514cc6ddeb69e642" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_comments_articles" ADD CONSTRAINT "FK_c20c015942a9adb7167e9a84ecb" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_comments_articles" DROP CONSTRAINT "FK_c20c015942a9adb7167e9a84ecb"`);
        await queryRunner.query(`ALTER TABLE "users_comments_articles" DROP CONSTRAINT "FK_eaefd84dd60514cc6ddeb69e642"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c20c015942a9adb7167e9a84ec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eaefd84dd60514cc6ddeb69e64"`);
        await queryRunner.query(`DROP TABLE "users_comments_articles"`);
    }

}
