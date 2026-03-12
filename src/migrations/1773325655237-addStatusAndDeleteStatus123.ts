import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusAndDeleteStatus1231773325655237 implements MigrationInterface {
    name = 'AddStatusAndDeleteStatus1231773325655237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_likes" RENAME COLUMN "status123" TO "status"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_likes" RENAME COLUMN "status" TO "status123"`);
    }

}
