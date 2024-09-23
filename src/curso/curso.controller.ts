import { Controller, Post, Get, Body, HttpStatus, Param, Delete,UseInterceptors, NotFoundException, HttpException, Put, Query } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { Curso } from './curso.entity';
import { UpdateCursoDto } from './dto/update-curso.dto';


@Controller('cursos')
export class CursoController {
  constructor(private readonly cursoService: CursoService) {}

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
      if (error instanceof HttpException) {
        throw error;
      }
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
  
  @Get('/mis_cursos_creados')
async getCursos(@Query('userEmail') userEmail?: string) {
  if (userEmail) {
    return await this.cursoService.getCursosByEmail(userEmail);
  } else {
    return await this.cursoService.getAllCursos();
  }
}

  @Get(':id')
  async getCursoById(@Param('id') id: string): Promise<Curso> {
    return this.cursoService.findById(id);
  }

  
  @Put(':id')
  async updateCurso(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto): Promise<Curso> {
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

  @Put(':id/archivo')
async updateArchivoNombre(
  @Param('id') id: string,
  @Body() updateArchivoDto: { [key: string]: string },
) {
  try {
    const curso = await this.cursoService.findById(id);
    const updatedCurso = await this.cursoService.update(id, {
      ...curso,
      ...updateArchivoDto,
    });

    return {
      status: 'success',
      data: updatedCurso,
    };
  } catch (error) {
    throw new HttpException(
      'Error al actualizar el nombre del archivo',
      HttpStatus.BAD_REQUEST,
    );
  }
}

@Put(':id/estado')
async updateCursoEstado(@Param('id') id: string, @Body('estado') estado: boolean) {
  try {
    const cursoActualizado = await this.cursoService.updateCursoEstado(id, estado);
    return {
      statusCode: HttpStatus.OK,
      message: `Curso ${estado ? 'activado' : 'desactivado'} correctamente`,
      data: cursoActualizado,
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new HttpException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Ocurrió un error al actualizar el estado del curso.',
    }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}


}
