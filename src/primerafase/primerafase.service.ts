import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrimeraFase, PrimeraFaseDocument } from './primerafase.entity';
import { response } from 'express';

@Injectable()
export class PrimeraFaseService {
  constructor(
    @InjectModel(PrimeraFase.name)
    private primerafaseModel: Model<PrimeraFaseDocument>,

  ) {}

  async crearPrimerafase(datosPrimeraFase: any): Promise<PrimeraFase> {
    try {
      const nuevaPrimeraFase =
        await this.primerafaseModel.create(datosPrimeraFase);
      return nuevaPrimeraFase;
    } catch (error) {
      throw new BadRequestException('Error al ingresar primera fase.');
    }
  }

  async checkIfCourseCompleted(
    cursoId: string,
    userId: string,
    faseId: string,
  ): Promise<boolean> {
    const primeraFase = await this.primerafaseModel
      .findOne({ cursoId, userId, faseId })
      .exec();
    return !!primeraFase;
  }

  async findCursosByUserId(userId: string): Promise<PrimeraFase[]> {
    return this.primerafaseModel.find({ userId }).exec();
  }

  async findAll(): Promise<PrimeraFase[]> {
    try {
      return await this.primerafaseModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener datos');
    }
  }

  async findByCursoId(cursoId: string): Promise<PrimeraFase[]> {
    return this.primerafaseModel.find({ cursoId }).exec();
  }
}
