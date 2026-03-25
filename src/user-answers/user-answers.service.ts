import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import { UserAnswer } from './entities/user-answer.entity';

@Injectable()
export class UserAnswersService {
  constructor(
    @InjectRepository(UserAnswer)
    private readonly userAnswersRepository: Repository<UserAnswer>,
  ) {}

  create(createUserAnswerDto: CreateUserAnswerDto) {
    const userAnswer = this.userAnswersRepository.create(createUserAnswerDto);
    return this.userAnswersRepository.save(userAnswer);
  }

  findAll() {
    return this.userAnswersRepository.find();
  }

  async findOne(id: string) {
    const userAnswer = await this.userAnswersRepository.findOneBy({ id });

    if (!userAnswer) {
      throw new NotFoundException(`UserAnswer with id ${id} not found`);
    }

    return userAnswer;
  }

  async update(id: string, updateUserAnswerDto: UpdateUserAnswerDto) {
    const userAnswer = await this.userAnswersRepository.preload({
      id,
      ...updateUserAnswerDto,
    });

    if (!userAnswer) {
      throw new NotFoundException(`UserAnswer with id ${id} not found`);
    }

    return this.userAnswersRepository.save(userAnswer);
  }

  async remove(id: string) {
    const userAnswer = await this.findOne(id);
    await this.userAnswersRepository.remove(userAnswer);
    return userAnswer;
  }
}
