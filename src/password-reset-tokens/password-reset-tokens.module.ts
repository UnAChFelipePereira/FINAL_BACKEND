import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { PasswordResetTokensController } from './password-reset-tokens.controller';
import { PasswordResetTokensService } from './password-reset-tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetToken])],
  controllers: [PasswordResetTokensController],
  providers: [PasswordResetTokensService],
  exports: [PasswordResetTokensService],
})
export class PasswordResetTokensModule {}
