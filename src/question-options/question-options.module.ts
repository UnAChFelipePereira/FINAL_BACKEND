import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionOption } from './entities/question-option.entity';
import { QuestionOptionsController } from './question-options.controller';
import { QuestionOptionsService } from './question-options.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionOption])],
  controllers: [QuestionOptionsController],
  providers: [QuestionOptionsService],
  exports: [QuestionOptionsService],
})
export class QuestionOptionsModule {}
