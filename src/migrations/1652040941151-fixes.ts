import {MigrationInterface, QueryRunner} from "typeorm";

export class fixes1652040941151 implements MigrationInterface {
    name = 'fixes1652040941151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_931974526dcdc75affeda661bb5"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_c11a4e5526d865e235abe4a0d0a"`);
        await queryRunner.query(`ALTER TABLE "comments" RENAME COLUMN "articleIdId" TO "articleId"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "commentsId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_b0011304ebfcb97f597eae6c31f"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "commentsId" integer`);
        await queryRunner.query(`ALTER TABLE "comments" RENAME COLUMN "articleId" TO "articleIdId"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_c11a4e5526d865e235abe4a0d0a" FOREIGN KEY ("commentsId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_931974526dcdc75affeda661bb5" FOREIGN KEY ("articleIdId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
