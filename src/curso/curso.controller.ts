// import { Controller, Post, Get, Body, HttpStatus, Param } from '@nestjs/common';
// import { CursoService } from './curso.service';
// import { CreateCursoDto } from './dto/create-curso.dto';
// import { Curso } from './curso.entity';

// @Controller('cursos')
// export class CursoController {
//   constructor(private readonly cursoService: CursoService) {}

//   @Post('create')
//   async create(@Body() createCursoDto: CreateCursoDto) {
//     const response = await this.cursoService.create(createCursoDto);
//     return {
//       statusCode: HttpStatus.CREATED,
//       message: 'Curso creado exitosamente',
//       data: response.curso,
//     };
//   }

//   @Get('buscar-curso')
//   async findAll() {
//     const cursos = await this.cursoService.findAll();
//     return {
//       statusCode: HttpStatus.OK,
//       message: 'Cursos encontrados',
//       data: cursos,
//     };
//   }

//   // @Get(':id')
//   // async getCursoById(@Param('id') id: string) {
//   //   return this.cursoService.getCursoById(id);
//   // }

//   @Get(':id')
//   async findOne(@Param('id') id: string): Promise<Curso> {
//     return this.cursoService.findById(id);
//   }
// }

import { Controller, Post, Get, Body, HttpStatus, Param, Delete,UseInterceptors, NotFoundException, HttpException, Put } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { Curso } from './curso.entity';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Controller('cursos')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

  // @Post('create')
  // async create(@Body() createCursoDto: CreateCursoDto)
  //  {
  //   const response = await this.cursoService.crearcurso(createCursoDto);
  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: 'Curso creado exitosamente',
  //     data: response,
  //   };
  // }

  @Post('create')
  async create(@Body() createCursoDto: CreateCursoDto) {
    try {
      const response = await this.cursoService.crearcurso(createCursoDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Curso creado exitosamente',
        data: response,
      };
    } catch (error) {
      // Verifica si el error es una instancia de HttpException para manejarla adecuadamente
      if (error instanceof HttpException) {
        throw error;
      }
      // Si no, lanza una excepción de error interno del servidor
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Ocurrió un error inesperado al crear el curso.',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
  async getCursoById(@Param('id') id: string): Promise<Curso> {
    return this.cursoService.findById(id);
  }

  @Put(':id')
  async updateCurso(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    try {
      const updatedCurso = await this.cursoService.updateCurso(id, updateCursoDto);
      if (!updatedCurso) {
        throw new NotFoundException('Curso no encontrado');
      }
      return updatedCurso;
    } catch (error) {
      throw new NotFoundException('Error al actualizar el curso', error);
    }
  }

  @Delete(':id')
  async deleteCurso(@Param('id') id: string): Promise<{ message: string }> {
    const deleted = await this.cursoService.deleteCurso(id);
    if (!deleted) {
      throw new NotFoundException('Curso no encontrado');
    }
    return { message: 'Curso eliminado correctamente' };
  }

  

}
