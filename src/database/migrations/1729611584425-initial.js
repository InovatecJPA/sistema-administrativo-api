const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class Initial1729611584425 {
    name = 'Initial1729611584425'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_ae9c507fb01e4ed0defdc9b4e69"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "receiver_sector_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_ae9c507fb01e4ed0defdc9b4e69" FOREIGN KEY ("receiver_sector_id") REFERENCES "sectors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_ae9c507fb01e4ed0defdc9b4e69"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "receiver_sector_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_ae9c507fb01e4ed0defdc9b4e69" FOREIGN KEY ("receiver_sector_id") REFERENCES "sectors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
