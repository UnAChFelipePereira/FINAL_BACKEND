import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateQuestionOptionDto } from './dto/create-question-option.dto';
import { UpdateQuestionOptionDto } from './dto/update-question-option.dto';
import { QuestionOptionsService } from './question-options.service';

@Controller('question-options')
export class QuestionOptionsController {
  constructor(
    private readonly questionOptionsService: QuestionOptionsService,
  ) {}

  @Post()
  create(@Body() createQuestionOptionDto: CreateQuestionOptionDto) {
    return this.questionOptionsService.create(createQuestionOptionDto);
  }

  @Get()
  findAll() {
    return this.questionOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionOptionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionOptionDto: UpdateQuestionOptionDto,
  ) {
    return this.questionOptionsService.update(id, updateQuestionOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionOptionsService.remove(id);
  }
}
