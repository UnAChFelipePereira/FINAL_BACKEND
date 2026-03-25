import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleResource } from './entities/module-resource.entity';
import { ModuleResourcesController } from './module-resources.controller';
import { ModuleResourcesService } from './module-resources.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleResource])],
  controllers: [ModuleResourcesController],
  providers: [ModuleResourcesService],
  exports: [ModuleResourcesService],
})
export class ModuleResourcesModule {}
