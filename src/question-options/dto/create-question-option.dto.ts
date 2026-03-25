import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateQuestionOptionDto {
  @IsNumberString()
  questionId: string;

  @IsString()
  texto: string;

  @IsOptional()
  @IsBoolean()
  esCorrecta?: boolean;

  @Type(() => Number)
  @IsInt()
  orden: number;
}
