import { IsNumberString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @MaxLength(255)
  originalName: string;

  @IsString()
  @MaxLength(255)
  storedName: string;

  @IsString()
  @MaxLength(500)
  path: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  mimeType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  extension?: string;

  @IsOptional()
  @IsNumberString()
  sizeBytes?: string;
}
