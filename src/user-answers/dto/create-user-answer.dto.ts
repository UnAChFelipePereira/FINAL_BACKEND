import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserAnswerDto {
  @IsNumberString()
  attemptId: string;

  @IsNumberString()
  questionId: string;

  @IsOptional()
  @IsNumberString()
  selectedOptionId?: string;

  @IsOptional()
  @IsString()
  answerText?: string;

  @IsOptional()
  @IsBoolean()
  esCorrecta?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  respondidoEn?: Date;
}
