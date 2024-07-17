import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrimeraFaseDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @IsString()
  @IsNotEmpty()
  readonly cursoId: string;

  @IsString()
  @IsNotEmpty()
  readonly Nombre_Curso: string;

  @IsString()
  @IsNotEmpty()
  readonly pregunta1: boolean; 

  @IsString()
  @IsNotEmpty()
  readonly pregunta2: boolean; 

  @IsString()
  @IsNotEmpty()
  readonly pregunta3: boolean; 

  @IsString()
  @IsNotEmpty()
  readonly pregunta4: boolean; 

  @IsString()
  @IsNotEmpty()
  readonly pregunta5: boolean; 

  @IsString()
  @IsNotEmpty()
  readonly faseId: string; 
}