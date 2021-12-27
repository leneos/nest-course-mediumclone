import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUsernameToUsers1640645426787 implements MigrationInterface {
    name = 'AddUsernameToUsers1640645426787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    }

}
