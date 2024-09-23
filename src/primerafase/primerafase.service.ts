import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrimeraFase, PrimeraFaseDocument } from './primerafase.entity';


@Injectable()
export class PrimeraFaseService {
  constructor(
    @InjectModel(PrimeraFase.name)
    private primerafaseModel: Model<PrimeraFaseDocument>,
  ) {}

  // Crear una nueva fase
  async crearPrimerafase(datosPrimeraFase: any): Promise<PrimeraFase> {
    try {
      const nuevaPrimeraFase = await this.primerafaseModel.create(datosPrimeraFase);
      return nuevaPrimeraFase;
    } catch (error) {
      throw new BadRequestException('Error al ingresar primera fase.');
    }
  }

  async checkIfCourseCompleted(cursoId: string, userId: string, faseId: string): Promise<boolean> {
    const primeraFase = await this.primerafaseModel.findOne({ cursoId, userId, faseId }).exec();
    // El curso se considera completado si todas las preguntas han sido respondidas
    return primeraFase && primeraFase.pregunta1 !== undefined && primeraFase.pregunta2 !== undefined && 
           primeraFase.pregunta3 !== undefined && primeraFase.pregunta4 !== undefined && 
           primeraFase.pregunta5 !== undefined;
  }
  // Buscar cursos realizados por usuario
  async findCursosByUserId(userId: string): Promise<PrimeraFase[]> {
    return this.primerafaseModel.find({ userId }).exec();
  }

  // Buscar todos los cursos
  async findAll(): Promise<PrimeraFase[]> {
    try {
      return await this.primerafaseModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener datos');
    }
  }

  async updateRespuestasYEndTime(
    respuestasFase: { userId: string, cursoId: string, faseId: string, pregunta1: boolean, pregunta2: boolean, pregunta3: boolean, pregunta4: boolean, pregunta5: boolean, endTime: Date }
  ): Promise<PrimeraFase> {
    const { userId, cursoId, faseId, endTime, ...respuestas } = respuestasFase;
  
    // Buscar el documento específico por userId, cursoId y faseId
    const fase = await this.primerafaseModel.findOne({ userId, cursoId, faseId }).exec();
  
    if (!fase || !fase.startTime) {
      throw new BadRequestException('No se pudo encontrar el curso o falta el startTime.');
    }
  
    // Calcular el tiempo total en segundos
    const totalTimeInSeconds = (new Date(endTime).getTime() - fase.startTime.getTime()) / 1000;
  
    // Formatear el tiempo total
    const formattedTotalTime = this.formatTotalTime(totalTimeInSeconds);
    console.log('Formatted total time:', formattedTotalTime); // Mostrar el tiempo formateado en la consola
  
    // Actualizar el documento con los nuevos datos
    fase.totalTime = formattedTotalTime; // Guardar el tiempo total formateado
    fase.endTime = endTime;
    fase.pregunta1 = respuestas.pregunta1;
    fase.pregunta2 = respuestas.pregunta2;
    fase.pregunta3 = respuestas.pregunta3;
    fase.pregunta4 = respuestas.pregunta4;
    fase.pregunta5 = respuestas.pregunta5;
  
    return fase.save(); // Guardar los cambios en la base de datos
  }

  // Método para formatear el tiempo total en formato DD:HH:MM:SS
  formatTotalTime(totalTimeInSeconds: number): string {
    const days = Math.floor(totalTimeInSeconds / (24 * 3600));
    totalTimeInSeconds %= 24 * 3600;
    const hours = Math.floor(totalTimeInSeconds / 3600);
    totalTimeInSeconds %= 3600;
    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = Math.floor(totalTimeInSeconds % 60);

    const formattedDays = String(days).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  async checkIfCourseStarted(cursoId: string, userId: string, faseId: string): Promise<PrimeraFase> {
    return this.primerafaseModel.findOne({ cursoId, userId, faseId }).exec();
  }

  async findFase(userId: string, cursoId: string, faseId: string): Promise<PrimeraFase> {
    return this.primerafaseModel.findOne({ userId, cursoId, faseId }).exec();
  }
}
// import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { PrimeraFase, PrimeraFaseDocument } from './primerafase.entity';

// @Injectable()
// export class PrimeraFaseService {
//   constructor(
//     @InjectModel(PrimeraFase.name)
//     private primerafaseModel: Model<PrimeraFaseDocument>,
//   ) {}

//   async crearPrimerafase(datosPrimeraFase: any): Promise<PrimeraFase> {
//     try {
//       const nuevaPrimeraFase = await this.primerafaseModel.create(datosPrimeraFase);
//       return nuevaPrimeraFase;
//     } catch (error) {
//       throw new BadRequestException('Error al ingresar primera fase.');
//     }
//   }

//   async checkIfCourseCompleted(
//     cursoId: string,
//     userId: string,
//     faseId: string,
//   ): Promise<boolean> {
//     const primeraFase = await this.primerafaseModel.findOne({ cursoId, userId, faseId }).exec();
//     return !!primeraFase;
//   }

//   async findCursosByUserId(userId: string): Promise<PrimeraFase[]> {
//     return this.primerafaseModel.find({ userId }).exec();
//   }

//   async findAll(): Promise<PrimeraFase[]> {
//     try {
//       return await this.primerafaseModel.find().exec();
//     } catch (error) {
//       throw new InternalServerErrorException('Error al obtener datos');
//     }
//   }

//   async findByCursoId(cursoId: string): Promise<PrimeraFase[]> {
//     return this.primerafaseModel.find({ cursoId }).exec();
//   }

//   // Actualizar las respuestas y el tiempo final
//   async updateRespuestasYEndTime(
//     respuestasFase: { userId: string, cursoId: string, pregunta1: boolean, pregunta2: boolean, pregunta3: boolean, pregunta4: boolean, pregunta5: boolean, endTime: Date }
//   ): Promise<PrimeraFase> {
//     const { userId, cursoId, ...respuestas } = respuestasFase;
//     return this.primerafaseModel.findOneAndUpdate(
//       { userId, cursoId },
//       { ...respuestas },
//       { new: true }
//     );
//   }



//   async endCourse(
//     respuestasFase: { userId: string, cursoId: string, endTime: Date }
//   ): Promise<PrimeraFase> {
//     const { userId, cursoId, endTime } = respuestasFase;

//     // Buscar la fase en la base de datos
//     const fase = await this.primerafaseModel.findOne({ userId, cursoId }).exec();

//     if (!fase || !fase.startTime) {
//       throw new BadRequestException('No se pudo encontrar el curso o falta el startTime.');
//     }

//     // Calcular la diferencia entre endTime y startTime en milisegundos
//     const totalTime = (new Date(endTime).getTime() - fase.startTime.getTime()) / 1000; // Convertir a segundos

//     // Agregar logs para depuración
//     console.log('Total time calculated:', totalTime); // Depuración
//     fase.totalTime = totalTime; // Almacenar el tiempo total en segundos
//     console.log('Saving fase with totalTime:', fase); // Depuración

//     // Actualizar el registro con endTime y totalTime
//     fase.endTime = endTime;

//     return fase.save(); // Guardar los cambios en la base de datos
//   }
// }


// import {
//   BadRequestException,
//   Injectable,
//   InternalServerErrorException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { PrimeraFase, PrimeraFaseDocument } from './primerafase.entity';
// import { response } from 'express';

// @Injectable()
// export class PrimeraFaseService {
//   constructor(
//     @InjectModel(PrimeraFase.name)
//     private primerafaseModel: Model<PrimeraFaseDocument>,

//   ) {}

//   async crearPrimerafase(datosPrimeraFase: any): Promise<PrimeraFase> {
//     try {
//       const nuevaPrimeraFase =
//         await this.primerafaseModel.create(datosPrimeraFase);
//       return nuevaPrimeraFase;
//     } catch (error) {
//       throw new BadRequestException('Error al ingresar primera fase.');
//     }
//   }

//   async checkIfCourseCompleted(
//     cursoId: string,
//     userId: string,
//     faseId: string,
//   ): Promise<boolean> {
//     const primeraFase = await this.primerafaseModel
//       .findOne({ cursoId, userId, faseId })
//       .exec();
//     return !!primeraFase;
//   }

//   async findCursosByUserId(userId: string): Promise<PrimeraFase[]> {
//     return this.primerafaseModel.find({ userId }).exec();
//   }

//   async findAll(): Promise<PrimeraFase[]> {
//     try {
//       return await this.primerafaseModel.find().exec();
//     } catch (error) {
//       throw new InternalServerErrorException('Error al obtener datos');
//     }
//   }

//   async findByCursoId(cursoId: string): Promise<PrimeraFase[]> {
//     return this.primerafaseModel.find({ cursoId }).exec();
//   }



//   //-------------------------

//   async updateStartTime(cursoId: string, userId: string, startTime: Date) {
//     return this.primerafaseModel.findOneAndUpdate(
//       { cursoId, userId },
//       { startTime },
//       { new: true }
//     );
//   }
  
//   async updateEndTime(cursoId: string, userId: string, endTime: Date) {
//     return this.primerafaseModel.findOneAndUpdate(
//       { cursoId, userId },
//       { endTime },
//       { new: true }
//     );
//   }
// }
