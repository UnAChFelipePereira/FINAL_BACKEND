// eventos.controller.ts

import { Controller, Get, Body, Param, BadRequestException, Post, HttpStatus } from '@nestjs/common';
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
    @Param('email') email: string,
    @Param('pregunta1') pregunta1: boolean,
    @Param('pregunta2') pregunta2: boolean,
    @Param('pregunta3') pregunta3: boolean,
    @Param('pregunta4') pregunta4: boolean,
    @Param('pregunta5') pregunta5: boolean,
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

  // Nueva ruta para iniciar el curso y guardar la información
  @Post('start-course')
  async startCourse(
    @Body() datosPrimeraFase: { userId: string, name: string, lastname: string, email:string, cursoId: string, Nombre_Curso: string, faseId: string, startTime: Date }
  ) {
    try {
      return this.primerafaseService.crearPrimerafase(datosPrimeraFase);
    } catch (error) {
      throw new BadRequestException('Error al iniciar el curso.');
    }
  }

  // @Post('end-course')
  // async endCourse(
  //   @Body() respuestasFase: { userId: string, cursoId: string, faseId: string, pregunta1: boolean, pregunta2: boolean, pregunta3: boolean, pregunta4: boolean, pregunta5: boolean, endTime: Date }
  // ) {
  //   try {
  //     return this.primerafaseService.updateRespuestasYEndTime(respuestasFase);
  //   } catch (error) {
  //     throw new BadRequestException('Error al finalizar el curso.');
  //   }
  // }


  @Post('end-course')
  async endCourse(
    @Body() respuestasFase: { userId: string, cursoId: string, faseId: string, pregunta1: boolean, pregunta2: boolean, pregunta3: boolean, pregunta4: boolean, pregunta5: boolean, endTime: Date }
  ) {
    try {
      const fase = await this.primerafaseService.findFase(respuestasFase.userId, respuestasFase.cursoId, respuestasFase.faseId);
      
      if (fase && fase.pregunta1 !== undefined && fase.pregunta2 !== undefined && fase.pregunta3 !== undefined && fase.pregunta4 !== undefined && fase.pregunta5 !== undefined) {
        throw new BadRequestException('Este curso ya ha sido completado.');
      }
      
      return this.primerafaseService.updateRespuestasYEndTime(respuestasFase);
    } catch (error) {
      console.error("Error en endCourse:", error);
      throw new BadRequestException('Error al finalizar el curso.');
    }
  }

  @Get('check-started/:cursoId/:userId/:faseId')
async checkIfCourseStarted(
  @Param('cursoId') cursoId: string,
  @Param('userId') userId: string,
  @Param('faseId') faseId: string,
): Promise<{ started: boolean, startTime?: Date }> {
  const fase = await this.primerafaseService.checkIfCourseStarted(cursoId, userId, faseId);
  if (fase && fase.startTime) {
    return { started: true, startTime: fase.startTime };
  }
  return { started: false };
}

}

// import { Controller, Get, Body, Param, BadRequestException, Post, HttpStatus } from '@nestjs/common';
// import { PrimeraFaseService } from './primerafase.service'; 
// import { PrimeraFase } from './primerafase.entity';

// @Controller('primerafase')
// export class PrimeraFaseController {
//   constructor(private readonly primerafaseService: PrimeraFaseService) {}

//   @Post('/crear/:userId/:cursoId')
//   async crearPrimeraFase(
//     @Body() datosPrimeraFase: any 
//   ): Promise<any> {
//     try {
//       if (!datosPrimeraFase) {
//         throw new BadRequestException('Faltan datos.');
//       }

//       const nuevoEvento = await this.primerafaseService.crearPrimerafase(datosPrimeraFase);

//       return nuevoEvento;
//     } catch (error) {
//       throw new BadRequestException('Error al crear primerafase.');
//     }
//   }

//   @Get(':cursoId/:userId/:faseId/completed')
//   async checkIfCourseCompleted(
//     @Param('cursoId') cursoId: string,
//     @Param('userId') userId: string,
//     @Param('faseId') faseId: string,
//   ): Promise<boolean> {
//     return this.primerafaseService.checkIfCourseCompleted(cursoId, userId, faseId);
//   }

//   @Get(':userId')
//   async getCursosRealizados(@Param('userId') userId: string): Promise<PrimeraFase[]> {
//     return this.primerafaseService.findCursosByUserId(userId);
//   }

//   @Get('')
//   async findAll() {
//     const primerafase = await this.primerafaseService.findAll();
//     return {
//       statusCode: HttpStatus.OK,
//       message: 'Datos encontrados',
//       data: primerafase,
//     };
//   }

//   // Nueva ruta para iniciar el curso y guardar la información
//   @Post('start-course')
//   async startCourse(
//     @Body() datosPrimeraFase: { userId: string, name: string, lastname: string, cursoId: string, Nombre_Curso: string, faseId: string, startTime: Date }
//   ) {
//     try {
//       return this.primerafaseService.crearPrimerafase(datosPrimeraFase);
//     } catch (error) {
//       throw new BadRequestException('Error al iniciar el curso.');
//     }
//   }

//   @Post('end-course')
//   async endCourse(
//     @Body() respuestasFase: { userId: string, cursoId: string, pregunta1: boolean, pregunta2: boolean, pregunta3: boolean, pregunta4: boolean, pregunta5: boolean, endTime: Date }
//   ) {
//     try {
//       return this.primerafaseService.updateRespuestasYEndTime(respuestasFase);
//     } catch (error) {
//       throw new BadRequestException('Error al finalizar el curso.');
//     }
//   }
// }


// // eventos.controller.ts

// import { Controller, Get, Body, Param, BadRequestException, Post, Req, Query, HttpStatus } from '@nestjs/common';
// import { PrimeraFaseService } from './primerafase.service'; 
// import { PrimeraFase } from './primerafase.entity';

// @Controller('   ')
// export class PrimeraFaseController {
//   constructor(private readonly primerafaseService: PrimeraFaseService) {}

//   @Post('/crear/:userId/:cursoId')
//   async crearPrimeraFase(
//     @Body() datosPrimeraFase: any 
//   ): Promise<any> {
//     try {
//       if (!datosPrimeraFase) {
//         throw new BadRequestException('Faltan datos.');
//       }

//       const nuevoEvento = await this.primerafaseService.crearPrimerafase(datosPrimeraFase);

//       return nuevoEvento;
//     } catch (error) {
//       throw new BadRequestException('Error al crear primerafase.');
//     }
//   }

//   @Get(':cursoId/:userId/:faseId/completed')
//   async checkIfCourseCompleted(
//     @Param('cursoId') cursoId: string,
//     @Param('userId') userId: string,
//     @Param('faseId') faseId: string,
//   ): Promise<boolean> {
//     return this.primerafaseService.checkIfCourseCompleted(cursoId, userId, faseId);
//   }

//   @Get(':userId')
//   async getCursosRealizados(@Param('userId') userId: string): Promise<PrimeraFase[]> {
//     return this.primerafaseService.findCursosByUserId(userId);
//   }

//   @Get('')
//   async findAll() {
//     const primerafase = await this.primerafaseService.findAll();
//     return {
//       statusCode: HttpStatus.OK,
//       message: 'Datos encontrados',
//       data: primerafase,
//     };
//   }
// //---------------------------------------
//   @Post('start-course')
// async startCourse(@Body() { cursoId, userId }: { cursoId: string, userId: string }) {
//   const startTime = new Date();
//   return this.primerafaseService.updateStartTime(cursoId, userId, startTime);
// }

// @Post('end-course')
// async endCourse(@Body() { cursoId, userId }: { cursoId: string, userId: string }) {
//   const endTime = new Date();
//   return this.primerafaseService.updateEndTime(cursoId, userId, endTime);
// }

// }
