import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ResourceType } from '../../common/enums/resource-type.enum';

export class CreateModuleResourceDto {
  @IsNumberString()
  moduleId: string;

  @IsNumberString()
  fileId: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  titulo?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(ResourceType)
  tipoRecurso?: ResourceType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  orden?: number;
}
