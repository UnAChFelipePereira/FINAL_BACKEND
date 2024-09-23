import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Query,
  BadRequestException,
  Redirect,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { last } from 'rxjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CursoService } from 'src/curso/curso.service';
import { User, UserDocument } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ActivateUserDto } from './dto/activate-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cursoService: CursoService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    return this.usersService.loginUser(email, password);
  }

  @Post('refresh')
  refreshToken(@Req() request: Request) {
    const [type, token] = request.headers['authorization']?.split(' ') || [];
    return this.usersService.refreshToken(token);
  }

  @Post('perfil')
  async getperfil(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    return this.usersService.Perfil(email);
  }

  @Get('activate-account')
  // @Redirect('http://localhost:4200/login', 302)
  async activateAccount(@Query('token') token: string) {
    console.log('Activando cuenta con token:', token); 
    const result = await this.usersService.activarUsuario(token);
    if (!result) {
      console.log('Token inválido o cuenta ya activada'); 
      throw new BadRequestException('Token inválido o cuenta ya activada');
    }

    // return { url: 'http://localhost:4200/login' };
  }

  @Put('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    try {
      return await this.usersService.changePassword(
        changePasswordDto.email,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword,
      );
    } catch (error) {
      console.error('Error en el controlador al cambiar la contraseña:', error);
      throw new HttpException('Error en el servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // @Put('change-password')
  // async changePassword(
  //   @Body() changePasswordDto: ChangePasswordDto,
  //   @Req() req,
  // ) {
  //   return this.usersService.changePassword(
  //     req.oid,
  //     changePasswordDto.oldPassword,
  //     changePasswordDto.newPassword,
  //   );
  // }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }

  @Post('upload-profile-picture')
  @UseInterceptors(FileInterceptor('profilePic'))
  @UseGuards(JwtService)
  async uploadProfilePic(@UploadedFile() file, @Req() req) {
    return this.usersService.updateProfilePic(req.oid, req.profilePic);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post(':userId/enroll/:cursoId')
  async enrollCourse(
    @Param('userId') userId: string,
    @Param('cursoId') cursoId: string,
  ) {
    try {
      const user = await this.usersService.enrollUserInCurso(userId, cursoId);
      return { message: 'Usuario inscrito.', user };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id/cursos-inscritos')
  async getEnrolledCursos(@Param('id') id: string) {
    return this.usersService.getEnrolledCursos(id);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }
}
