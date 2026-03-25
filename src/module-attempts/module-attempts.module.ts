import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleAttempt } from './entities/module-attempt.entity';
import { ModuleAttemptsController } from './module-attempts.controller';
import { ModuleAttemptsService } from './module-attempts.service';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleAttempt])],
  controllers: [ModuleAttemptsController],
  providers: [ModuleAttemptsService],
  exports: [ModuleAttemptsService],
})
export class ModuleAttemptsModule {}
