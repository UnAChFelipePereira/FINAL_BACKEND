// eventos.controller.ts

import { Controller, Get, Body, Param, BadRequestException, Post, Req, Query, HttpStatus } from '@nestjs/common';
import { PrimeraFaseService } from './primerafase.service'; 
import { PrimeraFase } from './primerafase.entity';

@Controller('primerafase')
export class PrimeraFaseController {
  constructor(private readonly primerafaseService: PrimeraFaseService) {}

  @Post('/crear/:userId/:cursoId')
  async crearPrimeraFase(
    @Body() datosPrimeraFase: any 
  ): Promise<any> {
    try {
      if (!datosPrimeraFase) {
        throw new BadRequestException('Faltan datos.');
      }

      const nuevoEvento = await this.primerafaseService.crearPrimerafase(datosPrimeraFase);

      return nuevoEvento;
    } catch (error) {
      throw new BadRequestException('Error al crear primerafase.');
    }
  }

  @Get(':cursoId/:userId/:faseId/completed')
  async checkIfCourseCompleted(
    @Param('cursoId') cursoId: string,
    @Param('userId') userId: string,
    @Param('faseId') faseId: string,
  ): Promise<boolean> {
    return this.primerafaseService.checkIfCourseCompleted(cursoId, userId, faseId);
  }

  @Get(':userId')
  async getCursosRealizados(@Param('userId') userId: string): Promise<PrimeraFase[]> {
    return this.primerafaseService.findCursosByUserId(userId);
  }

  @Get('')
  async findAll() {
    const primerafase = await this.primerafaseService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Datos encontrados',
      data: primerafase,
    };
  }

}
