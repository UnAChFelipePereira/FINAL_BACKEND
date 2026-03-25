import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountActivationTokensModule } from './account-activation-tokens/account-activation-tokens.module';
import { CourseEnrollmentsModule } from './course-enrollments/course-enrollments.module';
import { CourseModulesModule } from './course-modules/course-modules.module';
import { CoursesModule } from './courses/courses.module';
import { FilesModule } from './files/files.module';
import { ModuleAttemptsModule } from './module-attempts/module-attempts.module';
import { ModuleResourcesModule } from './module-resources/module-resources.module';
import { PasswordResetTokensModule } from './password-reset-tokens/password-reset-tokens.module';
import { QuestionOptionsModule } from './question-options/question-options.module';
import { QuestionsModule } from './questions/questions.module';
import { UserAnswersModule } from './user-answers/user-answers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USERNAME ?? 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME ?? 'aulavirtual',
      autoLoadEntities: true,
      synchronize: false,
    }),
    MulterModule.register({ dest: './uploads' }),
    UsersModule,
    FilesModule,
    CoursesModule,
    CourseModulesModule,
    ModuleResourcesModule,
    QuestionsModule,
    QuestionOptionsModule,
    CourseEnrollmentsModule,
    ModuleAttemptsModule,
    UserAnswersModule,
    AccountActivationTokensModule,
    PasswordResetTokensModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
