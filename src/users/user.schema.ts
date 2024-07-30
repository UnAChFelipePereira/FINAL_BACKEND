import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Schema as MongooseSchema } from "mongoose";

@Schema({ versionKey: false ,timestamps: true })
export class UserSchema extends Document {
    @Prop({required: true, type: mongoose.Types.ObjectId})
    userId: string;

    @Prop({required: true})
    name: string;

    @Prop({required: true})
    lastname: string;

    @Prop({required: true})
    email: string;

    @Prop({required: true})
    rol: string;

    @Prop({required: true, type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Curso' }]})
    cursosinscritos: mongoose.Types.ObjectId[];

}

export const UserSchemaSchema = SchemaFactory.createForClass(UserSchema);
