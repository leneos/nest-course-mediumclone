import {MigrationInterface, QueryRunner} from "typeorm";

export class deletename1645819275076 implements MigrationInterface {
    name = 'deletename1645819275076'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
    }

}
