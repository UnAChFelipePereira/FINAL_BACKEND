import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Question } from '../../questions/entities/question.entity';
import { UserAnswer } from '../../user-answers/entities/user-answer.entity';

@Entity('question_options')
export class QuestionOption {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({
    name: 'question_id',
    type: 'bigint',
    unsigned: true,
  })
  questionId: string;

  @Column({
    type: 'text',
  })
  texto: string;

  @Column({
    name: 'es_correcta',
    type: 'boolean',
    default: false,
  })
  esCorrecta: boolean;

  @Column({
    type: 'int',
  })
  orden: number;

  @ManyToOne(() => Question, (question) => question.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @OneToMany(() => UserAnswer, (userAnswer) => userAnswer.selectedOption)
  userAnswers: UserAnswer[];
}
