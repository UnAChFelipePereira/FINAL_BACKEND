import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionOptionDto } from './dto/create-question-option.dto';
import { UpdateQuestionOptionDto } from './dto/update-question-option.dto';
import { QuestionOption } from './entities/question-option.entity';

@Injectable()
export class QuestionOptionsService {
  constructor(
    @InjectRepository(QuestionOption)
    private readonly questionOptionsRepository: Repository<QuestionOption>,
  ) {}

  create(createQuestionOptionDto: CreateQuestionOptionDto) {
    const questionOption = this.questionOptionsRepository.create(
      createQuestionOptionDto,
    );
    return this.questionOptionsRepository.save(questionOption);
  }

  findAll() {
    return this.questionOptionsRepository.find();
  }

  async findOne(id: string) {
    const questionOption = await this.questionOptionsRepository.findOneBy({
      id,
    });

    if (!questionOption) {
      throw new NotFoundException(`QuestionOption with id ${id} not found`);
    }

    return questionOption;
  }

  async update(id: string, updateQuestionOptionDto: UpdateQuestionOptionDto) {
    const questionOption = await this.questionOptionsRepository.preload({
      id,
      ...updateQuestionOptionDto,
    });

    if (!questionOption) {
      throw new NotFoundException(`QuestionOption with id ${id} not found`);
    }

    return this.questionOptionsRepository.save(questionOption);
  }

  async remove(id: string) {
    const questionOption = await this.findOne(id);
    await this.questionOptionsRepository.remove(questionOption);
    return questionOption;
  }
}
