import {MigrationInterface, QueryRunner} from "typeorm";

export class users1640564735683 implements MigrationInterface {
    name = 'users1640564735683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "token" character varying NOT NULL, "username" character varying NOT NULL, "bio" character varying NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
