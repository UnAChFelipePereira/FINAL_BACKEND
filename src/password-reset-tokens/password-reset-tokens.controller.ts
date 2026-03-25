import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password-reset-token.dto';
import { PasswordResetTokensService } from './password-reset-tokens.service';

@Controller('password-reset-tokens')
export class PasswordResetTokensController {
  constructor(
    private readonly passwordResetTokensService: PasswordResetTokensService,
  ) {}

  @Post()
  create(@Body() createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    return this.passwordResetTokensService.create(createPasswordResetTokenDto);
  }

  @Get()
  findAll() {
    return this.passwordResetTokensService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.passwordResetTokensService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePasswordResetTokenDto: UpdatePasswordResetTokenDto,
  ) {
    return this.passwordResetTokensService.update(
      id,
      updatePasswordResetTokenDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.passwordResetTokensService.remove(id);
  }
}
