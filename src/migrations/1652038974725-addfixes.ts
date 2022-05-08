import {MigrationInterface, QueryRunner} from "typeorm";

export class addfixes1652038974725 implements MigrationInterface {
    name = 'addfixes1652038974725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "commentsId" integer`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_c11a4e5526d865e235abe4a0d0a" FOREIGN KEY ("commentsId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_c11a4e5526d865e235abe4a0d0a"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "commentsId"`);
    }

}
