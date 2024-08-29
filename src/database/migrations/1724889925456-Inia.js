const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Inia1724889925456 {
    name = 'Inia1724889925456'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "profile_grants" ADD "grant_id" uuid`);
        await queryRunner.query(`ALTER TABLE "profile_grants" ADD "profile_id" uuid`);
        await queryRunner.query(`ALTER TABLE "profile_grants" ADD CONSTRAINT "FK_7e6cb2051d62c6e7660515a0839" FOREIGN KEY ("grant_id") REFERENCES "grants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_grants" ADD CONSTRAINT "FK_cbfef597a5efdea1fbb1dcde8f3" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "profile_grants" DROP CONSTRAINT "FK_cbfef597a5efdea1fbb1dcde8f3"`);
        await queryRunner.query(`ALTER TABLE "profile_grants" DROP CONSTRAINT "FK_7e6cb2051d62c6e7660515a0839"`);
        await queryRunner.query(`ALTER TABLE "profile_grants" DROP COLUMN "profile_id"`);
        await queryRunner.query(`ALTER TABLE "profile_grants" DROP COLUMN "grant_id"`);
    }
}
