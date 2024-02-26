import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1708982431841 implements MigrationInterface {
    name = 'InitialMigration1708982431841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetPassword" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "resetPassword" ADD CONSTRAINT "UQ_aa4d2bbc4c2750ffeb377d4207c" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "resetPassword" ADD CONSTRAINT "FK_aa4d2bbc4c2750ffeb377d4207c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "resetPassword" DROP CONSTRAINT "FK_aa4d2bbc4c2750ffeb377d4207c"`);
        await queryRunner.query(`ALTER TABLE "resetPassword" DROP CONSTRAINT "UQ_aa4d2bbc4c2750ffeb377d4207c"`);
        await queryRunner.query(`ALTER TABLE "resetPassword" DROP COLUMN "userId"`);
    }

}
