import { IsString } from "class-validator";

export class ChangePasswordDto {

  @IsString()
  email: string;

  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;


}