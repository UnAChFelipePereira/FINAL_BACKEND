import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly filesRepository: Repository<File>,
  ) {}

  create(createFileDto: CreateFileDto) {
    const file = this.filesRepository.create(createFileDto);
    return this.filesRepository.save(file);
  }

  findAll() {
    return this.filesRepository.find();
  }

  async findOne(id: string) {
    const file = await this.filesRepository.findOneBy({ id });

    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }

    return file;
  }

  async update(id: string, updateFileDto: UpdateFileDto) {
    const file = await this.filesRepository.preload({
      id,
      ...updateFileDto,
    });

    if (!file) {
      throw new NotFoundException(`File with id ${id} not found`);
    }

    return this.filesRepository.save(file);
  }

  async remove(id: string) {
    const file = await this.findOne(id);
    await this.filesRepository.remove(file);
    return file;
  }
}
