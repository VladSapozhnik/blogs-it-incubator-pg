import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatus123AndDeleteStatus1773325540081 implements MigrationInterface {
    name = 'AddStatus123AndDeleteStatus1773325540081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_likes" RENAME COLUMN "status" TO "status123"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_likes" RENAME COLUMN "status123" TO "status"`);
    }

}
