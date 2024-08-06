import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from 'src/services/mail.service';
import { ResetToken, ResetTokenSchema } from './reset-token.schema';
import { CursoModule } from 'src/curso/curso.module';
import { CursoService } from 'src/curso/curso.service';
import { Curso, CursoSchema } from 'src/curso/curso.entity';
import { ActivateToken, ActivateTokenSchema } from './activate-user.schema';
import { RolesMiddleware } from './rol.service';
import { AuthMiddleware } from './middleware.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
      { name: Curso.name, schema: CursoSchema },
      { name: ActivateToken.name, schema: ActivateTokenSchema }
    ]),
    JwtModule.register({}),
    CursoModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, MailService, CursoService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/register', method: RequestMethod.POST },
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/activate-account', method: RequestMethod.GET },
        { path: 'users/:id/cursos-inscritos', method: RequestMethod.GET },
        { path: 'users/:userId/enroll/:cursoId', method: RequestMethod.POST },
        { path: 'cursos/buscar-curso', method: RequestMethod.GET },
        { path: 'users/upload-profile-picture', method: RequestMethod.POST },
        { path: 'users/change-password', method: RequestMethod.PUT },
        { path: 'users/refresh', method: RequestMethod.POST },
        { path: 'users/perfil', method: RequestMethod.POST },
        { path: 'users/forgot-password', method: RequestMethod.POST },
      )
      .forRoutes(UsersController);

    consumer
      .apply(RolesMiddleware)
      .exclude(
        { path: 'users/change-password', method: RequestMethod.PUT }
      )
      .forRoutes({ path: 'restricted/*', method: RequestMethod.ALL });
  }
}
