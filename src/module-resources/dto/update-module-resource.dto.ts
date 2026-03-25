import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleResourceDto } from './create-module-resource.dto';

export class UpdateModuleResourceDto extends PartialType(
  CreateModuleResourceDto,
) {}
