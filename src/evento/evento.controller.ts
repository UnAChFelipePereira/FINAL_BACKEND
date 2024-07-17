// eventos.controller.ts

import { Controller, Put, Body, Param, NotFoundException, BadRequestException, Post } from '@nestjs/common';
import { EventoService } from './evento.service';

@Controller('eventos')
export class EventoController {
  constructor(private readonly eventosService: EventoService) {}

  @Post('/crear/:userId/:cursoId')
  async crearEvento(
    @Body() datosEvento: any 
  ): Promise<any> {
    try {
      if (!datosEvento) {
        throw new BadRequestException('Faltan parámetros obligatorios para crear el evento.');
      }

      const nuevoEvento = await this.eventosService.crearEvento(datosEvento);

      return nuevoEvento;
    } catch (error) {
      throw new BadRequestException('Error al crear el evento.');
    }
  }

  @Put(':userId/:cursoId/posicion')
  async actualizarPosicionCurso(
    @Param('userId') userId: string,
    @Param('cursoId') cursoId: string,
    @Body('nuevaPosicion') nuevaPosicion: any 
  ): Promise<any> {
    try {
      if (!userId || !cursoId || !nuevaPosicion) {
        throw new BadRequestException('Faltan parámetros obligatorios.');
      }

   
      if (typeof nuevaPosicion === 'string') {
        nuevaPosicion = new Date(nuevaPosicion);
      }

      const cursoActualizado = await this.eventosService.actualizarPosicionCurso(cursoId, userId, nuevaPosicion);
      if (!cursoActualizado) {
        throw new NotFoundException('No se encontró el curso o el usuario especificado.');
      }

      return cursoActualizado;
    } catch (error) {
      throw new BadRequestException('Error al actualizar la posición del curso.');
    }
  }
}
