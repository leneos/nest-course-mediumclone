import {MigrationInterface, QueryRunner} from "typeorm";

export class ADDARTICLECOMMENTS1652037171277 implements MigrationInterface {
    name = 'ADDARTICLECOMMENTS1652037171277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "updatedAt"`);
    }

}
