import { Controller, Post, Get, Body, HttpStatus, Param } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { Curso } from './curso.entity';

@Controller('cursos')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  @Post('create')
  async create(@Body() createCursoDto: CreateCursoDto) {
    const response = await this.cursoService.create(createCursoDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Curso creado exitosamente',
      data: response.curso,
    };
  }

  @Get('buscar-curso')
  async findAll() {
    const cursos = await this.cursoService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Cursos encontrados',
      data: cursos,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Curso> {
    return this.cursoService.findById(id);
  }
}