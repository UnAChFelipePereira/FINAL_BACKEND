import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModuleResourceDto } from './dto/create-module-resource.dto';
import { UpdateModuleResourceDto } from './dto/update-module-resource.dto';
import { ModuleResource } from './entities/module-resource.entity';

@Injectable()
export class ModuleResourcesService {
  constructor(
    @InjectRepository(ModuleResource)
    private readonly moduleResourcesRepository: Repository<ModuleResource>,
  ) {}

  create(createModuleResourceDto: CreateModuleResourceDto) {
    const moduleResource = this.moduleResourcesRepository.create(
      createModuleResourceDto,
    );
    return this.moduleResourcesRepository.save(moduleResource);
  }

  findAll() {
    return this.moduleResourcesRepository.find();
  }

  async findOne(id: string) {
    const moduleResource = await this.moduleResourcesRepository.findOneBy({
      id,
    });

    if (!moduleResource) {
      throw new NotFoundException(`ModuleResource with id ${id} not found`);
    }

    return moduleResource;
  }

  async update(id: string, updateModuleResourceDto: UpdateModuleResourceDto) {
    const moduleResource = await this.moduleResourcesRepository.preload({
      id,
      ...updateModuleResourceDto,
    });

    if (!moduleResource) {
      throw new NotFoundException(`ModuleResource with id ${id} not found`);
    }

    return this.moduleResourcesRepository.save(moduleResource);
  }

  async remove(id: string) {
    const moduleResource = await this.findOne(id);
    await this.moduleResourcesRepository.remove(moduleResource);
    return moduleResource;
  }
}
