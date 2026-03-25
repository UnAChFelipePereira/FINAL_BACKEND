import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountActivationToken } from './entities/account-activation-token.entity';
import { AccountActivationTokensController } from './account-activation-tokens.controller';
import { AccountActivationTokensService } from './account-activation-tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountActivationToken])],
  controllers: [AccountActivationTokensController],
  providers: [AccountActivationTokensService],
  exports: [AccountActivationTokensService],
})
export class AccountActivationTokensModule {}
