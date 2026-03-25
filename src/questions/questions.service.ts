import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  create(createQuestionDto: CreateQuestionDto) {
    const question = this.questionsRepository.create({
      ...createQuestionDto,
      puntaje:
        createQuestionDto.puntaje !== undefined
          ? createQuestionDto.puntaje.toFixed(2)
          : undefined,
    });

    return this.questionsRepository.save(question);
  }

  findAll() {
    return this.questionsRepository.find();
  }

  async findOne(id: string) {
    const question = await this.questionsRepository.findOneBy({ id });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionsRepository.preload({
      id,
      ...updateQuestionDto,
      puntaje:
        updateQuestionDto.puntaje !== undefined
          ? updateQuestionDto.puntaje.toFixed(2)
          : undefined,
    });

    if (!question) {
      throw new NotFoundException(`Question with id ${id} not found`);
    }

    return this.questionsRepository.save(question);
  }

  async remove(id: string) {
    const question = await this.findOne(id);
    await this.questionsRepository.remove(question);
    return question;
  }
}
