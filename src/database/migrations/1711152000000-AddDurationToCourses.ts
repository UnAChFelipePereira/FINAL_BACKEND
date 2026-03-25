import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDurationToCourses1711152000000 implements MigrationInterface {
  name = 'AddDurationToCourses1711152000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`courses\`
      ADD COLUMN \`duracion\` int unsigned NOT NULL DEFAULT 0
      AFTER \`nombre\`
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`courses\`
      DROP COLUMN \`duracion\`
    `);
  }
}
