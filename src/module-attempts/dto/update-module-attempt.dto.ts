import { PartialType } from '@nestjs/mapped-types';
import { CreateModuleAttemptDto } from './create-module-attempt.dto';

export class UpdateModuleAttemptDto extends PartialType(CreateModuleAttemptDto) {}
