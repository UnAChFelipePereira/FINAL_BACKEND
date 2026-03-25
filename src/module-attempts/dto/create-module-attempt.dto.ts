import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateModuleAttemptDto {
  @IsNumberString()
  enrollmentId: string;

  @IsNumberString()
  moduleId: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaInicio?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaTermino?: Date;

  @IsOptional()
  @IsBoolean()
  aprobado?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  puntajeObtenido?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  puntajeTotal?: number;
}
