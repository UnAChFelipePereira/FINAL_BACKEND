import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  name: string;
  lastname: string;
  email: string;
  password: string;
  rol: string;
  active: boolean;
  token: string;
  cursosInscritos: string[];
  resetPasswordToken?: string;
  createdOn?: string;
  profilePic?: string;
}
