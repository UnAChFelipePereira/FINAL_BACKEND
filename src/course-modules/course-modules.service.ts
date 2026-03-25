import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseModule } from './entities/course-module.entity';

@Injectable()
export class CourseModulesService {
  constructor(
    @InjectRepository(CourseModule)
    private readonly courseModulesRepository: Repository<CourseModule>,
  ) {}

  create(createCourseModuleDto: CreateCourseModuleDto) {
    const courseModule = this.courseModulesRepository.create(
      createCourseModuleDto,
    );
    return this.courseModulesRepository.save(courseModule);
  }

  findAll() {
    return this.courseModulesRepository.find();
  }

  async findOne(id: string) {
    const courseModule = await this.courseModulesRepository.findOneBy({ id });

    if (!courseModule) {
      throw new NotFoundException(`CourseModule with id ${id} not found`);
    }

    return courseModule;
  }

  async update(id: string, updateCourseModuleDto: UpdateCourseModuleDto) {
    const courseModule = await this.courseModulesRepository.preload({
      id,
      ...updateCourseModuleDto,
    });

    if (!courseModule) {
      throw new NotFoundException(`CourseModule with id ${id} not found`);
    }

    return this.courseModulesRepository.save(courseModule);
  }

  async remove(id: string) {
    const courseModule = await this.findOne(id);
    await this.courseModulesRepository.remove(courseModule);
    return courseModule;
  }
}
