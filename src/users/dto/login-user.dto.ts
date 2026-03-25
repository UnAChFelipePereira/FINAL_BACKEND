import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  password: string;
}
