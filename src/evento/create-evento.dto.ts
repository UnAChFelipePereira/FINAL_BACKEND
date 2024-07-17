import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly cursoId: string;

  @IsString()
  @IsNotEmpty()
  readonly nuevaPosicion: any;
}