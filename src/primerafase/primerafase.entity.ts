import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Bool } from 'aws-sdk/clients/clouddirectory';
import { Document, HydratedDocument } from 'mongoose';

export type PrimeraFaseDocument = HydratedDocument<PrimeraFase>;
@Schema()
export class  PrimeraFase {
  @Prop({ required: true })
  userId: string;

  @Prop({required: true})
  name: string;

  @Prop({required: true})
  lastname: string;

  @Prop({ required: true })
  cursoId: string;

  @Prop({ required: true })
  Nombre_Curso: string;

  @Prop({ required: true })
  pregunta1: boolean; 

  @Prop({ required: true })
  pregunta2: boolean; 

  @Prop({ required: true })
  pregunta3: boolean; 

  @Prop({ required: true })
  pregunta4: boolean; 

  @Prop({ required: true })
  pregunta5: boolean; 

  @Prop({ required: true })
  faseId: string; 
}

export const PrimeraFaseSchema = SchemaFactory.createForClass(PrimeraFase);
