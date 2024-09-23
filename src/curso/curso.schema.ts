import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema({ versionKey: false ,timestamps: true })
export class CursoSchema extends Document {
    @Prop({required: true})
    nombre_curso: string;

    @Prop({required: true})
    nombre_profesor: string;

    @Prop({required: true})
    userEmail: string;

    @Prop({required: true})
    descripcion: string;

    @Prop({required: true})
    tiempoestimado: number;

    @Prop({ default: true })
    estado: boolean;
}

export const CursoSchemaSchema = SchemaFactory.createForClass(CursoSchema);
