import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, Types } from "mongoose";

@Schema({ versionKey: false})
export class ActivateToken extends Document {

    @Prop({ required: true })
    token: string;
  
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;


}

export const ActivateTokenSchema = SchemaFactory.createForClass(ActivateToken);