import { MigrationInterface, QueryRunner } from "typeorm"

export class User1674722390341 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "type" text;`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE public."user" DROP COLUMN "type";`,
        )
    }

}
