import { IsBoolean, IsInt, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseModuleDto {
  @IsNumberString()
  courseId: string;

  @IsString()
  @MaxLength(200)
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @Type(() => Number)
  @IsInt()
  orden: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
