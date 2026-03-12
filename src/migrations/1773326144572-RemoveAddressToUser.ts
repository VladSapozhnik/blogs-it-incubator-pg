import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAddressToUser1773326144572 implements MigrationInterface {
    name = 'RemoveAddressToUser1773326144572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "address"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "address" character varying NOT NULL`);
    }

}
