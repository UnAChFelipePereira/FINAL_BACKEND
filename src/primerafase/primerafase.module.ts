import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrimeraFase, PrimeraFaseSchema } from './primerafase.entity';
import { PrimeraFaseController } from './primerafase.controller';
import { PrimeraFaseService } from './primerafase.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: PrimeraFase.name, schema: PrimeraFaseSchema }])],
  controllers: [PrimeraFaseController],
  providers: [PrimeraFaseService],
  exports: [MongooseModule]

})
export class PrimeraFaseModule {}
