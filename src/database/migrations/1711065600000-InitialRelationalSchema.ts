import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialRelationalSchema1711065600000
  implements MigrationInterface
{
  name = 'InitialRelationalSchema1711065600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`email\` varchar(150) NOT NULL,
        \`nombre\` varchar(100) NOT NULL,
        \`apellido\` varchar(100) NOT NULL,
        \`password_hash\` varchar(255) NOT NULL,
        \`rol\` enum('admin','docente','estudiante') NOT NULL DEFAULT 'estudiante',
        \`activo\` tinyint(1) NOT NULL DEFAULT 0,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY \`uq_users_email\` (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`files\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`original_name\` varchar(255) NOT NULL,
        \`stored_name\` varchar(255) NOT NULL,
        \`path\` varchar(500) NOT NULL,
        \`mime_type\` varchar(120) NULL,
        \`extension\` varchar(20) NULL,
        \`size_bytes\` bigint unsigned NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`courses\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`nombre\` varchar(200) NOT NULL,
        \`descripcion_general\` text NULL,
        \`icon_file_id\` bigint unsigned NULL,
        \`creado_por\` bigint unsigned NULL,
        \`activo\` tinyint(1) NOT NULL DEFAULT 1,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_courses_icon_file_id\` FOREIGN KEY (\`icon_file_id\`) REFERENCES \`files\`(\`id\`),
        CONSTRAINT \`fk_courses_creado_por\` FOREIGN KEY (\`creado_por\`) REFERENCES \`users\`(\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`course_modules\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`course_id\` bigint unsigned NOT NULL,
        \`titulo\` varchar(200) NOT NULL,
        \`descripcion\` text NULL,
        \`orden\` int NOT NULL,
        \`activo\` tinyint(1) NOT NULL DEFAULT 1,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_course_modules_course_id\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`module_resources\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`module_id\` bigint unsigned NOT NULL,
        \`file_id\` bigint unsigned NOT NULL,
        \`titulo\` varchar(200) NULL,
        \`descripcion\` text NULL,
        \`tipo_recurso\` enum('imagen','documento','excel','pbix','pdf','video','otro') NOT NULL DEFAULT 'otro',
        \`orden\` int NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_module_resources_module_id\` FOREIGN KEY (\`module_id\`) REFERENCES \`course_modules\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_module_resources_file_id\` FOREIGN KEY (\`file_id\`) REFERENCES \`files\`(\`id\`)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`questions\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`module_id\` bigint unsigned NOT NULL,
        \`enunciado\` text NOT NULL,
        \`tipo_pregunta\` enum('multiple_choice','true_false','open_text') NOT NULL DEFAULT 'multiple_choice',
        \`orden\` int NOT NULL,
        \`puntaje\` decimal(10,2) NOT NULL DEFAULT 1.00,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_questions_module_id\` FOREIGN KEY (\`module_id\`) REFERENCES \`course_modules\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`question_options\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`question_id\` bigint unsigned NOT NULL,
        \`texto\` text NOT NULL,
        \`es_correcta\` tinyint(1) NOT NULL DEFAULT 0,
        \`orden\` int NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_question_options_question_id\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`course_enrollments\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`user_id\` bigint unsigned NOT NULL,
        \`course_id\` bigint unsigned NOT NULL,
        \`fecha_inscripcion\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`estado\` enum('inscrito','en_progreso','completado','cancelado') NOT NULL DEFAULT 'inscrito',
        \`progreso\` decimal(5,2) NOT NULL DEFAULT 0.00,
        UNIQUE KEY \`uq_course_enrollments_user_course\` (\`user_id\`, \`course_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_course_enrollments_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_course_enrollments_course_id\` FOREIGN KEY (\`course_id\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`module_attempts\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`enrollment_id\` bigint unsigned NOT NULL,
        \`module_id\` bigint unsigned NOT NULL,
        \`fecha_inicio\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`fecha_termino\` timestamp NULL,
        \`aprobado\` tinyint(1) NOT NULL DEFAULT 0,
        \`puntaje_obtenido\` decimal(10,2) NOT NULL DEFAULT 0.00,
        \`puntaje_total\` decimal(10,2) NOT NULL DEFAULT 0.00,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_module_attempts_enrollment_id\` FOREIGN KEY (\`enrollment_id\`) REFERENCES \`course_enrollments\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_module_attempts_module_id\` FOREIGN KEY (\`module_id\`) REFERENCES \`course_modules\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`user_answers\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`attempt_id\` bigint unsigned NOT NULL,
        \`question_id\` bigint unsigned NOT NULL,
        \`selected_option_id\` bigint unsigned NULL,
        \`answer_text\` text NULL,
        \`es_correcta\` tinyint(1) NOT NULL DEFAULT 0,
        \`respondido_en\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_user_answers_attempt_id\` FOREIGN KEY (\`attempt_id\`) REFERENCES \`module_attempts\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_user_answers_question_id\` FOREIGN KEY (\`question_id\`) REFERENCES \`questions\`(\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_user_answers_selected_option_id\` FOREIGN KEY (\`selected_option_id\`) REFERENCES \`question_options\`(\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`account_activation_tokens\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`user_id\` bigint unsigned NOT NULL,
        \`token\` varchar(255) NOT NULL,
        \`expires_at\` datetime NOT NULL,
        \`used_at\` datetime NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY \`uq_account_activation_tokens_token\` (\`token\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_account_activation_tokens_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`password_reset_tokens\` (
        \`id\` bigint unsigned NOT NULL AUTO_INCREMENT,
        \`user_id\` bigint unsigned NOT NULL,
        \`token\` varchar(255) NOT NULL,
        \`expires_at\` datetime NOT NULL,
        \`used_at\` datetime NULL,
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY \`uq_password_reset_tokens_token\` (\`token\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`fk_password_reset_tokens_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `password_reset_tokens`');
    await queryRunner.query('DROP TABLE `account_activation_tokens`');
    await queryRunner.query('DROP TABLE `user_answers`');
    await queryRunner.query('DROP TABLE `module_attempts`');
    await queryRunner.query('DROP TABLE `course_enrollments`');
    await queryRunner.query('DROP TABLE `question_options`');
    await queryRunner.query('DROP TABLE `questions`');
    await queryRunner.query('DROP TABLE `module_resources`');
    await queryRunner.query('DROP TABLE `course_modules`');
    await queryRunner.query('DROP TABLE `courses`');
    await queryRunner.query('DROP TABLE `files`');
    await queryRunner.query('DROP TABLE `users`');
  }
}
