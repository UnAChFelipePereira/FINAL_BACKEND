import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = this.coursesRepository.create(createCourseDto);
    const savedCourse = await this.coursesRepository.save(course);
    return this.findOne(savedCourse.id);
  }

  async findAll() {
    const courses = await this.coursesRepository.find({
      relations: {
        iconFile: true,
      },
    });

    return courses.map((course) => this.mapCourseResponse(course));
  }

  async findOne(id: string) {
    const course = await this.coursesRepository.findOne({
      where: { id },
      relations: {
        iconFile: true,
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    return this.mapCourseResponse(course);
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.coursesRepository.preload({
      id,
      ...updateCourseDto,
    });

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    await this.coursesRepository.save(course);
    return this.findOne(id);
  }

  async remove(id: string) {
    const course = await this.coursesRepository.findOneBy({ id });

    if (!course) {
      throw new NotFoundException(`Course with id ${id} not found`);
    }

    await this.coursesRepository.remove(course);
    return this.mapCourseResponse(course);
  }

  private mapCourseResponse(course: Course) {
    return {
      ...course,
      iconFilePath: course.iconFile?.path ?? null,
      iconUrl: course.iconFile?.path ?? null,
    };
  }
}
