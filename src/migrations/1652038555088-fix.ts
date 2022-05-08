import {MigrationInterface, QueryRunner} from "typeorm";

export class fix1652038555088 implements MigrationInterface {
    name = 'fix1652038555088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "slugId" integer`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_73c75f32269425c28cb771b91c3" FOREIGN KEY ("slugId") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_73c75f32269425c28cb771b91c3"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "slugId"`);
    }

}
