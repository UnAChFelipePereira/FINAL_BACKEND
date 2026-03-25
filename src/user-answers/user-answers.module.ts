import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAnswer } from './entities/user-answer.entity';
import { UserAnswersController } from './user-answers.controller';
import { UserAnswersService } from './user-answers.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAnswer])],
  controllers: [UserAnswersController],
  providers: [UserAnswersService],
  exports: [UserAnswersService],
})
export class UserAnswersModule {}
