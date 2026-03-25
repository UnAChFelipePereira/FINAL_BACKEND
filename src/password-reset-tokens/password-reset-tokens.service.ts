import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePasswordResetTokenDto } from './dto/create-password-reset-token.dto';
import { UpdatePasswordResetTokenDto } from './dto/update-password-reset-token.dto';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Injectable()
export class PasswordResetTokensService {
  constructor(
    @InjectRepository(PasswordResetToken)
    private readonly passwordResetTokensRepository: Repository<PasswordResetToken>,
  ) {}

  create(createPasswordResetTokenDto: CreatePasswordResetTokenDto) {
    const passwordResetToken = this.passwordResetTokensRepository.create(
      createPasswordResetTokenDto,
    );
    return this.passwordResetTokensRepository.save(passwordResetToken);
  }

  findAll() {
    return this.passwordResetTokensRepository.find();
  }

  async findOne(id: string) {
    const passwordResetToken = await this.passwordResetTokensRepository.findOneBy(
      { id },
    );

    if (!passwordResetToken) {
      throw new NotFoundException(
        `PasswordResetToken with id ${id} not found`,
      );
    }

    return passwordResetToken;
  }

  async update(
    id: string,
    updatePasswordResetTokenDto: UpdatePasswordResetTokenDto,
  ) {
    const passwordResetToken = await this.passwordResetTokensRepository.preload(
      {
        id,
        ...updatePasswordResetTokenDto,
      },
    );

    if (!passwordResetToken) {
      throw new NotFoundException(
        `PasswordResetToken with id ${id} not found`,
      );
    }

    return this.passwordResetTokensRepository.save(passwordResetToken);
  }

  async remove(id: string) {
    const passwordResetToken = await this.findOne(id);
    await this.passwordResetTokensRepository.remove(passwordResetToken);
    return passwordResetToken;
  }
}
