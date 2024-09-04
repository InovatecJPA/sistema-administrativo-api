const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Aauth1725368779623 {
    name = 'Aauth1725368779623'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "grants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "note" text, "route_filter" character varying, "route" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_879062f2bb2575735d550ad1dd6" UNIQUE ("name"), CONSTRAINT "PK_a25f5f89eff8b3277f7969b7094" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile_grants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "grant_id" uuid, "profile_id" uuid, CONSTRAINT "PK_f7be36e68300b113abb0d231d62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4e9da7cade0e9edd393329bb326" UNIQUE ("name"), CONSTRAINT "UQ_eaa0caf6ff8df342f2b1a693af2" UNIQUE ("description"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "token" character varying NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6a8ca5961656d13c16c04079dd3" UNIQUE ("token"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8769073e38c365f315426554ca" ON "tokens" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "email" character varying NOT NULL, "birth_date" date, "phone" character varying, "is_active" boolean NOT NULL DEFAULT true, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profile_id" uuid NOT NULL, CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "profile_grants" ADD CONSTRAINT "FK_7e6cb2051d62c6e7660515a0839" FOREIGN KEY ("grant_id") REFERENCES "grants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile_grants" ADD CONSTRAINT "FK_cbfef597a5efdea1fbb1dcde8f3" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "profile_grants" DROP CONSTRAINT "FK_cbfef597a5efdea1fbb1dcde8f3"`);
        await queryRunner.query(`ALTER TABLE "profile_grants" DROP CONSTRAINT "FK_7e6cb2051d62c6e7660515a0839"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8769073e38c365f315426554ca"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "profile_grants"`);
        await queryRunner.query(`DROP TABLE "grants"`);
    }
}
