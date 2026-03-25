import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountActivationTokenDto } from './create-account-activation-token.dto';

export class UpdateAccountActivationTokenDto extends PartialType(
  CreateAccountActivationTokenDto,
) {}
