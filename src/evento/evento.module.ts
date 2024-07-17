import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Evento, EventoSchema } from './evento.entity';
import { EventoController } from './evento.controller';
import { EventoService } from './evento.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: Evento.name, schema: EventoSchema }])],
  controllers: [EventoController],
  providers: [EventoService],
  exports: [MongooseModule]

})
export class EventoModule {}
