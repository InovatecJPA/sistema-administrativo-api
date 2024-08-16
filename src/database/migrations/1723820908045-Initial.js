const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1723820908045 {
    name = 'Initial1723820908045'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "isAdmin" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_4e9da7cade0e9edd393329bb326" UNIQUE ("name"), CONSTRAINT "UQ_eaa0caf6ff8df342f2b1a693af2" UNIQUE ("description"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "email" character varying NOT NULL, "birthDate" date NOT NULL, "phone" character varying, "profile_id" uuid NOT NULL, "isAtivo" boolean NOT NULL DEFAULT true, "password_hash" character varying NOT NULL, "profiles_id" uuid, CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "grant" character varying NOT NULL, "note" text, "routeFilter" character varying, "route" character varying NOT NULL, CONSTRAINT "UQ_a0eb435513df23bce922be4f0c9" UNIQUE ("grant"), CONSTRAINT "PK_a25f5f89eff8b3277f7969b7094" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile_grants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying, CONSTRAINT "PK_f7be36e68300b113abb0d231d62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_e7a7f7db3fc96700d9239e43cda" FOREIGN KEY ("profiles_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_e7a7f7db3fc96700d9239e43cda"`);
        await queryRunner.query(`DROP TABLE "profile_grants"`);
        await queryRunner.query(`DROP TABLE "grants"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
    }
}
