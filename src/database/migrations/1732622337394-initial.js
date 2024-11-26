const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1732622337394 {
    name = 'Initial1732622337394'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" character varying(6) NOT NULL, "note" text, "route" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a25f5f89eff8b3277f7969b7094" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_4e9da7cade0e9edd393329bb326" UNIQUE ("name"), CONSTRAINT "UQ_eaa0caf6ff8df342f2b1a693af2" UNIQUE ("description"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "token" character varying NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6a8ca5961656d13c16c04079dd3" UNIQUE ("token"), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8769073e38c365f315426554ca" ON "tokens" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "cpf" character varying NOT NULL, "email" character varying NOT NULL, "birth_date" date, "phone" character varying, "is_active" boolean NOT NULL DEFAULT true, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profile_id" uuid NOT NULL, "sector_id" uuid, CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sectors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_1a10b192342e5165948f4dccefc" UNIQUE ("name"), CONSTRAINT "PK_923fdda0dc12f59add7b3a1782f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_name" character varying NOT NULL, "mime_type" character varying NOT NULL, "data" bytea NOT NULL, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "sended_at" TIMESTAMP WITH TIME ZONE NOT NULL, "sender_id" uuid NOT NULL, "receiver_id" uuid NOT NULL, "receiver_sector_id" uuid, "chat_id" uuid NOT NULL, "attachment_id" uuid, CONSTRAINT "REL_d2e0ab24e536e1933067c8f37e" UNIQUE ("attachment_id"), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_users" ("chat_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_31efa25a44c55b3ceed47f98ba4" PRIMARY KEY ("chat_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f60265ed6da63600bad2c5ee8c" ON "chat_users" ("chat_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a5f2493e2c02490ceb527649e" ON "chat_users" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "grants_profiles" ("grant_id" uuid NOT NULL, "profile_id" uuid NOT NULL, CONSTRAINT "PK_9c40c0da06030e5bfb29107cb90" PRIMARY KEY ("grant_id", "profile_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_adda5fcced1f51e4873851b6e1" ON "grants_profiles" ("grant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_edcb1ada9c908b1b6c9eb9426d" ON "grants_profiles" ("profile_id") `);
        await queryRunner.query(`CREATE TABLE "grants_sectors" ("grant_id" uuid NOT NULL, "sector_id" uuid NOT NULL, CONSTRAINT "PK_8336c5e69351fcfd15eda89efb3" PRIMARY KEY ("grant_id", "sector_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d54648ad5c24824072d4dd3d10" ON "grants_sectors" ("grant_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_affdf2378019df7f3045300f00" ON "grants_sectors" ("sector_id") `);
        await queryRunner.query(`CREATE TABLE "projects_coordinators_users" ("projects_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_4fd877c27b17037184258170c0a" PRIMARY KEY ("projects_id", "users_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5315ca43d46e7feafdc40bc0a0" ON "projects_coordinators_users" ("projects_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5924dc50a7346e88318bf1447" ON "projects_coordinators_users" ("users_id") `);
        await queryRunner.query(`CREATE TABLE "projects_members_users" ("projects_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_2e3b997b794810d9bdf404ac108" PRIMARY KEY ("projects_id", "users_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6f67aec6642458070c77a5fa84" ON "projects_members_users" ("projects_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1360ca05efa304118ae73c519" ON "projects_members_users" ("users_id") `);
        await queryRunner.query(`CREATE TABLE "projects_sectors_sectors" ("projects_id" uuid NOT NULL, "sectors_id" uuid NOT NULL, CONSTRAINT "PK_3ab07368a769d270e615e8dd499" PRIMARY KEY ("projects_id", "sectors_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9cf1e11a138bf9bd88cc9fa55b" ON "projects_sectors_sectors" ("projects_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e99e1d652fdb8d58eb3118f3a8" ON "projects_sectors_sectors" ("sectors_id") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_98c79f3071f838004cb466e9bd4" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_b561864743d235f44e70addc1f5" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_ae9c507fb01e4ed0defdc9b4e69" FOREIGN KEY ("receiver_sector_id") REFERENCES "sectors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_d2e0ab24e536e1933067c8f37e6" FOREIGN KEY ("attachment_id") REFERENCES "attachment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grants_profiles" ADD CONSTRAINT "FK_adda5fcced1f51e4873851b6e15" FOREIGN KEY ("grant_id") REFERENCES "grants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "grants_profiles" ADD CONSTRAINT "FK_edcb1ada9c908b1b6c9eb9426d3" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "grants_sectors" ADD CONSTRAINT "FK_d54648ad5c24824072d4dd3d10a" FOREIGN KEY ("grant_id") REFERENCES "grants"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "grants_sectors" ADD CONSTRAINT "FK_affdf2378019df7f3045300f00a" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_coordinators_users" ADD CONSTRAINT "FK_5315ca43d46e7feafdc40bc0a0a" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_coordinators_users" ADD CONSTRAINT "FK_a5924dc50a7346e88318bf14471" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" ADD CONSTRAINT "FK_6f67aec6642458070c77a5fa84e" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" ADD CONSTRAINT "FK_c1360ca05efa304118ae73c5195" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_sectors_sectors" ADD CONSTRAINT "FK_9cf1e11a138bf9bd88cc9fa55b5" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_sectors_sectors" ADD CONSTRAINT "FK_e99e1d652fdb8d58eb3118f3a8c" FOREIGN KEY ("sectors_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "projects_sectors_sectors" DROP CONSTRAINT "FK_e99e1d652fdb8d58eb3118f3a8c"`);
        await queryRunner.query(`ALTER TABLE "projects_sectors_sectors" DROP CONSTRAINT "FK_9cf1e11a138bf9bd88cc9fa55b5"`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" DROP CONSTRAINT "FK_c1360ca05efa304118ae73c5195"`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" DROP CONSTRAINT "FK_6f67aec6642458070c77a5fa84e"`);
        await queryRunner.query(`ALTER TABLE "projects_coordinators_users" DROP CONSTRAINT "FK_a5924dc50a7346e88318bf14471"`);
        await queryRunner.query(`ALTER TABLE "projects_coordinators_users" DROP CONSTRAINT "FK_5315ca43d46e7feafdc40bc0a0a"`);
        await queryRunner.query(`ALTER TABLE "grants_sectors" DROP CONSTRAINT "FK_affdf2378019df7f3045300f00a"`);
        await queryRunner.query(`ALTER TABLE "grants_sectors" DROP CONSTRAINT "FK_d54648ad5c24824072d4dd3d10a"`);
        await queryRunner.query(`ALTER TABLE "grants_profiles" DROP CONSTRAINT "FK_edcb1ada9c908b1b6c9eb9426d3"`);
        await queryRunner.query(`ALTER TABLE "grants_profiles" DROP CONSTRAINT "FK_adda5fcced1f51e4873851b6e15"`);
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4"`);
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_d2e0ab24e536e1933067c8f37e6"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_ae9c507fb01e4ed0defdc9b4e69"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_b561864743d235f44e70addc1f5"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_98c79f3071f838004cb466e9bd4"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e99e1d652fdb8d58eb3118f3a8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9cf1e11a138bf9bd88cc9fa55b"`);
        await queryRunner.query(`DROP TABLE "projects_sectors_sectors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1360ca05efa304118ae73c519"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f67aec6642458070c77a5fa84"`);
        await queryRunner.query(`DROP TABLE "projects_members_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5924dc50a7346e88318bf1447"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5315ca43d46e7feafdc40bc0a0"`);
        await queryRunner.query(`DROP TABLE "projects_coordinators_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_affdf2378019df7f3045300f00"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d54648ad5c24824072d4dd3d10"`);
        await queryRunner.query(`DROP TABLE "grants_sectors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_edcb1ada9c908b1b6c9eb9426d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_adda5fcced1f51e4873851b6e1"`);
        await queryRunner.query(`DROP TABLE "grants_profiles"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a5f2493e2c02490ceb527649e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f60265ed6da63600bad2c5ee8c"`);
        await queryRunner.query(`DROP TABLE "chat_users"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "attachment"`);
        await queryRunner.query(`DROP TABLE "sectors"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8769073e38c365f315426554ca"`);
        await queryRunner.query(`DROP TABLE "tokens"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "grants"`);
        await queryRunner.query(`DROP TABLE "chats"`);
    }
}
