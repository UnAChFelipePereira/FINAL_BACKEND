import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from './services/mail.service';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { CursoModule } from './curso/curso.module';
import { EventoModule } from './evento/evento.module';
import { PrimeraFaseModule } from './primerafase/primerafase.module';
import { FilesController } from './files/file.controller';
import { FileModule } from './files/file.module';
import { AuthMiddleware } from './users/middleware.service';


@Module({
  imports: [UsersModule, CursoModule,EventoModule,PrimeraFaseModule,FileModule, MongooseModule.forRoot('mongodb://root:admin@localhost/dbtesis'),
    MulterModule.register({dest: './uploads', })
  ],
  controllers: [AppController, FilesController],
  providers: [AppService, MailService],
})
export class AppModule {}
