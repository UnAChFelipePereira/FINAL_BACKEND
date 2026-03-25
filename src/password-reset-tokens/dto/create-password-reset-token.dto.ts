import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePasswordResetTokenDto {
  @IsNumberString()
  userId: string;

  @IsString()
  @MaxLength(255)
  token: string;

  @Type(() => Date)
  @IsDate()
  expiresAt: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  usedAt?: Date;
}
