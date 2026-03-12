import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressToUser1773325899261 implements MigrationInterface {
    name = 'AddAddressToUser1773325899261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
    }

}
