import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';


@Controller('cursos')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post('crearcurso')
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursoService.create(createCursoDto);
  }

}
