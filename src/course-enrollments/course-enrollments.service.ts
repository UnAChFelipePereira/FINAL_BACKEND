import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCourseEnrollmentDto } from './dto/create-course-enrollment.dto';
import { UpdateCourseEnrollmentDto } from './dto/update-course-enrollment.dto';
import { CourseEnrollment } from './entities/course-enrollment.entity';

@Injectable()
export class CourseEnrollmentsService {
  constructor(
    @InjectRepository(CourseEnrollment)
    private readonly courseEnrollmentsRepository: Repository<CourseEnrollment>,
  ) {}

  create(createCourseEnrollmentDto: CreateCourseEnrollmentDto) {
    const courseEnrollment = this.courseEnrollmentsRepository.create({
      ...createCourseEnrollmentDto,
      progreso:
        createCourseEnrollmentDto.progreso !== undefined
          ? createCourseEnrollmentDto.progreso.toFixed(2)
          : undefined,
    });

    return this.courseEnrollmentsRepository.save(courseEnrollment);
  }

  findAll() {
    return this.courseEnrollmentsRepository.find();
  }

  async findOne(id: string) {
    const courseEnrollment = await this.courseEnrollmentsRepository.findOneBy({
      id,
    });

    if (!courseEnrollment) {
      throw new NotFoundException(`CourseEnrollment with id ${id} not found`);
    }

    return courseEnrollment;
  }

  async update(
    id: string,
    updateCourseEnrollmentDto: UpdateCourseEnrollmentDto,
  ) {
    const courseEnrollment = await this.courseEnrollmentsRepository.preload({
      id,
      ...updateCourseEnrollmentDto,
      progreso:
        updateCourseEnrollmentDto.progreso !== undefined
          ? updateCourseEnrollmentDto.progreso.toFixed(2)
          : undefined,
    });

    if (!courseEnrollment) {
      throw new NotFoundException(`CourseEnrollment with id ${id} not found`);
    }

    return this.courseEnrollmentsRepository.save(courseEnrollment);
  }

  async remove(id: string) {
    const courseEnrollment = await this.findOne(id);
    await this.courseEnrollmentsRepository.remove(courseEnrollment);
    return courseEnrollment;
  }
}
