import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { QuestionType } from '../../common/enums/question-type.enum';

export class CreateQuestionDto {
  @IsNumberString()
  moduleId: string;

  @IsString()
  enunciado: string;

  @IsOptional()
  @IsEnum(QuestionType)
  tipoPregunta?: QuestionType;

  @Type(() => Number)
  @IsInt()
  orden: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  puntaje?: number;
}
