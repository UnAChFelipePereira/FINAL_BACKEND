import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Curso } from 'src/curso/curso.entity';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {

  _id:string;
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({required:true})
  rol: string;

  @Prop({ type: Boolean, default: false })
  active: boolean;

  @Prop({unique: true})
  token: string;

  @Prop()
  cursosInscritos: string[];
  
  @Prop({
    type: 'oid',
    unique: true,
    name: 'reset_password_token',
    nullable: true,
  })
  resetPasswordToken: string;

  @Prop({name: 'created_on'})
  createdOn: string;

  @Prop()
  profilePic: string;

}

export const UserSchema = SchemaFactory.createForClass(User);
