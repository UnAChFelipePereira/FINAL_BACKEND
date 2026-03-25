import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @MaxLength(200)
  nombre: string;

  @IsNumber()
  @Min(0)
  duracion: number;

  @IsOptional()
  @IsString()
  descripcionGeneral?: string;

  @IsOptional()
  @IsNumberString()
  iconFileId?: string;

  @IsOptional()
  @IsNumberString()
  creadoPorId?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
