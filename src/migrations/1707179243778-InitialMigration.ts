import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1707179243778 implements MigrationInterface {
    name = 'InitialMigration1707179243778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "contact" DROP CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989"`);
        await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "contact" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "contact" ADD CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
