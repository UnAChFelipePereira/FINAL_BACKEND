import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateModuleAttemptDto } from './dto/create-module-attempt.dto';
import { UpdateModuleAttemptDto } from './dto/update-module-attempt.dto';
import { ModuleAttemptsService } from './module-attempts.service';

@Controller('module-attempts')
export class ModuleAttemptsController {
  constructor(private readonly moduleAttemptsService: ModuleAttemptsService) {}

  @Post()
  create(@Body() createModuleAttemptDto: CreateModuleAttemptDto) {
    return this.moduleAttemptsService.create(createModuleAttemptDto);
  }

  @Get()
  findAll() {
    return this.moduleAttemptsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleAttemptsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuleAttemptDto: UpdateModuleAttemptDto,
  ) {
    return this.moduleAttemptsService.update(id, updateModuleAttemptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleAttemptsService.remove(id);
  }
}
