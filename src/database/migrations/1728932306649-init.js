const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Init1728932306649 {
    name = 'Init1728932306649'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "chats" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat_users" ("chat_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_31efa25a44c55b3ceed47f98ba4" PRIMARY KEY ("chat_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f60265ed6da63600bad2c5ee8c" ON "chat_users" ("chat_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a5f2493e2c02490ceb527649e" ON "chat_users" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "projects_members_users" ("projects_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_2e3b997b794810d9bdf404ac108" PRIMARY KEY ("projects_id", "users_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6f67aec6642458070c77a5fa84" ON "projects_members_users" ("projects_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1360ca05efa304118ae73c519" ON "projects_members_users" ("users_id") `);
        await queryRunner.query(`ALTER TABLE "messages" ADD "chat_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chat_users" ADD CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" ADD CONSTRAINT "FK_6f67aec6642458070c77a5fa84e" FOREIGN KEY ("projects_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" ADD CONSTRAINT "FK_c1360ca05efa304118ae73c5195" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "projects_members_users" DROP CONSTRAINT "FK_c1360ca05efa304118ae73c5195"`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" DROP CONSTRAINT "FK_6f67aec6642458070c77a5fa84e"`);
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4"`);
        await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "chat_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1360ca05efa304118ae73c519"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6f67aec6642458070c77a5fa84"`);
        await queryRunner.query(`DROP TABLE "projects_members_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a5f2493e2c02490ceb527649e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f60265ed6da63600bad2c5ee8c"`);
        await queryRunner.query(`DROP TABLE "chat_users"`);
        await queryRunner.query(`DROP TABLE "chats"`);
    }
}
