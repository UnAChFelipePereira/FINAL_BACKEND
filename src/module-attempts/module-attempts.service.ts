import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModuleAttemptDto } from './dto/create-module-attempt.dto';
import { UpdateModuleAttemptDto } from './dto/update-module-attempt.dto';
import { ModuleAttempt } from './entities/module-attempt.entity';

@Injectable()
export class ModuleAttemptsService {
  constructor(
    @InjectRepository(ModuleAttempt)
    private readonly moduleAttemptsRepository: Repository<ModuleAttempt>,
  ) {}

  create(createModuleAttemptDto: CreateModuleAttemptDto) {
    const moduleAttempt = this.moduleAttemptsRepository.create({
      ...createModuleAttemptDto,
      puntajeObtenido:
        createModuleAttemptDto.puntajeObtenido !== undefined
          ? createModuleAttemptDto.puntajeObtenido.toFixed(2)
          : undefined,
      puntajeTotal:
        createModuleAttemptDto.puntajeTotal !== undefined
          ? createModuleAttemptDto.puntajeTotal.toFixed(2)
          : undefined,
    });

    return this.moduleAttemptsRepository.save(moduleAttempt);
  }

  findAll() {
    return this.moduleAttemptsRepository.find();
  }

  async findOne(id: string) {
    const moduleAttempt = await this.moduleAttemptsRepository.findOneBy({ id });

    if (!moduleAttempt) {
      throw new NotFoundException(`ModuleAttempt with id ${id} not found`);
    }

    return moduleAttempt;
  }

  async update(id: string, updateModuleAttemptDto: UpdateModuleAttemptDto) {
    const moduleAttempt = await this.moduleAttemptsRepository.preload({
      id,
      ...updateModuleAttemptDto,
      puntajeObtenido:
        updateModuleAttemptDto.puntajeObtenido !== undefined
          ? updateModuleAttemptDto.puntajeObtenido.toFixed(2)
          : undefined,
      puntajeTotal:
        updateModuleAttemptDto.puntajeTotal !== undefined
          ? updateModuleAttemptDto.puntajeTotal.toFixed(2)
          : undefined,
    });

    if (!moduleAttempt) {
      throw new NotFoundException(`ModuleAttempt with id ${id} not found`);
    }

    return this.moduleAttemptsRepository.save(moduleAttempt);
  }

  async remove(id: string) {
    const moduleAttempt = await this.findOne(id);
    await this.moduleAttemptsRepository.remove(moduleAttempt);
    return moduleAttempt;
  }
}
