import { IsNotEmpty, IsString } from 'class-validator';

export class ActivateUserDto{

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    code: string;
}