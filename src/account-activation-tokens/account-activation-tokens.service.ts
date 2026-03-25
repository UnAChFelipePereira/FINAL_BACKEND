import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountActivationTokenDto } from './dto/create-account-activation-token.dto';
import { UpdateAccountActivationTokenDto } from './dto/update-account-activation-token.dto';
import { AccountActivationToken } from './entities/account-activation-token.entity';

@Injectable()
export class AccountActivationTokensService {
  constructor(
    @InjectRepository(AccountActivationToken)
    private readonly accountActivationTokensRepository: Repository<AccountActivationToken>,
  ) {}

  create(createAccountActivationTokenDto: CreateAccountActivationTokenDto) {
    const accountActivationToken =
      this.accountActivationTokensRepository.create(
        createAccountActivationTokenDto,
      );
    return this.accountActivationTokensRepository.save(accountActivationToken);
  }

  findAll() {
    return this.accountActivationTokensRepository.find();
  }

  async findOne(id: string) {
    const accountActivationToken =
      await this.accountActivationTokensRepository.findOneBy({ id });

    if (!accountActivationToken) {
      throw new NotFoundException(
        `AccountActivationToken with id ${id} not found`,
      );
    }

    return accountActivationToken;
  }

  async update(
    id: string,
    updateAccountActivationTokenDto: UpdateAccountActivationTokenDto,
  ) {
    const accountActivationToken =
      await this.accountActivationTokensRepository.preload({
        id,
        ...updateAccountActivationTokenDto,
      });

    if (!accountActivationToken) {
      throw new NotFoundException(
        `AccountActivationToken with id ${id} not found`,
      );
    }

    return this.accountActivationTokensRepository.save(accountActivationToken);
  }

  async remove(id: string) {
    const accountActivationToken = await this.findOne(id);
    await this.accountActivationTokensRepository.remove(accountActivationToken);
    return accountActivationToken;
  }
}
