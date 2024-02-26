import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1708979271258 implements MigrationInterface {
    name = 'InitialMigration1708979271258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "resetPassword" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, CONSTRAINT "UQ_cf84637b743633ec1be62fdde6b" UNIQUE ("token"), CONSTRAINT "PK_98b22462b330d1a21bcbbb1c6eb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "resetPassword"`);
    }

}
