import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CursoSchema, Curso } from './curso.entity';




// @Module({
  
//   imports:[MongooseModule.forFeature([{name: User.name, schema: UserSchema},{name: ResetToken.name, schema: ResetTokenSchema}])],
//   controllers: [UsersController],
//   providers: [UsersService,JwtService,MailService],
// })
// export class UsersModule {}

@Module({
  imports: [MongooseModule.forFeature([{ name: Curso.name, schema: CursoSchema }])],
  controllers: [CursoController],
  providers: [CursoService],
})
export class CursoModule {}