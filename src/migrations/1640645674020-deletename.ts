import {MigrationInterface, QueryRunner} from "typeorm";

export class deletename1640645674020 implements MigrationInterface {
    name = 'deletename1640645674020'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "token"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "token" character varying NOT NULL`);
    }

}
