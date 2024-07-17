import { Injectable, HttpException, HttpStatus, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import * as bcryp from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResetToken } from './reset-token.schema';
import { MailService } from 'src/services/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { CursoDocument } from 'src/curso/curso.entity';
import { Curso } from 'src/curso/curso.entity';
import jwt from 'jsonwebtoken';
import { CursoService } from 'src/curso/curso.service';
import { PrimeraFase, PrimeraFaseDocument } from 'src/primerafase/primerafase.entity';



type Tokens ={
  access_token: string,
  refresh_token: string
};

@Injectable()
export class UsersService {

  // constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtSvc: JwtService,
  //             @InjectModel(Curso.name) private cursoModel: Model<CursoDocument>,
  //             // @InjectModel(Curso.name) private cursoController: Model<CursoController>,
  //             // @InjectModel(Curso.name) private cursoService: Model<CursoService>,
  //             // private cursoService: CursoService,
  //             @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
  //             private mailService: MailService,  
  //           ){}


  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, private jwtSvc: JwtService,
    @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
    @InjectModel(Curso.name) private cursoModel: Model<CursoDocument>,
   // Asegúrate de inyectar CursoModel correctamente
    // private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  //async create(createUserDto: CreateUserDto):Promise<User> {
    async create(createUserDto: CreateUserDto) {
    try {
      const hasherPassword = await bcryp.hash(createUserDto.password,10);

      const newUser = new this.userModel({
        ... createUserDto,
        password: hasherPassword
      });

      const user = await newUser.save();
      const { access_token, refresh_token } = await this.generateTokens(user);
      return{
        access_token,
        refresh_token,
        user: this.removePassword(user),
        status:HttpStatus.CREATED,
        message:'Cuenta creada'

      }

    } catch (error) {
      throw new HttpException('Error al crear', HttpStatus.UNAUTHORIZED)
    }
  }



  async Perfil(email: string) {

    const user = await this.userModel.findOne({ email});
    const payload = {sub: user._id, email: user.email, name: user.name}
       const { access_token, refresh_token } = await this.generateTokens(payload);
       return {
        access_token,
        refresh_token,
        user: this.removePassword(user),
        message: 'DATOS CON ÉXITO',
       };  
  }


  async loginUser(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException('Usuario no encontrado', HttpStatus.UNAUTHORIZED);
      }
  
      const isPasswordValid = await bcryp.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Contraseña incorrecta', HttpStatus.UNAUTHORIZED);
      }
  
      const payload = { sub: user._id, email: user.email, name: user.name, lastname: user.lastname };
      const { access_token, refresh_token } = await this.generateTokens(payload);
  
      return {
        access_token,
        refresh_token,
        user: this.removePassword(user),
        message: 'Inicio de sesión exitoso',
      };
    } catch (error) {
      throw new HttpException('Revisa tus credenciales', HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshToken(refreshToken: string){
try {
  const user = this.jwtSvc.verify(refreshToken, {secret: 'jwt secret_refresh'})
  const payload = { sub: user._id, email: user.email, name: user.name}
  const { access_token, refresh_token } = await this.generateTokens(payload);
  return{
    access_token,
    refresh_token,
    status:200,
    message:'Refresh Token exitoso'
  }
} catch (error) {
  throw new HttpException('Refresh_token fallido', HttpStatus.UNAUTHORIZED)
}


  }


  private async generateTokens(user): Promise <Tokens>{
    const jwtPayload = { sub: user._id, email: user.email, name: user.name}

    const[accessToken,refreshToken] = await Promise.all([

      this.jwtSvc.signAsync(jwtPayload, {secret: 'jwt secret', expiresIn: '1d'}),
      this.jwtSvc.signAsync(jwtPayload, {secret: 'jwt secret_refresh',expiresIn: '2d'})
  ])

  return {

    access_token: accessToken,
    refresh_token: refreshToken
  }
}


private removePassword(user){
  const {password, ... rest} = user.toObject();
  return rest;
}

async changePassword(oid, oldPassword: string, newPassword: string){

  const user = await this.userModel.findOne({ oid });
  
  if(!user){
    throw new NotFoundException ('Usuario no encontrado.');
  }
  const isPasswordValid = await bcryp.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new HttpException('Contraseña invalida', HttpStatus.UNAUTHORIZED)   
  }

const newHashedPassword = await bcryp.hash(newPassword,10);
user.password = newHashedPassword;
await user.save();
return{
  status:200,
  message:'¡Cambio de clave éxitoso!'
}
}


async resetPassword(newPassword: string, resetToken: string){

  const token = await this.ResetTokenModel.findOne({
    token: resetToken,
    expiryDate: {$gte: new Date(),
     },
  });

  if (!token){
    throw new UnauthorizedException('Enlace Invalido')
  }

  const user = await this.userModel.findById(token.userId);
  if(!user){
    throw new InternalServerErrorException();
  }

  user.password = await bcryp.hash(newPassword,10);
  await user.save();
  return{
    status:200,
    message:'¡Cambio de clave éxitoso!'
  }
}





async forgotPassword(email: string) {
  const user = await this.userModel.findOne({ email });
  if (user) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const resetToken = uuidv4(20);

    await this.ResetTokenModel.create({
      token: resetToken,
      userId: user._id,
      expiryDate
    });
    this.mailService.sendPasswprdResetEmail(email, resetToken);
  }

  return { message: 'Se ha enviado un correo a la siguiente dirección: ' + email };
}


async updateProfilePic(oid, profilePicPath: string): Promise<void> {
  await this.userModel.findByIdAndUpdate(oid, { profilePic: profilePicPath });
}


// async enrollUserInCurso(userId: string, cursoId: string): Promise<User> {
//   const user = await this.userModel.findById(userId);
//   if (!user) {
//     throw new NotFoundException('User not found');
//   }

//   const curso = await this.cursoService.findById(cursoId);
//   if (!curso) {
//     throw new NotFoundException('Curso not found');
//   }

//   // Añadir el ID del curso al array de cursos inscritos del usuario
//   user.enrolledCourses.push(curso._id); // Añade solo el ID del curso
//   await user.save();

//   return user;
// }

async enrollUserInCurso(userId: string, cursoId: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException(`User with ID ${userId} not found`);
  }

  const curso = await this.cursoModel.findById(cursoId);
  if (!curso) {
    throw new NotFoundException(`Curso with ID ${cursoId} not found`);
  }

  user.cursosInscritos.push(cursoId);
  await user.save();
  return { message: 'Usuario inscrito correctamente', user };
}

async getEnrolledCursos(userId: string) {
  const user = await this.userModel.findById(userId).populate('cursosInscritos').exec();
  return { cursosInscritos: user.cursosInscritos };
}

// Métodos adicionales para buscar usuario y curso
async findUserById(userId: string) {
  return this.userModel.findById(userId).exec();
}

async findCursoById(cursoId: string) {
  return this.cursoModel.findById(cursoId).exec();
}

async findOne(id: string): Promise<User> {
  return this.userModel.findById(id).exec();
}

}
