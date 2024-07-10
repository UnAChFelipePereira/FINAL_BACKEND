import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CursoSchema, Curso } from './curso.entity';


@Module({
  imports: [MongooseModule.forFeature([{ name: Curso.name, schema: CursoSchema }])],
  controllers: [CursoController],
  providers: [CursoService],
  exports: [MongooseModule]

})
export class CursoModule {}
