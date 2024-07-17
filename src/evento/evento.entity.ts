import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
export type EventoDocument = HydratedDocument<Evento>;
@Schema()
export class Evento {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  cursoId: string;

  @Prop({ required: false })
  nuevaPosicion: any[]; 


}

export const EventoSchema = SchemaFactory.createForClass(Evento);
