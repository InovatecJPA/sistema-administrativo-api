const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Undefined1724244331833 {
    name = 'Undefined1724244331833'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e7a7f7db3fc96700d9239e43cda"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profiles_id"`);
        await queryRunner.query(`ALTER TABLE "profile_grants" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "profile_grants" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "grants" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "birthDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "birthDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "grants" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "profile_grants" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "profile_grants" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profiles_id" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e7a7f7db3fc96700d9239e43cda" FOREIGN KEY ("profiles_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }
}
