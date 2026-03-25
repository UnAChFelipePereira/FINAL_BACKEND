import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseModule } from '../../course-modules/entities/course-module.entity';
import { QuestionType } from '../../common/enums/question-type.enum';
import { QuestionOption } from '../../question-options/entities/question-option.entity';
import { UserAnswer } from '../../user-answers/entities/user-answer.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'module_id',
    type: 'bigint',
    unsigned: true,
  })
  moduleId: string;

  @Column({
    type: 'text',
  })
  enunciado: string;

  @Column({
    name: 'tipo_pregunta',
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
  })
  tipoPregunta: QuestionType;

  @Column({
    type: 'int',
  })
  orden: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '1.00',
  })
  puntaje: string;

  @ManyToOne(() => CourseModule, (courseModule) => courseModule.questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: CourseModule;

  @OneToMany(
    () => QuestionOption,
    (questionOption) => questionOption.question,
  )
  options: QuestionOption[];

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.question)
  userAnswers: UserAnswer[];
}
