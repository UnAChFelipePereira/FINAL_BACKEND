import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CursoDocument = HydratedDocument<Curso>;

@Schema()
export class Curso {
  @Prop({ required: true, unique: true })
  nombre_curso: string;

  @Prop({ required: true })
  nombre_profesor: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: false })
  iconocurso: string;

  @Prop({ required: true })
  iconocursoNombre: string;

  @Prop({ required: true })
  archivo_pt1Nombre: string;

  @Prop({ required: true })
  descripcionpt1: string;

  @Prop({ required: true })
  pregunta1pt1: string;

  @Prop({ required: true })
  respuesta1p1pt1: string;

  @Prop({ required: true })
  respuesta2p1pt1: string;

  @Prop({ required: true })
  respuesta3p1pt1: string;

  @Prop({ required: true })
  respuesta4p1pt1: string;

  @Prop({ required: true })
  respuestacorrectap1pt1: string;

  @Prop({ required: true })
  pregunta2pt1: string;

  @Prop({ required: true })
  respuesta1p2pt1: string;

  @Prop({ required: true })
  respuesta2p2pt1: string;

  @Prop({ required: true })
  respuesta3p2pt1: string;

  @Prop({ required: true })
  respuesta4p2pt1: string;

  @Prop({ required: true })
  respuestacorrectap2pt1: string;

  @Prop({ required: true })
  pregunta3pt1: string;

  @Prop({ required: true })
  respuesta1p3pt1: string;

  @Prop({ required: true })
  respuesta2p3pt1: string;

  @Prop({ required: true })
  respuesta3p3pt1: string;

  @Prop({ required: true })
  respuesta4p3pt1: string;

  @Prop({ required: true })
  respuestacorrectap3pt1: string;

  @Prop({ required: true })
  pregunta4pt1: string;

  @Prop({ required: true })
  respuesta1p4pt1: string;

  @Prop({ required: true })
  respuesta2p4pt1: string;

  @Prop({ required: true })
  respuesta3p4pt1: string;

  @Prop({ required: true })
  respuesta4p4pt1: string;

  @Prop({ required: true })
  respuestacorrectap4pt1: string;

  @Prop({ required: true })
  pregunta5pt1: string;

  @Prop({ required: true })
  respuesta1p5pt1: string;

  @Prop({ required: true })
  respuesta2p5pt1: string;

  @Prop({ required: true })
  respuesta3p5pt1: string;

  @Prop({ required: true })
  respuesta4p5pt1: string;

  @Prop({ required: true })
  respuestacorrectap5pt1: string;

  @Prop({ required: true })
  archivo_pt2Nombre: string;

  @Prop({ required: true })
  descripcionpt2: string;

  @Prop({ required: true })
  pregunta1pt2: string;

  @Prop({ required: true })
  respuesta1p1pt2: string;

  @Prop({ required: true })
  respuesta2p1pt2: string;

  @Prop({ required: true })
  respuesta3p1pt2: string;

  @Prop({ required: true })
  respuesta4p1pt2: string;

  @Prop({ required: true })
  respuestacorrectap1pt2: string;

  @Prop({ required: true })
  pregunta2pt2: string;

  @Prop({ required: true })
  respuesta1p2pt2: string;

  @Prop({ required: true })
  respuesta2p2pt2: string;

  @Prop({ required: true })
  respuesta3p2pt2: string;

  @Prop({ required: true })
  respuesta4p2pt2: string;

  @Prop({ required: true })
  respuestacorrectap2pt2: string;

  @Prop({ required: true })
  pregunta3pt2: string;

  @Prop({ required: true })
  respuesta1p3pt2: string;

  @Prop({ required: true })
  respuesta2p3pt2: string;

  @Prop({ required: true })
  respuesta3p3pt2: string;

  @Prop({ required: true })
  respuesta4p3pt2: string;

  @Prop({ required: true })
  respuestacorrectap3pt2: string;

  @Prop({ required: true })
  pregunta4pt2: string;

  @Prop({ required: true })
  respuesta1p4pt2: string;

  @Prop({ required: true })
  respuesta2p4pt2: string;

  @Prop({ required: true })
  respuesta3p4pt2: string;

  @Prop({ required: true })
  respuesta4p4pt2: string;

  @Prop({ required: true })
  respuestacorrectap4pt2: string;

  @Prop({ required: true })
  pregunta5pt2: string;

  @Prop({ required: true })
  respuesta1p5pt2: string;

  @Prop({ required: true })
  respuesta2p5pt2: string;

  @Prop({ required: true })
  respuesta3p5pt2: string;

  @Prop({ required: true })
  respuesta4p5pt2: string;

  @Prop({ required: true })
  respuestacorrectap5pt2: string;

  @Prop({ required: true })
  archivo_pt3Nombre: string;

  @Prop({ required: true })
  descripcionpt3: string;

  @Prop({ required: true })
  pregunta1pt3: string;

  @Prop({ required: true })
  respuesta1p1pt3: string;

  @Prop({ required: true })
  respuesta2p1pt3: string;

  @Prop({ required: true })
  respuesta3p1pt3: string;

  @Prop({ required: true })
  respuesta4p1pt3: string;

  @Prop({ required: true })
  respuestacorrectap1pt3: string;

  @Prop({ required: true })
  pregunta2pt3: string;

  @Prop({ required: true })
  respuesta1p2pt3: string;

  @Prop({ required: true })
  respuesta2p2pt3: string;

  @Prop({ required: true })
  respuesta3p2pt3: string;

  @Prop({ required: true })
  respuesta4p2pt3: string;

  @Prop({ required: true })
  respuestacorrectap2pt3: string;

  @Prop({ required: true })
  pregunta3pt3: string;

  @Prop({ required: true })
  respuesta1p3pt3: string;

  @Prop({ required: true })
  respuesta2p3pt3: string;

  @Prop({ required: true })
  respuesta3p3pt3: string;

  @Prop({ required: true })
  respuesta4p3pt3: string;

  @Prop({ required: true })
  respuestacorrectap3pt3: string;

  @Prop({ required: true })
  pregunta4pt3: string;

  @Prop({ required: true })
  respuesta1p4pt3: string;

  @Prop({ required: true })
  respuesta2p4pt3: string;

  @Prop({ required: true })
  respuesta3p4pt3: string;

  @Prop({ required: true })
  respuesta4p4pt3: string;

  @Prop({ required: true })
  respuestacorrectap4pt3: string;

  @Prop({ required: true })
  pregunta5pt3: string;

  @Prop({ required: true })
  respuesta1p5pt3: string;

  @Prop({ required: true })
  respuesta2p5pt3: string;

  @Prop({ required: true })
  respuesta3p5pt3: string;

  @Prop({ required: true })
  respuesta4p5pt3: string;

  @Prop({ required: true })
  respuestacorrectap5pt3: string;

  @Prop({ required: true })
  archivo_pt4Nombre: string;


  @Prop({ required: true })
  descripcionpt4: string;

  @Prop({ required: true })
  pregunta1pt4: string;

  @Prop({ required: true })
  respuesta1p1pt4: string;

  @Prop({ required: true })
  respuesta2p1pt4: string;

  @Prop({ required: true })
  respuesta3p1pt4: string;

  @Prop({ required: true })
  respuesta4p1pt4: string;

  @Prop({ required: true })
  respuestacorrectap1pt4: string;

  @Prop({ required: true })
  pregunta2pt4: string;

  @Prop({ required: true })
  respuesta1p2pt4: string;

  @Prop({ required: true })
  respuesta2p2pt4: string;

  @Prop({ required: true })
  respuesta3p2pt4: string;

  @Prop({ required: true })
  respuesta4p2pt4: string;

  @Prop({ required: true })
  respuestacorrectap2pt4: string;

  @Prop({ required: true })
  pregunta3pt4: string;

  @Prop({ required: true })
  respuesta1p3pt4: string;

  @Prop({ required: true })
  respuesta2p3pt4: string;

  @Prop({ required: true })
  respuesta3p3pt4: string;

  @Prop({ required: true })
  respuesta4p3pt4: string;

  @Prop({ required: true })
  respuestacorrectap3pt4: string;

  @Prop({ required: true })
  pregunta4pt4: string;

  @Prop({ required: true })
  respuesta1p4pt4: string;

  @Prop({ required: true })
  respuesta2p4pt4: string;

  @Prop({ required: true })
  respuesta3p4pt4: string;

  @Prop({ required: true })
  respuesta4p4pt4: string;

  @Prop({ required: true })
  respuestacorrectap4pt4: string;

  @Prop({ required: true })
  pregunta5pt4: string;

  @Prop({ required: true })
  respuesta1p5pt4: string;

  @Prop({ required: true })
  respuesta2p5pt4: string;

  @Prop({ required: true })
  respuesta3p5pt4: string;

  @Prop({ required: true })
  respuesta4p5pt4: string;

  @Prop({ required: true })
  respuestacorrectap5pt4: string;

  @Prop({ required: true })
  archivo_pt5Nombre: string;

  @Prop({ required: true })
  descripcionpt5: string;

  @Prop({ required: true })
  pregunta1pt5: string;

  @Prop({ required: true })
  respuesta1p1pt5: string;

  @Prop({ required: true })
  respuesta2p1pt5: string;

  @Prop({ required: true })
  respuesta3p1pt5: string;

  @Prop({ required: true })
  respuesta4p1pt5: string;

  @Prop({ required: true })
  respuestacorrectap1pt5: string;

  @Prop({ required: true })
  pregunta2pt5: string;

  @Prop({ required: true })
  respuesta1p2pt5: string;

  @Prop({ required: true })
  respuesta2p2pt5: string;

  @Prop({ required: true })
  respuesta3p2pt5: string;

  @Prop({ required: true })
  respuesta4p2pt5: string;

  @Prop({ required: true })
  respuestacorrectap2pt5: string;

  @Prop({ required: true })
  pregunta3pt5: string;

  @Prop({ required: true })
  respuesta1p3pt5: string;

  @Prop({ required: true })
  respuesta2p3pt5: string;

  @Prop({ required: true })
  respuesta3p3pt5: string;

  @Prop({ required: true })
  respuesta4p3pt5: string;

  @Prop({ required: true })
  respuestacorrectap3pt5: string;

  @Prop({ required: true })
  pregunta4pt5: string;

  @Prop({ required: true })
  respuesta1p4pt5: string;

  @Prop({ required: true })
  respuesta2p4pt5: string;

  @Prop({ required: true })
  respuesta3p4pt5: string;

  @Prop({ required: true })
  respuesta4p4pt5: string;

  @Prop({ required: true })
  respuestacorrectap4pt5: string;

  @Prop({ required: true })
  pregunta5pt5: string;

  @Prop({ required: true })
  respuesta1p5pt5: string;

  @Prop({ required: true })
  respuesta2p5pt5: string;

  @Prop({ required: true })
  respuesta3p5pt5: string;

  @Prop({ required: true })
  respuesta4p5pt5: string;

  @Prop({ required: true })
  respuestacorrectap5pt5: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  enrolledUsers: Types.ObjectId[];
}

export const CursoSchema = SchemaFactory.createForClass(Curso);
