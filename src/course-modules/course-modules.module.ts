import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModulesController } from './course-modules.controller';
import { CourseModulesService } from './course-modules.service';
import { CourseModule } from './entities/course-module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseModule])],
  controllers: [CourseModulesController],
  providers: [CourseModulesService],
  exports: [CourseModulesService],
})
export class CourseModulesModule {}
