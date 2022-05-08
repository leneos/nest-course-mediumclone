import {MigrationInterface, QueryRunner} from "typeorm";

export class asd1652043739967 implements MigrationInterface {
    name = 'asd1652043739967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "body" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ALTER COLUMN "body" SET DEFAULT ''`);
    }

}
