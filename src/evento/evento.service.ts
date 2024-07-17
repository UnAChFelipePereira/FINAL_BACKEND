import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Evento, EventoDocument } from './evento.entity';


@Injectable()
export class EventoService {
  constructor(@InjectModel(Evento.name) private eventoModel: Model<EventoDocument>) {}

  async crearEvento(datosEvento: any): Promise<Evento> {
    try {
      const nuevoEvento = await this.eventoModel.create(datosEvento);
      return nuevoEvento;
    } catch (error) {
      throw new BadRequestException('Error al crear el evento.');
    }
  }

  async actualizarPosicionCurso(cursoId: string, userId: string, nuevaPosicion: Date): Promise<Evento> {
    const cursoActualizado = await this.eventoModel.findByIdAndUpdate(
      cursoId,
      { posicion_calendario: nuevaPosicion },
      { new: true } // Devuelve el curso actualizado
    );
    return cursoActualizado;
  }
}