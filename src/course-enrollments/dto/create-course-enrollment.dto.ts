import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsNumberString, IsOptional } from 'class-validator';
import { EnrollmentStatus } from '../../common/enums/enrollment-status.enum';

export class CreateCourseEnrollmentDto {
  @IsNumberString()
  userId: string;

  @IsNumberString()
  courseId: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaInscripcion?: Date;

  @IsOptional()
  @IsEnum(EnrollmentStatus)
  estado?: EnrollmentStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  progreso?: number;
}
