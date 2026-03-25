import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateAccountActivationTokenDto } from './dto/create-account-activation-token.dto';
import { UpdateAccountActivationTokenDto } from './dto/update-account-activation-token.dto';
import { AccountActivationTokensService } from './account-activation-tokens.service';

@Controller('account-activation-tokens')
export class AccountActivationTokensController {
  constructor(
    private readonly accountActivationTokensService: AccountActivationTokensService,
  ) {}

  @Post()
  create(
    @Body()
    createAccountActivationTokenDto: CreateAccountActivationTokenDto,
  ) {
    return this.accountActivationTokensService.create(
      createAccountActivationTokenDto,
    );
  }

  @Get()
  findAll() {
    return this.accountActivationTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountActivationTokensService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateAccountActivationTokenDto: UpdateAccountActivationTokenDto,
  ) {
    return this.accountActivationTokensService.update(
      id,
      updateAccountActivationTokenDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountActivationTokensService.remove(id);
  }
}
