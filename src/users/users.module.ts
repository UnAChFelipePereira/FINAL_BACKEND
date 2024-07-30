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
        { path: 'users/activate-account', method: RequestMethod.GET }
      )
      .forRoutes(UsersController);

    consumer
      .apply(RolesMiddleware)
      .forRoutes({ path: 'restricted/*', method: RequestMethod.ALL });
  }
}
