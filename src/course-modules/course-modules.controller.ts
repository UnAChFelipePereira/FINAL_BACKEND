import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CourseModulesService } from './course-modules.service';

@Controller('course-modules')
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Post()
  create(@Body() createCourseModuleDto: CreateCourseModuleDto) {
    return this.courseModulesService.create(createCourseModuleDto);
  }

  @Get()
  findAll() {
    return this.courseModulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseModulesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseModuleDto: UpdateCourseModuleDto,
  ) {
    return this.courseModulesService.update(id, updateCourseModuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseModulesService.remove(id);
  }
}
