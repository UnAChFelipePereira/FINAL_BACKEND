import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
import { ActivateUserDto } from './dto/activate-user.dto';
import { ActivateToken } from './activate-user.schema';

type Tokens = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtSvc: JwtService,
    @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
    @InjectModel(Curso.name) private cursoModel: Model<CursoDocument>,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    try {
      const hashedPassword = await bcryp.hash(createUserDto.password, 10);
      const activationToken = uuidv4();
  
      let role = 'docente';
      if (createUserDto.email.endsWith('@alu.unach.cl')) {
        role = 'estudiante';
      } else if (createUserDto.email.endsWith('@unach.cl')) {
        role = 'docente';
      } else {
        throw new HttpException('Correo no permitido', HttpStatus.BAD_REQUEST);
      }
  
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
        token: activationToken,
        active: false,
        rol: role,
      });
  
      const user = await newUser.save();
  
      await this.mailService.sendActivationEmail(user.email, activationToken);
  
      const tokens = await this.generateTokens(user);
      return {
        ...tokens,
        user: this.removePassword(user),
        status: HttpStatus.CREATED,
        message: 'Cuenta creada. Por favor, verifica tu correo electrónico para activar tu cuenta.',
      };
    } catch (error) {
      throw new HttpException('Error al crear la cuenta', HttpStatus.UNAUTHORIZED);
    }
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }
 
  async Perfil(email: string) {
    const user = await this.userModel.findOne({ email });
    const payload = { sub: user._id, email: user.email, name: user.name };
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
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.UNAUTHORIZED,
        );
      }
  
      // Verificar si la cuenta está activada
      if (!user.active) {
        throw new HttpException(
          'Cuenta no activada. Por favor, verifica tu correo electrónico.',
          HttpStatus.UNAUTHORIZED,
        );
      }
  
      const isPasswordValid = await bcryp.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(
          'Contraseña incorrecta',
          HttpStatus.UNAUTHORIZED,
        );
      }
  
      const payload = {
        sub: user._id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
      };
      const { access_token, refresh_token } =
        await this.generateTokens(payload);
  
      return {
        access_token,
        refresh_token,
        user: this.removePassword(user),
        message: 'Inicio de sesión exitoso',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Revisa tus credenciales',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const user = this.jwtSvc.verify(refreshToken, {
        secret: 'jwt secret_refresh',
      });
      const payload = { sub: user._id, email: user.email, name: user.name };
      const { access_token, refresh_token } =
        await this.generateTokens(payload);
      return {
        access_token,
        refresh_token,
        status: 200,
        message: 'Refresh Token exitoso',
      };
    } catch (error) {
      throw new HttpException('Refresh_token fallido', HttpStatus.UNAUTHORIZED);
    }
  }
  private async generateTokens(user): Promise<Tokens> {
    const jwtPayload = { sub: user._id, email: user.email, name: user.name };
  
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtSvc.signAsync(jwtPayload, {
        secret: 'jwt_secret', // Asegúrate de usar la misma clave secreta aquí
        expiresIn: '1d',
      }),
      this.jwtSvc.signAsync(jwtPayload, {
        secret: 'jwt_secret_refresh', // Y aquí para el refresh token
        expiresIn: '2d',
      }),
    ]);
  
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private removePassword(user) {
    const { password, ...rest } = user.toObject();
    return rest;
  }

  async changePassword(email: string, oldPassword: string, newPassword: string) {
    try {
      // Verifica si el usuario existe
      const user = await this.userModel.findOne({ email });
      if (!user) {
        console.log('Usuario no encontrado.');
        throw new NotFoundException('Usuario no encontrado.');
      }

      // Verifica la contraseña actual
      const isPasswordValid = await bcryp.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        console.log('Contraseña invalida');
        throw new HttpException('Contraseña invalida', HttpStatus.UNAUTHORIZED);
      }

      // Hashea la nueva contraseña
      const newHashedPassword = await bcryp.hash(newPassword, 10);
      user.password = newHashedPassword;
      await user.save();

      console.log('¡Cambio de clave éxitoso!');
      return {
        status: 200,
        message: '¡Cambio de clave éxitoso!',
      };
    } catch (error) {
      console.error('Error cambiando la contraseña:', error);
      throw new HttpException('Error en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async changePassword(oid, oldPassword: string, newPassword: string) {
  //   const user = await this.userModel.findOne({ oid });

  //   if (!user) {
  //     throw new NotFoundException('Usuario no encontrado.');
  //   }
  //   const isPasswordValid = await bcryp.compare(oldPassword, user.password);
  //   if (!isPasswordValid) {
  //     throw new HttpException('Contraseña invalida', HttpStatus.UNAUTHORIZED);
  //   }

  //   const newHashedPassword = await bcryp.hash(newPassword, 10);
  //   user.password = newHashedPassword;
  //   await user.save();
  //   return {
  //     status: 200,
  //     message: '¡Cambio de clave éxitoso!',
  //   };
  // }

  // async changePassword(id: string, oldPassword: string, newPassword: string) {
  //   try {
  //     // Verifica si el usuario existe
  //     const user = await this.userModel.findById(id);
  //     if (!user) {
  //       console.log('Usuario no encontrado.');
  //       throw new NotFoundException('Usuario no encontrado.');
  //     }

  //     // Verifica la contraseña actual
  //     const isPasswordValid = await bcryp.compare(oldPassword, user.password);
  //     if (!isPasswordValid) {
  //       console.log('Contraseña invalida');
  //       throw new HttpException('Contraseña invalida', HttpStatus.UNAUTHORIZED);
  //     }

  //     // Hashea la nueva contraseña
  //     const newHashedPassword = await bcryp.hash(newPassword, 10);
  //     user.password = newHashedPassword;
  //     await user.save();

  //     console.log('¡Cambio de clave éxitoso!');
  //     return {
  //       status: 200,
  //       message: '¡Cambio de clave éxitoso!',
  //     };
  //   } catch (error) {
  //     console.error('Error cambiando la contraseña:', error);
  //     throw new HttpException('Error en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  async resetPassword(newPassword: string, resetToken: string) {
    const token = await this.ResetTokenModel.findOne({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Enlace Invalido');
    }

    const user = await this.userModel.findById(token.userId);
    if (!user) {
      throw new InternalServerErrorException();
    }

    user.password = await bcryp.hash(newPassword, 10);
    await user.save();
    return {
      status: 200,
      message: '¡Cambio de clave éxitoso!',
    };
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
        expiryDate,
      });
      this.mailService.sendPasswprdResetEmail(email, resetToken);
    }

    return {
      message: 'Se ha enviado un correo a la siguiente dirección: ' + email,
    };
  }

  async updateProfilePic(oid, profilePicPath: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(oid, { profilePic: profilePicPath });
  }

  async enrollUserInCurso(userId: string, cursoId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`Usuaro con id:  ${userId} no disponible`);
    }

    const curso = await this.cursoModel.findById(cursoId);
    if (!curso) {
      throw new NotFoundException(`Curso con id: ${cursoId} no disponible`);
    }

    user.cursosInscritos.push(cursoId);
    await user.save();
    return { message: 'Usuario inscrito correctamente', user };
  }

  async getEnrolledCursos(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate('cursosInscritos')
      .exec();
    return { cursosInscritos: user.cursosInscritos };
  }

  // Métodos adicionales para buscar usuario y curso
  // async findUserById(userId: string) {
  //   return this.userModel.findById(userId).exec();
  // }
  async findUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }
  
  async findCursoById(cursoId: string) {
    return this.cursoModel.findById(cursoId).exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }



  async activarUsuario(token: string): Promise<boolean> {
    console.log('Buscando usuario con el token:', token);
    const user = await this.userModel.findOne({ token }).exec();
    if (!user) {
      console.log('Token no encontrado o usuario no existente');
      return false;
    }

    if (user.active) {
      console.log('La cuenta ya está activada');
      return false;
    }

    user.active = true;
    user.token = null;

    try {
      await user.save();
      console.log('Estado del usuario actualizado a activo'); 
      return true;
    } catch (error) {
      console.error('Error al guardar el estado del usuario:', error);
      return false;
    }
  }


}
