import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1708984023100 implements MigrationInterface {
    name = 'InitialMigration1708984023100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "UQ_f9f62556c7092913f2a06975052"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "UQ_eff09bb429f175523787f46003b"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "UQ_eff09bb429f175523787f46003b" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "UQ_f9f62556c7092913f2a06975052" UNIQUE ("phone")`);
    }

}
