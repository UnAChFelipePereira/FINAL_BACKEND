import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from 'src/services/mail.service';
import { ResetToken, ResetTokenSchema } from './reset-token.schema';
import { CursoModule } from 'src/curso/curso.module';
import { CursoService } from 'src/curso/curso.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResetToken.name, schema: ResetTokenSchema }

    ]),
    JwtModule.register({}), 
    CursoModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    MailService, 
    CursoService
  ],
})
export class UsersModule {}



// import { Module } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';
// import { MongooseModule } from '@nestjs/mongoose';
// import { UserSchema, User } from './entities/user.entity';
// import { JwtService } from '@nestjs/jwt';
// import { MailService } from 'src/services/mail.service';
// import { ResetToken, ResetTokenSchema } from './reset-token.schema';
// import { CursoModule } from 'src/curso/curso.module';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: User.name, schema: UserSchema },
//       { name: ResetToken.name, schema: ResetTokenSchema },
//     ]),
//     // JwtModule.register({}),
//     CursoModule,
//   ],
//   controllers: [UsersController],
//   providers: [UsersService, JwtService, MailService],
//   exports: [UsersService],
// })
// export class UsersModule {}
