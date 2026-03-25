import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEnrollment } from './entities/course-enrollment.entity';
import { CourseEnrollmentsController } from './course-enrollments.controller';
import { CourseEnrollmentsService } from './course-enrollments.service';

@Module({
  imports: [TypeOrmModule.forFeature([CourseEnrollment])],
  controllers: [CourseEnrollmentsController],
  providers: [CourseEnrollmentsService],
  exports: [CourseEnrollmentsService],
})
export class CourseEnrollmentsModule {}
