import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateModuleResourceDto } from './dto/create-module-resource.dto';
import { UpdateModuleResourceDto } from './dto/update-module-resource.dto';
import { ModuleResourcesService } from './module-resources.service';

@Controller('module-resources')
export class ModuleResourcesController {
  constructor(
    private readonly moduleResourcesService: ModuleResourcesService,
  ) {}

  @Post()
  create(@Body() createModuleResourceDto: CreateModuleResourceDto) {
    return this.moduleResourcesService.create(createModuleResourceDto);
  }

  @Get()
  findAll() {
    return this.moduleResourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduleResourcesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuleResourceDto: UpdateModuleResourceDto,
  ) {
    return this.moduleResourcesService.update(id, updateModuleResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleResourcesService.remove(id);
  }
}
