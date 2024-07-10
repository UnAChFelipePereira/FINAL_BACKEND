import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Curso } from 'src/curso/curso.entity';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Curso' })
  enrolledCourses: Types.ObjectId[];

  @Prop({ type: 'oid', unique: true, name: 'reset_password_token', nullable: true })
  resetPasswordToken: string;

  @Prop()
  profilePic: string;
}

export const UserSchema = SchemaFactory.createForClass(User);


// // import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// // import mongoose, { HydratedDocument} from "mongoose";
// // import { Curso} from "src/curso/curso.entity";

// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import { Document, SchemaTypes } from 'mongoose';

// //export type UserDocument = HydratedDocument <User & Document>;
// export type UserDocument = HydratedDocument<User>;
// @Schema()

// export class User extends Document {


//     @Prop({required: true })
//     name: string;

//     @Prop({required: true })
//     lastname: string;

//     @Prop({ required: true, unique: true })
//     email: string;

//     @Prop({ required: true })
//     password: string;

//     @Prop({type:'oid', unique: true, name: 'reset_password_token', nullable: true})
//     resetPasswordToken: string;

//     @Prop()
//     profilePic: string;

//     @Prop([{ type: Schema.Types.ObjectId, ref: 'Curso' }])
//     enrolledCourses: Curso[];
// }

// export const UserSchema = SchemaFactory.createForClass(User);