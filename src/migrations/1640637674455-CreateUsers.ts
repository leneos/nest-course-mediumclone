import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUsers1640637674455 implements MigrationInterface {
    name = 'CreateUsers1640637674455'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "bio" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "image" SET DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "image" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "bio" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
