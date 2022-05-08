import {MigrationInterface, QueryRunner} from "typeorm";

export class asdasd1652039595358 implements MigrationInterface {
    name = 'asdasd1652039595358'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_73c75f32269425c28cb771b91c3"`);
        await queryRunner.query(`ALTER TABLE "comments" RENAME COLUMN "slugId" TO "articleIdId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_931974526dcdc75affeda661bb5" FOREIGN KEY ("articleIdId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_931974526dcdc75affeda661bb5"`);
        await queryRunner.query(`ALTER TABLE "comments" RENAME COLUMN "articleIdId" TO "slugId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_73c75f32269425c28cb771b91c3" FOREIGN KEY ("slugId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
